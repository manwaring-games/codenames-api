import "source-map-support/register";
import { SNS } from "aws-sdk";
import { dynamodbStream, DynamoDBStreamSignature } from "@manwaring/lambda-wrapper";
import { GamesTable } from "./table";

const TopicArn = process.env.GAME_UPDATED_TOPIC;
const sns = new SNS({ apiVersion: "2010-03-31" });

export const handler = dynamodbStream(
  async ({ newVersions, success, error }: DynamoDBStreamSignature<GamesTable>) => {
    try {
      const gameIds = [...new Set(newVersions.map((version) => version.gameId))];
      for (const gameId of gameIds) {
        await publishNotification(gameId);
      }
      return success();
    } catch (err) {
      return error(err);
    }
  }
);

function publishNotification(gameId: string): Promise<any> {
  const params = { Message: JSON.stringify({ gameId }), TopicArn };
  console.log("Publishing game update notification", params);
  return sns.publish(params).promise();
}
