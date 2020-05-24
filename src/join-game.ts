import "source-map-support/register";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { Game } from "./game";

/**
 *  @swagger
 *  paths:
 *    /games/{code}/people:
 *      post:
 *        summary: Join game
 *        description: Join an existing game
 *        tags: [Games]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CreatePersonRequest'
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
