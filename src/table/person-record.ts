import { Person } from "@manwaring-games/codenames-common";
import { GamesTable, RecordType } from "./table";

export class PersonRecord extends GamesTable {
  public person: Person;

  constructor(gameId: string, personId: string) {
    super(gameId, `${RecordType.PERSON}#${personId}`, RecordType.PERSON);
  }

  getUpdateParams(person: Person) {
    const params = {
      Key: { gameId: this.gameId, identifiers: this.identifiers },
      TableName: process.env.GAMES_TABLE,
      UpdateExpression: "Add #version :increment SET #person = :person",
      ExpressionAttributeNames: { "#version": "version", "#person": "person" },
      ExpressionAttributeValues: { ":increment": 1, ":person": person },
    };
    console.debug("Updating person with params", params);
    return params;
  }
}
