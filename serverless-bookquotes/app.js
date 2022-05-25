'use strict';
//using this: dashbird.io/blog/how-to-deploy-nodejs-application-aws-lambda/
// module.exports.hello = async (event) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v3.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };
// };

// app.js

const express = require('express')
const sls = require('serverless-http')
const app = express()


app.get('/', async (req, res, next) => {
  res.status(200).send('Hello World!')
})
module.exports.server = sls(app)
