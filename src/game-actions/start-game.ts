import "source-map-support/register";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { Game } from "../game";

/**
 *  @swagger
 *  paths:
 *    /games/{gameId}/start:
 *      post:
 *        summary: Start game
 *        description: Start an existing game
 *        tags: [Game actions]
 *        responses:
 *          200:
 *            description: The existing game
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Game'
 */
export const handler = api(
  async ({ body, success, error, invalid }: ApiSignature) => {
    try {
      const request = new Game();
      const game = await saveGame(request);
      return success(game);
    } catch (err) {
      return error(err);
    }
  }
);
