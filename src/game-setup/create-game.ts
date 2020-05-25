import "source-map-support/register";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { Game } from "../game";
import { Person } from "../person";
import { createGame } from "../table";

/**
 *  @swagger
 *  paths:
 *    /games:
 *      post:
 *        summary: Create game
 *        description: Create a new game of Codenames that others can join
 *        tags: [Game setup]
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
export const handler = api(
  async ({ body, success, error }: ApiSignature<Person>) => {
    try {
      const game = new Game();
      const person = new Person(body.name);
      // TODO validate person
      const response = await createGame(game, person);
      return success(response);
    } catch (err) {
      return error(err);
    }
  }
);
