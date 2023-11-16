const express = require('express');
const { getAllFromDatabase, getFromDatabaseById } = require('./db');
const router = express.Router();

const getWorkByMinionId = (minionId) => {
    let workArray = getAllFromDatabase('work');
    let workForMinion = workArray.map((work) => work.minionId === minionId);
    return workForMinion;
}

router.param('minionId', (req, res, next, id) => {
    let minionId = Number(id);
    console.log('minionId: ', minionId);
    let minion = getFromDatabaseById('minions', minionId);
    if (minion) {
        req.work = getWorkByMinionId(minion.id);
        next();
    } else {
        res.status(404).send('Minion not found.');
    }
});

router.get('/', (req, res) => {
    console.log('get work');
   res.send(getAllFromDatabase('work'));
});

module.exports = router;