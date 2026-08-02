const express = require('express');

const router = express.Router();

const adminController = require('../controller/adminController');

router.get('/users', adminController.getAllUsers);

router.get('/watches', adminController.getAllWatches);

router.get('/watches/pending', adminController.getPendingWatches);

router.patch('/watches/:id/approve', adminController.approveWatch);

router.patch('/watches/:id/reject', adminController.rejectWatch);

router.delete('/watches/:id', adminController.deleteWatch);

router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
