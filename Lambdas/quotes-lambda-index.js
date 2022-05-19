const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dbQuotesTable = 'quote-table';
const quotesPath = '/quotes';

exports.handler = async function (event) {
    console.log('Request event: ', event);
    if(event.path != quotesPath){
        return buildResponse(404, '404 Not Found');
    }
    let response;
    switch (true) {
        case event.httpMethod === 'GET' && event.queryStringParameters == null:
            response = await getRecentQuotes();
            break;
        case event.httpMethod === 'GET' && event.queryStringParameters.userId != null:
            response = await getUserQuotes(event.queryStringParameters.userId);
            break;
        default:
            response = buildResponse(404, '404 Not Found');
    }
    return response;
}

async function getRecentQuotes() {
    const recentQuotes = [];
    for(let i = 0; i < 3; i++){
        const queryDate = new Date(new Date().setDate(new Date().getDate() - i)).toISOString().split('T', 1)[0];
        const params = {
            TableName: dbQuotesTable,
            IndexName: 'createdDate-index',
            KeyConditionExpression: "createdDate = :createdDate",
            ExpressionAttributeValues: {
                ":createdDate": queryDate
            }
        }
        console.log('Request Params: ', params);
        try{
            const response = await dynamodb.query(params).promise();
            const quotes = response.Items;
            if (quotes.length > 0) {
                quotes.sort((a, b) => (a.numBookmarks > b.numBookmarks) ? 1 : -1);
                recentQuotes.push(quotes);
            }
        }catch (error) {
            console.error('log error: ', error);
            break;
        }
    }
    const body = {quotes: recentQuotes};
    return buildResponse(200, body);
}

async function getUserQuotes(userIdStr) {
    const params = {
        TableName: dbQuotesTable,
        IndexName: 'userId-index',
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userIdStr
        }
    }
    console.log('Request Params: ', params);
    return await dynamodb.query(params).promise().then((response) => {
        const body = {
            thread: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('log error: ', error);
    });
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