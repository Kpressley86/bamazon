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
