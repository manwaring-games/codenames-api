import "source-map-support/register";
import { ApiGatewayManagementApi } from "aws-sdk";
import { sns, SnsSignature } from "@manwaring/lambda-wrapper";
import { Game, Person } from "@manwaring-games/codenames-common";
import { getAllGameRecords, GamesTable, gameRecordsToResponse, RecordType } from "../table";

const socket = new ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint: process.env.APIGW_BASE_ENDPOINT,
});

export const handler = sns(async ({ message, success, error }: SnsSignature) => {
  try {
    const { gameId } = message;
    const records = await getAllGameRecords(gameId);
    const game = gameRecordsToResponse(records);
    for (const record of records) {
      if (record.recordType === RecordType.PERSON) {
        await publishGameUpdate(record, game);
      }
    }
    return success();
  } catch (err) {
    return error(err);
  }
});

function publishGameUpdate(record: GamesTable, game: Game): Promise<any> {
  // @ts-ignore
  const { websocketConnectionId: ConnectionId } = record;
  if (!ConnectionId) {
    console.log("Person isn't subscribed to updates, can't send an update", record);
  } else {
    const params = { ConnectionId, Data: JSON.stringify(game) };
    console.log("Publishing game update to websocket with params", params);
    return socket.postToConnection(params).promise();
  }
}
