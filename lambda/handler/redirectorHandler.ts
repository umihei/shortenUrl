import {
  APIGatewayEventRequestContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

// export async function handler(){

export async function handler(
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext
): Promise<APIGatewayProxyResult> {
  console.log(event);
  
  return {
    statusCode: 302,
    headers: {
      Location: 'https://amazon.co.jp/'
    },
    body: JSON.stringify({}),
    isBase64Encoded: false
  };
}
