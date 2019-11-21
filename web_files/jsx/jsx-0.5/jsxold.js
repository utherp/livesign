var jsx = {
	root:'jsxtemplates',
	find_skel:function (type, called, root) {
		if (!jsx.util.isset(root)) root = jsx.root;
		if (!jsx.util.isset(root)) return false;
		if (typeof(root) == 'string')
			return jsx.find_skel(type, called, document.getElementById(root));

		if (!jsx.util.istype('function', root.getJSXElements))
			root.getJSXElements = jsx.getJSXElements;

		var list = root.getJSXElements(type, called);
		if (!jsx.util.isset(list)) return false;
		return list;
	},
	getJSXElements:function(type, called, depth, last_list) {
		var found = new Array();
		if (!jsx.util.isset(type)) return false;
		if (!jsx.util.isset(called)) called = false;
	
		if (!jsx.util.isset(depth)) depth = 0;
		var newlist = new Array();
		if (jsx.util.isset(last_list)) {
			for (var i = 0; i < last_list.length; i++) {
				if (!jsx.util.isset(last_list[i].attributes)) continue;
				for (var j = 0; j < last_list[i].childNodes.length; j++)
					newlist.push(last_list[i].childNodes[j]);
			}
		} else newlist.push(this);
	
		for (i = 0; i < newlist.length; i++)
			if (jsx.util.istype('function', newlist[i], 'getAttribute') && newlist[i].getAttribute('jsx') == type)
				if (called != false && newlist[i].getAttribute('called') != called) continue;
				else found.push(newlist[i]);
	
		if (!found.length) 
			return this.getJSXElements(type, called, depth+1, newlist);
	
		found.depth = depth;
		return found;
	},
	stack_scope:function (obj) {
		if (!jsx.util.istype('object', obj, 'scope', 0)) return false;
		for (var i = 0; i < obj.scope.length; i++)
			this.scope.push(obj.scope[i]);
		return true;
	},
	load:function (from_obj) { },
	make:{
		def:function (called, uopts) {
			var opts;
			var args = [];
			if (jsx.util.istype('object', uopts)) {
				opts = uopts;
				uopts = false;
			} else opts = {};
			opts.action = 'make';

			if (jsx.util.isset(uopts)) args.push(uopts);
			for (var i = 2; i < arguments.length; i++) args.push(arguments[i]);
			if (args.length) opts.stdargs = args;

			return new jsxdef(called, opts);
		}
	},
	skels:{
		def:{},
		list:{},
		value:{}
	},
	all:{
		instances:{
			def:{},
			list:{},
			value:{}
		}
	}
}

function jsxdef (called, opts) {
	this.called = called;
	this.type = 'def';


	return;
}


jsxdef.prototype = {
	make_self:function () {
		this.self = {
			scope:this.scope,
			stdargs:this.stdargs,
			called:this.called,
			type:this.type
		}
		return;
	},

	load_args:function (args, i) {
		if (!jsx.util.isset(i)) i = 0;
		if (!jsx.util.istype('object', args)) return false;
		for (; i < args.length; i++)
			this.stdargs.push(args[i]);
	
		return true;
	},
	
	allocate:function () {
		this.scope = [{}];
		this.stdargs = [];
	
		this.type = '';
		this.called = '';
	
		this.containing = {};
		this.container = null;
		this.skels = {};
		this.base = null;
	
		this.disposition = null;
		return;
	},
	
	parse_opts:function (opts) {
		if (!this.util.istype('object', opts)) return;
		for (var i in opts) {
			switch (i) {
				case('jsxcontainer'): this.container = opts[i]; break;
				case('jsxtemplate'): this.tmpl = opts[i]; break;
				case('action'): this.disposition = opts[i];	break;
				case('stdargs'):
					if (typeof(opts[i]) == 'object') {
						for (var j = 0; j < opts[i].length; j++)
							this.stdargs.push(opts[i][j]);
						break;
					}
				default: this.scope[0][i] = opts[i];
			}
		}
		return;
	},
	
	load_skels:function () {
		this.tmpl = this.find_skel(this.called);
		if (this.tmpl == false) {
			this.error = "Failed loading jsx def '"+this.called+"': def not found!";
			this.disposition = 'error';
			return false;
		}
		if (undefined != this.tmpl.length) 
			this.tmpl = this.tmpl[0];
	
		return true;
	},
	
	validate:function () {
		if (!jsx.util.isset(this.disposition)) this.disposition = 'error';
		switch (this.disposition) {
			case('load'): 
				if (jsx.util.isset(this.tmpl)) break;
				if (this.load_skel()) {
					if (jsx.util.istype('object', this, 'container', 'skels')) this.container.skels[this.called] = this;
					else jsx.skels.def[this.called] = this;
					this.disposition = 'ready';
					break;
				}
				return false;
			case('make'):
				if (this.use_base()) break;
				return false;
			default:
				this.disposition = 'error';
				this.error = "No action specified for jsx def '"+this.called+"'!";
				return false;
		}
		return true;
	},
	
	/* load? 
	 	jsx.skels.def[called] = this;
		this.tmpl.parentNode.removeChild(this.tmpl);
	*/
	
	find_base:function () {
		if (jsx.util.istype('object', this, 'container', 'skels', this.called))
			return this.use_base(this.container.skels[this.called]);
	
		if (jsx.util.istype('object', jsx, 'skels', 'def', this.called))
			return this.use_base(jsx.skels.def[this.called]);
		
		this.base = new jsxdef(this.called, {'action':'load', 'jsxcontainer':this.container, 'stdargs':this.stdargs});
	
		if (jsx.util.getval(this.base, 'disposition') == 'ready') 
			return this.use_base();
		
		this.error = "Failed making from jsx def '"+this.called+"': Load failed: '"+this.base.error+"'!";
		this.disposition = 'error';
		this.base = null;
	
		return false;
	},

	use_base:function (skel) {
		if (jsx.util.isset(skel)) this.base = skel;
		if (!jsx.util.istype('function', this.base, 'tmpl', 'cloneNode') && !this.find_base()) return false;
	
		this.tmpl = this.base.tmpl.cloneNode(true);
		this.stack_scope(this.base);
	
		return true;
	},
	stack_scope:jsx.stack_scope
}

/************** helpers **********************/
jsx.util = {
	isset:function () {
		if (!arguments.length) return false;
		var p = (arguments.length > 1)?climb_to(arguments):arguments[0];
		return (undefined == p || p == null)?false:true;
	},
	
	climb_to:function (args, i) {
		if (!jsx.util.istype('object', args) || !jsx.util.isset(args.length)) return null;
		if (!jsx.util.isset(i)) i = 0;
		var last = args[i++];
		if (!jsx.util.isset(last)) return null;
		for (; i < args.length; i++) {
			if (!jsx.util.isset(last[args[i]])) return null;
			last = last[args[i]];
		}
		return last;
	},
	
	getval:function () {
		if (!arguments.length) return null;
		return (arguments.length == 1)?arguments[0]:climb_to(arguments);
	},
	
	istype:function (type) {
		var p = (arguments.length > 2)?climb_to(arguments, 1):arguments[1];
		return (typeof(p) == type && p != null)?true:false;
	}
}	

