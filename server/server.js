// set up ========================
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();

// configuration =================
mongoose.connect('mongodb://localhost/fridge');

app.use(express.static(__dirname + '/../client'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// define model =================
var fridgeSchema = new mongoose.Schema({
  item: String,
  expiration: String,
  utc: Number
});

var Fridge = mongoose.model('food', fridgeSchema);
// routes ======================================================================
app.get('/api/fridge', function(req, res) {
  Fridge.find(function(err, fridge) {
    if (err) {
      res.send(err);
    }
    res.json(fridge);
  });
});

app.post('/api/fridge', function(req, res) {
  Fridge.create({
    item: req.body.item,
    expiration: req.body.expiration,
    utc: req.body.utc
  }, function(err, fridge) {
    if (err) {
      res.send(err);
    }
    Fridge.find(function(err, fridge) {
      if (err) {
        res.send(err);
      }
      res.json(fridge);
    });
  });
});

// app.delete('/api/', function(req, res) {

// });

// listen (start app with node server.js) ======================================
app.listen(1337);
console.log('App listening on port 1337');
module.exports = app;
