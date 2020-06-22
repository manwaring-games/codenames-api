import { DynamoDB } from "aws-sdk";
import { CustomError } from "ts-custom-error";
import { Game, Person, Role, Team, Tile, Turn, Clue } from "@manwaring-games/codenames-common";
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

export async function startGame(gameId: string, startTeam: Team, tiles: Tile[]): Promise<Game> {
  console.debug("Starting game", gameId, startTeam, tiles);
  const gamePromise = table.update(new GameRecord(gameId).getStartGameParams(startTeam)).promise();
  const tilePromises = tiles.map((tile) =>
    table.update(new TileRecord(gameId, tile.id).getUpdateParams(tile)).promise()
  );
  await Promise.all([gamePromise, ...tilePromises]);
  return getFullGame(gameId);
}

export async function startTurn(gameId: string, turn: Turn): Promise<Game> {
  console.debug("Starting turn", gameId, turn);
  const turnRecord = new TurnRecord(gameId, turn.id);
  await table.update(turnRecord.getUpdateParams(turn)).promise();
  return getFullGame(gameId);
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
  return getFullGame(game.id);
}

export async function chooseRole(gameId: string, personId: string, role: Role): Promise<Game> {
  // TODO if someone already has the spymaster role boot them out
  console.debug("Choosing role", gameId, personId, role);
  const personRecord = new PersonRecord(gameId, personId);
  await table.update(personRecord.getUpdateRoleParams(role)).promise();
  return getFullGame(gameId);
}

export async function chooseTeam(gameId: string, personId: string, team: Team): Promise<Game> {
  console.debug("Choosing team", gameId, personId, team);
  const personRecord = new PersonRecord(gameId, personId);
  await table.update(personRecord.getUpdateTeamParams(team)).promise();
  return getFullGame(gameId);
}

export async function subscribeToUpdates(
  gameId: string,
  personId: string,
  connectionId: string
): Promise<void> {
  console.debug("Subscribing to updates", gameId, personId);
  const personRecord = new PersonRecord(gameId, personId);
  await table.update(personRecord.getAddWebsocketSubscriptionParams(connectionId)).promise();
}

export async function getAllGameRecords(gameId: string): Promise<GamesTable[]> {
  console.debug("Getting all game records", gameId);
  const gamesTable = new GamesTable(gameId);
  const response = await table.query(gamesTable.getAllRecordParams()).promise();
  return response.Items as GamesTable[];
}

export async function getFullGame(gameId: string): Promise<Game> {
  console.debug("Getting all game records", gameId);
  const gamesTable = new GamesTable(gameId);
  const response = await table.query(gamesTable.getAllRecordParams()).promise();
  const records = response.Items;
  return gameRecordsToResponse(records as GamesTable[]);
}

export function gameRecordsToResponse(records: GamesTable[]): Game {
  let game;
  let people = [];
  let tiles = [];
  let turns = { active: undefined, past: [] };
  records.forEach((record) => {
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
  return { ...game, people, tiles, turns };
}

export class RecordNotFoundError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}
