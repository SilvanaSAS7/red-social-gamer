const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const castrRouter = require('./castr');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

app.use('/api/castr', castrRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));