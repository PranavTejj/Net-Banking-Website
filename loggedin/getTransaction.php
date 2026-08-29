<?php

$conn = new mysqli("localhost", "root", "", "yashas");

if ($conn->connect_error) {
    die("Connection failed");
}

$sql = "SELECT * FROM transactions ORDER BY date DESC";
$result = $conn->query($sql);

$transactions = array();

while ($row = $result->fetch_assoc()) {
    $transactions[] = $row;
}

echo json_encode($transactions);

$conn->close();

?>
