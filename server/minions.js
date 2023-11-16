const express = require('express');
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId } = require('./db');
const router = express.Router({mergeParams: true});


const validateMinion = (req, res, next) => {
    const name = req.body.bame;
    const salary = req.body.salary;
    if (name === "" || salary === "") {
        res.status(400).send('Unable to create minion with the input data.');
    } else {
        req.body.salary = Number(salary);
        next();
    }
};

const validateWork = (req, res, next) => {
    let title = req.body.title;
    if (title === "") {
        res.status(400).send('Unable to create work with the input data.');
    } else {
        next();
    }
};

router.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('minions'));
});

router.post('/', validateMinion, (req, res) => {
    const newMinion = addToDatabase('minions', req.body);
    res.status(201).send(newMinion);
});

router.param('minionId', (req, res, next, id) => {
    const minion = getFromDatabaseById('minions', id);
    if (minion) {
        req.minion = minion;
        next();
    } else {
        res.status(404).send();
    }
});

router.param('workId', (req, res, next, id) => {
    const work = getFromDatabaseById('work', id);
    if (work) {
        req.work = work;
        next();
    } else {
        res.status(404).send();
    }
});

router.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
});

router.put('/:minionId', validateMinion, (req, res, next) => {
    res.send(updateInstanceInDatabase('minions', req.body));
});

router.delete('/:minionId', validateMinion, (req, res, next) => {
    res.status(204).send(deleteFromDatabasebyId('minions', req.minion.id));
});

router.get('/:minionId/work', (req, res) => {
    let workArray = getAllFromDatabase('work');
    let workForMinion = workArray.filter((work) => work.minionId === req.params.minionId);
    res.send(workForMinion);
});

router.post('/:minionId/work', validateWork, (req, res) => {
    let work = req.body;
    work.minionId = req.params.minionId;
    res.status(201).send(addToDatabase('work', work));
});

router.put('/:minionId/work/:workId', validateWork, (req, res) => {
    if (req.params.minionId !== req.body.minionId) {
        res.status(400).send();
    } else {
        res.send(updateInstanceInDatabase('work', req.body));
    }
});

router.delete('/:minionId/work/:workId', validateMinion, validateWork, (req, res) => {
    const result = deleteFromDatabasebyId('work', req.work.id);
    if (result) {
        res.status(204).send();
    } else {
        res.status(500).send();
    }
});

module.exports = router;
