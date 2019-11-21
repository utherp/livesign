function jsxvalue(container, type, called, obj) {
	this.jsx_container = container;
	this.last = undefined;
	this.obj = document.createElement('a');
	obj.parentNode.insertBefore(this.obj, obj);
	obj.parentNode.removeChild(obj);
	this.scope = {};

	this.scope.targetNode = undefined;
	this.scope.target = obj.getAttribute('target');

	this.scope.type = type;
	this.scope.defcalled = obj.getAttribute('defcalled');
	if (this.scope.defcalled == null) delete(this.scope.defcalled);
	this.scope.name = obj.getAttribute('name');
	this.scope.default = obj.getAttribute('default');

	this.scope.called = (called.indexOf('#!') == 0)?this.jsx_container.shebang(called.substring(2), this.scope):called;

	this.events = {};

	var tmp = obj.getAttribute('onAssign');
	if (tmp != null) this.events['assign'] = tmp;

	if (undefined == this.scope.target)
		if (this.scope.type == 'attr') this.scope.target = 'parent';
		else if (this.scope.type == 'value') this.scope.target = 'self';

	/*
	if (typeof(events) != 'object') {
		this.events = {};
		if (typeof(events) == 'string' || typeof(events) == 'function')
			this.events.all = events;
		return;
	}
	*/

	return;
}

jsxvalue.prototype.find_target = function (obj) {
	if (undefined == obj) obj = this.obj;
	if (undefined == this.scope.target_type) {
		if (this.scope.target.indexOf(':') == -1) this.scope.target_type = -1;
		else {
			this.scope.target_type = this.scope.target.substring(this.scope.target.indexOf(':')+1).toUpperCase();
			this.scope.target = this.scope.target.substring(0, this.scope.target.indexOf(':'));
		}
	}

	if (this.scope.target.indexOf('id=') == 0)
		t = document.getElementById(this.scope.target.substring(3));
		
	var t;

	if (this.scope.target == 'parent') t = obj.parentNode;
	else if (this.scope.target == 'next') t = obj.nextSibling;
	else if (this.scope.target == 'previous') t = obj.previousSibling;
	else if (this.scope.target == 'id') {
		this.scope.targetNode = document.getElementById(this.scope.target_type);
		return ;
	} else t = obj;

	if (t == obj || this.scope.target_type == -1 || t.nodeName == this.scope.target_type) {
		this.scope.targetNode = t;
		return;
	}

	this.find_target(t);
	return;
}

jsxvalue.prototype.set = function (value) {
	if (this.scope.type == 'attr') return this.set_attr(value);
	if (this.scope.type == 'value') return this.set_value(value);
	return false;
}

jsxvalue.prototype.set_attr = function (value) {
	if (this.scope.type != 'attr') return false;
	var val = value;
	if (undefined == this.scope.targetNode) this.find_target();

	if (undefined == val) val = this.scope.default;
	if (undefined == val) return false;

	if (val.indexOf('#!') == 0)
		val = this.jsx_container.shebang(val.substring(2), this.scope);
	
	val = this.callEvent('assign', val);
	this.scope.targetNode.setAttribute(this.scope.name, val);

	return true;
}

jsxvalue.prototype.set_value = function (value) {
	if (this.scope.type != 'value') return false;
	var txt = document.createTextNode(value);

	var val = value;
	if (undefined == this.scope.targetNode)
		this.find_target();

	if (undefined == val) val = this.scope.default;
	if (undefined == val) return false;

	if (val.indexOf('#!') == 0)
		val = this.jsx_container.shebang(val.substring(2), this.scope);
	
	val = this.callEvent('assign', val);

	var txt = document.createTextNode(val);

	if (undefined != this.last) {
		this.last.parentNode.replaceChild(txt, this.last);
		this.last = txt;
		return true;
	}

	if (this.scope.target == 'self')
		this.scope.targetNode.parentNode.insertBefore(txt, this.obj.nextSibling);
	else
		this.scope.targetNode.appendChild(txt);

	this.last = txt;

	return true;	
}

jsxvalue.prototype.callEvent = function (name, value) {
	if (undefined == this.events[name]) return value;
	if (typeof(this.events[name]) == 'string')
		return eval(this.events[name] + '("' + value + '");');

	if (typeof(this.events[name] == 'function'))
		return this.events[name](value);
	
	return value;
}

