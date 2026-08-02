const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routeHandler/authHandler');
const watchRoutes = require('./routeHandler/watchHandler');
const userRoutes = require('./routeHandler/userHandler');
const adminRoutes = require('./routeHandler/adminHandler');
const buyRoutes = require('./routeHandler/buyHandler');
const sellerRoutes = require('./routeHandler/sellerHandler');
const simpleRoutes = require('./routeHandler/simpleHandler');

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/watches', watchRoutes);
app.use('/api/authentication', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/buy', buyRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/public-watches', simpleRoutes);
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    return res.status(500).json({
        error: err.message,
    });
}

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`app listening at port ${port}`);
});
