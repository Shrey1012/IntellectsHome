const mongoose = require("mongoose");

const DbConnect = () => {
  mongoose
    .set("strictQuery", false)
    .connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB connection successfull');
    });
};

module.exports = DbConnect;
