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
        case event.httpMethod === 'GET': // check / add user
            response = await getUser(q_params.userId, q_params.password);
            break;
        default:
            response = buildResponse(404, '404 Not Found');
    }
    return response;
}

async function getUser(userId, password) {
    const params = {
        TableName: dbUserTable,
        Key: {
            'userId': userId
        }
    }
    console.log('Request Params: ', params);
    return await dynamodb.get(params).promise().then((response) => {

        return buildResponse(200, response.Item);
    }, (error) => {
        console.error('log error: ', error);
    });
}

async function matchUserId(postId, userId) {
    const params = {
        TableName: dbQuoteTable,
        Key: {
            'postId': postId
        }
    }
    console.log('Request Params: ', params);
    try {
        const response = await dynamodb.get(params).promise();
        if (response.Item.userId === userId) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('log error: ', error);
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
            'Access-Control-Allow-Headers' : 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods' : 'OPTIONS,GET',
            'X-Requested-With' : '*'
        },
        body: JSON.stringify(body)
    }
}