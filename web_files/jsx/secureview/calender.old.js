calender.prototype.words = {
	English:{
		months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		days:['Sunday', 'Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday', 'Saturday'],
		dayabr:['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	},
	French:{
		months:['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
		days:['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
		dayabr:['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
	},
	Spanish:{
		months:['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		days:['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
		dayabr:['Lun', 'Mar', 'Miér', 'Jue', 'Vie', 'Sáb', 'Dom']
	},
	Italian:{
		months:['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Màggio', 'Giugno', 'Lùglio', 'Agosto', 'Settèmbre', 'Ottàgono', 'Novèmbre', 'Dicèmbre'],
		days:['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'],
		dayabr:['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
	},
	German:{
		months:['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
		days:['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
		dayabr:['Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam', 'Son']
	}
};

calender.prototype.lang = language_pack.lang;
calender.prototype.util = jsx.prototype.util;
calender.prototype.getType = function () { return 'calender'; }

function calender(node_id, timestamp) {
	this.loading = false;
	this.loaded = false;
	this.refresh = false;
	this.init = true;
	this.node_id = -1;
	this.playerbox = null;
	this.player = null;
	this.date = (undefined != timestamp)?new Date(timestamp):new Date();

	this.selected = {
		'Day':null,
		'Entry':null,
		'Save':new Array()
	};

	this.setDate(this.date);
	this.set_node(node_id);
	this.headers = ['Start', 'Length', 'Events'];
	this.query_month(this.year, this.month);
	this.build_window();
	return;
}

calender.prototype.set_node = function (id) {
	if (this.node_id == id) return;
	this.node_id = id;
	this.div_id = 'cal_'+this.node_id;

	if (this.init) return;

	this.unselect('Entry');
	this.unselect('Day');

	if (undefined != this.jsxwin) {
		this.jsxwin.tmpl.setAttribute('id', this.div_id);
		this.jsxwin.self.id = this.div_id;
	}

	if (undefined != this.entryList) this.entryList.clear();

	delete(this.cache);
	this.cache = {};
	this.refresh = true;
	this.query_month(this.year, this.month);
	return;
}

calender.prototype.getTimestamp = function () {
	return this.date.getTime();
}
calender.prototype.calenderClass = function () { return "calender"; }

calender.prototype.hasRecords = function (d) {
	if (undefined == this.cache[this.year]) return false;
	if (undefined == this.cache[this.year][this.month]) return false;
	if (undefined == this.cache[this.year][this.month][d]) return false;
	return true;
}

calender.prototype.make_style = function () {
	var txt = '';
	var cellrows = this.jsxwin.getInstancesByName('cells');
	for (var i = 0; i < cellrows.length; i++) {
		for (var j = 0; j < cellrows[i].list.length; j++) {
			var id = cellrows[i].list[j].self.params.dayNumber;
			if (id<1) continue;
			if (id<10) id = '0'+id;
			if (!this.hasRecords(id)) continue;
			cellrows[i].list[j].tmpl.className += ' highlight';
		}

	}
	return;
}
calender.prototype.remove_style = function () {
	if (undefined == this.jsxwin) return;
	var cellrows = this.jsxwin.getInstancesByName('cells');
	for (var i = 0; i < cellrows.length; i++)
		for (var j = 0; j < cellrows[i].list.length; j++)
			cellrows[i].list[j].tmpl.className = cellrows[i].list[j].tmpl.className.replace(/highlight/g, '');
	return;
}

calender.prototype.getBody = function () {
	return this.jsxwin.tmpl;
}

calender.prototype.build_window = function () {
	this.loaded = true;
	this.init = false;
	this.jsxwin = new jsx(	'calender',
							{'id':this.div_id,'timestamp':this.date.getTime()},
							this
						);

	this.jsxentries = new jsx('tableList', {'id':this.id}, this);
	this.entryList = this.jsxentries.getInstancesByName('listRow');
	if (this.entryList != null && undefined == this.entryList[0]) this.entryList = null;
	else this.entryList = this.entryList[0];
	return;
}

calender.prototype.getHeaders = function () {
	return this.headers;
}

calender.prototype.tableClass = 'svEntryList';
calender.prototype.time_string = function (d) {
	var s = '';
	var h = d.getHours();
	var pr = 'am';
	if (h == 0) h = 12;
	else if (h > 11) {
		pr = 'pm';
		if (h > 12)	h -= 12;
	}
	if (h < 10) h = ''+'0'+h;
	s = h + ':';
	s += ((d.getMinutes()<10)?'0':'')+d.getMinutes()+':';
	s += ((d.getSeconds()<10)?'0':'')+d.getSeconds();
	return s+pr;
}

calender.prototype.getRows = function () {
	if (!this.util.isset(this.cache, this.year, this.month, this.day)) return [];
	var entries = new Array();
	var d = new Date();
	if (this.cache[this.year][this.month][this.day].constructor != Array) {
		var tmp = new Array();
		for (var i in this.cache[this.year][this.month][this.day])
			tmp.push(this.cache[this.year][this.month][this.day][i]);
		this.cache[this.year][this.month][this.day] = tmp;
	}
	return this.cache[this.year][this.month][this.day];
}

calender.prototype.makeListRow = function (item) {
	if (undefined != item.listRow) return item.listRow;
	if (undefined == item.stStr) {
		var d = new Date();
		d.setTime(item.s*1000);
		item.stStr = this.time_string(d);
	}
	if (undefined == item.durStr) { 
		if (item.e == 'now') item.durStr = 'Now';
		else {
			var dur = item.e - item.s; 
			var min = Math.floor(dur / 60);
			if (min < 1) dstr = '<1 min.';
			else if (min > 59) {
				var hr = Math.floor(min / 60);
				min = min % 60;
				item.durStr = hr + ' hr. '+min+' min.';
			} else
				item.durStr = min + ' min.';
		}
	}
	item.listRow = [item.stStr, item.durStr];
	if (undefined == item.evjsx) {
		if (typeof(item.ev) != 'object') item.evjsx = null;
		else {
			var events = new Array();
			for (var name in item.ev) 
				events.push(new Array(name, item.ev[name].length));
			if (undefined == events.length || events.length == 0) item.evjsx = null;
			else item.evjsx = new jsx('thumbList', null, events);
		}

		item.listRow.push((item.evjsx == null)?'.':[item.evjsx.tmpl]);
	}
	return item.listRow;
}

calender.prototype.query = function (q) {
	var obj = this;
	var query = q;
	return node_comm.make_request(
			this.node_id, 
			'secureview/load.php',
			query,
			function (data) {
				switch (query.type) {
					case ('days'): return obj.load_month(query, data);
					case ('entries'): return obj.load_entries(query, data);
					case ('details'): return obj.load_details(query, data);
					default: return false;
				}
			}
		);
}

calender.prototype.query_details = function (entry) { return this.query({'type':'details','entry':entry}); }
calender.prototype.load_details = function (query, data) {
	var entry = query.entry;
	if (!this.util.istype('object', this.cache)) this.cache = {};
	if (!this.util.istype('object', this.cache.details)) this.cache.details = {};
	this.cache.details[entry] = data;
	if (this.entry == entry) return this.refresh_details();
	return true;
}

calender.prototype.query_entries = function (year, month, day) { return this.query({'type':'entries','year':year,'month':month,'day':day}); }
calender.prototype.load_entries = function (query, data) {
	if (!this.util.istype('object', this.cache)) this.cache = {};
	if (!this.util.istype('object', this.cache.year)) this.cache[query.year] = {};
	if (!this.util.istype('object', this.cache.year.month)) this.cache[query.year][query.month] = {};
	this.cache[query.year][query.month][query.day] = data;
	if (this.year == query.year && this.month == query.month && this.day == query.day) return this.refresh_entries();
	return true;
}

calender.prototype.query_month = function (year, month) { return this.query({'type':'days','year':year, 'month':month}); }
calender.prototype.load_month = function (query, data) {
	if (!this.util.istype('object', this, 'cache', query.year)) {
		if (!this.util.istype('object', this, 'cache')) this.cache = {};
		this.cache[query.year] = {};
	}
	this.cache[query.year][query.month] = data;

	if (this.refresh || (this.year == query.year && this.month == query.month)) {
		this.refresh = false;
		this.make_style();
	}
	return true;
}

calender.prototype.getMonthName = function () {
	return this.lang('months', this.date.getMonth());
}

calender.prototype.unselect = function (type) {
	if (this.selected[type] != null) this.selected[type].removeAttribute('id');
	this.selected[type] = null;
	return;
}
calender.prototype.select = function (type, elem) {
	this.unselect(type);
	this.selected[type] = elem;
	elem.setAttribute('id', 'selected'+type);
}

calender.prototype.dayClick = function (year, month, day, elem) {
	if (this.selected.Day == elem) return true;
	this.unselect('Entry');
	this.day = day;
	if (this.day<10)this.day = ''+'0'+this.day;
	this.select('Day', elem);
	this.refreshEntries();
	return true;
}

calender.prototype.refresh_header = function () {
	var header = this.jsxentries.getInstancesByName('headerList');
	if (header==null || undefined == header[0]) return;
	header[0].refresh(0, true);
	return;
}

calender.prototype.set_loading = function () {
	this.loading = true;
	this.entryList.unshift(['Loading', '...', '...']);
	this.entryList.list[0].tmpl.setAttribute('id', 'loadingTag');
	return;
}
calender.prototype.unset_loading = function () {
	if (this.loading && typeof(this.updating) == 'object') {
		clearTimeout(this.updating.timer);
		delete(this.updating);
	}
	this.loading = false;
	if (undefined != this.entryList) this.entryList.shift();
	return;
}

calender.prototype.refreshEntries = function () {
	if (typeof(this.updating) == 'object' && this.updating.timer != null) {
		clearTimeout(this.updating.timer);
		this.unset_loading();
	}
	if (this.entryList == null) return;
	this.set_loading();

	this.updating = {
		'timer':null,
		'next': 1,
		'plen':this.entryList.list.length,
		'list':this.getRows()
	};

	if (!this.updating.list.length) return this.entryList.clear();

	return this.update_next_entry();

}

calender.prototype.update_next_entry = function () {
	var c = 0;
	while (c < 2) {
//	with (this.updating) {
		clearTimeout(this.updating.timer);
		this.updating.timer = null;
		if (undefined == this.updating.list[this.updating.next].listRow)
			this.makeListRow(this.updating.list[this.updating.next]);

		var tmp = this.updating.list[this.updating.next].listRow;

		if (this.updating.next >= this.updating.plen) this.entryList.push(tmp);
		else {
			this.entryList.list[this.updating.next].containing.listCell.list[0].self.stdargs[0] = tmp[0];
			this.entryList.list[this.updating.next].containing.listCell.list[1].self.stdargs[0] = tmp[1];
			this.entryList.list[this.updating.next].containing.listCell.list[2].self.stdargs[0] = tmp[2][0];
			this.entryList.list[this.updating.next].refresh();
		}
		this.updating.next++;

		if (this.updating.list.length <= this.updating.next)  break;
		c++;
	}
	if (this.updating.list.length > this.updating.next) {
		var obj = this;
		this.updating.timer = setTimeout(function () { return obj.update_next_entry(); }, 10);
		return;
	}

	while (this.updating.next < this.entryList.length)
		this.entryList.pop().destroy();

	this.unset_loading();
	return;
}

calender.prototype.entryClick = function (index, elem) {
	if (this.selecting) {
		if (undefined != this.selected.Save[index]) {
			delete(this.selected.Save[index]);
			elem.style.backgroundColor = '';
		} else {
			this.selected.Save[index] = {
				'node':elem,
				'id':this.cache[this.year][this.month][this.day][index].id
			};
			elem.style.backgroundColor = '#90D0D0';
		}
		return;
	}
	this.select('Entry', elem);
	if (this.playerbox == null)
		this.playerbox = (playerWindow.getInstancesByName('playerbox'))[0];

	while (this.playerbox.tmpl.childNodes.length) 
		this.playerbox.tmpl.removeChild(this.playerbox.tmpl.firstChild);

	if (this.player == null)
		this.player = get_player({'params':{
			'VideoID':this.cache[this.year][this.month][this.day][index].id,
			'domain':'demo.care-view.com',
			'player_folder':'nodes/'+this.node_id+'/secureview',
			'Width':'100%',
			'Height':'100%',
			'Background':'#ffffff'
		}});
	
	this.playerbox.tmpl.appendChild(this.player);

	return true;
}

calender.prototype.saveClick = function (elem) {
	if (!this.selecting) {
		this.selecting = true;
		elem.style.borderStyle = 'inset';
		elem.style.backgroundColor = '#90D0D0';
		return true;
	}
	this.selecting = false;
	var q = '';
	var c = 0;
	for (var i in this.selected.Save) {
		this.selected.Save[i].node.style.backgroundColor = '';
		q += '&v['+c+']='+this.selected.Save[i].id;
		delete(this.selected.Save[i]);
		c++;
	}
	elem.style.backgroundColor = '';
	elem.style.borderStyle = 'outset';
	if (q != '')
		document.location = '/nodes/'+this.node_id+'/secureview/get_movie.php?&type=list'+q;

	return true;
}

calender.prototype.previousMonth = function (dateobj) {
	dateobj.setDate(0);
	return this.setDate(dateobj);
}

calender.prototype.nextMonth = function (dateobj) {
	dateobj.setDate(32);
	return this.setDate(dateobj);
}

calender.prototype.setDate = function (dateobj) {
	this.unselect('Day');
	this.unselect('Entry');

	this.year = dateobj.getFullYear();
	this.month = dateobj.getMonth()+1;
	if (this.month < 10) this.month = ''+'0'+this.month;
	this.day = 0;

	this.unset_loading();
	if (undefined != this.entryList) this.entryList.clear();

	this.remove_style();
	if (this.init) return true;
	if (undefined == this.cache[this.year] || undefined == this.cache[this.year][this.month]) {
		this.refresh = true;
		return this.query_month(this.year, this.month);
	}
	this.make_style();
	return true;
}

