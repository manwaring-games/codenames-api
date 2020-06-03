import "source-map-support/register";
import { CreateClueRequest } from "@manwaring-games/codenames-common";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { startTurn } from "../table";
import { Turn } from "../turn";
import { Clue } from "../clue";

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
export const handler = api(
  async ({ path, body, success, error, invalid }: ApiSignature<CreateClueRequest>) => {
    try {
      const { gameId } = path;
      const { team, word, tiles } = body;
      const clue = new Clue(word, tiles);
      const turn = new Turn(team, clue);
      const game = await startTurn(gameId, turn);
      // TODO get existing turns, set active one to false
      return success(game);
    } catch (err) {
      return error(err);
    }
  }
);
