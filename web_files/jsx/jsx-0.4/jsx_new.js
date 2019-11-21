function jsx(called, opts) {
	this.defs = {};
	this.containing = {};
	this.container = false;
	if (undefined == called) {
		this.action = 'load';
		return this.init();
	}
	if (!jsx.prototype.initialized) new jsx();

	this.called = called;
	this.scope = [{}];
	this.stdargs = [];

	if (!jsxutil.istype('object', opts))
		opts = jsxutil.isset(opts)?{'action':opts}:{};

	for (var i in opts) switch (i) {
		case ('action'): this.action = opts[i]; break;
		case ('container'): this.container = opts[i]; break;
		case ('stdargs'): this.load_args (opts[i], 0); break;
		case ('tmpl'): this.tmpl = opts[i]; break;
		default: this.scope[i] = opts[i];
	}

	return this.init();
}

jsx.prototype.initialized = false;
jsx.prototype.init = function () {
	switch (this.action) {
		case ('load'): return this.load_all();
		case ('build'):
			if (!jsxutil.istype('object', this.tmpl)) return false;
			return this.build();
		case ('create'): 
			if (!jsxutil.istype('object', this.container)) this.container = document.body.jsxSelf;
			if (!jsxutil.istype('object', this.container, 'containing', this.called)) return false;
			return this.create();
		default: return false;
	}
}

jsx.prototype.load_all = function () {
	this.called = 'root';
	var list = document.getElementsByName('jsx');
	document.body.jsxChildNodes = {};
	document.body.jsxSelf = this;
	var root_list = {};
	for (var i = 0; i < list.length; i++) {
		list[i].jsxChildNodes = {};
		var called = list[i].getAttribute('called');
		var last = list[i].parentNode;
		while (last.getAttribute('name') != 'jsx') {
			last = last.parentNode;
			if (last == document.body) break;
		}
		if (last == document.body) {
			document.body.jsxChildNodes[i] = list[i];
			list[i].jsxParent = this;
			list[i].jsxParentNode = document.body;
			root_list[called] = list[i];
		} else {
			list[i].jsxParentNode = last;
			last.jsxChildNodes[called] = list[i];
		}
	}

	jsx.prototype.initialized = true;

	for (i in root_list) {
		this.containing[i] = new jsx(i, {action:'build', tmpl:root_list[i] });
	}

	return;
}

jsx.prototype.create = function () {
	this.base = this.container.containing[this.called];
	this.tmpl = this.base.tmpl.cloneNode(true);
	if (this.container.called != 'root') {
		this.holder = this.container.tmpl.getElementsByClassName('jsxNode_'+this.called);
		this.holder.parentNode.replaceChild(this.tmpl, this.holder);
	}
	
	// process the data
	
	for (var i in this.base.containing)
		this.containing[i] = new jsx(i, {action:'create', container:this});

}

jsx.prototype.clone = function (container) {
	var obj = new jsx(this.called, {action:'none'});

	obj.container = container;
	obj.tmpl = this.tmpl.cloneNode(true);
	obj.holder = (this.container == document.body)?null:(obj.tmpl.getElementsByClassName('jsxNode_' + this.called))[0];

	for (var i in this.containing)
		obj.containing[i] = this.containing[i].clone(obj);

	return obj;
}

jsx.prototype.set
jsx.prototype.build = function () {
	this.holder = document.createElement('div');
	this.holder.style['display'] = 'none';
	this.holder.className = 'jsxNode_'+called;
	this.holder.jsxSkel = this;
	this.container = this.tmpl.jsxParent;
	this.tmpl.parentNode.replaceChild(this.holder, this.tmpl);
	this.tmpl.jsxSelf = this;

	if (jsxutil.istype('object', this.tmpl.jsxChildNodes)) {
		for (var i in this.tmpl.jsxChildNodes) {
			this.tmpl.jsxChildNodes[i].jsxParent = this;
			this.containing[i] = new jsx(i, {action:'build', tmpl:this.tmpl.jsxChildNodes[i]});
		}
		delete(this.tmpl.jsxChildNodes);
	}
	
	return;
}


jsx.prototype.stack_scope = function (obj) {
	if (!jsxutil.istype('object', obj, 'scope', 0)) return false;
	for (var i = 0; i < obj.scope.length; i++)
		this.scope.push(obj.scope[i]);
	return true;
}
jsx.prototype.load_args = function (args, i) {
	if (!jsx.util.isset(i)) i = 0;
	if (!jsx.util.istype('object', args)) return false;
	for (; i < args.length; i++)
		this.stdargs.push(args[i]);
	
	return true;
}
	
jsx.prototype.allocate = function () {

	this.type = '';
	this.called = '';

	return;
}
	
	parse_opts:function (opts) {
		if (!jsx.util.istype('object', opts)) return;
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
	

/************** helpers **********************/
var jsxutil = {
	isset:function () {
		if (!arguments.length) return false;
		var p = (arguments.length > 1)?jsxutil.climb_to(arguments):arguments[0];
		return (undefined == p || p == null)?false:true;
	},
	
	climb_to:function (args, i) {
		if (!jsxutil.istype('object', args) || !jsxutil.isset(args.length)) return null;
		if (!jsxutil.isset(i)) i = 0;
		var last = args[i++];
		if (!jsxutil.isset(last)) return null;
		for (; i < args.length; i++) {
			if (!jsxutil.isset(last[args[i]])) return null;
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

