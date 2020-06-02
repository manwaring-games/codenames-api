import "source-map-support/register";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { Team } from "@manwaring-games/codenames-common";
import { startGame } from "../table";
import { Turn } from "../turn";
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
    const { tiles, turn } = getTilesAndFirstTurn();
    const game = await startGame(path.gameId, tiles, turn);
    return success(game);
  } catch (err) {
    return error(err);
  }
});

function getTilesAndFirstTurn(count: number = 24): { tiles: Tile[]; turn: Turn } {
  const firstTeam = Math.random() < 0.5 ? Team.BLUE : Team.RED;
  const secondTeam = firstTeam == Team.BLUE ? Team.RED : Team.BLUE;
  const firstCount = 9;
  const secondCount = 8;
  const assassinCount = 1;
  const neutralCount = count - firstCount - secondCount - assassinCount;
  const words = getWords(count);
  console.log("Setting up game with", words);

  const firstTiles = createTilesForTeam(firstTeam, words.splice(0, firstCount));
  const secondTiles = createTilesForTeam(secondTeam, words.splice(0, secondCount));
  const neutralTiles = createTilesForTeam(Team.NEUTRAL, words.splice(0, neutralCount));
  const assassinTiles = createTilesForTeam(Team.ASSASSIN, words.splice(0, assassinCount));
  const tiles = [...firstTiles, ...secondTiles, ...neutralTiles, ...assassinTiles];
  console.log("Tiles", tiles);
  tiles.sort(() => (Math.random() < 0.5 ? -1 : 1));

  const turn = new Turn(firstTeam, true);
  return { tiles, turn };
}

function createTilesForTeam(team: Team, words: string[]): Tile[] {
  console.log("Creating tiles for", team, words);
  const tiles = words.map((word) => new Tile(team, word));
  console.log("Created tiles", tiles);
  return tiles;
}
