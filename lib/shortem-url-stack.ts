import * as cdk from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class ShortemUrlStack extends cdk.Stack {
  
  public readonly registerLambda: NodejsFunction;
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "shortenUrlDB", {
      partitionKey: {
        name: "redirectPath",
        type: dynamodb.AttributeType.STRING,
      },
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    const registerLambda = new NodejsFunction(this, "registerLambda", {
      entry: "lambda/handler/handler.ts",
      environment: {
        REDIRECT_TABLE_NAME: table.tableName,
      },
    });
    this.registerLambda = registerLambda;
    
    table.grantReadWriteData(this.registerLambda);

    const registerApiGw = new apigw.LambdaRestApi(
      this,
      "shortenUrlRegisterEndpoint",
      {
        handler: registerLambda,
        proxy: false,
      }
    );

    const register = registerApiGw.root.addResource("register");
    register.addMethod("POST");

    const redirectorLambda = new NodejsFunction(this, "redirectorLambda", {
      entry: "lambda/handler/redirectorHandler.ts",
    });

    new apigw.LambdaRestApi(this, "shortenUrlRedirectEndpoint", {
      handler: redirectorLambda,
    });

    // const items = api.root.addResource("path");
    // items.addMethod("GET"); // GET /items

    // The code that defines your stack goes here
  }
}
