import { DynamoDB } from "aws-sdk";
import { Game } from "../game";
import { Person } from "../person";
import { GameRecord } from "./game-record";
import { PersonRecord } from "./person-record";
import { GamesTable, RecordType } from "./table";

const table = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

export async function createGame(game: Game, person: Person): Promise<any> {
  console.debug("Creating game", game, person);
  const gameRecord = new GameRecord(game.id);
  const personRecord = new PersonRecord(game.id, person.id);
  await table.update(gameRecord.getUpdateParams(game)).promise();
  await table.update(personRecord.getUpdateParams(person)).promise();
  return { ...game, people: [person] };
}

export async function getAllGameRecords(gameId: string): Promise<Game> {
  console.debug("Getting all game records", gameId);
  const gamesTable = new GamesTable(gameId);
  const response = await table.query(gamesTable.getAllRecordParams()).promise();

  let game;
  let people = [];
  response.Items.forEach((record) => {
    const recordType = (record as GamesTable).recordType;
    switch (recordType) {
      case RecordType.GAME:
        game = (record as GameRecord).game;
        break;
      case RecordType.PERSON:
        people.push((record as PersonRecord).person);
    }
  });
  return { ...game, people };
}
