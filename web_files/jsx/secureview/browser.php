<?php
	require_once('ezFramework.php');

	load_definitions('BROWSER');
	load_definitions('VIDEO');
	load_definitions('NODE_WEB');
	load_definitions('FLAGS');

	$ts = isset($_GET['ts'])?$_GET['ts']:time();
	$timestamp = new DateTime("@$ts");
	list( $year, $month, $day ) = explode('_', $timestamp->format('Y_m_d'));

	$ts = mktime(1, 1, 1, intval($month), intval($day), intval($year));

	if (isset($_GET['id'])) $id = $_GET['id'];
	
// Page Head and CSS Link
?><html>
	<head>
		<link rel='stylesheet' type='text/css' href='browser.css' />
		<style>
			tr.selected {
				background-color: powderblue;
			}
			tr.selected td a {
				font-weight: bolder;
			}
		</style>
<?


	// Checking for libraries
	$ret = load_libs('player');
	if ($ret !== true) {

?>		<title>Careview SecureView: Error!</title>
	</head><body>
		<br /><br />
		<h2>
			<font color='red'>
				<?=$ret?>
			</font>
		</h2>
	</body>
</html>
<?		exit;
	}

function _tmp($msg) {
	file_put_contents('/tmp/blah.log', $msg . "\n", FILE_APPEND);
}

		
	list($repo, $index) = explode('_', request_entry());
	$epoch = mktime(1, 1, 1, intval($month), intval($day), intval($year));

	if (!isset($_SESSION['sv_epoch']) || $_SESSION['sv_epoch'] != $epoch || !is_array($_SESSION['sv_video_list'])) {
		_tmp("epoch is different: old {$_SESSION['sv_epoch']}, new $epoch");
		$_SESSION['sv_epoch'] = $epoch;
		$_SESSION['sv_video_list'] = archive_entries($year, $month, $day);
		_tmp('read ' . count($_SESSION['sv_video_list']) . " entries from $year/$month/$day");
	}
	$entries =& $_SESSION['sv_video_list'];
	$_SESSION['sv_current'] = -1;
	$current =& $_SESSION['sv_current'];
	$entry = $entries[$id]['start'];
//	$entries = archive_entries($year, $month, $day);
//	$entry = read_entry($repo, $year, $month, $day, $index);;

	$entry_cache = array();
	$room = load_object(LOCATION_TYPE);

	if (flag_raised(STANDALONE_FLAG)) {
		print "<font color=red size=4><b>Warning: Standalone flag raised, skipping authentication</b></font><br />\n";
		$dl_archive = true;
	} else {
		new session_login();
		if (!$_SESSION['_login_']->validate_permission('viewarchives')) {
?>			</head><body onLoad='top.location = "secureview.php"'></body></html>
<?			exit;
		}
		$dl_archive = $_SESSION['_login_']->validate_permission('dl_archives', false);
	}


?>
		<title>CareView (<?=$room->get_name()?>) Archive Viewer</title>

		<script type="text/javascript">
			var selectedRow = false;
			var ts = <?=$ts?>;
			var current = 0;
			function readCookie(name) {
				var nameEQ = name + "=";
				var ca = document.cookie.split(';');
				for(var i=0;i < ca.length;i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
				}
				return null;
			}
			function update_timer() {
				var timest = readCookie('timestamp');
				document.getElementById('stamp').value = timest;
//				alert(timest);
				setTimeout('update_timer()', 250);
			}
			top.frames['browser'].unselect = function() {
				if (!selectedRow) return;
				selectedRow.className = '';
				selectedRow = false;
			}
			top.frames['browser'].set_selected = function(id) {
				if (selectedRow) unselect();
				var tmp = document.getElementById('entry_' + id);
				if (!tmp) return;
				tmp.className = 'selected';
				selectedRow = tmp;
			}
			top.frames['browser'].set_date = function (new_ts) {
				if (ts != new_ts) {
					document.location = 'browser.php?ts='+new_ts;
				}
			}
		</script>
		<script type='text/javascript' language='JavaScript' src='<?=web_path('script/VideoStream.js')?>'></script>
	</head>
	<body onLoad="entries = get_entries_on(<?=$ts?>, done_loading);">
		<table width=80%>
			<tr>
				<td>
					<table width=200 style="border: medium double #006699;">
						<tr>
							<td width=200 align=center>
<?								//$cal_ts = new DateTime('@' . $timestamp->format('U'));
								draw_calendar($timestamp->format('U'));
?>						</td>
						</tr><tr>
							<td align=center id='entry_list'>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>
