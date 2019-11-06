CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INTEGER AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100),
  department_name VARCHAR(100),
  stock_quantity INTEGER,
  price DECIMAL (6,2),
  
  PRIMARY KEY(item_id)
);

CREATE TABLE departments (
    department_id INTEGER AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100),
    over_head_costs DECIMAL (8,2),
    product_sales DECIMAL (8,2),
    total_profit DECIMAL (8,2),

    PRIMARY KEY(department_id)
);
