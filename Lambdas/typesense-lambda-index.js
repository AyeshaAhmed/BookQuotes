const AWS = require('aws-sdk');
const Typesense = require('typesense');
AWS.config.update({
    region: 'us-east-2'
});

// got this from : dev.to/joshuajee/how-to-integrate-typesense-search-engine-in-a-nodejs-application-5654
// and this : typesense.org/docs/guide/dynamodb-full-text-search.html#step-4-create-a-lambda-function
// and this : https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.Tutorial.html
// and this : https://typesense.org/docs/0.16.1/api/documents.html#index-a-document
// must be syncronous...

exports.handler = async function (event) {
    console.log('Request event: ', JSON.stringify(event));

    const client = new Typesense.Client({
        nodes: [{
            host: 'sulxzkojgi4ecawdp-1.a1.typesense.net', // For Typesense Cloud use xxx.a1.typesense.net
            port: '443',      // For Typesense Cloud use 443
            protocol: 'https'   // For Typesense Cloud use https
        }],
        apiKey: 'XVnTBbiaIxVvc0K9sldzNTYgbljZLzZh',
        connectionTimeoutSeconds: 5
    });

    const ddb_record = event.dynamodb;
    let response;
    if (event.eventName == 'REMOVE') {
        response = await deleteRecordDocument(ddb_record, client);
    } 
    if (event.eventName == 'INSERT') {
        response = await saveRecordDocument(ddb_record, client);
    } 
    if (event.eventName == 'MODIFY') {
        response = await updateRecordDocument(ddb_record, client);
    }
    return response;
}

async function deleteRecordDocument(dbRecord, client) {
    const postId = JSON.stringify(dbRecord.OldImage.postId.S).replaceAll('"', '');
    try {
        return await client.collections('quotes').documents().delete({ 'filter_by': 'postId:' + postId }).then(data => {
            const response = data;
            console.log('typesense response on delete: ', response);
            return response;
        });
    } catch (err) {
        console.error('typesense error on delete: ', err);
    }
}

async function saveRecordDocument(dbRecord, client) {
    const document = {
        'postId': JSON.stringify(dbRecord.NewImage.postId.S).replaceAll('"', ''),
        'quoteText': JSON.stringify(dbRecord.NewImage.quoteText.S).replaceAll('"', ''),
        'tags': JSON.stringify(dbRecord.NewImage.tags.S).replaceAll('"', ''),
        'authorName': JSON.stringify(dbRecord.NewImage.authorName.S).replaceAll('"', ''),
        'bookName': JSON.stringify(dbRecord.NewImage.bookName.S).replaceAll('"', '')
    };
    try {
        return await client.collections('quotes').documents().upsert(document).then(data => {
            const response = data;
            console.log('typesense response on insert: ', response);
            return response;
        });
    } catch (err) {
        console.error('typesense error on insert: ', err);
    }
}

async function updateRecordDocument(dbRecord, client) {
    const postId = JSON.stringify(dbRecord.NewImage.postId.S).replaceAll('"', '');
    const document = {
        'quoteText': JSON.stringify(dbRecord.NewImage.quoteText.S).replaceAll('"', '')
    };
    try {
        const result = await client.collections('quotes').documents().search({ 'q': postId, 'query_by': 'postId' }).then(data => {
            console.log('typesense response on search: ', JSON.stringify(data));
            return data;
        });
        const docId = JSON.stringify(result.hits[0].document.id).replaceAll('"', '');
        console.log('id to update: ', docId);
        return await client.collections('quotes').documents(docId).update(document).then(data => {
            const response = data;
            console.log('typesense response on modify: ', response);
            return response;
        });
    } catch (err) {
        console.error('typesense error on modify: ', err);
    }
}