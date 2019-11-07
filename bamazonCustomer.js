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

var orderMsg;
var welcome =
    "      ***************************************************************\n" +
    "     **********            WELCOME TO BAMAZON                *********\n" +
    "    **********     One stop shop for everything BAMAZING!!    *********\n" +
    "     **********                                              *********\n" +
    "      ***************************************************************\n\r"

var exit =
    "      *********************************************************\n" +
    "     ********        THANKS FOR SHOPPING BAMAZON        ********\n" +
    "    ********              Come back soon!!!              ********\n" +
    "     ********                                           ********\n" +
    "      *********************************************************\n\r"


// DISPLAY PRODUCTS TABLE //
function displayProducts() {

    console.log(welcome);

    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;

        var table = new cliTable({
            head: ["Item Number".cyan, "Product Name".cyan, "Department".cyan, "Price".cyan, "Quantity".cyan],
            colWidths: [13, 28, 18, 13, 12],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        };

        console.log(table.toString());
        orderMenu();
    });
};


//  ORDER MENU  //
function orderMenu() {

    inquirer.prompt([
        {
            type: "input",
            message: "Please select an item number you would like to purchase ",
            name: "itemNum"
        },
        {
            type: "input",
            message: "How many would you like to buy?",
            name: "Qty"
        }
    ])
        .then((userOrder) => {

            connection.query("SELECT * FROM products JOIN departments ON products.department_name = departments.department_name",
                (err, res) => {
                    if (err) throw err;

                    var i = userOrder.itemNum - 1;

                    if (res[i].stock_quantity >= userOrder.Qty) {

                        var updateQty = parseInt(res[i].stock_quantity) - parseInt(userOrder.Qty);

                        var OrderTotal = parseFloat(res[i].price) * parseFloat(userOrder.Qty);
                        OrderTotal = OrderTotal.toFixed(2);

                        // UPDATES TABLE DATA //
                        connection.query("UPDATE products SET ? WHERE ?",
                            [{
                                stock_quantity: updateQty
                            },
                            {
                                item_id: userOrder.itemNum
                            }],
                            (error, results) => {

                                if (error) throw error;

                                orderMsg = "     Your order for " + userOrder.Qty + "  " + res[i].product_name + " has been placed.  \n" +
                                    "     Your total is $ " + OrderTotal + "  \n";

                                console.log(orderMsg);
                            }
                        );


                        //-- Update the departments table total sales  --//
                        var deptSales = parseFloat(res[i].total_sales) + parseFloat(OrderTotal);
                        deptSales = deptSales.toFixed(2);

                        connection.query("UPDATE departments SET ? WHERE ?", [
                            { total_sales: deptSales },
                            { department_name: res[userOrder.itemNum - 1].department_name }
                        ],
                            (error, results) => {
                                continueShopping();
                            }
                        );

                    }

                    else {
                        orderMsg =
                            "     Low on stock! -- We only have " + res[i].stock_quantity + " " + res[i].product_name + " \n" +
                            "     Sorry for the inconvenience check back later.  " + userOrder.Qty + " " + res[i].product_name + " \n";

                        console.log(orderMsg);
                        continueShopping();
                    }
                });

        });
};


// EXIT OR CONTINUE SHOPPING //
function continueShopping() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Continue shopping? ",
            name: "cont"
        }
    ])
        .then((shopping) => {
            if (shopping.cont) {
                displayProducts();
            }
            else {
                exitBamazon();
            }
        });
};

// EXIT //
function exitBamazon() {
    connection.end();
    console.log(exit);
};


displayProducts();