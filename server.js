const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/projet-map'));
app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+
    '/dist/projet-map/index.html'));});
app.listen(process.env.PORT || 8080);

