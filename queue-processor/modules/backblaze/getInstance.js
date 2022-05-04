const B2 = require('backblaze-b2');
B2.prototype.uploadAny = require('@gideo-llc/backblaze-b2-upload-any');
const { BACKBLAZE_APP_KEY_ID, BACKBLAZE_APPLICATION_KEY } = require('../../utils/constants');

module.exports = async () => {
  const B2Instance = new B2({
    applicationKey: BACKBLAZE_APPLICATION_KEY,
    applicationKeyId: BACKBLAZE_APP_KEY_ID,
  });
  const res = await B2Instance.authorize();
  return { B2Instance, partSize: res.data.absoluteMinimumPartSize };
};
