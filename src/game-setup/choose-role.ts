import "source-map-support/register";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { Game } from "../game";
import { chooseRole } from "../table";
import { Role } from "@manwaring-games/codenames-common";

/**
 *  @swagger
 *  paths:
 *    /games/{gameId}/people/{personId}/roles/{role}:
 *      put:
 *        summary: Update role
 *        description: Update the person's role on their team to the one specified
 *        tags: [Game setup]
 *        parameters:
 *          - in: path
 *            name: gameId
 *            description: ID of the game this person is a part of
 *            required: true
 *            schema:
 *              type: string
 *          - in: path
 *            name: personId
 *            description: ID of the person changing roles
 *            required: true
 *            schema:
 *              type: string
 *          - in: path
 *            name: role
 *            description: Name of the role the person is choosing
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/Role'
 *        responses:
 *          200:
 *            description: Game with updated information
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Game'
 */
export const handler = api(
  async ({ path, success, error, invalid }: ApiSignature) => {
    try {
      const response = await chooseRole(
        path.gameId,
        path.personId,
        path.role as Role
      );
      return success(response);
    } catch (err) {
      return error(err);
    }
  }
);
