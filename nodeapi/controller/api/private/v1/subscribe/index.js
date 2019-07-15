const express = require('express');
const router = express.Router();

// Load Subscription model
const Subscription = require('../../../../../models/Subscribers/index');

var DdosValidator = require('../../../../setupHelper'); // Added by Bharat Jograna on 20 Jun 2019

router.use(DdosValidator.validateDenialofService());// Added by Bharat Jograna on 20 Jun 2019

// Replace with your email
router.post('/', (req, res) => {
    const subscriptionModel = new Subscription(JSON.parse(req.body.jsondata));

    subscriptionModel.save((err, subscription) => {
        if (err) {
            res.status(500).json({
                error: 'Technical error occurred'
            });
        } else {
            res.json({
                data: 'Subscription saved.'
            });
        }
    });
});

router.get('/', (req, res) => {
    res.json({
        data: 'Invalid Request Bad'
    });
});

module.exports = router;