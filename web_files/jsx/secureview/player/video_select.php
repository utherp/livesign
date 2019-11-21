<?
//$_GET['code'] <- id (u'll get it from player show)
	require_once('ezFramework.php');
	load_libs('player');

	if (!empty($_GET['code']))
		$id = $_GET['code'];

	if (strpos($id, 'pl') === 0) {
		$id = substr($id, 2);
		$GLOBALS['just_playlist'] = true;
	}

	$tmp = explode('_', $id);
	$nodeid = $tmp[0];
	$id = $tmp[1];

//	$id = intval($id);
//	setcookie('movie_id', $id);

	list ($year, $month, $day) = explode('/', date('Y/m/d', intval($id)));
	$date_epoch = mktime(1, 1, 1, intval($month), intval($day), intval($year));

//	setcookie('date_epoch', $date_epoch);
//	setcookie('index', 0);

	if (isset($GLOBALS['just_playlist'])) {
		$video = 'no_video.flv';
		$thumb = '';
		$link = '/' . $player_folder . '/player.php?ts=' . $id;
		$video_name = 'Archives for ' . date('Y-m-d', $id);  //video name
		$videoDescription = $video_name;
	} else {
		$video = "/nodes/$nodeid/secureview/get_movie.php?&type=flash&id=$id"; //$web_filename . '.flv';
		$thumb = "/nodes/$nodeid/secureview/get_movie.php?&type=thumb&id=$id"; //$web_filename . '.jpg';
		$link  = "/nodes/$nodeid/secureview/get_movie.php?&type=movie&id=$id"; //$web_filename . '.jpg';
	
		list ($start, $end) = movie_times(movie_filename($id));
	
//		print $start . "\n$end\n";
		$video_id = $id; //"1219087521-1219087582"; //video id
		$video_name = date('Y-m-d H:i:s', $start) . ' - ' . date('Y-m-d H:i:s', $end);  //video name
		$videoDescription = "Archived Video";
		
	}
	$channels = array('x1z','x2','x3','x4','x5','x6');
?>
