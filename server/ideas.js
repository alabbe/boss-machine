const express = require('express');
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId } = require('./db');
const router = express.Router();

const validateIdea = (req, res, next) => {
  const name = req.body.bame;
  const description = req.body.description;
  const numWeeks = req.body.numWeeks;
  const weeklyRevenue = req.body.weeklyRevenue;
  if (name === "" || description === "" || numWeeks === "" || weeklyRevenue === "") {
    res.status(400).send('Unable to create new idea with the input data.');
  }
  req.body.numWeeks = Number(numWeeks);
  req.body.weeklyRevenue = Number(weeklyRevenue);
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
    res.status(400).send('Id is missing');
  }
});

router.get('/', (req, res) => {
  res.send(getAllFromDatabase('ideas'));
});

router.post('/', validateIdea, (req, res) => {
  res.send(addToDatabase('ideas', req.body));
})

router.get('/:ideaId', (req, res) => {
  res.send(req.idea);
});

router.put('/:ideaId', (req, res) => {
  res.send(updateInstanceInDatabase('ideas', req.body));
});

router.delete('/:ideaId', (req, res) => {
  res.send(deleteFromDatabasebyId('ideas', req.idea.id));
});

module.exports = router;