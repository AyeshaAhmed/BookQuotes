const crypto = require('crypto');
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dbQuoteTable = 'quote-table';
const dbThreadTable = 'thread-table';
const quotePath = '/quote';

exports.handler = async function (event) {
    console.log('Request event: ', event);
    if (event.path != quotePath) {
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
    if (!validUserId) {
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
    if (!validUserId) {
        return buildResponse(400, '400 Bad Request');
    }
    const getThreadParams = {
        TableName: dbThreadTable,
        IndexName: 'postId-index',
        KeyConditionExpression: "postId = :postId",
        ExpressionAttributeValues: {
            ":postId": postId
        }
    }
    console.log('Get Thread Request Params: ', getThreadParams);
    const quoteDeleteParams = {
        TableName: dbQuoteTable,
        Key: {
            'postId': postId
        },
        ReturnValues: 'ALL_OLD'
    }
    console.log('Delete Quote Request Params: ', quoteDeleteParams);
    try {
        const getThreadResponse = await dynamodb.query(getThreadParams).promise();
        const threadList = getThreadResponse.Items;
        const deletedThreadIds = [];
        for (const thread of threadList) {
            const threadDeleteParams = {
                TableName: dbThreadTable,
                Key: {
                    'threadId': thread.threadId
                },
                ReturnValues: 'ALL_OLD'
            }
            console.log('Delete Thread Request Params: ', threadDeleteParams);
            const threadDeleteResponse = await dynamodb.delete(threadDeleteParams).promise();
            console.log('Deleted Thread: ', threadDeleteResponse);
            deletedThreadIds.push(threadDeleteResponse.Attributes.threadId);
        }
        if (threadList.length === deletedThreadIds.length) {
            const quoteDeleteResponse = await dynamodb.delete(quoteDeleteParams).promise();
            const body = {
                Operation: 'DELETE',
                Message: 'SUCCESS',
                Item: quoteDeleteResponse,
                ThreadCount: deletedThreadIds.length
            }
            return buildResponse(200, body);
        } else {
            console.log('Thread Deletetion Failed, threadListSize: %d, deletedThreadsSize: %d', threadList.length, deletedThreadIds.length);
            return buildResponse(500, 'Thread Deletion Failed');
        }
    } catch (error) {
        console.error('log error: ', error);
    }
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
            'Access-Control-Allow-Methods' : 'OPTIONS,POST,GET,DELETE,PATCH',
            'X-Requested-With' : '*'
        },
        body: JSON.stringify(body)
    }
}