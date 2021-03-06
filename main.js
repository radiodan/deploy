var express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    morgan         = require('morgan'),
    logfmt         = require('logfmt'),
    verifySecrets  = require(__dirname + '/lib/verify-secrets'),
    determineAction= require(__dirname + '/lib/determine-action'),
    Deployment     = require(__dirname + '/lib/deployment'),
    persistance    = require(__dirname + '/lib/persistance').create();

var app  = express(),
    port = (process.env.PORT || 3000);

app.use(bodyParser.json({ verify: verifySecrets }));
app.use(methodOverride());
app.use(morgan('combined'));
app.use(logfmt.requestLogger());
app.use(express.static(__dirname + "/public"));

app.post('/post-hook', function(req, res){
  var action = determineAction(req.body);

  switch(action) {
    case 'deploy':
      Deployment.create(req.body).then(
        function(deploy) {
          deploy.deploy();
          res.status(200).end();
        },
        function(err) {
          console.warn(err);
          res.status(500).end();
        });
      break;
    case 'erase':
      Deployment.create(req.body).then(
        function(deploy) {
          deploy.erase();
          res.status(200).end();
        },
        function(err) {
          console.warn(err);
          res.status(500).end();
        });
      break;
    default:
      console.warn('Don\'t know what to do with', action);
  }
});

app.get('/', function(req, res) {
  var repos = persistance.fetch(),
      url;

  if(req.get('x-forwarded-host')) {
    url = req.protocol + '://' + req.get('x-forwarded-host');
  } else {
    url = req.protocol + '://' + req.host + ':' + port;
  }

  for(var project in repos) {
    for(var ref in repos[project]) {
      if(repos[project][ref].hasOwnProperty("file")) {
        repos[project][ref]["file"] = url + repos[project][ref]["file"];
      }
    }
  }

  res.json(repos);
});

app.get('/releases/:owner/:repo/:ref', function(req, res) {
  var project = req.params['owner'] + '/' + req.params['repo'],
      ref     = req.params['ref'];

  persistance.fetch();

  if(persistance.isValidRepo(project, ref)) {
    var tarBall = persistance.data[project][ref].file;

    res.redirect(tarBall);
  } else {
    res.status(404).end();
  }
});

var server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});
