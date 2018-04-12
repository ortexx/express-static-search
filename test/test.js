"use strict";

const assert = require('chai').assert;
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const request = require('supertest');
const stream = require('stream');
const expressStatic = require('../index');

describe('ExpressStaticSearch:', function () {
  let staticPath = path.join(__dirname, 'assets/');

  before(() => {
    let staticFile = path.join(staticPath, '/static.mp3');
    fs.ensureFileSync(staticFile);
    fs.writeFileSync(staticFile, 'hello');
  });

  after(() => {
    fs.removeSync(staticPath);
  });

  let userName = 'Alex';
  let userEmail = 'first@example.com';

  function createApp() {
    let app = express();
    app.use(expressStatic(staticPath));
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
});

