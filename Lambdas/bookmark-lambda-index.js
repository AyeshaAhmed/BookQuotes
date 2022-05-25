const crypto = require('crypto');
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dbQuoteTable = 'quote-table';
const dbUserTable = 'user-table';
const bmPath = '/bookmark';

exports.handler = async function (event) {
    console.log('Request event: ', event);
    if (event.path != bmPath) {
        return buildResponse(404, '404 Not Found');
    }
    let response;
    const requestBody = JSON.parse(event.body);
    switch (true) {
        case event.httpMethod === 'POST':
            response = await addBookmark(requestBody.postId, requestBody.userId);
            break;
        case event.httpMethod === 'PATCH':
            response = await removeBookmark(requestBody.postId, requestBody.userId);
            break;
        default:
            response = buildResponse(404, '404 Not Found');
    }
    return response;
}

async function addBookmark(postId, userId) {
    const params = {
        TableName: dbQuoteTable,
        Key: {
            'postId': postId
        },
        UpdateExpression: 'set quoteText = :value',
        ExpressionAttributeValues: {
            ':value': quoteText
        },
        ReturnValues: 'ALL_NEW'
    }
    console.log('Request Params: ', params);
    return await dynamodb.put(params).promise().then(() => {
        const body = {
            Operation: 'SAVE',
            Message: 'SUCCESS',
            Item: requestBody
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('log error: ', error);
    });
}

async function removeBookmark(postId, userId) {
    const params = {
        TableName: dbQuoteTable,
        Key: {
            'postId': postId
        },
        UpdateExpression: 'set quoteText = :value',
        ExpressionAttributeValues: {
            ':value': quoteText
        },
        ReturnValues: 'ALL_NEW'
    }
    console.log('Request Params: ', params);
    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE',
            Message: 'SUCCESS',
            Item: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('log error: ', error);
    })
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
            'Access-Control-Allow-Methods' : 'OPTIONS,PATCH,PUT',
            'X-Requested-With' : '*'
        },
        body: JSON.stringify(body)
    }
}