<?php
// Simple example with hard-coded credentials
$username = $_POST['username'];
$password = $_POST['password'];

// Example hard-coded values (replace with a database in real projects)
$valid_user = "admin";
$valid_pass = "1234";

// Validate credentials
if ($username === $valid_user && $password === $valid_pass) {
    echo "✅ Login successful. Welcome, $username!";
} else {
    echo "❌ Invalid username or password.";
}
?>