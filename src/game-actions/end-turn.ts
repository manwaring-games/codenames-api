import "source-map-support/register";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { Game } from "../game";

/**
 *  @swagger
 *  paths:
 *    /games/{gameId}/turns/{turnId}/end:
 *      post:
 *        summary: End turn
 *        description: Create a new game of Codenames that others can join
 *        tags: [Game actions]
 *        parameters:
 *          - in: path
 *            name: gameId
 *            description: ID of the game being played
 *            required: true
 *            schema:
 *              type: string
 *          - in: path
 *            name: turnId
 *            description: ID of the turn the guess is for
 *            required: true
 *            schema:
 *              type: string
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CreatePersonRequest'
 *        responses:
 *          200:
 *            description: Newly created game
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Game'
 */
export const handler = api(async ({ body, success, error, invalid }: ApiSignature) => {
  try {
    const request = new Game();
    const game = await saveGame(request);
    return success(game);
  } catch (err) {
    return error(err);
  }
});
