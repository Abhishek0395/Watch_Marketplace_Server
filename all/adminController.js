const User = require('../schemas/userSchema');
const Watch = require('../schemas/watchSchema');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('purchasedWatches', 'title brand price status');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// Get all watches
const getAllWatches = async (req, res) => {
    try {
        const watches = await Watch.find().populate('seller', 'name email');

        res.status(200).json(watches);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// Get pending watches
const getPendingWatches = async (req, res) => {
    try {
        const watches = await Watch.find({
            status: 'pending',
        }).populate('seller', 'name email');

        res.status(200).json(watches);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// Approve watch
const approveWatch = async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.id);

        if (!watch) {
            return res.status(404).json({
                error: 'Watch not found',
            });
        }

        watch.status = 'approved';
        watch.approvedAt = new Date();

        // If you later implement authentication,
        // set this to req.user.id instead.
        if (req.body.adminId) {
            watch.approvedBy = req.body.adminId;
        }

        await watch.save();

        res.json({
            message: 'Watch approved successfully',
            watch,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// Reject watch
const rejectWatch = async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.id);

        if (!watch) {
            return res.status(404).json({
                error: 'Watch not found',
            });
        }

        watch.status = 'rejected';

        await watch.save();

        res.json({
            message: 'Watch rejected successfully',
            watch,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// Delete watch
// const deleteWatch = async (req, res) => {
//     try {
//         const watch = await Watch.findByIdAndDelete(req.params.id);

//         if (!watch) {
//             return res.status(404).json({
//                 error: 'Watch not found',
//             });
//         }

//         res.json({
//             message: 'Watch deleted successfully',
//         });
//     } catch (err) {
//         res.status(500).json({
//             error: err.message,
//         });
//     }
// };

const deleteWatch = async (req, res) => {
    try {
        const watch = await Watch.findByIdAndDelete(req.params.id);

        if (!watch) {
            return res.status(404).json({
                error: 'Watch not found',
            });
        }

        // Remove the watch from all users' purchasedWatches
        await User.updateMany(
            { purchasedWatches: watch._id },
            { $pull: { purchasedWatches: watch._id } }
        );

        res.json({
            message: 'Watch deleted successfully',
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// Delete user
// const deleteUser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);

//         if (!user) {
//             return res.status(404).json({
//                 error: 'User not found',
//             });
//         }

//         res.json({
//             message: 'User deleted successfully',
//         });
//     } catch (err) {
//         res.status(500).json({
//             error: err.message,
//         });
//     }
// };

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        // Delete all watches listed by this user
        await Watch.deleteMany({
            seller: user._id,
        });

        res.json({
            message: 'User and their watches deleted successfully',
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};
module.exports = {
    getAllUsers,
    getAllWatches,
    getPendingWatches,
    approveWatch,
    rejectWatch,
    deleteWatch,
    deleteUser,
};
