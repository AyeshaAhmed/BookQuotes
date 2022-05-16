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
            response = await getThread(event.queryStringParameters.postId);
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

async function getThread(postId) {
    const params = {
        TableName: dbThreadTable,
        IndexName: 'PostThreadIndex',
        KeyConditionExpression: 'Quote = :postId',
        ExpressionAttributeValues: {
            ':postId': {'S': postId}
        },
        ProjectionExpression: 'userId, text, date, threadId, postId',
        ScanIndexForward: false
    }
    console.log('Request Params: ', params);
    return await dynamodb.get(params).promise().then((response) => {
        const body = {
            thread: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('log error: ', error);
    });
}

async function saveThread(requestBody) {
    const threadId = crypto.randomUUID();
    requestBody.threadId = threadId;
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
    const params = {
        TableName: dbThreadTable,
        Key: {
            'threadId': threadId
        },
        UpdateExpression: 'set text = :value',
        ExpressionAttributeValues: {
            ':value': text
        },
        returnValues: 'UPDATE_NEW'
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

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}