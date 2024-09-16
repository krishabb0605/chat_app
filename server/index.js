const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookiesParser = require('cookie-parser');
// const app = express();
const { app, server } = require('./socket/index');

app.use(
  cors({
    origin: JSON.parse(process.env.FRONTEND_URL_ARRAY),
    credentials: true,
  })
);

app.use(express.json());
app.use(cookiesParser());
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.json({
    message: 'server running at ' + PORT,
  });
});
// api endpoints

app.use('/api', router);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log('Server running at ' + PORT);
  });
});
