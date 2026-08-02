const express = require('express');
const User = require('../schemas/userSchema');

const router = express.Router();

router.get('/', (req, res) => {
    User.find()
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});
router.post('/', (req, res) => {
    const newUser = new User(req.body);
    newUser
        .save()
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});
router.post('/all', (req, res) => {
    User.insertMany(req.body)
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});

router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});

module.exports = router;
