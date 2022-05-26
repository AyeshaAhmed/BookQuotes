
exports.handler = async (event, context, callback) => {
    if (event.body !== null && event.body !== undefined) {
        let data = JSON.parse(event.body);
        
        if (typeof data.name === 'undefined') {
            return sendRes(404, '{ error: true, message: "Hello World!." }');
        }
        
        return sendRes(200, '{ "error": false, "message": "Hello "' + data.name + '" }');
    }    
    
    return sendRes(404, '{ error: true, message: "Hello World!." }');
};
const sendRes = (status, body) => {
    var response = {
        statusCode: status,
        headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,PUT,GET,DELETE,PATCH",
            "Access-Control-Allow-Credentials" : true,
            "Access-Control-Allow-Origin" : "*",
            "X-Requested-With" : "*"
        },
        body: body
    };
    return response;
};