'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const fs = require('fs');

'use strict';
const _ = require('lodash');
const ImageModel = require('../db/image').ImageModel;
const http = require('http');

var gcloud = require('gcloud')({
  projectId: 'taranio-1281',
  credentials: {
    "private_key": process.env.google_api_key.replace(/\\n/g,'\n'), //newlines are hard in windows env variables
    "client_email": process.env.google_api_email,
  }
});

var vision = gcloud.vision();

let inProcessRequests = {};

//retuerns a promise that's true or false
function getURLInfo(url) {
  //first check db.
  url = url.replace( /^https/i, 'http');
  if(inProcessRequests[url]) {
    return inProcessRequests[url];
  }
  let r = ImageModel.find({url: url})
    .then((docs)=>{
      if(docs.length) {
        return docs[0];
      }
      //check if it exists

      return new Promise((resolve, reject)=>{
        http.get(url, function (res) {
          // If you get here, you have a response.
          // If you want, you can check the status code here to verify that it's `200` or some other `2xx`.
          if(res && res.statusCode < 300) {
            return detectNSFW(url).then((data)=>{
              resolve(data);
            });
          } else {
            const image = {
              url: url,
              exists: false,
              sfw: false,
            };
            new ImageModel(image)
              .save();
            inProcessRequests[url] = null;
            resolve(image);
          }
        })
          .on('error', function(e) {
          // Here, an error occurred.  Check `e` for the error.
          const image = {
            url: url,
            exists: false,
            sfw: false,
          };
          new ImageModel(image)
            .save();
          inProcessRequests[url] = null;
          resolve(image);
        });
      });
  });

  inProcessRequests[url] = r;
  return r;
}

function detectNSFW(url) {
  return new Promise( (resolve, reject)=> {
    vision.detect(url, ['safeSearch'], (err, detections, apiResponse) => {
      if(err) {
        console.log(err);
        return reject();
      }
      //google api resp: {"adult":true,"spoof":false,"medical":false,"violence":false,"errors":[]}
      const image = {
        url: url,
        exists: true,
        sfw: !detections.adult && !detections.violence,
      };
      new ImageModel(image)
        .save();
      inProcessRequests[url] = null;
      return resolve(image);
    });
  });
}

module.exports.setupImageRoutes = (app) => {
  app.get('/image-test', (req,resp) =>{
    getURLInfo(req.query.url)
      .then((image)=>{
        resp.json(image);
      });
  });
};
