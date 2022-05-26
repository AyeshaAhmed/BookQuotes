const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});
const healthPath = '/health';

exports.handler = async function(event) {
    console.log('Request event: ', event);
    let response;
    switch(true){
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = buildResponse(200, 'SUCCESS');
            break;
        default:
            response = buildResponse(404, '404 Not Found')
    }
    return response;
}

function buildResponse(statusCode, body){
    return{
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