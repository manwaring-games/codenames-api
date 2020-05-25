import "source-map-support/register";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { Team } from "@manwaring-games/codenames-common";
import { chooseTeam } from "../table";

/**
 *  @swagger
 *  paths:
 *    /games/{gameId}/people/{personId}/teams/{team}:
 *      put:
 *        summary: Update team
 *        description: Update the user's team to the one specified
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
 *            name: team
 *            description: Name of the team the person is joining
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/Team'
 *        responses:
 *          200:
 *            description: Newly created game
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Game'
 */
export const handler = api(
  async ({ path, success, error, invalid }: ApiSignature) => {
    try {
      // TODO validate team
      const response = await chooseTeam(
        path.gameId,
        path.personId,
        path.team as Team
      );
      return success(response);
    } catch (err) {
      return error(err);
    }
  }
);
