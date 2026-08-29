# 333Bank — Net Banking Website

A simple full-stack net banking web application built as a college project to understand how a banking interface can interact with a backend and database.

The project includes user registration and login, account information, transaction history, fund transfers, loan information, and a basic interest/EMI calculator.

## Features

- User registration and login
- Account dashboard with balance and account details
- Transaction history
- Fund transfers between accounts
- Loan details with repayment progress
- Simple interest and EMI calculator
- FAQ and help section
- Form validation using AngularJS
- MySQL database for users and transactions

## Tech Stack

- HTML5
- CSS3
- JavaScript
- AngularJS
- Node.js
- MySQL

## How It Works

The frontend is built using HTML, CSS, JavaScript and AngularJS.

A lightweight Node.js HTTP server handles requests from the frontend and communicates with MySQL for operations such as:

- Creating new users
- Authenticating users
- Fetching account information
- Processing fund transfers
- Retrieving transaction history

User and transaction data is stored in MySQL tables.

## Running the Project Locally

### 1. Prerequisites

Make sure you have:

- Node.js
- MySQL
- A web browser

### 2. Set up the database

Create a MySQL database named:

`Yashas`

The Node.js backend creates the required `users` and `transactions` tables automatically when it starts.

> The current project is configured for a local MySQL setup (`localhost`) and may need the database credentials in `AA.js` to be updated for your system.

### 3. Install the MySQL dependency

From the project directory, run:

```bash
npm install mysql
