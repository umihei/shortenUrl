import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
const dynamoDBClient = new DynamoDBClient({});

export interface ShortenUrlInterface {
  generateRamdomUrlString(): string;
}

export class ShortenUrl {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  getUrlRedirect = async (): Promise<string> => {
    let randomString: string = this.generateRamdomUrlString();

    while (true) {
      let res = await this.validateUrlNotInUse(randomString);
      console.log('validate res: ', res);
      if (res) {
        break;
      }
      randomString = this.generateRamdomUrlString();
    }

    await this.registerNewUrlToDB(this.url, randomString);

    return randomString;
  };

  private generateRamdomUrlString = (): string => {
    let shortenUrlLength: number = 6;
    let generatedUrlString: string = "";
    const characters: string =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength: number = characters.length;
    for (let i: number = 0; i < shortenUrlLength; i++) {
      generatedUrlString += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    return generatedUrlString;
  };

  validateUrlNotInUse = async (randomString: string): Promise<boolean> => {
    const params = {
      TableName: process.env.REDIRECT_TABLE_NAME,
      Key: {
        redirectPath: { S: randomString },
      },
      ProjectionExpression: "ATTRIBUTE_NAME",
    };

    try {
      const data = await dynamoDBClient.send(new GetItemCommand(params));
      console.log(`getItem ${randomString} Success`, data.Item);
      if (data.Item === undefined) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(`getItem ${randomString} Fail`, err);
      return true;
    }
  };

  registerNewUrlToDB = async (url: string, randomString: string) => {
    // Set the parameters
    const params = {
      TableName: process.env.REDIRECT_TABLE_NAME,
      Item: {
        redirectPath: { S: randomString },
        redirectedPath: { S: url },
      },
    };
    try {
      const data = await dynamoDBClient.send(new PutItemCommand(params));
      console.log(`putItem ${randomString} success`, data);
    } catch (err) {
      console.error(`putItem ${randomString} fail`, err);
    }
  };
}
