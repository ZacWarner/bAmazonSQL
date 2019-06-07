//function that asks post, bid, exit
var inquirer = require("inquirer");

var mysql = require("mysql");

var Table = require('cli-table');

// instantiate
var table = new Table({
    head: ['Item Number', 'Name', 'Department', 'Price', 'Quantity']
    , colWidths: [20, 20, 20, 20, 20]
});

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazondb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start()
});

function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "what would you like to do?",
            choices: ["View Items", "Buy Items", "Exit"],
            name: "menuChoice"
        }
    ]).then(function (res) {
        if (res.menuChoice === "View Items") {
            itemList();
        }
        else if (res.menuChoice === "Buy Items") {
            buy();
        }

        else if (res.menuChoice === "Exit") {
            return process.exit();
        }
    });
};

function itemList() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, res[i].stock_quantity]
            )
        }
        console.log(table.toString());
        start();
    })
};

function buy() {
    inquirer.prompt([
        {
            type: "input",
            message: "What's the number of the item you would like to buy?",
            name: "itemNum"
        },
        {
            type: "input",
            message: "How many would you like to buy?",
            name: "quantity"
        }
    ]).then(function (inqRes) {
        var purch = inqRes.quantity;
        connection.query("SELECT stock_quantity FROM products WHERE item_id = \"" + inqRes.itemNum + "\"", function (err, res) {
            var stock = res[0].stock_quantity;
            if (purch <= stock) {
                console.log("you Bought " + purch + "items!");
                var left = stock - purch;
                connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: left,
                    },
                    {
                        item_id: inqRes.itemNum,
                    }
                ]);
                start();
            }
            else if (purch > stock) {
                var over = purch - stock;
                console.log("Sorry theres not enough stock, reduce order by " + over);
                start();
            }



        });
    });

};