const AWS = require('aws-sdk');
const ConsumerApp = require('./modules/consumer');
const Server = require('./modules/server');
const WebSocket = require('./modules/websocket');

// Configure the region
AWS.config.update({ region: 'us-east-1' });

// Create an SQS service object
const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  accessKeyId: 'API_KEY',
  secretAccessKey: 'SECRET',
});
const queueUrl = 'https://sqs.us-east-1.amazonaws.com/342063193137/TEST-queue';

// Init server with api for updating items to the queue.
const app = Server(queueUrl, sqs);

// Init websocket for notify when image is cut.
// WebSocket(app);

// Init queue consumer, process the images from the queue on cut service.
ConsumerApp(queueUrl, sqs);
