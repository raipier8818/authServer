require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT;

// AUTHENTICATION_TYPE : cookie-session, jwt
const authentication_type = process.env.AUTHENTICATION_TYPE;

const accountRouter = require('./router/account');
const { run } = require('./instances');

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/account', accountRouter);


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, async () => {
  console.log(`Auth Server listening on port ${port}`);
  await run();
  
});