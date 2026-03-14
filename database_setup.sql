-- Create the Database and Schema
CREATE DATABASE AI_COO_DB;
USE DATABASE AI_COO_DB;
CREATE SCHEMA CORE_DATA;

-- Table 1: For the structured data (The Math)
CREATE TABLE company_sales (
    date DATE,
    region VARCHAR(50),
    revenue NUMBER(10, 2),
    tickets_opened INT
);

-- Insert some dummy data to test with
INSERT INTO company_sales VALUES 
('2023-10-01', 'EU', 45000.00, 12),
('2023-10-02', 'EU', 42000.00, 45), -- A drop in revenue with high tickets
('2023-10-01', 'US', 80000.00, 5);
