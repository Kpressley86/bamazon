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

var inventoryMsg;
var welcome =
    "     ************************************************************\n" +
    "    ********              BAMAZON MANAGER APP             ********\n" +
    "   ********        Manage Inventory and Product Sales      ********\n" +
    "    ********                                                ********\n" +
    "     ************************************************************\n\r"

var goodbye =
    "      *****************************************************\n" +
    "     ********       EXTING BAMAZON MANAGER APP        ********\n" +
    "    ********              Work Safe!!!                 ********\n" +
    "     ********                                         ********\n" +
    "      *****************************************************\n\r"


// MANAGER OPTIONS //
function managerMenu() {

    inquirer.prompt([
        {
            type: "list",
            message: "SELECT Manager Task",
            choices: ["View Current Inventory", "Check Low Inventory", "Add to Inventory", "Add New Products", "Exit"],
            name: "mgrDoItem"
        }
    ])
        .then((manager_menu) => {
            switch (manager_menu.mgrDoItem) {
                case "View Current Inventory":
                    displayProducts();
                    break;
                case "Check Low Inventory":
                    lowInventory();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Products":
                    addProduct();
                    break;
                case "Exit":
                    exit();
                    break;
            };
        });
};

// SHOWS CURRENT TABLE DATA //
function displayProducts() {

    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;

        var table = new cliTable({
            head: ["Item Number".red, "Product Name".yellow, "Department".green, "Price".blue, "Quantity".magenta],
            colWidths: [13, 20, 20, 13, 13],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        };

        console.log(table.toString());
        managerMenu();
    });
};


// DISPLAYS LOW INVENTORY ITEMS //
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 10", (err, res) => {
        if (err) throw err;

        var table = new cliTable({
            head: ["Item Number".cyan, "Product Name".cyan, "Department".cyan, "Price".cyan, "Quantity".bgRed.black],
            colWidths: [13, 20, 20, 13, 13],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        };

        console.log(table.toString());
        managerMenu();
    });

};

// RESTOCK INVENTORY //
function addInventory() {

    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;

        var table = new cliTable({
            head: ["Item Number".green, "Product Name".green, "Department".green, "Price".green, "Quantity".green],
            colWidths: [13, 20, 20, 13, 13],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        };

        console.log(table.toString());

        inquirer.prompt([
            {
                type: "input",
                message: "Which item number would you like to order?",
                name: "itemNum"
            },
            {
                type: "input",
                message: "How many would you like to order?",
                name: "Qty"
            }
        ])
            .then((userOrder) => {

                var i = userOrder.itemNum - 1;

                var updateQty = parseInt(res[i].stock_quantity) + parseInt(userOrder.Qty);

                // UPDATE STOCK QUANTITY //
                connection.query("UPDATE products SET ? WHERE ?",
                    [{
                        stock_quantity: updateQty
                    },
                    {
                        item_id: userOrder.itemNum
                    }],
                    (error, results) => {

                        if (error) throw error;

                        inventoryMsg = "     You ordered " + userOrder.Qty + "  " + res[i].product_name + " for restocking.  \n";

                        console.log(inventoryMsg);
                        managerMenu();
                    }
                );

            });

    });

};

// TAKES IN MANAGER INPUT AND UPDATES TABLE DATA//
function addProduct() {

    inquirer.prompt([
        {
            type: "input",
            message: "Name of the product you would like to add? ",
            name: "itemName"
        },
        {
            type: "list",
            message: "Department this item belongs to?",
            choices: ["Electronics", "Auto", "Apparel"],
            name: "itemDept"
        },
        {
            type: "input",
            message: "What is the listing price of this ietem?",
            name: "itemPrice"
        },
        {
            type: "input",
            message: "Quantity of items to be stocked?",
            name: "itemQty"
        },
    ])
        .then((addProd) => {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: addProd.itemName,
                    department_name: addProd.itemDept,
                    price: addProd.itemPrice,
                    stock_quantity: addProd.itemQty
                },
                (err, res) => {
                    if (err) throw err;

                    inventoryMsg = "    A quantity of " + addProd.itemQty + " " + addProd.itemName + "s have been added to your inventory under the " +
                        addProd.itemDept + " department";
                    console.log(inventoryMsg);
                    managerMenu();
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
managerMenu();