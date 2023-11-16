const express = require('express');
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId } = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');
const router = express.Router();

const validateIdea = (req, res, next) => {
  const name = req.body.bame;
  const numWeeks = req.body.numWeeks;
  const weeklyRevenue = req.body.weeklyRevenue;
  if (name === "" || numWeeks === "" || weeklyRevenue === "") {
    res.status(400).send('Unable to create new idea with the input data.');
  }
  next();
};

router.param('ideaId', (req, res, next, id) => {
  let ideaId = Number(id);
  if (ideaId) {
    const idea = getFromDatabaseById('ideas', id);
    if (idea) {
      req.idea = idea;
      next();
    } else {
      res.status(404).send('Idea with the given ID was not found');
    }
  } else {
    res.status(404).send('Id is missing');
  }
});

router.get('/', (req, res) => {
  res.send(getAllFromDatabase('ideas'));
});

router.post('/', validateIdea, checkMillionDollarIdea, (req, res) => {
  res.status(201).send(addToDatabase('ideas', req.body));
})

router.get('/:ideaId', (req, res) => {
  res.send(req.idea);
});

router.put('/:ideaId', checkMillionDollarIdea, (req, res) => {
  res.status(201).send(updateInstanceInDatabase('ideas', req.body));
});

router.delete('/:ideaId', (req, res) => {
  res.status(204).send(deleteFromDatabasebyId('ideas', req.idea.id));
});

module.exports = router;