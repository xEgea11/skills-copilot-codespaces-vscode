// Create web server

// import express
const express = require('express');

// import body-parser
const bodyParser = require('body-parser');

// import mongoose
const mongoose = require('mongoose');

// import jsonwebtoken
const jwt = require('jsonwebtoken');

// import passport
const passport = require('passport');

// import passport-jwt
const passportJWT = require('passport-jwt');

// import cors
const cors = require('cors');

// import config
const config = require('./config');

// import models
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');

// define jwt strategy
const JWTStrategy = passportJWT.Strategy;

// define jwt extractor
const ExtractJWT = passportJWT.ExtractJwt;

// define port
const port = 8081;

// create express app
const app = express();

// use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use cors
app.use(cors());

// use passport
app.use(passport.initialize());

// define jwt options
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret
};

// use jwt strategy
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, callback) => {
  User.findById(jwtPayload.id, (err, user) => {
    if (err) {
      return callback(err, false);
    }

    if (user) {
      return callback(null, user);
    } else {
      return callback(null, false);
    }
  });
}));

// connect to mongodb
mongoose.connect(config.database);

// create a new post
app.post('/posts', passport.authenticate('jwt', { session: false }), (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    body: req.body.body,