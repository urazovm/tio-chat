const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

var gcloud = require('gcloud')({
  projectId: 'taranio-1281',
  credentials: {
    "private_key": process.env.google_api_key.replace(/\\n/g,'\n'), //newlines are hard in windows env variables
    "client_email": process.env.google_api_email,
  }
});

var vision = gcloud.vision();

vision.detect('http://i1.cdn2b.image.pornhub.phncdn.com/m=ecuK8daaaa/videos/201606/20/80047681/original/9.jpg', ['safeSearch'], (err, detections, apiResponse) => {
  if(err) {
    console.log(err);
    return reject();
  }
  //google api resp: {"adult":true,"spoof":false,"medical":false,"violence":false,"errors":[]}
  console.dir(detections);
});


