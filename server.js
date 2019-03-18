var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

mongoose.connect('mongodb://localhost/ListeaFaire', { useNewUrlParser: true });

require('./model');

app.use('/', require('./api-route'));

app.listen(8080);
console.log("on utilise le port: 8080");