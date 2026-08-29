const mysql = require('mysql');
const http = require('http');
const fs = require('fs');
const path = require('path');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Yashas"
});
con.connect((err) => {
    if (err) console.log("DB Connection Failed");
    else console.log("Connected to MySQL");
});
let createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    account_number VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    pan_card VARCHAR(10) UNIQUE,
    account_type ENUM('Savings', 'Current') NOT NULL,
    bank_name ENUM('333', 'SBI', 'HDFC') NOT NULL,
    balance INT DEFAULT 0
)`;
con.query(createUsersTable);
let createTransactionTable = `
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_email VARCHAR(100),
    receiver_acc VARCHAR(20),
    amount INT,
    remark VARCHAR(100),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
con.query(createTransactionTable);
let insertUsers = `
INSERT INTO users 
(account_number, name, email, password, phone_number, pan_card, account_type, bank_name, balance)
VALUES
('3331001','Pranav Kasi','pranav1@gmail.com','pass123','9000000001','ABCDE1234A','Savings','333',990000000),
('3331002','Vijay Malya','vijay333@gmail.com','pass123','9000000002','BBBBB2222B','Current','333',9999000),
('3331003','Pratham Choksy','pratham3@gmail.com','pass123','9000000003','CDEFG3456C','Savings','333',0),
('3331004','Yashas Ranjan','yashas4@gmail.com','pass123','9000000004','DEFGH4567D','Current','333',10000000),
('3331005','Harshvardhan Singh','harsh5@gmail.com','pass123','9000000005','EFGHI5678E','Savings','333',9000),
('SBI2001','Kushagr Chaturvedi','kush6@gmail.com','pass123','9000000006','FGHIJ6789F','Savings','SBI',5000),
('SBI2002','Bhavya Kalla','bhavya7@gmail.com','pass123','9000000007','GHIJK7890G','Current','SBI',6000),
('SBI2003','Pratham Deore','pdeore8@gmail.com','pass123','9000000008','HIJKL8901H','Savings','SBI',7000),
('SBI2004','Vedakshi Oswal','vedakshi9@gmail.com','pass123','9000000009','IJKLM9012I','Current','SBI',8000),
('SBI2005','Itee Yadav','itee10@gmail.com','pass123','9010000010','JKLMN0123J','Savings','SBI',9000),
('HDFC3001','Ojas Mahajan','ojas11@gmail.com','pass123','9010000011','KLMNO1234K','Savings','HDFC',5000),
('HDFC3002','Sayyam Jain','riya12@gmail.com','pass123','9010000012','LMNOP2345L','Current','HDFC',6000),
('HDFC3003','Aditya Roy','aditya13@gmail.com','pass123','9010000013','MNOPQ3456M','Savings','HDFC',7000),
('HDFC3004','Manish Jain','manish14@gmail.com','pass123','9010000014','NOPQR4567N','Current','HDFC',8000),
('HDFC3005','Kunal Das','kunal15@gmail.com','pass123','9010000015','OPQRS5678O','Savings','HDFC',9000)
`;
con.query("SELECT COUNT(*) AS count FROM users", (err, result) => {
    if (!err && result[0].count === 0) {
        con.query(insertUsers, () => {
            console.log("Initial Users Inserted");
        });
    }
});
const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }
    if (req.method === "GET" && !req.url.startsWith("/transactions")) {
        let filePath = path.join(__dirname, req.url === "/" ? "login.html" : req.url);
        let ext = path.extname(filePath);
        let contentType = "text/html";
        if (ext === ".css") contentType = "text/css";
        if (ext === ".js") contentType = "text/javascript";
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end("Not Found");
            } else {
                res.writeHead(200, { "Content-Type": contentType });
                res.end(content);
            }
        });
        return;
    }
    if (req.method === "POST" && req.url === "/signup") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            let data = JSON.parse(body);
            let accNo = "333" + Date.now().toString().slice(-6);
            let account_type = data.account_type === 'savings' ? 'Savings' : 'Current';
            let sql = `
            INSERT INTO users 
            (account_number, name, email, password, phone_number, pan_card, account_type, bank_name, balance)
            VALUES (?, ?, ?, ?, ?, ?, ?, '333', 0)
            `;
            con.query(sql, [accNo, data.name, data.email, data.password, data.phone_number, data.pan_card, account_type],
                (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end("Error");
                    } else {
                        res.writeHead(200);
                        res.end("User Created");
                    }
                });
        });
        return;
    }
    if (req.method === "POST" && req.url === "/login") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            let data = JSON.parse(body);
            let sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
            con.query(sql, [data.email, data.password], (err, result) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Error");
                }
                else if (result.length === 0) {
                    res.writeHead(401);
                    res.end("Invalid credentials");
                }
                else if (result[0].bank_name !== '333') {
                    res.writeHead(403);
                    res.end("External users cannot login");
                }
                else {
                    res.writeHead(200);
                    res.end("Login Success");
                }
            });
        });
        return;
    }
    if (req.method === "POST" && req.url === "/getUser") {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
            let data = JSON.parse(body);
            let sql = "SELECT * FROM users WHERE email = ?";
            con.query(sql, [data.email], (err, result) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Error");
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result[0]));
                }
            });
        });
        return;
    }
    if (req.method === "POST" && req.url === "/transfer") {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
            let data = JSON.parse(body);
            let senderEmail = data.email;
            let receiverAcc = data.accno;
            let amount = parseInt(data.amount);
            con.query("SELECT * FROM users WHERE email = ?", [senderEmail], (err, senderRes) => {
                if (senderRes.length === 0) {
                    res.writeHead(500);
                    return res.end("Sender not found");
                }
                let sender = senderRes[0];
                if (sender.balance < amount) {
                    res.writeHead(400);
                    return res.end("Insufficient balance");
                }
                con.query("SELECT * FROM users WHERE account_number = ?", [receiverAcc], (err, recRes) => {
                    let newSenderBal = sender.balance - amount;
                    con.query("UPDATE users SET balance = ? WHERE email = ?", 
                        [newSenderBal, senderEmail]);
                    if (recRes.length !== 0) {
                        let receiver = recRes[0];
                        let newReceiverBal = receiver.balance + amount;
                        con.query("UPDATE users SET balance = ? WHERE account_number = ?", 
                            [newReceiverBal, receiverAcc]);
                    }
                    let insertTx = `
                    INSERT INTO transactions (sender_email, receiver_acc, amount, remark)
                    VALUES (?, ?, ?, ?)
                    `;
                    con.query(insertTx, [
                        senderEmail,
                        receiverAcc,
                        amount,
                        data.remark || "Fund Transfer"
                    ]);
                    res.writeHead(200);
                    res.end("Transfer Successful");
                });
            });
        });
        return;
    }
    if (req.method === "GET" && req.url.startsWith("/transactions")) {
        let url = new URL(req.url, "http://localhost:3000");
        let email = url.searchParams.get("email");
        let sql = `
        SELECT * FROM transactions 
        WHERE sender_email = ? 
        OR receiver_acc = (
            SELECT account_number FROM users WHERE email = ?
        )
        ORDER BY date DESC
        `;
        con.query(sql, [email, email], (err, result) => {
            if (err) {
                res.writeHead(500);
                res.end("Error");
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(result));
            }
        });
        return;
    }
});
server.listen(3000, () => {
    console.log("Server running on port 3000");
});