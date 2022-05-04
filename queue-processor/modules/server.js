const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const { PORT_SERVER } = require('../utils/constants');

module.exports = (queueUrl, sqs) => {
  const app = express();

  app.use(cors());

  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.status(200).send({ status: 'ok' });
  });

  app.get('/createImage', (req, res) => {
    let orderData = {
      imgUrl: req.query['imgUrl'],
      fileName: req.query['fileName'],
    };

    let sqsOrderData = {
      MessageAttributes: {
        imgUrl: {
          DataType: 'String',
          StringValue: orderData.imgUrl,
        },
        fileName: {
          DataType: 'String',
          StringValue: orderData.fileName,
        },
      },
      MessageBody: JSON.stringify(orderData),
      QueueUrl: queueUrl,
    };

    // send the order data to the SQS queue
    let sendSqsMessage = sqs.sendMessage(sqsOrderData).promise();

    sendSqsMessage
      .then((data) => {
        console.log(`SQS | SUCCESS: ${data.MessageId}`);
        res.status(200).send({ error: false, message: 'The image is queued for being processed.' });
      })
      .catch((err) => {
        console.log(`SQS | ERROR: ${err}`);
        res.status(500).send({ error: true, message: 'We ran into an error. Please try again.' });
      });
  });

  const options = {
    cert: fs.readFileSync('./ssl_certs/cert.pem', 'utf-8'),
    key: fs.readFileSync('./ssl_certs/privkey.pem', 'utf-8'),
    ca: fs.readFileSync('./ssl_certs/ca.pem', 'utf-8'),
    requestCert: true,
    rejectUnauthorized: false,
  };

  const Init = https.createServer(options, app);
  Init.listen(PORT_SERVER);
  console.log(`SQS API listening on ${PORT_SERVER}`);
  return app;
};
