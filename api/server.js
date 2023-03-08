// BUILD YOUR SERVER HERE
const express = require('express');

const server = express();

server.use(express.json());

module.exports = server;