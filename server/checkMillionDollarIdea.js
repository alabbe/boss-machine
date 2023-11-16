const checkMillionDollarIdea = (req, res, next) => {
    let numWeeks = Number(req.body.numWeeks);
    let weeklyRevenue = Number(req.body.weeklyRevenue);
    if (!numWeeks || !weeklyRevenue || Number.isNaN(numWeeks) || Number.isNaN(weeklyRevenue)) {
        res.status(400).send("Idea's numweeks or weekly revenue has been not supplied.");
    } else {
        let ideaValue = Number(req.body.numWeeks) * Number (req.body.weeklyRevenue);
        if (ideaValue < 1000000) {
            res.status(400).send("Idea's value is less than one million dollars.");
        } else {
            next();
        }
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
