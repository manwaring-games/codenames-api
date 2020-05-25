export class GamesTable {
  public gameId: string;
  public identifiers?: string;
  public recordType?: RecordType;

  constructor(gameId: string, identifiers?: string, recordType?: RecordType) {
    this.gameId = gameId;
    this.identifiers = identifiers;
    this.recordType = recordType;
  }

  getAllRecordParams() {
    const params = {
      TableName: process.env.GAMES_TABLE,
      KeyConditionExpression: "gameId = :gameId",
      ExpressionAttributeValues: { ":gameId": this.gameId },
    };
    console.debug("Getting all game records with params", params);
    return params;
  }

  getGameByCode() {
    const params = {
      TableName: process.env.GAMES_TABLE,
      IndexName: process.env.GAME_CODE_INDEX,
      KeyConditionExpression: "code = :code",
      ExpressionAttributeValues: { ":code": this.gameId },
    };
    console.debug("Getting game by code with params", params);
    return params;
  }
}

export enum RecordType {
  CLUE = "CLUE",
  GAME = "GAME",
  GUESS = "GUESS",
  PERSON = "PERSON",
  TILE = "TILE",
  TURN = "TURN",
}
