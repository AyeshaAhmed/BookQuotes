const crypto = require('crypto');
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dbQuoteTable = 'quote-table';
const quotePath = '/quote';

exports.handler = async function (event) {
    console.log('Request event: ', event);
    if(event.path != quotePath){
        return buildResponse(404, '404 Not Found');
    }
    let response;
    const requestBody = JSON.parse(event.body);
    switch (true) {
        case event.httpMethod === 'GET':
            response = await getQuote(event.queryStringParameters.postId);
            break;
        case event.httpMethod === 'POST':
            response = await saveQuote(requestBody);
            break;
        case event.httpMethod === 'PATCH':
            response = await modifyQuote(requestBody.postId, requestBody.userId, requestBody.quoteText);
            break;
        case event.httpMethod === 'DELETE':
            response = await deleteQuote(requestBody.postId, requestBody.userId);
            break;
        default:
            response = buildResponse(404, '404 Not Found');
    }
    return response;
}

async function getQuote(postId) {
    const params = {
        TableName: dbQuoteTable,
        Key: {
            'postId': postId
        }
    }
    console.log('Request Params: ', params);
    return await dynamodb.get(params).promise().then((response) => {
        return buildResponse(200, response.Item);
    }, (error) => {
        console.error('log error: ', error);
    });
}

async function saveQuote(requestBody) {
    const postId = crypto.randomUUID();
    requestBody.postId = postId;
    const today = new Date().toISOString().split('T', 1)[0];
    requestBody.createdDate = today;
    const params = {
        TableName: dbQuoteTable,
        Item: requestBody
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

async function modifyQuote(postId, userId, quoteText) {
    const validUserId = await matchUserId(postId, userId);
    if(!validUserId){
        return buildResponse(400, '400 Bad Request');
    }
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

async function deleteQuote(postId, userId) {
    const validUserId = await matchUserId(postId, userId);
    if(!validUserId){
        return buildResponse(400, '400 Bad Request');
    }
    const params = {
        TableName: dbQuoteTable,
        Key: {
            'postId': postId
        },
        ReturnValues: 'ALL_OLD'
    }
    console.log('Request Params: ', params);
    return await dynamodb.delete(params).promise().then((response) => {
        const body = {
            Operation: 'DELETE',
            Message: 'SUCCESS',
            Item: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('log error: ', error);
    })
}

async function matchUserId(postId, userId){
    const params = {
        TableName: dbQuoteTable,
        Key: {
            'postId': postId
        }
    }
    console.log('Request Params: ', params);
    try{
        const response = await dynamodb.get(params).promise();
        if(response.Item.userId === userId){
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
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}