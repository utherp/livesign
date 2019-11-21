<? require_once('ezFramework.php');
	load_definitions('FLAGS');
	define('DEBUG', 3);
	if (!flag_raised(STANDALONE_FLAG)) {
		new session_login();
		if (!$_SESSION['_login_']->validate_permission('viewarchives')) {
			fns_output::restricted('View Archives');
			exit;
		}
	}
	if (isset($_GET['id']))
		$id = '?&id=' . $_GET['id'];
	else
		$id = '';
?><html>
	<head>
		<title>Room '<?=load_object(LOCATION_TYPE)->get_name()?>' Archive Viewer</title>
	</head>
	<frameset cols='265,*' border="0" framespacing="0" frameborder="no">
		<frame name='browser' id='browser' src='browser.php<?=$id?>' />
		<frame name='player' id='player' src='player.php<?=$id?>' />
	</frameset>
</html>
