<?/*	require_once('config.php');*/ ?>
<html>
	<head>
		<link rel=stylesheet type=text/css href='css/browser.css' />
		<link rel=stylesheet type=text/css href='css/entryList.css' />
		<link rel=stylesheet type=text/css href='css/calender.css' />
		<link rel=stylesheet type=text/css href='css/player.css' />
		<link rel=stylesheet type=text/css href='css/jsxWindow.css' />

		<script type=text/javascript src=browser_detect.js></script>
		<script type=text/javascript src='language_pack.js'></script>

		<script type=text/javascript src='jsx/jsxPosCtrl.js'></script>
		<script type=text/javascript src='jsx/jsx.js'></script>
		<script type=text/javascript src='jsx/jsxList.js'></script>
		<script type=text/javascript src='jsx/jsxWM.js'></script>

		<script type=text/javascript src='node_comm.js'></script>
		<script type=text/javascript src='calender.js'></script>
		<script type=text/javascript src='player_box.js'></script>
		<script>
			function lpad (n, c, str) {
				var out = "" + str;
				while (out.length < n) out = c + out;
				return out;
			}
			var jsxBase;
			var mycal;
			var playerWindow;

			function load_templates () {
				jsxBase = new jsx();
				playerWindow = new SecureViewer(175, {'x':200, 'y':100, 'w':800, 'h':460, 'title':"Stephen's Office"});
				playerWindow.windows.jsxWin.attach(document.body);
			}
		</script>
	</head>
	<body onLoad='load_templates()'>
		<?include("templates/calender.tmpl");?>
		<?include("templates/entryList.tmpl");?>
		<?include("templates/thumbList.tmpl");?>
		<?include("templates/window.tmpl");?>
		<?include("templates/scvWin.tmpl");?>

		<select onChange='calender.prototype.locale = this.value; mycal.jsxwin.refresh();'>
			<option>English</option>
			<option>Spanish</option>
			<option>French</option>
			<option>Italian</option>
			<option>German</option>
		</select>

		<select onChange='mycal.set_node(this.value);'>
			<option selected='selected'>175</option>
			<option>123</option>
			<option>177</option>
		</select>

		<br />
	</body>
</html>
