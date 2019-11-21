function jsxList (container, called, obj) {
	this.jsx_container = container;
	this.scope = {};
	this.scope.called = called;
	this.scope.tag = obj.getAttribute('tag');
	this.scope.target = obj.getAttribute('target');

	this.obj = obj;
	this.find_target();

	this.scope.default = obj.getAttribute('default');
	this.scope.assign = obj.getAttribute('assign');
	if (undefined == this.scope.assign || this.scope.assign == null) this.scope.assign = [];
	if (this.scope.assign.indexOf('#!') == 0) this.scope.assign = this.jsx_container.shebang(this.scope.assign, this.scope);
	if (typeof(this.scope.assign) != 'object') this.scope.assign = [this.scope.assign];

	this.scope.count = 0;
	this.base_obj = document.createElement('a');

	this.scope.targetNode.appendChild(this.base_obj);
	this.last = this.base_obj;

	this.obj = document.createElement(this.scope.tag);
	this.jsx_container.copy_attributes(obj, this.obj);

	obj.parentNode.removeChild(obj);
	return;
}

jsxList.prototype.set = function (values) {
	var list = values;
	if (undefined == list) list = this.scope.default;
	if (list.indexOf('#!') == 0) list = this.jsx_container.shebang(list.substring(2), this.scope);
	if (undefined == list || list == null) return;
	if (typeof(list) != 'object') list = [list];

	this.clear();
	
	for (var i = 0; i < list.length; i++)
		this.push(list[i]);
	
	return;
}

jsxList.prototype.push = function (params) {
	var p = params;
	if (p.indexOf('#!') == 0) p = this.jsx_container.shebang(p, this.scope);
	if (typeof(p) != 'object') p = [p];
	var node = this.obj.cloneNode(this.obj);
	
	for (var i = 0; i < this.scope.assign.length; i++) {
		if (undefined == p[i]) break;
		var v = p[i];
		if (v.indexOf('#!') == 0) v = this.jsx_container.shebang(v, this.scope);
		node.setAttribute(this.scope.assign[i], v);
	}

	this.last.parentNode.insertBefore(node, this.last.nextSibling);
	this.scope.count++;

	return;
}

jsxList.prototype.remove = function (index) {
	if (undefined == index || index > this.count)
		return this.pop();

	if (index == 0) return false;

	var o = this.base_obj;

	var i = index;
	while (i-- && o.nextSibling != null) o = o.nextSibling;
	if (i) return false;

	o.parentNode.removeChild(o);
	this.scope.count--;

	return this.scope.count;

}

jsxList.prototype.pop = function () {
	if (!this.scope.count) return 0;
	this.last.parentNode.removeChild(last);
	this.scope.count--;
	return this.scope.count;
}

jsxList.prototype.clear = function () {
	while (this.scope.count) this.pop();
	return 0;
}

jsxList.prototype.find_target = function (obj) {
	if (undefined == obj) obj = this.obj;
	if (undefined == this.scope.target || this.scope.target == null) this.scope.target = 'self';
	if (undefined == this.scope.target_type) {
		if (this.scope.target.indexOf(':') == -1) this.scope.target_type = -1;
		else {
			this.scope.target_type = this.scope.target.substring(this.scope.target.indexOf(':')+1).toUpperCase();
			this.scope.target = this.scope.target.substring(0, this.scope.target.indexOf(':'));
		}
	}
		
	var t;

	if (this.scope.target == 'parent') t = obj.parentNode;
	else if (this.scope.target == 'next') t = obj.nextSibling;
	else if (this.scope.target == 'previous') t = obj.previousSibling;
	else t = obj;

	if (t == obj || this.scope.target_type == -1 || t.nodeName == this.scope.target_type) {
		this.scope.targetNode = t;
		return;
	}

	this.find_target(t);
	return;
}


