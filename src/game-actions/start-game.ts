import "source-map-support/register";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { Team } from "@manwaring-games/codenames-common";
import { startGame } from "../table";
import { Tile } from "../tile";
import { getWords } from "../word-list";

/**
 *  @swagger
 *  paths:
 *    /games/{gameId}/start:
 *      post:
 *        summary: Start game
 *        description: Start an existing game
 *        tags: [Game actions]
 *        parameters:
 *          - in: path
 *            name: gameId
 *            description: ID of the game being played
 *            required: true
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: The existing game
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Game'
 */
export const handler = api(async ({ path, success, error, invalid }: ApiSignature) => {
  try {
    const startTeam = Math.random() < 0.5 ? Team.BLUE : Team.RED;
    const tiles = getTiles(startTeam);
    const game = await startGame(path.gameId, startTeam, tiles);
    return success(game);
  } catch (err) {
    return error(err);
  }
});

function getTiles(startTeam: Team, count: number = 24): Tile[] {
  const secondTeam = startTeam == Team.BLUE ? Team.RED : Team.BLUE;
  const firstCount = 9;
  const secondCount = 8;
  const assassinCount = 1;
  const neutralCount = count - firstCount - secondCount - assassinCount;
  const words = getWords(count);

  const firstTiles = createTilesForTeam(startTeam, words.splice(0, firstCount));
  const secondTiles = createTilesForTeam(secondTeam, words.splice(0, secondCount));
  const neutralTiles = createTilesForTeam(Team.NEUTRAL, words.splice(0, neutralCount));
  const assassinTiles = createTilesForTeam(Team.ASSASSIN, words.splice(0, assassinCount));
  const tiles = [...firstTiles, ...secondTiles, ...neutralTiles, ...assassinTiles];
  return tiles.sort(() => (Math.random() < 0.5 ? -1 : 1));
}

function createTilesForTeam(team: Team, words: string[]): Tile[] {
  const tiles = words.map((word) => new Tile(team, word));
  return tiles;
}
