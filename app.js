require('./config.js');

var express             = require('express'),
    bodyParser          = require('body-parser'),
    mysql               = require('./dbcon.js'),
    axios               = require('axios')

var app                 = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT);
app.set('mysql', mysql);
app.set('view engine', 'ejs');

app.use('/api/data', require('./routes/api/data'));

app.get('/', function(req, res){
  res.render('index');
})

app.listen(app.get('port'), function(){
  console.log('WorldVis started on port: ' + app.get('port'));
})
