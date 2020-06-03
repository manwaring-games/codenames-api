import { Game, Team } from "@manwaring-games/codenames-common";
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
      UpdateExpression:
        "Add #version :increment SET #game = :game, #code = :code, #recordType = :recordType",
      ExpressionAttributeNames: {
        "#version": "version",
        "#game": "game",
        "#code": "code",
        "#recordType": "recordType",
      },
      ExpressionAttributeValues: {
        ":increment": 1,
        ":game": game,
        ":code": game.code,
        ":recordType": this.recordType,
      },
    };
    console.debug("Updating game with params", params);
    return params;
  }

  getStartGameParams(startTeam: Team) {
    const params = {
      Key: { gameId: this.gameId, identifiers: this.identifiers },
      TableName: process.env.GAMES_TABLE,
      UpdateExpression:
        "Add #version :increment SET #game.#started = :started, #game.#startTeam = :startTeam",
      ExpressionAttributeNames: {
        "#version": "version",
        "#game": "game",
        "#started": "started",
        "#startTeam": "startTeam",
      },
      ExpressionAttributeValues: { ":increment": 1, ":started": true, ":startTeam": startTeam },
    };
    console.debug("Starting game with params", params);
    return params;
  }
}
