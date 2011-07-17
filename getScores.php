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

$topX = $_GET['top'];

$result = "<p>Top $topX High Scores</p>";
$result .= "<table style=\"text-align:center\" align=\"center\" >";

$scoresQuery = mysql_query("SELECT * FROM $table_name ORDER BY $score_column DESC LIMIT $topX") or die(mysql_error());
while($row = mysql_fetch_array($scoresQuery))
{
	$result .= "<tr>";
	$result .= "<td>$row[$name_column]</td>";
	$result .= "<td>$row[$score_column]</td>";
	$result .= "</tr>";
	
}
$result .= "</table>";
echo $result;

mysql_close() or die(mysql_error());
?>
