jsxtemplate.prototype.allTemplates = {};

function jsxtemplate(called) {
	if (typeof(called) == 'string' && called == '!LOAD!') {
		this.called = arguments[1];
		this.obj = arguments[2];
		this.parse_template();
		return;
	}

	var from = jsxtemplate.prototype.allTemplates[called];

	if (undefined == from) {
		jsxtemplate.prototype.load_all();
		from = jsxtemplate.prototype.allTemplates[called];
		if (undefined == from) return false;
	}

	this.called = called;
	this.tmpl = from.tmpl.cloneNode(true);

	var defaults = true;
	this.stdargs = new Array();

	for (var i = 1; i < arguments.length; i++)
		if (typeof(arguments[i]) == 'string' && arguments[i] == '!NODEFAULTS!') {
			defaults = false;
			continue;
		} else
			this.stdargs.push(arguments[i]);

	this.init(defaults);
	return;
}

jsxtemplate.prototype.set = function (called, value) {
	if (undefined == this.values[called]) return false;
	for (var i = 0; i < this.values[called].length; i++)
		this.values[called][i].set(value);
	return true;
}

jsxtemplate.prototype.set_all = function (values) {
	for (var i in values) {
		if (undefined == this.values[i]) continue;
		for (var j = 0; j < this.values.length; j++)
			this.values[i][j].set(values[i]);
	}
	return;
}

jsxtemplate.prototype.set_at = function (called, index, value) {
	if (undefined == this.values[called]) return false;
	if (undefined == this.values[called][index]) return false;
	return this.values[called][index].set(called, value);
}

jsxtemplate.prototype.apply_defaults = function () {
	for (var i in this.values)
		for (var j = 0; j < this.values[i].length; j++)
			this.values[i][j].set();

	return true;
}

jsxtemplate.prototype.dup = function (from) {
}

jsxtemplate.prototype.parse_template = function () {
//	var tag = this.obj.getAttribute('tag');
//	if (undefined == tag || null == tag) tag = 'div';
//	this.tmpl = document.createElement(tag);
//	this.copy_attributes(this.obj, this.tmpl);
//	this.copy_children(this.obj, this.tmpl);
	this.tmpl = this.obj.cloneNode(true);
	this.obj.parentNode.removeChild(this.obj);
	return;
}

jsxtemplate.prototype.copy_attributes = function (from, to) {
	var scope = {};
	var objs = [from, to];
	for (var j = 0; j < 2; j++) {
		for (var i = 0; i < objs[j].attributes.length; i++) {
			var name = objs[j].attributes[i].name;
			if (undefined == scope[name])
				scope[name] = objs[j].attributes[i].value;
		}
	}

	for (i in scope) {
		var orig = to.getAttribute(i);
		if (scope[i].indexOf('#!') == 0) {
			var last = scope[i];
			if (undefined != orig && orig != null)
				scope[i] = orig;
			scope[i] = this.shebang(last.substring(2), scope);
			to.setAttribute(i, scope[i]);
			continue;
		}
		to.setAttribute(i, scope[i]);
	}
	return;
}

jsxtemplate.prototype.copy_children = function (from, to) {
	for (var i = 0; i < from.childNodes.length; i++)
		to.appendChild(from.childNodes[i].cloneNode(true));
}

jsxtemplate.prototype.shebang = function (cmd, scope) {
	var self = this.params;
	self.scope = scope;
	return eval(cmd);
}

jsxtemplate.prototype.parse_stdargs = function(def) {
	var parsing = def;
	if (/\$[0-9]+/.test(parsing))
		for (i = 1; i <= this.stdargs.length; i++)
			parsing = parsing.replace(new RegExp('\\$'+i+'([^0-9]?)', 'g'), this.stdargs[i-1] + "$1");
	return parsing;
}

jsxtemplate.prototype.parse_values = function(def, shebang) {
	var parsing = this.parse_stdargs(def);
	var i; 
	for (i in this.scope)
		parsing.replace(new RegExp('\%'+i+'([^a-zA-Z0-9]?)', 'g'), this.scope[i] + "$1");
	return parsing;
}

jsxtemplate.prototype.init = function (apply_defaults) {
	this.values = {};
	this.params = {};
	this.defs = {};
	this.lists = {};

	this.read_params();
	this.read_defs();
	this.read_lists();
	this.read_values('attr');
	this.read_values('value');

	if (undefined != apply_defaults && apply_defaults)
		this.apply_defaults();

	return true;
}

jsxtemplate.prototype.read_params = function () {
	var xp = this.tmpl.getElementsByName('xparam');
	for (var i = 0; i < xp.length; i++) {
		var name = xp[i].getAttribute('called');
		var def = xp[i].getAttribute('default');
		var tmp = def.match(/\$([0-9])/);
		if (tmp && tmp.length > 1) 
			this.params[name] = this.stdargs[tmp[1]-1];
	}
	return;
}

jsx.prototype.read_defs = function () {
	var xd = this.tmpl.getElementsByName('xdef');
	for (var i = 0; i < xd.length; i++) {
		var called = xd[i].getAttribute('called');
		var type = xd[i].getAttribute('tag');

		if (undefined == type || type == null || type == 'null') {
			this.defs[called] = [];
			this.defs[called].notag = true;
			for (var ch = 0; ch < xd[i].childNodes.length; ch++)
				this.defs[called].push(xd[i].childNodes[ch].cloneNode(true));
		} else {
			this.defs[called] = document.createElement(type);
			this.copy_attributes(xd[i], this.defs[called]);
			this.copy_children(xd[i], this.defs[called]);
		}
	}

	while (undefined != xd[0])
		xd[0].parentNode.removeChild(xd[0]);

	for (i in this.defs) {
		var tags = this.tmpl.getElementsByName(i);
//		for (var j = 0; j < tags.length; j++) {
		while (undefined != tags[0]) {
			if (undefined != this.defs[i].notag) {
				var last = tags[0];
				for (var x = 0; x < this.defs[i].length; x++) {
					var tmpnode = this.defs[i][x].cloneNode(true);
					var called = tags[0].getAttribute('called');
					if (undefined != called && called != null)
						tmpnode.setAttribute('defcalled', called);
					last.parentNode.insertBefore(tmpnode, last.nextSibling);
				}
			} else {
				var newtag = this.defs[i].cloneNode(true);
				this.copy_attributes(tags[0], newtag);
				tags[0].parentNode.insertBefore(newtag, tags[0]);
			}
			tags[0].parentNode.removeChild(tags[0]);
		}
	}

	return;
}

jsxtemplate.prototype.read_lists = function () {
	var lists = this.tmpl.getElementsByName('xlist');
	var c = 0;
	while (undefined != lists[0]) {
		var called = lists[0].getAttribute('called');
		if (undefined == this.lists[called]) this.lists[called] = new Array();
		this.lists[called].push(new jsxlist(this, called, lists[0]));
		c++;
	}
	return c;
}

jsxtemplate.prototype.read_values = function (type) {
	var tname = 'x' + type;
	var values = this.tmpl.getElementsByName(tname);
	var c = 0;
//	for (var i=0; i < a.length; i++) {
	while (undefined != values[0]) {
		var called = values[0].getAttribute('called');
		if (undefined == this.values[called]) this.values[called] = new Array();
		this.values[called].push(new jsxvalue(this, type, called, values[0]));
		c++;
	}

	return c;
}

