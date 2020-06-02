import { Turn } from "@manwaring-games/codenames-common";
import { GamesTable, RecordType } from "./table";

export class TurnRecord extends GamesTable {
  public turn: Turn;

  constructor(gameId: string, turnId: string) {
    super(gameId, `${RecordType.TURN}#${turnId}`, RecordType.TURN);
  }

  getUpdateParams(turn: Turn) {
    const params = {
      Key: { gameId: this.gameId, identifiers: this.identifiers },
      TableName: process.env.GAMES_TABLE,
      UpdateExpression: "Add #version :increment SET #turn = :turn, #recordType = :recordType",
      ExpressionAttributeNames: {
        "#version": "version",
        "#turn": "turn",
        "#recordType": "recordType",
      },
      ExpressionAttributeValues: {
        ":increment": 1,
        ":turn": turn,
        ":recordType": this.recordType,
      },
    };
    console.debug("Updating turn with params", params);
    return params;
  }
}
