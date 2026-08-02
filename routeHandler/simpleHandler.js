const express = require('express');
const Watch = require('../schemas/watchSchema');

const router = express.Router();
// router.get('/', async (req, res) => {
//     try {
//         const watches = await Watch.find({ status: 'approved' });
//         res.status(200).json(watches);
//     } catch (err) {
//         res.status(500).json({
//             error: err.message,
//         });
//     }
// });
router.get('/', async (req, res) => {
    try {
        const dbName = Watch.db.name;
        const total = await Watch.countDocuments({});
        const statuses = await Watch.distinct('status'); // <-- every distinct status value
        const sample = await Watch.findOne({}, 'title status'); // <-- one doc's title + status
        res.status(200).json({
            dbName,
            total,
            statuses,
            sample,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
