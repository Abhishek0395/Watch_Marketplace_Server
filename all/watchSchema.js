const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema(
    {
        title: String,

        description: String,

        brand: String,

        condition: {
            type: String,
            enum: ['New', 'Like New', 'Excellent', 'Good', 'Fair'],
        },

        price: Number,

        images: [String],

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'sold'],
            default: 'pending',
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        approvedAt: Date,
    },
    {
        timestamps: true,
    },
);
module.exports = mongoose.model('Watch', watchSchema);
