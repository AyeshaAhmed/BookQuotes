'use strict';
const AWS = require("aws-sdk");
AWS.config.update({
    region: 'us-east-2'
});

exports.handler = (event, context, callback) => {

    const lambda = new AWS.Lambda({
        region: 'us-east-2' //change to your region
    });

    let processed = 0;
    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));
        lambda.invoke({
            FunctionName: 'serverless-bookquotes-production-typesenselambda',
            InvocationType: 'Event',
            Payload: JSON.stringify(record)
        },function(err, data){
            if (err) {
                console.log("error");
                callback(null, 'Processed '+processed+' of '+event.Records.length+' records.');
            }
            else {
                processed++;
                console.log("lambda invoke end");
                callback(null, 'Processed '+processed+' of '+event.Records.length+' records.');
            }
        });
    });
    callback(null, `Successfully processed ${processed} of ${event.Records.length} records.`);
};

