use bamazon;

create table products
(
    item_id int primary key not null,
    product_name varchar(55) not null,
    dept_name varchar(55),
    price decimal(12, 2),
    stock_quantity int
);
