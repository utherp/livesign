<?php
	require_once('ezFramework.php');

	load_definitions('BROWSER');
	load_definitions('VIDEO');
	load_definitions('NODE_WEB');
	load_definitions('FLAGS');

	if (!flag_raised(STANDALONE_FLAG)) {
		$GLOBALS['_ContentType_'] = 'script';
		new session_login();
		if (!$_SESSION['_login_']->validate_permission('viewarchives')) exit;
	}
	function get_param ($p, $default = false) {
		return isset($_REQUEST[$p])?$_REQUEST[$p]:$default;
	}


	function days_to_js() {
		$year = get_param('year');
		$month = get_param('month');
		if (!$year || !$month) {
			list ($y, $m) = explode('/', date('Y/m'));
			if (!$year) $year = $y;
			if (!$month) $month = $m;
		}
		$a = load_days ($year, $month);
		if ($a === false) return 'false';
		return array_to_js($a);
	}

	function load_days ($year, $month) {
		if (!@chdir(abs_path(ARCHIVE_PATH, 'by_date', $year, $month))) return false;
		$list = array();
		foreach (glob('[0-9][0-9]/video/*') as $fn) { //[0123456789]*-[0123456789]*.*') as $fn) {
//			if (!preg_match('/(\d+?)\/(\d+?)-(\d+?)\.(.*)$/', $fn, $matches)) continue;
			$tmp = explode('/', $fn);
			$times = explode('-', $tmp[2]);
			if (count($times) == 1) {
				array_push($times, 'now');
				$id = $times[0];
			} else
				$id = $times[0] . '-' . $times[1];

			if (!isset($list[$tmp[0]])) $list[$tmp[0]] = array();
			$list[$tmp[0]][] = array(
									'id'=> $id,
									's' => $times[0],
									'e' => $times[1],
									't' => 'mpg'
								);
		}
		return $list;
	}

	function array_to_js ($list) {
		$out = '';
		foreach ($list as $n => $l) {
			$out .= (!$out)?'{':', ';
			$out .= "'$n':";
			if (is_array($l)) $out .= array_to_js($l);
			else $out .= "'$l'";
		}
		$out .= '}';
		return $out;
	}


	header('Content-Type: text/javascript');
	$type = get_param('type');
	$rid = get_param('reqid');
	if (!$type) exit;
	if ($rid === false) exit;
	$resp = '';
	switch ($type) {
		case ('day'): $resp = days_to_js(); break;
		case ('entries'): $resp = entries_to_js(); break;
	}

	if ($resp) {
		print 'node_comm.response_cache['.$rid.'] = ' . $resp . ";\n";
		file_put_contents('/tmp/testing', 'loaded...' . "\n" . 'node_comm.response_cache['.$rid.'] = ' . $resp . ";\n");
//		print "alert('loaded');\n";
	}

	exit;

