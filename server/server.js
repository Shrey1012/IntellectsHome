const express = require('express');
const router = require('./routes');
require('dotenv').config();
const DbConnect = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
DbConnect();
app.use(express.json());

app.use(router);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});