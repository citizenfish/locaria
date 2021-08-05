

const load = require('./load_os_opendata');

const express = require('express');

// Constants
const PORT = 9002;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.json());

app.post('/', async (req, res) => {

    let result = await load.loadOSOpenData(req.body)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result))
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);