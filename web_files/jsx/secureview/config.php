<?php
//	require_once('ezFramework.php');
//	$dbhost  = 'localhost';
	$dbhost  = 'gateway.cv-internal.com';
	$dbname  = 'SecureView';
	$dblogin = 'SecureView';
	$dbhaslo = 'n3wfl4shpl4y3r';
	$connect = mysql_connect($dbhost, $dblogin, $dbhaslo); 
	mysql_select_db($dbname, $connect);
	$prefix = '';
	$serial = '486be1c6935f573';
	
	$language = 'en';
	
	if (isset($_SERVER['HTTP_X_FORWARDED_HOST'])) {
		$domain = $_SERVER['HTTP_X_FORWARDED_HOST'];
		$player_folder = 'nodes/' . load_object('node')->get_id() . '/secureview';
	} else {
		$domain = '175.nodes.cv-internal.com';
		$player_folder = 'ezFramework/secureview'; 
	}
	
	$admin_login = 'admin'; 
	$admin_pass = 'n3wfl4shpl4y3r';
?>
