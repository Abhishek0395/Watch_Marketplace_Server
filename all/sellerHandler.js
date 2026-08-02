const express = require('express');

const router = express.Router();
const Watch = require('../schemas/watchSchema');
const User = require('../schemas/userSchema');

router.post('/', async (req, res) => {
    try {
        const seller = await User.findById(req.body.sellerId);

        if (!seller) {
            return res.status(404).json({
                error: 'Seller not found',
            });
        }

        if (seller.role !== 'seller') {
            return res.status(403).json({
                error: 'Only sellers can list watches',
            });
        }

        const newWatch = new Watch({
            brand: req.body.brand,
            model: req.body.model,
            description: req.body.description,
            price: req.body.price,
            year: req.body.year,
            condition: req.body.condition,
            seller: seller._id,
            status: 'pending',
        });

        const watch = await newWatch.save();

        res.status(201).json(watch);
    } catch (err) {
        res.status(400).json({
            error: err.message,
        });
    }
});
router.post('/all', async (req, res) => {
    try {
        // Check if request body is an array
        if (!Array.isArray(req.body) || req.body.length <= 1) {
            return res.status(400).json({
                error: 'Request body must be a non-empty array of watches.',
            });
        }

        // Assuming all watches belong to the same seller
        const { sellerId } = req.body[0];

        const seller = await User.findById(sellerId);

        if (!seller) {
            return res.status(404).json({
                error: 'Seller not found',
            });
        }

        if (seller.role !== 'seller') {
            return res.status(403).json({
                error: 'Only sellers can list watches.',
            });
        }

        // Optional: Ensure every watch has the same sellerId
        const invalidSeller = req.body.some((watch) => watch.sellerId !== sellerId);

        if (invalidSeller) {
            return res.status(400).json({
                error: 'All watches must belong to the same seller.',
            });
        }

        const watches = await Watch.insertMany(req.body);

        res.status(201).json({
            success: true,
            count: watches.length,
            data: watches,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

module.exports = router;
