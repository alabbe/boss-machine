const express = require('express');
const { getAllFromDatabase } = require('./db');
const router = express.Router();


router.get('/ideas', (req, res, next) => {
    res.send(getAllFromDatabase('ideas'));
  });

module.exports = router;