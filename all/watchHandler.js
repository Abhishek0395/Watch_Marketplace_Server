const express = require('express');
const Watch = require('../schemas/watchSchema');

const router = express.Router();

router.get('/', (req, res) => {
    Watch.find()
        .then((watches) => {
            res.json(watches);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});
router.get('/:id', (req, res) => {
    Watch.findById(req.params.id)
        .then((watch) => {
            if (!watch) {
                return res.status(404).json({ error: 'Watch not found' });
            }
            res.json(watch);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});
router.post('/', (req, res) => {
    const newWatch = new Watch(req.body);
    newWatch
        .save()
        .then((watch) => {
            res.status(201).json(watch);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});
router.post('/all', (req, res) => {
    Watch.insertMany(req.body)
        .then((watches) => {
            res.status(201).json(watches);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});

router.put('/:id', (req, res) => {
    Watch.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((watch) => {
            if (!watch) {
                return res.status(404).json({ error: 'Watch not found' });
            }
            res.json(watch);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});

router.delete('/:id', (req, res) => {
    Watch.findByIdAndDelete(req.params.id)
        .then((watch) => {
            if (!watch) {
                return res.status(404).json({ error: 'Watch not found' });
            }
            res.json({ message: 'Watch deleted successfully' });
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});

module.exports = router;
