jsx.prototype.catagory = 0;
jsx._version = "0.3.0";

(function () {

var jsxStr,
	modules,
	window = document.window = this,
	undefined,
	/** Borrowed from JQuery v1.3.2 **/
	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/,
	isHtml = /<(.*)>/,
	

	srcType = function (src) {
		if (typeof(src) === 'string') {
			if (src.search(isHtml)) {


	jsx = function (src) {
		var tmp, undefined;
		tmp = modules;
		var modules = tmp;
		tmp = quickExpr;
		var 
			win = window,
			dt = desktop,
			qe

		var $_ = { 'stdargs':[] };

		if (

		for (var i = 1; i < arguments.length; i++)	\
			$_.stdargs[] = arguments[i];	\
		
		var src = src;

var jsxStr = "function (src) { \
	/* stack jsx scopes ($_ => $1_, $1_ => $2_, ect ect..) */ \
	var scopestr = ''; \
	for (var i = 1; eval('undefined != $'+i+'_'); i++)	\
		scopestr == 'var $'+(i+1)+'_ = $'+i+"_;\n" + scopestr; \
	eval(scopestr);		\
\
	var $1_ = $_;	\
	var $_ = {		\
		'stdargs':[]	\
	};	\
\
	// import argument list	\
	for (var i = 1; i < arguments.length; i++)	\
		$_.stdargs[] = arguments[i];	\
\
	return eval(jsxStr);	\
\
}\n";

function jsx (called, opts) {
	if (!this.util.isset(called)) called = '';

	this.allocate();
	this.self.called = called;

	this.parse_opts(opts);
	this.stack_args(arguments, 2);

	if (called == '') return this.lib_init();

	this.make_actions();
	this.stack_params();
	this.parse_params();

	this.stack_scope(this.container);
	this.parse_events();
//	this.self.params = this.params;
	this.init();

	this.reference_instance();

	this.call_event('whenCreate');

	this.parse_children();

	this.render();

	return;
}

jsx.prototype.getBody = function () { return this.tmpl; }
jsx.prototype.getCatagory = function () { return this.catagory; }

jsx.prototype.lib_init = function () {
	this.self.called = 'root';
	this.container = null;
	this.tmpl = document.body;
	this.locate_templates();
	jsx.prototype.jsxBase = this;
	return;
}

jsx.prototype.reference_instance = function () {
	var par = this.ourParent();
	if (par == this) {
		this.instances = {};
		return;
	}
	
	var prev = this.container;
	if (this.util.isset(prev, 'self', 'called') && prev.self.called == this.self.called && prev.self.type == 'list') return;
	while (prev.container != null) {
		var called = this.self.called;
		if (called.indexOf('#!') == 0)
			called = this.shebang(called);
		if (!this.util.isset(prev, 'instances')) prev.instances = {};
		if (!this.util.isset(prev, 'instances', called, length))
			prev.instances[called] = new Array();
//			this.util.setVal(prev, 'instances', this.self.called, new Array());
		prev.instances[called].push(this);
		prev = prev.container;
	}
	return;
}

jsx.prototype.ourParent = function () {
	var obj = this;
	while (this.util.istype('object', obj, 'container', 'container')) obj = obj.container;
	return obj;
}

jsx.prototype.attach = function (elem) {
	elem.appendChild(this.tmpl);
	this.call_event('whenAttach');
	for (var i in this.instances) for (var j in this.instances[i])
		if (undefined != i && undefined != j ) this.instances[i][j].call_event('whenAttach');
	return true;
}

jsx.prototype.toString = function () {
	if (undefined == this.tmpl) return '';
	this.attach(document.body); //.appendChild(this.tmpl);
	return '';
}

jsx.prototype.refresh = function (levels, lists) {
	if (this.util.isset(levels) && levels > 0 && this.util.istype('object', this, 'container', 'container'))
		return this.container.refresh(levels-1, lists);

//	if (this.in_group(groups)) {
		this.stack_params();
		this.parse_params();
		if (this.type != 'def') { //this.type == 'value' || this.type == 'slice') {
			this.get_default();
			this.set_value();
		} else
			this.markup_attributes();
//	}

	if (this.containing == null) return;
	for (var i in this.containing) 
		if (undefined != i) this.containing[i].refresh(0, lists);

	return;
}
/*
jsx.prototype.in_group = function (groups) {
	if (!this.util.isset(groups) || groups == 'all') return true;
	var glist = groups.split(',');
	for (var i = 0; i < glist.length; i++) 
		if (undefined != this.refreshGroups[glist[i]] && this.refreshGroups[glist[i]]) 
			return true;
	
	return false;
}
*/
jsx.prototype.read_params = function () {
	this.paramDefs = {};
	if (!this.tmpl) return;
	var params = this.tmpl.getAttribute('jsxParams');
	if (params == null) return;

	this.tmpl.removeAttribute('jsxParams');
	var list = params.split(',');
	for (var l = 0; l < list.length; l++) {
		this.paramDefs[list[l]] = this.tmpl.getAttribute('jsxParam_'+list[l]);
		this.tmpl.removeAttribute('jsxParam_'+list[l]);
	}
	return;
}

jsx.prototype.parse_params = function () {
	if (undefined == this.paramDefs) this.read_params();
	for (var p in this.paramDefs) {
		if (this.paramDefs[p].indexOf('$') == 0) {
			var tmp = this.paramDefs[p].substring(1);
			if (undefined != this.self.stdargs[tmp]) {
				this.self.params[p] = this.self.stdargs[tmp];
				continue;
			}
		} else if (this.paramDefs[p].indexOf('#!') == 0) {
			this.self.params[p] = this.shebang(this.paramDefs[p]);
			continue;
		}
		this.self.params[p] = this.paramDefs[p]; 
	}

	return;
}

jsx.prototype.stack_params = function () {
	if (!this.util.istype('object', this.container, 'self', 'params')) return;
	for (var i in this.container.self.params)
		this.self.params[i] = this.container.self.params[i];

	this.self.node = this.tmpl;
	if (undefined == this.self.params.topNode)
		this.self.params.topNode = this.tmpl;


	return;
}



jsx.prototype.parse_events = function (eventNames) {
	if (!this.util.isset(eventNames)) eventNames = ['whenAssign', 'whenCreate', 'whenRefresh', 'whenAttach'];
	if (!this.util.istype('object', eventNames)) eventNames = [eventNames];
	if (!this.util.istype('object', this.events)) this.events = {};

	for (var i = 0; i < eventNames.length; i++) {
		var val = this.tmpl.getAttribute(eventNames[i]);
		if (val == null) continue;
		this.events[eventNames[i]] = val;
	}
	return;
}

jsx.prototype.call_event = function() {
	var ret = false;
	var i = 0;
	while (ret == false) {
		if (i == arguments.length) return false;
		var name = arguments[i];
		if (undefined != this.events[name]) 
			ret = this.shebang(this.events[name]);
		i++;
	}
	return ret;
}

jsx.prototype.make = function (called, opts) {
	if (!this.util.istype('object', this.root[called])) return false;
	if (!this.root[called].length) return false;
	var tmpl = this.root[called][0].cloneNode(true);
	tmpl.jsxChildren = this.root[called][0].jsxChildren;
	if (!this.util.istype('object', opts)) opts = {};
	opts.tmpl = tmpl;
	opts.container = this;
	if (arguments.length > 2) {
		opts.stdargs = new Array();
		for (var i = 2; i < arguments.length; i++) opts.stdargs.push(arguments[i]);
	}

	return new jsx(called, opts);
}

jsx.prototype.render = function () {
	if (!this.util.isset(this, 'tmpl', 'setAttribute')) return;
	this.markup_attributes();
	if (this.containing != null) for (var i in this.containing) {
		if (undefined == i) continue;
		this.containing[i].render();
		if (i.indexOf('#!') == 0) {
			var tmp = this.containing[i];
			var newname = tmp.shebang(i);
			delete(this.containing[i]);
			this.containing[newname] = tmp;
		}
	}
//		else if (this.util.isset(this.containing[i], 'type') && this.containing[i].type == 'list') 
//			this.render_list(i);
//		else
//			this.containing[i] = new jsx(i, {container:this, tmpl:this.containing[i]});

//	if (this.type == 'value') 
	this.set_value();
	return;
}

jsx.prototype.init = function () {
	this.type = this.tmpl.getAttribute('jsxtype');
	this.catagory = this.tmpl.getAttribute('jsxCatagory');
	if (this.catagory == undefined || this.catagory == null)
		this.catagory = this.self.called;
/*
	var groups = this.tmpl.getAttribute('jsxRefreshGroup');
	if (groups != null) {
		var list = groups.split(',');
		for (var i = 0; i < list.length; i++)
			this.refreshGroups[list[i]] = true;
	}
*/
	if (this.type == null) this.type = 'null';

	this.get_default();

	return;
}

jsx.prototype.get_default = function () {
	if (!this.util.isset(this, 'def'))
		this.def = this.tmpl.getAttribute('jsxDefault');
	
	var def = this.def;

	if (def == null) return;

	if (def.indexOf('#!') == 0) def = this.shebang(def);
	this.self.value = def;

	return;
}

jsx.prototype.getInstancesByName = function(called) {
	if (!this.util.istype('object', this.instances, called)) return null;
	return this.instances[called];
}

jsx.prototype.set_value = function () {
	this.call_event('whenAssign');

	var val = this.self.value;

	if (this.type == 'value') {
		if (!this.util.isset(this.self, 'value', 'nodeType') || this.self.value.nodeType != 1)
			val = document.createTextNode(val);
		this.tmpl.parentNode.replaceChild(val, this.tmpl);
		this.tmpl = val;
	} else if (undefined != this.tmpl.value) { //this.tmpl.nodeName == 'INPUT')
		5+5;
		this.tmpl.value = this.self.value;
	}

	return;
}

jsx.prototype.markup_attributes = function () {
	if (undefined == this.activeAttributes) this.get_active_attributes();
	for (var i in this.activeAttributes)
		if (i.indexOf('on') == 0) {
			this.tmpl.removeAttribute(i);
			this.tmpl[i] = this.shebang(this.activeAttributes[i]);
		} else
			this.tmpl.setAttribute(i, this.shebang(this.activeAttributes[i]));
	
	return;
}

jsx.prototype.get_active_attributes = function () {
	this.activeAttributes = {};
	for (var i = 0; i < this.tmpl.attributes.length; i++) {
		var n = this.tmpl.attributes[i].name;
		var v = this.tmpl.attributes[i].value;
		if ((v.indexOf('#!') == 0) && !this.static_attribute(n)) {
			if (n.indexOf('on') == 0) n = n.toLowerCase();
			this.activeAttributes[n] = v;
		}
	}
	return;
}

jsx.prototype.static_attribute = function (attr) {
	var name = attr.toLowerCase();
	if (name.indexOf('when') == 0) return true;
	if (name == 'jsxdefault') return true;
	if (name == 'jsxtype') return true;
	if (name == 'jsxchildren') return true;
	if (name == 'jsxrefreshgroup') return true;
	return false;
}

jsx.prototype.shebang = function (cmd) {
	var scope = this.scope;
	var self = this.self;
	if (cmd.indexOf('#!') == 0) cmd = cmd.substring(2);
	return eval(cmd);
}

jsx.prototype.getJSXElements = function () {
	var browser=navigator.appName;
	if (browser.indexOf('Internet Explorer') != -1) return this.getElementsByName_iesux('jsx');
	return document.getElementsByName('jsx');
}

jsx.prototype.getElementsByName_iesux = function (name) {
	var elems = document.getElementsByTagName('*');
	var res = []
	for(var i=0;i<elems.length;i++) {
		att = elems[i].getAttribute('name');
		if (att == name) res.push(elems[i]);
	}
	return res;
}

jsx.prototype.locate_templates = function () {
	var list = this.getJSXElements();
	for (var i = 0; i < list.length; i++) {
		if (this.util.isset(list[i], 'jsxFound')) continue;
		var name = list[i].getAttribute('called');
		var last = list[i].parentNode;
		var prev = list[i];
		var path = [];
		do {
			var j = 0;
			for (var tmp = last.childNodes[0]; tmp != prev && tmp != null; j++, tmp = tmp.nextSibling);
			if (tmp == null) {
				alert('failed climbing up to container!');
				break;
			}
			path.unshift(j);

			var lname = last.getAttribute('name');
			if (lname == 'jsx') {
				var tmp = path[0];
				for (var x = 1;  x < path.length; x++) tmp += '.'+path[x];
				tmp += ';';
				var ch = last.getAttribute('jsxChildren');
				if (ch == null) ch = '';
				ch += tmp;
				last.setAttribute('jsxChildren', ch);
				list[i].jsxFound = true;
				break;
			}
			prev = last;
			last = last.parentNode;
		} while (last != document.body);
		if (this.util.isset(list[i], 'jsxFound')) continue;
		if (!this.util.istype('object', this.skels, name)) this.skels[name] = new Array();
		this.skels[name].push(list[i]);
	}
	return;
}

jsx.prototype.split_children_list = function () {
	this.jsxChildren = new Array();
	var ch = this.tmpl.getAttribute('jsxChildren');
	if (ch == null) return;
	var list = ch.split(';');
	for (var i = 0; i < list.length; i++) {
		if (list[i] == '') continue;
		this.jsxChildren.push(list[i].split('.'));
	}
	return;
}

jsx.prototype.parse_children = function () {
	var found = {};
	this.split_children_list();
	for (var i = 0; i < this.jsxChildren.length; i++) {
//		if (this.util.isset('object', found[i])) continue;
		var target = this.tmpl;
		for (var j = 0; target != null && j < this.jsxChildren[i].length; j++) {
			if (!this.util.istype('object', target.childNodes, this.jsxChildren[i][j])) target = null
				else target = target.childNodes[this.jsxChildren[i][j]];
		}

		if (target != null) {
			var name = target.getAttribute('called');
			found[name] = target;
		}
	}

	for (i in found) {
		if (undefined == i) break;
		if (this.containing == null) this.containing = {};
		var type = found[i].getAttribute('jsxtype');
		if (type == null) {
			found[i].setAttribute('jsxtype', 'null');
			type = 'value';
		}

		var targetName = found[i].getAttribute('targetName');
		if (targetName == null) found[i].removeAttribute('name');
		else found[i].setAttribute('name', targetName);

		if (type == 'def')
			this.skels[i] = found[i];

		else if (type == 'list') {
			found[i].style['display'] = 'none';
			this.containing[i] = new jsxList(i, {'tmpl':found[i], 'container':this});
		} else
			this.containing[i] = new jsx(i, {container:this, tmpl:found[i]});
	}

	var c = 0;
	for (i in this.containing) if (undefined != i) c++;
	if (!c) this.containing = null;
	return;
}

jsx.prototype.parse_opts = function (opts) {
	if (!this.util.istype('object', opts))
		opts = (!this.util.isset(opts))?{}:{'stdargs':new Array(opts)};

	if (!this.util.isset(opts.container))
		opts.container = jsx.prototype.jsxBase;

	for (var i in opts) switch (i) {
		case('container'): this.container = opts[i]; break;
		case('tmpl'): 
			this.tmpl = opts[i];
			this.tmpl.self = this.self;
			this.tmpl.scope = this.scope;
			break;
		case('stdargs'): this.stack_args(opts[i]); break;
		default: this.scope[0][i] = opts[i];
	}

	if (this.self.called == '') return true;
	
	return this.validate_tmpl();
}

jsx.prototype.validate_tmpl = function () {
	if (this.util.istype('object', this.tmpl)) return true;
	
	var prev = this;
	while (!this.util.isset(prev, 'skels', this.self.called, this.catagory))
		if (prev.container == null) return false;
		else prev = prev.container;
	
	this.tmpl = prev.skels[this.self.called][this.catagory].cloneNode(true);
	this.tmpl.jsxChildren = prev.skels[this.self.called][this.catagory].jsxChildren;
	return true;
}

jsx.prototype.stack_scope = function (obj) {
	if (!this.util.istype('object', obj, 'scope', 0)) return false;
	for (var i = 0; i < obj.scope.length; i++)
		this.scope.push(obj.scope[i]);

	if (!this.util.istype('object', obj.scope, 'last'))
		this.scope.last = this.scope[0];
	else {
		this.scope.last = {};
		for (i in this.scope[0]) this.scope.last[i] = this.scope[0][i];
		for (i in obj.scope.last) this.scope.last[i] = obj.scope.last[i];
	}
	return true;
}

jsx.prototype.stack_args = function (args, i) {
	if (!this.util.istype('object', args)) return false;
	if (!this.util.isset(i)) i = 0;
	for (; i < args.length; i++)
		this.self.stdargs.push(args[i]);

	return true;
}

jsx.prototype.make_actions = function () {
	var tmp = this;
	this.self.actions = {
		'set':function (value) { return tmp.set_value(value); },
		'refresh':function (levels, lists) { return tmp.refresh(levels, lists); }
	};

	return;
}


jsx.prototype.destroy = function () {
	this.delete_list(this.scope);
	this.delete_list(this.stdargs);
	this.delete_list(this.params);
	this.delete_list(this.refreshGroups);
//	while(this.scope.length) this.scope.shift();
//	while(this.stdargs.length) this.stdargs.shift();
//	for (var i in this.params) delete(this.params[i]);
	this.delete_list(this.skels);

	this.destroy_children();

	this.remove_node();
	this.delete_list(this.paramDefs);
	this.delete_list(this.activeAttributes);
	return;
}

jsx.prototype.remove_node = function () {
	if (!this.util.istype('object', this.tmpl)) return;

	if (this.util.istype('object', this.tmpl, 'self'))
		this.tmpl.self = undefined;;

	if (this.util.istype('object', this.tmpl, 'parentNode'))
		this.tmpl.parentNode.removeChild(this.tmpl);
	
	delete(this.tmpl);
	return;

}


jsx.prototype.delete_list = function (obj) {
	if (!this.util.istype('object', obj)) return;
	if (undefined != obj.length)
		while(obj.length) obj.shift();
	for (var i in obj) delete(obj[i]);

	return;
}


jsx.prototype.destroy_children = function (name) {
	var list;
	switch (typeof(name)) {
		case ('string'):
		case ('number'):
			return this.destroy_child(name);
		case ('object'):
			if (name != null) {
				if (undefined != name.length) list = name;
				list = new Array();
				for (var i in name) list.push(name[i]);
				break;
			}
		case ('undefined'):
		case ('null'):
		default:
			list = new Array();
			for (var i in this.containing) list.push(i);
			break;
	}
	
	while (list.length) this.destroy_child(list.shift());
	
	return;
}
	
jsx.prototype.destroy_child = function (name) {
	if (!this.util.istype('object', this.containing[name])) return; 
/*
	if (undefined != this.containing[name].length) {
		for (var j = 0; j < this.containing[name].length; j++) 
			this.containing[name][j].destroy();

		while (this.containing[name].length) this.containing[name].shift();
		if (this.util.isset(this.containing, name, 'skel')) delete(this.containing[name].skel);
	} else 
*/
		this.containing[name].destroy();

	delete(this.containing[name]);
	return;
}

jsx.prototype.allocate = function () {
	this.scope = new Array();

	this.self = {
		'stdargs':new Array(),
		'type':'',
		'called':'',
		'params':{},
		'util':this.util
	};

	this.scope.push(this.self);

	this.containing = null;
	this.container = null;
	this.skels = {};
	this.base = null;
	return;
}

jsx.prototype.util = {
	isset:function () {
		if (!arguments.length) return false;
		var p;
		with (jsx.prototype.util) 
			p = (arguments.length > 1)?climb_to(arguments):arguments[0];
		return (undefined == p || p == null)?false:true;
	},
	
	climb_to:function (args, i, create, asWhat) {
		if (undefined == create) create = null;
		if (undefined == asWhat || asWhat == null) asWhat = false;
		with (jsx.prototype.util) {
			if (!istype('object', args) || !isset(args.length)) return null;
			if (!isset(i)) i = 0;
			var last = args[i++];
			if (!isset(last)) return null;
			for (; i < args.length; i++) {
				if (!isset(last[args[i]]))
					if (create == null) return null;
					else last[args[i]] = (asWhat==false)?{}:eval('new '+asWhat);
				last = last[args[i]];
			}
			return last;
		}
	},

	setVal:function () {
		var tmp = new Array();
		for (var i = 0; i < arguments.length; i++) tmp.push(arguments[i]);
		var value = tmp[tmp.length];
		var lastVal = tmp.pop();
		if (!tmp.length) return;
		var last;
		with (jsx.prototype.util) 
			last = (tmp.length == 1)?tmp[0]:climb_to(tmp, 0, true, false);
		last[lastVal] = value;
		return value;
	},

	getVal:function () {
		if (!arguments.length) return null;
		with (jsx.prototype.util) 
			return (arguments.length == 1)?arguments[0]:climb_to(arguments);
	},
	
	istype:function (type) {
		var p;
		with (jsx.prototype.util) 
			p = (arguments.length > 2)?climb_to(arguments, 1):arguments[1];
		return (typeof(p) == type && p != null)?true:false;
	}
}	

