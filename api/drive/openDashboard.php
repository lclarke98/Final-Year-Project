<?php
session_start();

$path =  $_GET["path"];
$_SESSION["path"] = $path;

echo $_SESSION["path"];

header("location: dashboard.php");
