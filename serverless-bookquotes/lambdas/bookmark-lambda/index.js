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
    const q_params = event.queryStringParameters;
    switch (true) {
        case event.httpMethod === 'GET' && q_params.userId != null:
            response = await getBookmarks(q_params.userId);
            break;
        case event.httpMethod === 'POST':
            response = await addBookmark(requestBody.postId, requestBody.userId);
            break;
        case event.httpMethod === 'DELETE':
            response = await removeBookmark(requestBody.postId, requestBody.userId);
            break;
        default:
            response = buildResponse(404, '404 Not Found');
    }
    return response;
}

async function getBookmarks(userId) {
    const bmQuoteIds = getUserBookmarked(userId);
    const bmQuotes = [];
    if(bmQuoteIds != null){
        bmQuotes.forEach(quoteId => {
            const params = {
                TableName: dbQuoteTable,
                postId: quoteId
            }
            console.log('Request Params: ', params);
            recentQuotes.push.apply(recentQuotes, quotes);
            try{
                const response = await dynamodb.get(params).promise();
                const quote = response.Item;
                if (quote.postId != null) {
                    bmQuotes.push.apply(bmQuotes, quote);
                }
            }catch (error) {
                console.error('log error: ', error);
                return buildResponse(500, 'Internal Server Error');
            }
        });
        const body = {quotes: bmQuotes};
        return buildResponse(200, body);
    }
}

async function addBookmark(postId, userId) {
    const bmQuoteIds = getUserBookmarked(userId);
    bmQuoteIds.push.apply(bmQuoteIds, postId);
    const params = {
        TableName: dbUserTable,
        Key: {
            'userId': userId
        },
        UpdateExpression: 'set :bookmarks :value',
        ExpressionAttributeValues: {
            ':value': bmQuoteIds
        },
        ReturnValues: 'NONE'
    }
    console.log('update user list Request Params: ', params);
    const isSuccess = await dynamodb.put(params).promise().then(() => {
        return true;
    }, (error) => {
        console.error('log error: ', error);
        return false;
    });
    if(!isSuccess){
        return buildResponse(500, 'Internal Server Error');
    }
    const quote_params = {
        TableName: dbQuoteTable,
        Key: {
            'postId': postId
        },
        UpdateExpression: 'set ADD #counter :incva',
        ExpressionAttributeNames:{
            "#counter":"numBookmarks"
        },
        ExpressionAttributeValues:{
            ":incva":1
        },
        ReturnValues: 'UPDATED_NEW'
    }
    console.log('Update numBookmarks Request Params: ', quote_params);
    return await dynamodb.put(quote_params).promise().then((res) => {
        const body = {
            Operation: 'SAVE',
            Message: 'SUCCESS',
            numBookmarks: res.Item.numBookmarks
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('log error: ', error);
    });
}

async function removeBookmark(postId, userId) {
    const bmQuoteIds = getUserBookmarked(userId);
    let itemToBeRemoved = [postId];
    const filteredArray = bmQuoteIds.filter(item => !itemToBeRemoved.includes(item));
    const params = {
        TableName: dbUserTable,
        Key: {
            'userId': userId
        },
        UpdateExpression: 'set :bookmarks :value',
        ExpressionAttributeValues: {
            ':value': filteredArray
        },
        ReturnValues: 'NONE'
    }
    console.log('update user list Request Params: ', params);
    const isSuccess = await dynamodb.put(params).promise().then(() => {
        return true;
    }, (error) => {
        console.error('log error: ', error);
        return false;
    });
    if(!isSuccess){
        return buildResponse(500, 'Internal Server Error');
    }
    const quote_params = {
        TableName: dbQuoteTable,
        Key: {
            'postId': postId
        },
        UpdateExpression: 'set ADD #counter :incva',
        ExpressionAttributeNames:{
            "#counter":"numBookmarks"
        },
        ExpressionAttributeValues:{
            ":incva":-1
        },
        ReturnValues: 'UPDATED_NEW'
    }
    console.log('Update numBookmarks Request Params: ', quote_params);
    return await dynamodb.put(quote_params).promise().then((res) => {
        const body = {
            Operation: 'SAVE',
            Message: 'SUCCESS',
            numBookmarks: res.Item.numBookmarks
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('log error: ', error);
    });
}

async function getUserBookmarked(userId){
    const params = {
        TableName: dbUserTable,
        Key: {
            'userId': userId
        }
    }
    console.log('Request Params: ', params);
    return await dynamodb.get(params).promise().then((response) => {
        console.log(response.Item);
        if(response.Item.userId != null){
            return response.Item.bookmarks;
        }
        return null;
    }, (error) => {
        console.error('log error: ', error);
    });
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