<?php

	if (!isset($id)) $id = $_GET['id'];
	if (!isset($type)) $type = $_GET['type'];

	define('CACHE_PATH', '/usr/local/ezFramework/video/cache');

	function make_thumbnails($id) {
		global $movie_file;
		if (!$movie_file) $movie_file = mpg_filename($id);

		@exec('/usr/local/ezFramework/sbin/thumbnail.sh "'.$movie_file.'" '. $id .' 100x60', $output);
		return true;
	}

	function make_mini_thumbnail ($id) {
		global $movie_file;
		if (!$movie_file) $movie_file = mpg_filename($id);

		$thumb = thumbnail_filename($id);
		$mini_thumb = minithumb_filename($id);
		if (!file_exists($thumb)) make_thumbnail ($id);
		@exec('/usr/bin/convert ' . $thumb . ' -resize 100x60 ' . $mini_thumb);
		return true;
	}
		
	function send_file ($filename, $flash = false) {
		$file = fopen($filename, 'rb');
		if ($file === null)
			return false;

		header('Connection: close');

		if (!$flash || !file_exists($filename . '.filepart')) {
			header('Content-Length: ' . filesize($filename));
			fpassthru($file);
			fclose($file);
			return true;
		}
			
		$nullcount = 0;
		$buffer = '';

		$filesize = file_exists($filename . '.filepart')?100000000:filesize($filename);
		header('Content-Length: ' . $filesize);
		
		$buffer = '';
		do {
			$buffer = fread($file, 8192);
		} while (strlen($buffer) < 180);

		$tmp = unpack('d',
				$buffer[60] . $buffer[59] . $buffer[58] . $buffer[57] .
				$buffer[56] . $buffer[55] . $buffer[54] . $buffer[53]);

		if ($tmp[1] == 0) {
			$size = preg_replace('/^.*\/([0-9\-]+)\.flv$/', '$1', $filename);
			list ($start, $end) = explode('-', $size);
			$start = intval($start);
			$end = intval($end);
			$duration = doubleval($end - $start + .125);

			$i = 60;
			foreach (str_split(pack('d', $duration)) as $c)
				$buffer[$i--] = $c;

		}

		$tmp = unpack('d',
				$buffer[172] . $buffer[173] . $buffer[174] . $buffer[175] .
				$buffer[176] . $buffer[177] . $buffer[179] . $buffer[180]);
			
		if ($tmp[1] == 0) {
			$i = 180;
			foreach (str_split(pack('d', 100000000)) as $c)
				$buffer[$i--] = $c;
		}

		print $buffer;
		
		while (@ob_end_flush());

		$miss = 500;
		$check = 10;
		while ($check) {
			while ($miss) {
				if (!fpassthru($file)) {
					$miss--;
					usleep(1000);
				} else 
					$miss = 500;
			}
			if (file_exists($filename . '.filepart')) {
				$miss = 500;
				$check--;
			} else break;
		}

		fclose($file);
		return $miss?true:false;

		$initial = true;
		do {
			$data = fread($file, 8192);
			if ($data) {
				$buffer .= $data;
				$nullcount = 0;
				ob_flush();
				flush();
			} else {
				$nullcount++;
				usleep(1000);
			}
			if ($initial)
				if (strlen($buffer) > 50000) {
					$initial = false;
					print $buffer;
					$buffer = '';
				}
			else {
				print $buffer;
				$buffer = '';
			}
		} while ($nullcount < 2000);
		
		fclose($file);
		return ($nullcount < 2000);
	}

	function minithumb_filename ($id) {
//		global $movie_file;
//		if (!$movie_file) $movie_file = mpg_filename($id);
		return CACHE_PATH . '/thumbnails/mini/' . $id . '.jpg'; //preg_replace('/^.*\/([0-9\-]+)\.mpg$/', '$1', $movie_file) . '_mini.jpg';
	}

	function thumbnail_filename ($id) {
//		global $movie_file;
//		if (!$movie_file) $movie_file = mpg_filename($id);
		return CACHE_PATH . '/thumbnails/full/' . $id . '.jpg'; //preg_replace('/^.*\/([0-9\-]+)\.mpg$/', '$1', $movie_file) . '.jpg';
	}

	function flash_filename ($id) {
		global $movie_file;
		if (!$movie_file) $movie_file = mpg_filename($id);
		return CACHE_PATH . '/flash/' . $id . '.flv'; //preg_replace('/^.*\/([0-9\-]+)\.[am][vp][ig]$/', '$1', $movie_file) . '.flv';
	}

	function mpg_filename ($id) {
		$path = '/usr/local/ezFramework/video/archive/by_date/' . date("Y/m/d", intval($id)) . '/video/'.$id.'/data';
//		file_put_contents("/tmp/debugplayer.log", "mpeg file is: '$path'\n", FILE_APPEND);
		return $path;

		$lwd = getcwd();
		if (!@chdir($path))
			return false;

		$tmp = glob($id . "-*.[am][vp][ig]");
		if (!count($tmp)) 
			return false;

		chdir($lwd);
		return $path . '/' . $tmp[0];
	}


	$movie_file = mpg_filename($id);

	switch ($type) {
		case ('mini'):
		case ('minithumb'):
			if (!file_exists(minithumb_filename($id)))
				make_thumbnails($id);
//				make_mini_thumbnail($id);
			header('Content-type: image/jpeg');
			readfile(minithumb_filename($id));
			exit;
		case ('large'):
		case ('thumb'):
			if (!file_exists(thumbnail_filename($id)))
				make_thumbnails($id);
			header('Content-type: image/jpeg');
			readfile(thumbnail_filename($id));
			exit;
		case('flash'):
			header('Content-type: application/octet-stream');
			if (!file_exists(flash_filename($id))) {
				require_once('ezFramework.php');
				require_once('config.php');
//				load_definitions('PLAYER');
//				load_definitions('VIDEO');
//				load_definitions('FLAGS');
				load_libs('player');
				request_demux_to_flash($id);
			}
			$nullcount = 0;
			$flash_file = flash_filename($id);
			while (!file_exists($flash_file)) {
				$nullcount++;
				usleep(10000);
				if ($nullcount > 1000) exit;
			}
			sleep(1);
//			header('Content-Length: 100000'); // . filesize($filename));
			send_file(flash_filename($id), true);
			exit;
		case('movie'):
			$fn = mpg_filename($id);
			$tmp = explode('/', $fn);
			$name = $tmp[count($tmp)-2] . '.mpg';
//			$name = preg_replace('/^.*\//', '', $fn);
			if (substr($fn, -4) == '.mpg')
				header('Content-type: video/mpeg');
			else
				header('Content-type: video/avi');
	
			header('Content-disposition: attachment; filename="' . $name . '"');
			header('Content-Length: ' . filesize($fn));
			send_file(mpg_filename($id));
			exit;
		default:
			exit;
	}
?>
