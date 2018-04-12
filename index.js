"use strict";

const fs = require('fs-extra');
const path = require('path');

module.exports = function (staticPath) {
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

    if(/.*\.[^.]+$/.test(url)) {      
      const parts = url.split('/');

      search(0, parts, (err, file) => {
        if(err) {
          return next(err);
        }

        if(file) {
          return res.sendFile(file)
        }

        next();
      });
    }
    else {
      next();
    }
  }
};
