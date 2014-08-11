var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var logfmt = require("logfmt");
var app = express();
var hookContent = "{}";
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(methodOverride());
app.use(logfmt.requestLogger());

app.post("/post-recieve", function(req, res){
  hookContent = req.body;
  console.log("post",req.body);
  res.json(hookContent);
});

app.get("/", function(req, res) {
  res.json(hookContent);
});

var server = app.listen(port, function() {
  console.log("Listening on port %d", server.address().port);
});
