'use strict';

const requestCB = require('request');

module.exports.setupImageProxyRoutes = (app) => {
  app.get('/image', (req, resp)=> {
    let url = req.query.url.replace( /^https/i, 'http');
    requestCB(url).pipe(resp);
    //request.get({url: req.query.url, headers: {"cache-control": "none"}}).pipe(resp);
  });
}
