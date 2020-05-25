import { Game } from "@manwaring-games/codenames-common";
import { GamesTable, RecordType } from "./table";

export class GameRecord extends GamesTable {
  public game: Game;

  constructor(gameId: string) {
    super(gameId, `${RecordType.GAME}#${gameId}`, RecordType.GAME);
  }

  getUpdateParams(game: Game) {
    const params = {
      Key: { gameId: this.gameId, identifiers: this.identifiers },
      TableName: process.env.GAMES_TABLE,
      UpdateExpression: "Add #version :increment SET #game = :game",
      ExpressionAttributeNames: { "#version": "version", "#game": "game" },
      ExpressionAttributeValues: { ":increment": 1, ":game": game },
    };
    console.debug("Updating game with params", params);
    return params;
  }
}
