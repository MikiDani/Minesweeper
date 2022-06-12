<?php
    define("servername", "localhost");
    define("username", "root");
    define("password", "");
    define("dbname", "minesweeper");

    $conn = new mysqli(constant("servername"),constant("username"),constant("password"),constant("dbname"));
?>