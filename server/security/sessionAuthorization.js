var mongoose = require('mongoose');
var express = require('express');
var app = express();

// Session Model
var Session = require('./sessionModel.js');

// authentication middleware that checks to see if the key exists in the sessions collection before posting scores to the Game collection
exports.checkSession = function(req, res, next){
  Session.find({_id: req.body.session}).count({}, function(err, count){
    if (count > 0) {
      next();
    } else {
      res.status(401).send('Not allowed');
    }
  });
};
