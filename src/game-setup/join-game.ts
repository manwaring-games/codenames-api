import "source-map-support/register";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { Person } from "../person";
import { joinGame, RecordNotFoundError } from "../table";

/**
 *  @swagger
 *  paths:
 *    /games/{code}/people:
 *      post:
 *        summary: Join game
 *        description: Join an existing game
 *        tags: [Game setup]
 *        parameters:
 *          - in: path
 *            name: code
 *            description: User-friendly code of the game that is being joined
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
 *            description: The existing game
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Game'
 *          404:
 *            description: No game with that code was found
 */
export const handler = api(
  async ({ body, path, success, error, notFound }: ApiSignature<Person>) => {
    try {
      const person = new Person(body.name);
      const code = path?.gameId?.toUpperCase();
      // TODO validate person && code
      const game = await joinGame(code, person);
      return success(game);
    } catch (err) {
      if (err instanceof RecordNotFoundError) {
        return notFound();
      } else {
        return error(err);
      }
    }
  }
);
