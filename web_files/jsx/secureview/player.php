<?php
	require_once('ezFramework.php');
	require_once('config.php');
	load_definitions('PLAYER');
	load_definitions('VIDEO');
	load_definitions('FLAGS');

	new session_login();
	if (!$_SESSION['_login_']->validate_permission('viewarchives')) {
?>		</head><body onLoad='top.location = "secureview.php"'></body></html>
<?		exit;
	}

	load_libs('player');

	$buffer = '';
	$total_frames = false;
	$loaded_frames = 0;

	$cmd = isset($_GET['cmd'])?$_GET['cmd']:'show';
	$id = isset($_GET['id'])?$_GET['id']:time();

	if ($id === false && $cmd == 'play') $cmd = 'show';

	function mpg_filename ($id) {
		$path = '/usr/local/ezFramework/video/archive/' . date("Y/m/d", $id);

		$lwd = getcwd();
		if (!@chdir($path))
			return false;

		$tmp = glob($id . "-*.[am][vp][ig]");
		if (!count($tmp)) 
			return false;

		chdir($lwd);
		return $path . '/' . $tmp[0];
	}

	function calender_template () {
		$tmp .= "
		<style>
			tr.calRow {
			};
			td.calDay {
			};
			th.calHeader {
			};

			div.calender#off {
				visibility: hidden;
			};
		</style>\n";


		$tmp .= "<div>\n\t<table>\n\t\t<tr>\n";
		$day_names = array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

		for ($i = 0; $i < 7; $i++)
			$tmp .= "\t\t\t<th class='calHeader'>" . $day_names[$i] . "</th>\n";

		$tmp .= "\t\t</tr>\n";
		$day = 1;
		$row = 1;

		while ($day < 32) {
			$d = ($day < 10)?'0'.$day:$day;
			$tmp .= "\t\t<tr class='calRow' id='cal_row_$row'>\n";
			for ($c = 1; $c < 8 && $day < 32; $c++, $day++)
				$tmp .= "\t\t\t<td class='calDay' id='cal_day_$d' day=$day onClick='select_day()'></td>\n";
			$tmp .= "\t\t</tr>\n";
			$row++;
		}

		$tmp .= "\t</table>\n</div>\n";

		return $tmp;
	}


	function details_template () {
		return "
		<div style='margin-left: auto; margin-right: auto; width: 86%'>
			<h2>Archive Details for video <b id=video_id>...</b></h2>
			<br />

			<img id='video_thumb' style='width: 50%; margin-left: 25%; margin-right: 25%' />
			<br />
			<br />
	
			<table style='width: 100%'>
				<tr class='odd_row'>
					<td>File name:</td>
					<td id=video_filename></td>
				</tr><tr class='even_row'>
					<td>File size:</td>
					<td id='video_filesize'></td>
				</tr><tr class='odd_row'>
					<td>Start:</td>
					<td id=video_start></td>
				</tr><tr class='even_row'>
					<td>End:</td>
					<td id='video_end'></td>
				</tr><tr class='odd_row'>
					<td>Duration:</td>
					<td id=video_duration></td>
				</tr><tr class='even_row'>
					<td>Actions:</td>
					<td><a id='video_download'>Download</a></td>
				</tr><tr class='odd_row'>
					<td>&nbsp;</td>
					<td><a id='video_preview'>Preview</a></td>
				</tr>
			</table>
		</div>\n";
	}




?><html>
	<head>
		<link rel='stylesheet' type='text/css' href='player.css' />
		<script type='text/javascript' src='entry.js'></script>
		<script type='text/javascript'>
			var entries;
			var id = <?=$id?>;
			function done_loading() {
				show_entry(id);
				return true;
			}
		</script>
		<script type='text/javascript'>
<?			if (isset($_GET['ts'])) {
?>				if (top.frames['browser'])
					top.frames['browser'].set_date(<?=$_GET['ts']?>);
<?				if (!$id) $id = 'pl' . $_GET['ts'];
			}
?>
			var VideoID = <?=$id?"'$id'":'false'?>;
			var Width =  '100%';
			var Height = '100%';
			var Background = "#ffffff";
			var domain = '<?=$domain?>';
			var player_folder = '<?=$player_folder?>';
			if (top.frames['browser'])
				top.frames['browser'].set_selected('<?=$id?>');
//			var path2 = '<?=$player_folder?>';
		</script>
	</head>
<?

	switch ($cmd) {
		case('play'):
?>			<body>
			<div class="player">
				<script src="player_box.js" type="text/javascript"></script>
			</div>
<?			break;
		case('show'):
		default:
			show_details($id);
			break;
	}
?>
	</body>
</html>
