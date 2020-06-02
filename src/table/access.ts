import { DynamoDB } from "aws-sdk";
import { CustomError } from "ts-custom-error";
import { Game, Person, Role, Team, Tile, Turn } from "@manwaring-games/codenames-common";
import { GameRecord } from "./game-record";
import { PersonRecord } from "./person-record";
import { GamesTable, RecordType } from "./table";
import { TileRecord } from "./tile-record";
import { TurnRecord } from "./turn-record";

const table = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

export async function createGame(game: Game, person: Person): Promise<Game> {
  console.debug("Creating game", game, person);
  const gameRecord = new GameRecord(game.id);
  const personRecord = new PersonRecord(game.id, person.id);
  await table.update(gameRecord.getUpdateParams(game)).promise();
  await table.update(personRecord.getUpdateParams(person)).promise();
  return { ...game, people: [person] };
}

export async function startGame(gameId: string, tiles: Tile[], turn: Turn): Promise<Game> {
  console.debug("Starting game", gameId);
  const gamePromise = table.update(new GameRecord(gameId).getStartGameParams()).promise();
  const tilePromises = tiles.map((tile) =>
    table.update(new TileRecord(gameId, tile.id).getUpdateParams(tile)).promise()
  );
  const turnPromise = table.update(new TurnRecord(gameId, turn.id).getUpdateParams(turn)).promise();
  await Promise.all([gamePromise, ...tilePromises, turnPromise]);
  return getAllGameRecords(gameId);
}

export async function joinGame(code: string, person: Person): Promise<Game> {
  console.debug("Joining game", code, person);
  const gamesTable = new GamesTable(code);
  const res = await table.query(gamesTable.getGameByCode()).promise();
  if (!res.Items || res.Items.length < 1) {
    throw new RecordNotFoundError();
  }
  const game = (res.Items[0] as GameRecord).game;
  const personRecord = new PersonRecord(game.id, person.id);
  await table.update(personRecord.getUpdateParams(person)).promise();
  return getAllGameRecords(game.id);
}

export async function chooseRole(gameId: string, personId: string, role: Role): Promise<Game> {
  // TODO if someone already has the spymaster role boot them out
  console.debug("Choosing role", gameId, personId, role);
  const personRecord = new PersonRecord(gameId, personId);
  await table.update(personRecord.getUpdateRoleParams(role)).promise();
  return getAllGameRecords(gameId);
}

export async function chooseTeam(gameId: string, personId: string, team: Team): Promise<Game> {
  console.debug("Choosing team", gameId, personId, team);
  const personRecord = new PersonRecord(gameId, personId);
  await table.update(personRecord.getUpdateTeamParams(team)).promise();
  return getAllGameRecords(gameId);
}

export async function getAllGameRecords(gameId: string): Promise<Game> {
  console.debug("Getting all game records", gameId);
  const gamesTable = new GamesTable(gameId);
  const response = await table.query(gamesTable.getAllRecordParams()).promise();
  console.debug(response);
  let game;
  let people = [];
  let tiles = [];
  let turns = { active: undefined, past: [] };
  response.Items.forEach((record) => {
    const recordType = (record as GamesTable).recordType;
    switch (recordType) {
      case RecordType.GAME:
        game = (record as GameRecord).game;
        break;
      case RecordType.PERSON:
        people.push((record as PersonRecord).person);
        break;
      case RecordType.TILE:
        tiles.push((record as TileRecord).tile);
        break;
      case RecordType.TURN:
        const turn = (record as TurnRecord).turn;
        if (turn.active) {
          turns.active = turn;
        } else {
          turns.past.push(turn);
        }
        break;
    }
  });
  game.tiles = tiles;
  game.turns = turns;
  game.active;
  return { ...game, people };
}

export class RecordNotFoundError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}
