import { Tile } from "@manwaring-games/codenames-common";
import { GamesTable, RecordType } from "./table";

export class TileRecord extends GamesTable {
  public tile: Tile;

  constructor(gameId: string, tileId: string) {
    super(gameId, `${RecordType.TILE}#${tileId}`, RecordType.TILE);
  }

  getUpdateParams(tile: Tile) {
    const params = {
      Key: { gameId: this.gameId, identifiers: this.identifiers },
      TableName: process.env.GAMES_TABLE,
      UpdateExpression: "Add #version :increment SET #tile = :tile, #recordType = :recordType",
      ExpressionAttributeNames: {
        "#version": "version",
        "#tile": "tile",
        "#recordType": "recordType",
      },
      ExpressionAttributeValues: {
        ":increment": 1,
        ":tile": tile,
        ":recordType": this.recordType,
      },
    };
    console.debug("Updating tile with params", params);
    return params;
  }
}
