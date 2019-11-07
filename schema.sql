CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INTEGER AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100),
  department_name VARCHAR(100),
  price DECIMAL(10,2),
  stock_quantity INTEGER,
  
  PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES
	('Playstation 5', 'Electronics', 499.99, 100),
	('Intel Core i9 Skylake', 'Electronics', 2110.47, 20),
	('Asus ROG Dominus Extreme', 'Electronics', 1868.99, 50),
	('G.Skillz Memory', 'Electronics', 359.99, 75),
	('Wheels', 'Auto', 565.95, 28),
	('Transmission', 'Auto', 3099.99, 6),
	('Steering Wheel Cover', 'Auto', 12.99, 85),
	('Jacket', 'Apparel', 85.99, 60),
	('Pants', 'Apparel', 120.99, 60),
	('Shoes', 'Apparel', 64.99, 150);

SELECT * FROM products;

CREATE TABLE departments (
    department_id INTEGER AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100),
    over_head_costs DECIMAL(10,2),
    product_sales DECIMAL(10,2),
    total_profit DECIMAL(10,2),

    PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES
    ('Electronics', 260000.00),
    ('Auto', 48000.00),
    ('Apparel', 20000.00);

SELECT * FROM departments;
