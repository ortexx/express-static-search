"use strict";

const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const request = require('supertest');
const expressStatic = require('../index');

describe('ExpressStaticSearch:', function () {
  let staticPath = path.join(__dirname, 'assets/');

  before(() => {
    fs.ensureFileSync(path.join(staticPath, '/static.mp3'));
    fs.ensureFileSync(path.join(staticPath, '/is-not-static.js'));
  });

  after(() => {
    fs.removeSync(staticPath);
  });

  function createApp() {
    let app = express();
    app.use(expressStatic(staticPath, {
      beforeSend: (res, file) => {
        return !file.match('is-not-static.js');
      }
    }));
    app.get('*', (req, res) => res.sendStatus(404));
    return app;
  }

  it('should return static file', done => {
    let app = createApp();

    request(app)
      .get('/static.mp3')
      .expect('Content-Type', 'audio/mpeg')
      .expect(200)
      .end(done)
  });

  it('should return static file with non-existent path', done => {
    let app = createApp();

    request(app)
      .get('/non-existent/path/static.mp3')
      .expect('Content-Type', 'audio/mpeg')
      .expect(200)
      .end(done)
  });

  it('should not return non-existent file', done => {
    let app = createApp();

    request(app)
      .get('/non-existent.mp3')
      .expect(404)
      .end(done)
  });

  it('should not return excluded file', done => {
    let app = createApp();

    request(app)
      .get('/is-not-static.js')
      .expect(404)
      .end(done)
  });
});

