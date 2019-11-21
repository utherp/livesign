function entry(id, start, end, filename, filesize, metadata) {
	this.id = id;
	this.times = {'start':start, 'end':end};
	this.meta = metadata;
	this.file = {'name':filename, 'size':filesize};
	entry.prototype.allEntries[id] = this;

	return;
}

entry.prototype.lists = {}; //new Array();
entry.prototype.allEntries = {}; //new Array();
entry.prototype.url_base = 'get_movie.php?type=';
entry.prototype.preview_base = 'player.php?cmd=show';
entry.prototype.load_base = 'load.php?'

function set_param(name, val) {
	var elem = document.getElementById(name);
	if (undefined == elem) return;
	var txt = document.createTextNode(val);
	if (elem.childNodes.length)
		elem.replaceChild(txt, elem.firstChild);
	else
		elem.appendChild(txt);

	return;
}

function set_attr (name, attr, val) {
	var elem = document.getElementById(name);
	if (undefined == elem) return;
	elem.setAttribute(attr, val);
	return;
}

function show_entry(id) {
	var e = get_entry(id);
	set_param("video_filename", e.file.name);
	set_param("video_filesize", e.file.size);
	set_param('video_start', e.times.start);
	set_param('video_end', e.times.end);
	set_param('video_duration', e.duration());
	set_attr('video_download', 'href', e.video_download());
	set_attr('video_preview', 'href', e.video_preview());
	return;
}

entry.prototype.make_url = function (type) {
	return this.url_base + type + '&id=' + this.times.start;
}

//entry.prototype.thumb = {};
entry.prototype.thumb_small = function () { return this.make_url('mini'); }
entry.prototype.thumb_large = function () { return this.make_url('large'); }

entry.prototype.video_length = function () {
	return this.times.end - this.times.start;
}

entry.prototype.duration = function () {
	var secs = this.video_length();
	var mins = Math.round(secs / 60);
	if (mins) secs -= mins * 60;
	var hours = Math.round(mins / 60);
	if (hours) mins -= hours * 60;

	if (hours < 10) hours = '0' . hours;
	if (mins < 10) mins = '0' . mins;
	if (secs < 10) secs = '0' . secs;

	return hours + ':' + mins + ':' + secs;
}

entry.prototype.video_download = function () { return this.make_url('movie'); }
entry.prototype.video_preview = function () {
	document.location = this.preview_base + '&id=' + this.id;
	return true;
}

function get_entries_on(timestamp, callback) {
	var my_ts = timestamp;
	var my_cb = callback;

	var dtmp = new Date();
	dtmp.setTime(timestamp * 1000);
	dtmp.setHours(0);
	dtmp.setMinutes(0);
	dtmp.setSeconds(0);

	my_ts = dtmp.getTime();

	var list = get_list(my_ts);

	if (undefined == list) 
		return load_list(
					my_ts,
					function (list) { return load_entries(list, my_cb); }
		);

	return load_entries(list, my_cb);
}
var scripts_div = undefined;

function get_scripts_div() {
	if (undefined != scripts_div) return scripts_div;
	scripts_div = document.getElementById('scripts_div');
	if (undefined == scripts_div) {
		scripts_div = document.createElement('div');
		scripts_div.setAttribute('id', 'scripts_div');
		document.body.appendChild(scripts_div);
	}
	return scripts_div;
}

function load_list (timestamp, callback) {
	var my_cb = callback;
	var my_ts = timestamp / 1000;

	var sd = get_scripts_div();

	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', entry.prototype.load_base + '&ts=' + my_ts);
	script.onload = function () {
		my_cb(get_list(my_ts));
		this.parentNode.removeChild(this);
		return true;
	}

	sd.appendChild(script);
	return true;
}

function load_entries (list, callback) {
	var my_list = list;
	var my_cb = callback;

	for (var i in my_list) {
		if (undefined != my_list[i]) continue;
		my_list[i] = get_entry(i);
		if (undefined != my_list[i]) continue;
		var tmp = i;
		return load_entry(i, function (this_entry) { my_list[tmp] = this_entry; return load_entries (my_list, my_cb); });
	}
	return my_cb(my_list);
}


function load_entry (id, callback) {
	var my_cb = callback;

	var sd = get_scripts_div();

	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', entry.prototype.load_base + '&id=' + id);
	script.onload = function () {
		my_cb(get_entry(id));
		this.parentNode.removeChild(this);
		return true;
	}

	sd.appendChild(script);
	return true;
}

function get_entry (id) {
	return entry.prototype.allEntries[id];
}

function set_entry (id, obj) {
	entry.prototype.allEntries[id] = obj;
	return true;
}

function get_list(ts) {
	return entry.prototype.lists[ts];
}

function set_list (ts, list) {
	entry.prototype.lists[ts] = list;
	return true;
}

