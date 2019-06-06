
use bamazondb;
create table products
(
    item_id int primary key not null,
    product_name varchar(55) not null,
    dept_name varchar(55),
    price decimal(12, 2),
    stock_quantity int
);

INSERT INTO products
    (item_id, product_name, dept_name, price, stock_quantity)

VALUES
    (1341, "Basketball", "Team", 19.99, 25),
    (1355, "BaseBall", "Team", 6.99, 54),
    (1310, "Mitt", "Team", 49.99, 12),
    (1041, "Nike Shirt", "Apparel", 19.99, 30),
    (1045, "Nike short", "Apparel", 14.99, 30),
    (1055, "Nike Hat", "Apparel", 19.99, 41),
    (1277, "Golf Driver", "Golf", 249.99, 5),
    (1295, "Putter", "Golf", 109.99, 5),
    (1231, "Golf Glove", "Golf", 19.99, 23),
    (1463, "Bike", "Bikes", 349.99, 5); 


