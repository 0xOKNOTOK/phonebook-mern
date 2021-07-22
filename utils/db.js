const mongoose = require('mongoose');

const connectToDatabase = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);
};

module.exports = connectToDatabase;
