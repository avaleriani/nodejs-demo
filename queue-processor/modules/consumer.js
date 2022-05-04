const getInstance = require('./backblaze/getInstance');
const { Consumer } = require('sqs-consumer');
const https = require('https');
const { BACKBLAZE_BUCKET_ID } = require('../utils/constants');
const { CUT_SERVICE } = require('../utils/constants');

// CONSUMER RUNNING THE CUT PROCESS AND UPLOAD IMAGE
module.exports = async (queueUrl, sqs) => {
  const ConsumerApp = Consumer.create({
    queueUrl: queueUrl,
    handleMessage: async (message) => {
      const { imgUrl, fileName } = JSON.parse(message.Body);
      const cutUrl = `${CUT_SERVICE}${imgUrl}&a=true`;
      const { B2Instance, partSize } = await getInstance();

      https
        .get(cutUrl, (res) => {
          B2Instance.uploadAny({
            bucketId: BACKBLAZE_BUCKET_ID,
            fileName: fileName,
            partSize: partSize,
            data: res,
          });

          res.on('end', async (res) => {
            console.log('FILE UPLOAD FINISHED');
            console.log(fileName);
          });
        })
        .on('error', (err) => {
          console.log(
            'Error consuming message from SQS, file processing or upload error.',
            err.message
          );
        });
    },
    sqs: sqs,
  });

  ConsumerApp.on('error', (err) => {
    console.error({ errorConsumer: err.message });
  });

  ConsumerApp.on('processing_error', (err) => {
    console.error({ processingErrorConsumer: err });
    console.error({ errorDetail: err.response });
  });

  ConsumerApp.start();
  console.log(`SQS Consumer running`);
};
