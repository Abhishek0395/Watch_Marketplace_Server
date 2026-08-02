const express = require('express');
const Watch = require('../schemas/watchSchema');

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const watches = await Watch.find({ status: 'approved' });
        res.status(200).json(watches);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});
module.exports = router;
