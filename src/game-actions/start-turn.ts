import "source-map-support/register";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { startGame } from "../table";
import { Turn } from "../turn";

/**
 *  @swagger
 *  paths:
 *    /games/{gameId}/turns:
 *      post:
 *        summary: Start turn
 *        description: Start a new turn by providing a clue
 *        tags: [Game actions]
 *        parameters:
 *          - in: path
 *            name: gameId
 *            description: ID of the game being played
 *            required: true
 *            schema:
 *              type: string
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CreateClueRequest'
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
    // const { gameId } = path;
    // const turn = new Turn();
    return success();
  } catch (err) {
    return error(err);
  }
});
