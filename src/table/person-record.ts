import { Person, Team, Role } from "@manwaring-games/codenames-common";
import { GamesTable, RecordType } from "./table";
import { String } from "aws-sdk/clients/apigateway";

export class PersonRecord extends GamesTable {
  public person: Person;

  constructor(gameId: string, personId: string) {
    super(gameId, `${RecordType.PERSON}#${personId}`, RecordType.PERSON);
  }

  getUpdateParams(person: Person) {
    const params = {
      Key: { gameId: this.gameId, identifiers: this.identifiers },
      TableName: process.env.GAMES_TABLE,
      UpdateExpression: "ADD #version :increment SET #person = :person, #recordType = :recordType",
      ExpressionAttributeNames: {
        "#version": "version",
        "#person": "person",
        "#recordType": "recordType",
      },
      ExpressionAttributeValues: {
        ":increment": 1,
        ":person": person,
        ":recordType": this.recordType,
      },
    };
    console.debug("Updating person with params", params);
    return params;
  }

  getUpdateRoleParams(role: Role) {
    const params = {
      Key: { gameId: this.gameId, identifiers: this.identifiers },
      TableName: process.env.GAMES_TABLE,
      UpdateExpression: "ADD #version :increment SET #person.#role = :role",
      ExpressionAttributeNames: {
        "#version": "version",
        "#person": "person",
        "#role": "role",
      },
      ExpressionAttributeValues: { ":increment": 1, ":role": role },
    };
    console.debug("Updating person's role with params", params);
    return params;
  }

  getUpdateTeamParams(team: Team) {
    const params = {
      Key: { gameId: this.gameId, identifiers: this.identifiers },
      TableName: process.env.GAMES_TABLE,
      UpdateExpression: "ADD #version :increment SET #person.#team = :team",
      ExpressionAttributeNames: {
        "#version": "version",
        "#person": "person",
        "#team": "team",
      },
      ExpressionAttributeValues: { ":increment": 1, ":team": team },
    };
    console.debug("Updating person's team with params", params);
    return params;
  }

  getAddWebsocketSubscriptionParams(websocketConnectionId: string) {
    const params = {
      Key: { gameId: this.gameId, identifiers: this.identifiers },
      TableName: process.env.GAMES_TABLE,
      UpdateExpression:
        "ADD #version :increment SET #websocketConnectionId = :websocketConnectionId",
      ExpressionAttributeNames: {
        "#version": "version",
        "#websocketConnectionId": "websocketConnectionId",
      },
      ExpressionAttributeValues: {
        ":increment": 1,
        ":websocketConnectionId": websocketConnectionId,
      },
    };
    console.debug("Adding websocket subscription properties with params", params);
    return params;
  }
}
