const express = require('express');
const Watch = require('../schemas/watchSchema');
const User = require('../schemas/userSchema');

const router = express.Router();

router.post('/buy/:watchId', async (req, res) => {
    try {
        const { watchId } = req.params;
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        if (user.role !== 'user') {
            return res.status(403).json({
                error: 'Only buyers can purchase watches',
            });
        }

        const watch = await Watch.findById(watchId);

        if (!watch) {
            return res.status(404).json({
                error: 'Watch not found',
            });
        }

        if (watch.status !== 'approved') {
            return res.status(400).json({
                error: 'Watch is not available for purchase',
            });
        }

        user.purchasedWatches.push(watch._id);
        await user.save();

        watch.status = 'sold';
        await watch.save();

        res.status(200).json({
            message: 'Watch purchased successfully',
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

module.exports = router;
