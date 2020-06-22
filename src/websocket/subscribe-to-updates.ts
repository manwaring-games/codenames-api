import "source-map-support/register";
import { api, ApiSignature } from "@manwaring/lambda-wrapper";
import { subscribeToUpdates } from "../table";

export const handler = api(async ({ query, websocket, success, error }: ApiSignature) => {
  try {
    const { gameId, personId } = query;
    const { connectionId } = websocket;
    await subscribeToUpdates(gameId, personId, connectionId);
    return success();
  } catch (err) {
    return error(err);
  }
});
