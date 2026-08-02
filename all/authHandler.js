const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../schemas/userSchema');

const router = express.Router();

router.post('/signup', (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
        ...req.body,
        password: hashedPassword,
    });
    newUser
        .save()
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: 'Authentication failed' });
            }
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
            res.json({ message: 'Login successful', user });
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});

module.exports = router;
