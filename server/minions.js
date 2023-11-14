const express = require('express');
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId } = require('./db');
const router = express.Router();


const validateMinion = (req, res, next) => {
  const name = req.body.bame;
  const title = req.body.title;
  const weaknesses = req.body.weaknesses;
  const salary = req.body.salary;
  if (name === "" || title === "" || weaknesses === "" || salary === "") {
    res.status(400).send('Unable to create minion with the input data.');
  }
  req.body.salary = Number(salary);
  next();
};

router.get('/', (req, res, next) => {
  res.send(getAllFromDatabase('minions'));
});

router.post('/', validateMinion, (req, res, next) => {
  const newMinion = addToDatabase('minions', req.body);
  res.status(201).send(newMinion);
});

router.param('minionId', (req, res, next, id) => {
  let minionId = Number(id);
  if (minionId) {
    const minion = getFromDatabaseById('minions', id);
    if (minion) {
      req.minion = minion;
      next();
    } else {
      res.status(404).send('Minion with the given ID was not found');
    }
  } else {
    res.status(400).send('Id is missing');
  }
});

router.get('/:minionId', (req, res, next) => {
  res.send(req.minion);
});

router.put('/:minionId', validateMinion, (req, res, next) => {
  updateInstanceInDatabase('minions', req.body);
});

router.delete('/:minionId', validateMinion, (req, res, next) => {
  res.send(deleteFromDatabasebyId('minions', req.minion.id));
});

module.exports = router;
