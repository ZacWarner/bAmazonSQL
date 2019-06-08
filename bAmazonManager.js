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
    database: "bamazon1"
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
            choices: ["View Items", "View Low inventory", "Add to low inventory", "Add an Item", "Exit"],
            name: "menuChoice"
        }
    ]).then(function (res) {
        if (res.menuChoice === "View Items") {
            itemList();
        }
        else if (res.menuChoice === "View Low inventory") {
            lowInventory();
        }
        else if (res.menuChoice === "Add to low inventory") {
            addToLowInventory();
        }

        else if (res.menuChoice === "Add an Item") {
            addItem();
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
        table.length = 0;
        start();
    })
};

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, res[i].stock_quantity]
            )
        }
        console.log(table.toString());
        table.length = 0;
        start();
    })
};

function addToLowInventory() {

    inquirer.prompt([
        {
            type: "input",
            message: "What's the number of the item you would like to buy more of?",
            name: "itemNum"
        },
        {
            type: "input",
            message: "How many would you like to buy?",
            name: "quantity"
        }
    ]).then(function (inqRes) {
        var item = inqRes.itemNum;
        var purch = parseInt(inqRes.quantity);
        connection.query("SELECT stock_quantity FROM products WHERE item_id = \"" + item + "\"", function (err, res) {
            var stock = parseInt(res[0].stock_quantity);
            stock = stock + purch;
            console.log("buying " + purch + " you now have " + stock)
            connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: stock,
                },
                {
                    item_id: inqRes.itemNum,
                }
            ]);
            start();
        })
    });
};

function addItem() {
    inquirer.prompt([
        {
            type: "input",
            message: "Whats the item number?",
            name: "itemNum"
        },
        {
            type: "input",
            message: "What's the name of item?",
            name: "itemName"
        },
        {
            type: "input",
            message: "What's the dept of item?",
            name: "itemDept"
        },
        {
            type: "input",
            message: "What is the price?",
            name: "itemPrice"
        },
        {
            type: "input",
            message: "finally How many are you adding to inventory?",
            name: "itemQuantity"
        }
    ]).then(function (inqRes) {
        var itemNum = inqRes.itemNum;
        var name = inqRes.itemName;
        var itemDept = inqRes.itemDept;
        var itemPrice = inqRes.itemPrice;
        var itemQuantity = inqRes.itemQuantity;
        connection.query(
            "INSERT INTO products set ?", [
                {
                    item_id: itemNum,
                    product_name: name,
                    dept_name: itemDept,
                    price: itemPrice,
                    stock_quantity: itemQuantity
                }
            ])
        console.log("added item");
        start();

    })
}