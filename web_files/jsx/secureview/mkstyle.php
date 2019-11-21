<?php
	header('Content-type: text/stylesheet');

	if (!is_array($_REQUEST['s'])) exit;
	if (!isset($_REQUEST['c'])) exit;

	print $_REQUEST['c'] . " {\n";

	foreach ($_REQUEST['s'] as $n => $v)
		print "\t$n: $v\n";
	
	print "}\n";

	exit;
