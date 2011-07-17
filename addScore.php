<?php

include("conf.php");

//had issues using associative array call inside of sql statements 
//so i decided to just put them all into regular variables.
$server = $conf['server'];
$user = $conf['user'];
$password = $conf['password'];
$database_name = $conf['database_name'];
$table_name = $conf['table_name'];
$name_column = $conf['name_column'];
$score_column = $conf['score_column'];
$time_column = $conf['time_column'];

mysql_connect($server, $user, $password) or die(mysql_error());
  
mysql_select_db($database_name) or die(mysql_error());

$name = $_GET['n'];
$score = $_GET['s'];
$time = $_GET['t'];

//prevent sql injection
$name = mysql_real_escape_string($name);
$score = mysql_real_escape_string($score);
$time = mysql_real_escape_string($time);
//prevent user from inputting html
$name = htmlentities($name);
$score = htmlentities($score);
$time = htmlentities($time);

mysql_query("INSERT INTO $table_name ($name_column, $score_column, $time_column) VALUES ('$name', '$score', '$time')") or die(mysql_error());

mysql_close() or die(mysql_error());
?>
