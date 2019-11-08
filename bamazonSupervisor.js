require("dotenv").config();

const mysql = require("mysql");
const inquirer = require("inquirer");
const fs = require("fs");
const cliTable = require("cli-table");
const keys = require("./keys.js");
const colors = require("colors");

var connection = mysql.createConnection(keys.connection);

connection.connect((err) => {
    if (err) throw err;
});

var departmentMsg;
var welcome =
    "      **********************************************\n" +
    "     **********                            **********\n" +
    "    **********      BAMAZON SUPERVISOR      **********\n" +
    "     **********                            **********\n" +
    "      **********************************************\n\r"


var goodbye =
    "      *********************************************************\n" +
    "     **********    EXITING BAMAZON SUPERVISOR APP     **********\n" +
    "      *********************************************************\n\r"


// SUPERVISOR OPTIONS //
function supervisorMenu() {

    inquirer.prompt([
        {
            type: "list",
            message: "SELECT Supervison option.",
            choices: ["View Department Sales", "Create New Department", "Exit"],
            name: "superDoItem"
        }
    ])
        .then((supervisor_menu) => {
            switch (supervisor_menu.superDoItem) {
                case "View Department Sales":
                    displayDepartments();
                    break;
                case "Create New Department":
                    addDepartment();
                    break;
                case "Exit":
                    exit();
                    break;
            };
        });
};

// SHOW DEPARTMENT TABLE //
function displayDepartments() {

    connection.query("SELECT * FROM departments", (err, res) => {
        if (err) throw err;

        var table = new cliTable({
            head: ["Dept Number".cyan, "Department Name".cyan, "Overhead Costs".cyan, "Total Sales".cyan, "Profit".cyan],
            colWidths: [20, 20, 20, 20, 20],
        });

        for (var i = 0; i < res.length; i++) {
            var total_profit = res[i].product_sales - res[i].over_head_costs
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, total_profit]
            );
        };

        console.log(table.toString());
        supervisorMenu();
    });
};


// ADD DEPARTMENT TO TABLE DATA//
function addDepartment() {

    inquirer.prompt([
        {
            type: "input",
            message: "Name of department you would like to create? ",
            name: "itemDept"
        },
        {
            type: "input",
            message: "Overhead cost of this department?",
            name: "itemCost"
        }
    ])
        .then((addDept) => {
            connection.query("INSERT INTO departments SET ?",
                {
                    department_name: addDept.itemDept,
                    over_head_costs: addDept.itemCost,
                    product_sales: 0
                },
                (err, res) => {
                    if (err) throw err;

                    departmentMsg = "    " + addDept.itemDept + " department has been created with an initial overhead cost of " + addDept.itemCost;
                    console.log(departmentMsg);
                    supervisorMenu();
                }
            );
        });
};

// EXIT //
function exit() {
    connection.end();
    console.log(goodbye);
};

console.log(welcome);
supervisorMenu();