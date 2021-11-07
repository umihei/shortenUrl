import {
  APIGatewayEventRequestContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { ShortenUrl } from '../domain/app';
// export async function handler(){

export async function handler(
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext
): Promise<APIGatewayProxyResult> {
  console.log("test");
  console.log(event);
  const url = JSON.parse(event.body!).url;
  
  const shortenUrl = new ShortenUrl(url);
  const redirectPath = await shortenUrl.getUrlRedirect();
  console.log(redirectPath);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      method: event.httpMethod,
      query: JSON.parse(event.body!).url,
      redirectPath: redirectPath
    }),
  };
}
