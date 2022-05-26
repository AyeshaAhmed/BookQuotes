const crypto = require('crypto');
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dbUserTable = 'user-table';
const userPath = '/user';

exports.handler = async function (event) {
    console.log('Request event: ', event);
    if (event.path != userPath) {
        return buildResponse(404, '404 Not Found');
    }
    let response;
    const q_params = event.queryStringParameters;
    switch (true) {
        case event.httpMethod === 'GET' && q_params.userId != null: // check / add user
            response = await getUser(q_params.userId);
            break;
        default:
            response = buildResponse(404, '404 Not Found');
    }
    return response;
}

async function getUser(userId) {
    const params = {
        TableName: dbUserTable,
        Key: {
            'userId': userId
        }
    }
    console.log('Check User Request Params: ', params);
    const result = await dynamodb.get(params).promise().then((response) => {
        console.log(response);
        return response.Item;
        // return buildResponse(200, response.Item);
    }, (error) => {
        console.error('log error: ', error);
    });
    if (result != null && result.userId != null) {
        const body = {
            newUser: false,
            userId: result.userId
        }
        return buildResponse(200, body);
    } else {
        const reqBody = {
            userId: userId,
            bookmarks: []
        }
        const create_params = {
            TableName: dbUserTable,
            Item: reqBody
        }
        console.log('New User Request Params: ', params);
        return await dynamodb.put(create_params).promise().then(() => {
            const body = {
                newUser: true,
                userId: userId
            }
            return buildResponse(200, body);
        }, (error) => {
            console.error('log error: ', error);
        });
    }
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
            'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,GET',
            'X-Requested-With': '*'
        },
        body: JSON.stringify(body)
    }
}