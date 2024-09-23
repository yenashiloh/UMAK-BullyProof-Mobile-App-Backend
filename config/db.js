const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb+srv://bullyproof:bullyproof@bullyproof.h9jaa.mongodb.net/bullyproof?retryWrites=true&w=majority&appName=BullyProof').on('open', () => {
    console.log("MongoDB Connected");
}).on('error', () => {
    console.log("MongoDB connection error");
});

module.exports = connection;