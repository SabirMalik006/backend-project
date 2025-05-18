require('dotenv').config();
const express = require('express');
const jobRouter = require('./routes/jobs.routes');
const authRouter = require('./routes/auth.routes');
const port = 5000;
const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Home page');
});

app.use('/auth', authRouter)

app.use('/jobs', jobRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});