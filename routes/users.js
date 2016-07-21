'use strict';

const express = require('express');
const request = require('request');

const User = require('../models/user');


let router = express.Router();

router.get('/', User.authMiddleware, (req,res) => {
  User.find({}, (err, users) => {
    res.status(err ? 400 : 200).send(err || users)
  })
})

router.get('/profile', User.authMiddleware, (req, res) => {
  console.log('req.user:', req.user);
  res.send(req.user);
});

router.post('/login', (req, res) => {
  User.authenticate(req.body, (err, token) => {
    res.status(err ? 400 : 200).send(err || {token: token});
  })
})

router.post('/signup', (req, res) => {
  User.register(req.body, (err, token) => {
    res.status(err ? 400 : 200).send(err || {token: token});
  })
})

router.get('/:id', User.authMiddleware, (req,res) => {
  User.findById(req.params.id, (err, user) => {
    res.status(err ? 400: 200).send(err || user);
  })
})

router.post('/:id', User.authMiddleware, (req,res) => {
  console.log('req.user', req.user);
  console.log('req.body', req.body);
  User.findById(req.user._id, (err, user) => {
    if(err || !user) return res.status(400).send(err || {error: 'No user found.'});

    let stock = {
      symbol: req.params.id
    };

    user.stocks.push(stock)

    user.save(err => {
      res.status(err ? 400: 200).send(err);
    })
  })
})

router.put('/:id', User.authMiddleware, (req, res) => {
  User.findOne({'_id':req.user._id}, (err, user) => {
    if(err) res.status(400).send(err);
    if(user) {
      let index = user.stocks.indexOf(user.stocks.filter( item => {
        return item._id == req.params.id
      })[0])
      console.log('index:', index);
      if(index !== -1) {
        user.stocks.splice(index, 1)

        user.save(err => {
          res.status(err ? 400:200).send(err);
        })
      }
    }
  })
})


module.exports = router;
