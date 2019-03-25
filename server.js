var express  = require('express');
var nunjucks = require('nunjucks');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://user:user@cluster0-zt25f.mongodb.net/todolist', { useNewUrlParser: true });
//mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true });

Todolist = require('./models/Todolist');
User = require('./models/User');

var app      = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/views', express.static(__dirname + '/views'));

app.use('/todolists', require('./routes/todolists'));
app.use('/', require('./routes/users'));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});