const express = require('express');

// Middleware to parse JSON
const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});