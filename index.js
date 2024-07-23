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

  // View All Deparments Function
function viewDepartments() {
    pool.query("SELECT * FROM department", (err, res) => {
      if (err) {
        console.error("Error executing query", err.message);
        return mainMenu();
      }
      console.table(res.rows);
      mainMenu();
    });
  }
  
  // View All Roles Departments
  function viewRoles() {
    pool.query(
      "SELECT role.*, department.name AS department FROM role JOIN department ON role.department_id = department.id",
      (err, res) => {
        if (err) {
          console.error("Error executing query", err.message);
          return mainMenu();
        }
        console.table(res.rows);
        mainMenu();
      }
    );
  }
  
  // View All Employees Function
  function viewEmployees() {
    pool.query("SELECT employee.*, role.title AS role, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", (err, res) => {
      if (err) {
        console.error("Error executing query", err.message);
        return mainMenu();
      }
      console.table(res.rows);
      mainMenu();
    });
  }
  
  // Add a Department function
  function addDepartment() {
    inquirer
      .prompt({
        name: "newDepartment",
        type: "input",
        message: "Enter the new department name",
      })
      .then((answer) => {
        const psql = "INSERT INTO department (name) VALUES ($1)";
        const values = [answer.newDepartment];
  
        pool.query(psql, values, (err, res) => {
          if (err) {
            console.error("Error executing query", err.message);
          } else {
            console.log(`Department ${answer.newDepartment} added successfully.`);
          }
          mainMenu();
        });
      });
  }
  
  // Add a Role function
  async function addRole() {
    const { rows } = await pool.query("SELECT * FROM department");
    const dptArray = rows.map((dpt) => ({ name: dpt.name, value: dpt.id }));
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter a title for new role:",
        },
        {
          name: "salary",
          type: "input",
          message: "Enter a salary for new role:",
        },
        {
          name: "department",
          type: "list",
          message: "Select the department:",
          choices: dptArray,
        },
      ])
      .then((answer) => {
        const psql =
          "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)";
        const values = [
          answer.title,
          parseFloat(answer.salary),
          answer.department,
        ];
  
        pool.query(psql, values, (err) => {
          if (err) {
            console.error("Error executing query", err.message);
          } else {
            console.log(
              `New role ${answer.title}, ${answer.salary}, ${answer.department} added successfully`
            );
          }
          mainMenu();
        });
      });
  }
  
  // Add an Employee function
  async function addEmployee() {
    const { rows: roles } = await pool.query("SELECT * FROM role");
    const { rows: managers } = await pool.query("SELECT * FROM employee");
    const rolesArray = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    const manArray = managers.map((manager) => ({
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id,
    }));
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Enter new employee's first name:",
        },
        {
          name: "lastName",
          type: "input",
          message: "Enter new employee's last name:",
        },
        {
          name: "role",
          type: "list",
          message: "Select new employee's role:",
          choices: rolesArray,
        },
        {
          name: "manager",
          type: "list",
          message: "Who is the manager:",
          choices: manArray,
        },
      ])
      .then((answer) => {
        const psql =
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)";
        const values = [
          answer.firstName,
          answer.lastName,
          answer.role,
          answer.manager,
        ];
  
        pool.query(psql, values, (err) => {
          if (err) {
            console.error("Error executing query", err.message);
          } else {
            console.log(
              `New employee ${answer.firstName} ${answer.lastName} added successfully`
            );
          }
          mainMenu();
        });
      });
  }
  
  // Update an employee function
  async function updateEmployee() {
    const { rows: roles } = await pool.query("SELECT * FROM role");
    const { rows: employee } = await pool.query("SELECT * FROM employee");
    const rolesArray = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    const empArray = employee.map((emp) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));
  
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "What employee do you want to update:",
          choices: empArray,
        },
        {
          name: "roles",
          type: "list",
          message: "What role do want the employee to have?",
          choices: rolesArray,
        },
      ])
      .then((answer) => {
        const psql = "UPDATE employee SET role_id = $1 WHERE id = $2";
        const values = [answer.roles, answer.employee];
  
        pool.query(psql, values, (err) => {
          if (err) {
            console.error("Error executing query", err.message);
          } else {
            console.log(`Employee has been updated successfully`);
          }
          mainMenu();
        });
      });
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  