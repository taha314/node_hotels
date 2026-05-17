const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
    tls: true
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log('MongoDB Error:', err));
const db = mongoose.connection;

module.exports = db;