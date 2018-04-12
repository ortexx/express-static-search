# express-static-search
Module to get static files with deep scan of relative paths.

# Install 
`npm install express-static-search`

# Example
```js
const expressStatic = require("express-static-search");
const express = require("express");
const path = require("path");
const app = express();
const staticPath = path.join(__dirname, 'assets');

app.use(expressStatic(staticPath));
```

# Description
Let's say client is on __/hello/world/__ page and requests __static-file.mp3__. It is relative path, so browser sends to the server full url __/hello/world/static-file.mp3__. In some cases we can't set absolute path, but want to get the necessary file. This library scan every part of url to find a match. It will try to get:

* staticPath + /hello/world/static-file.mp3
* staticPath + /world/static-file.mp3
* staticPath + static-file.mp3

If any file of the specified exists, then you will get it.