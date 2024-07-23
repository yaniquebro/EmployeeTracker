const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require("pg");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
  });
  
  // Connect to pool and start main menu
  pool.connect((err) => {
    if (err) {
      console.error("Error connecting to emplyees_db", err.message);
      return;
    }
    console.log("Connected to employees_db");
    mainMenu();
  });
  
  // Main menu function and choices
  function mainMenu() {
    inquirer
      .prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add An Employee",
          "Update An Employee Role",
          "Quit",
        ],
      })

      .then((answer) => {
        switch (answer.menu) {
          case "View All Departments":
            viewDepartments();
            break;
          case "View All Roles":
            viewRoles();
            break;
          case "View All Employees":
            viewEmployees();
            break;
          case "Add a Department":
            addDepartment();
            break;
          case "Add a Role":
            addRole();
            break;
          case "Add An Employee":
            addEmployee();
            break;
          case "Update An Employee Role":
            updateEmployee();
            break;
          case "Quit":
            console.log("Bye!");
            process.exit();
          default:
            console.log("Invalid");
            mainMenu();
        }
      });
  }

  
  