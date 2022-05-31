const express = require('express');
const cors = require('cors');
const WebSDK = require('@loginid/node-sdk').default;
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const {
  AUTH_BASE_URL,
  LOGID_PRIVATE_KEY,
  AUTH_CLIENT_ID,
} = process.env;

const lAdmin = new WebSDK(AUTH_CLIENT_ID, LOGID_PRIVATE_KEY, AUTH_BASE_URL);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/api/auth/token', (req, res) => {
  try {
    const action = req.body.action;
    const scope = `auth.${action}`;
    const username = req.body.username;
    const token = lAdmin.generateServiceToken(scope, 'ES256', username);
    res.json({ auth_token: token });
  }
  catch(error) {
    res.status(500).json({ error: true, details: error})
  }
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});