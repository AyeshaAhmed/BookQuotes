const crypto = require('crypto');
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dbThreadTable = 'thread-table';
const threadPath = '/thread';

exports.handler = async function (event) {
    console.log('Request event: ', event);
    if(event.path != threadPath){
        return buildResponse(404, '404 Not Found');
    }
    let response;
    const requestBody = JSON.parse(event.body);
    switch (true) {
        case event.httpMethod === 'GET':
            response = await getPostThread(event.queryStringParameters.postId);
            break;
        case event.httpMethod === 'POST':
            response = await saveThread(requestBody);
            break;
        case event.httpMethod === 'PATCH':
            response = await modifyThread(requestBody.threadId, requestBody.userId, requestBody.text);
            break;
        case event.httpMethod === 'DELETE':
            response = await deleteThread(requestBody.threadId, requestBody.userId);
            break;
        default:
            response = buildResponse(404, '404 Not Found');
    }
    return response;
}

async function getPostThread(postIdStr) {
    const params = {
        TableName: dbThreadTable,
        IndexName: 'postId-index',
        KeyConditionExpression: "postId = :postId",
        ExpressionAttributeValues: {
            ":postId": postIdStr
        }
    }
    console.log('Request Params: ', params);
    return await dynamodb.query(params).promise().then((response) => {
        const body = {
            thread: response.Items
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('log error: ', error);
    });
}

async function saveThread(requestBody) {
    const threadId = crypto.randomUUID();
    requestBody.threadId = threadId;
    const today = new Date().toISOString().split('T', 1)[0];
    requestBody.createdDate = today;
    const params = {
        TableName: dbThreadTable,
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

async function modifyThread(threadId, userId, text) {
    if(!matchUserId(threadId, userId)){
        return buildResponse(400, '400 Bad Request');
    }
    const params = {
        TableName: dbThreadTable,
        Key: {
            'threadId': threadId
        },
        UpdateExpression: 'set threadText = :text',
        ExpressionAttributeValues: {
            ':text': text
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

async function deleteThread(threadId, userId) {
    if(!matchUserId(threadId, userId)){
        return buildResponse(400, '400 Bad Request');
    }
    const params = {
        TableName: dbThreadTable,
        Key: {
            'threadId': threadId
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

async function matchUserId(threadId, userId){
    const params = {
        TableName: dbThreadTable,
        Key: {
            'threadId': threadId
        }
    }
    console.log('Request Params: ', params);
    try{
        const response = await dynamodb.get(params).promise();
        if(response.Item.userId === userId){
            return true;
        }
        return false;
    } catch (error){
        console.log('log error: ', error);
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
            'Access-Control-Allow-Methods' : 'OPTIONS,POST,GET,DELETE,PATCH',
            'X-Requested-With' : '*'
        },
        body: JSON.stringify(body)
    }
}