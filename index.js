const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require("pg");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

