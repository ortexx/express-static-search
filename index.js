"use strict";

const fs = require('fs-extra');
const path = require('path');

module.exports = function (staticPath, options = {}) {
  const nestingLimit = options.nestingLimit || 15;

  function search (i, parts, callback) {
    const filePath = path.join(staticPath, parts.slice(i).join('/'));

    fs.pathExists(filePath, (err, exists) => {
      if(err) {
        return callback(err);
      }

      if(exists) {
        return callback(null, filePath);
      }

      if(i >= parts.length - 1) {
        return callback(null, false);
      }

      return search(i + 1, parts, callback);
    });
  }

  return function (req, res, next) {
    const url = req.path;

    if(!/.*\.[^.]+$/.test(url)) {  
      return next();
    }    

    let parts = url.split('/');

    if(parts.length > nestingLimit) {
      parts = parts.slice(0, nestingLimit);
    }

    search(0, parts, (err, file) => {
      if(err) {
        return next(err);
      }

      if(file) {
        let act = true;

        if(options.beforeSend) {
          act = options.beforeSend(res, file) !== false;
        }

        if(act) {
          return res.sendFile(file)
        }
      }

      next();
    });
  }
};
