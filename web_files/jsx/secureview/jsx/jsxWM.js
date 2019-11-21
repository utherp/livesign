jsxWM.prototype.active = {
	focused:null,
	moving:null,
	resizing:null,
	over:null
};

jsxWM.prototype.util = jsx.prototype.util;

function jsxWM (node, controller) {
	this.node = node;
	this.node.inherit = this.inherit;
	this.node.inherit(jsxPosCtrl);
	this.node.pos_types = {'x':'left','y':'top','z':'zIndex'};

	this.controller = controller;
	this.type = controller.getType();
	if (undefined == this.byType[this.type]) this.byType[this.type] = new Array(this);
	else this.byType[this.type].push(this);

	this.winID = this.allWindows.length;
	this.allWindows.push(this);

	this.skin_path = './skins/default';
	this.skin_ext = '.jpg';

	this.dragbars = new Array();
	this.resizeBars = new Array();

	this.node.save_pos('init');
	this.pos = {};
	for (var i in this.default_pos) {
		if (this.util.isset(controller, 'pos', i))
			this.pos[i] = controller.pos[i];
		else
			this.pos[i] = this.default_pos[i];
	}

	this.node.set_pos(this.pos);
	this.node.jsxWin = this;
	this.make_frame();

	return;
}
jsxWM.prototype.default_pos = {
	'x':100,
	'y':50,
	'z':100,
	'w':300,
	'h':200
};

jsxWM.prototype.inherit = function (namespace) {
	switch (typeof(namespace)) {
		case ('function'):
			if (undefined == namespace.prototype || namespace.prototype == null)
				return false;
			namespace = namespace.prototype;
			break;
		case ('object'):break;
		default: return false;
	}
	
	for (var i in namespace)
		this[i] = namespace[i];

	return true;
}

jsxWM.prototype.make_frame = function () {
	if (null == this.node.parentNode) {
		var obj = this;
		return setTimeout(function () { obj.make_frame(); }, 500);
	}

	this.node_frame = document.createElement('div');
	this.node_frame.className = 'jsxWMFrame';
	this.node_frame.inherit = this.inherit;
	this.node_frame.inherit(jsxPosCtrl);

	this.set_pos(this.get_pos());
	var obj = this;
	this.node_frame.onmousein = function () { return obj.set_over(); }
	this.node_frame.onmouseout = function () { return obj.set_out(); }

	this.node.parentNode.appendChild(this.node_frame);
	return true;
}

jsxWM.prototype.set_over = function () {
	if (undefined != this.active.over) this.active.over.set_out();
	this.active.over = this;
	return true;
}

jsxWM.prototype.set_out = function () {
	if (this.active.over == this) this.active.over = null;
	return true;
}

jsxWM.prototype.set_pos = function (pos, types) {
	var t = this.get_types(types);
	if (undefined != this.body && t.body != '') this.body.set_pos(pos, t.body);
	if (t.node == '' || undefined == this.node) return;
	this.node.set_pos(pos, t.node);
	
	if (undefined == this.node_frame) return;
	if (undefined == t.node.z) return;

	pos.z += 10000;
	this.node_frame.set_pos(pos, t.node);
	return;
}

jsxWM.prototype.restore_pos = function (name, types) {
	this.node.restore_pos(name, types);
	this.body.restore_pos(name, types);
	this.node_frame.restore_pos(name, types);
	return;
}

jsxWM.prototype.save_pos = function (name, types) {
	var t = this.get_types(types);
	this.node.save_pos(name, t.node);
	this.node_frame.save_pos(name, t.node);
	this.body.save_pos(name, t.body);
	return;
}

jsxWM.prototype.get_types = function (types) {
	if (undefined == types || types == null)
		types = 'xyzhw'.split('');
	if  (typeof(types) != 'object') types = types.split('');

	var t = {'node':'','body':''};
	for (var i=0; i<types.length;i++) switch(types[i]) {
		case('x'): case('y'): case('z'): t.node += types[i]; break;
		case('w'): case('h'): t.body += types[i]; break;
	}
	return t;
}


jsxWM.prototype.get_pos = function (name, types) {
	var t = this.get_types(types);
	var pos = (undefined != this.node)?this.node.get_pos(name, t.node):false;
	var tmp = (undefined != this.body)?this.body.get_pos(name, t.body):false;
	if (pos == false) return tmp;
	if (tmp == false) return pos;
	for (var i in tmp) pos[i] = tmp[i];
	return pos;
}

jsxWM.prototype.getId = function () { return this.winID; }

jsxWM.prototype.allWindows = [];
jsxWM.prototype.byType = {};

jsxWM.prototype.setBody = function (node, opts) {
	this.body = node;
	this.body.inherit = this.inherit;
	this.body.inherit(jsxPosCtrl);
	this.body.pos_types = {'w':'width','h':'height','z':'zIndex'};
	if (undefined == opts || opts == null)
		this.set_pos(this.pos);
	else
		this.set_pos(opts);
	return;
}

jsxWM.prototype.setResizeBar = function (resize_bar) {
	var resizeID = this.resizeBars.length;
	this.resizeBars.push(resize_bar);
	resize_bar.jsxWin = this;
	resize_bar.onmousedown = this.resizeBar_mousedown;
	return true;
}

jsxWM.prototype.setDragBar = function (drag_bar) {
	var dragID = this.dragbars.length;
	this.dragbars.push(drag_bar);
	drag_bar.jsxWin = this;
	drag_bar.onmousedown = this.dragBar_mousedown;
	this.node.onmouseover = this.dragBar_mouseover;
	return;
}

jsxWM.prototype.resizeBar_mousedown = function (ev) {
	var obj = this.jsxWin;
	obj.start_resizing(ev);
	return true;
}

jsxWM.prototype.start_resizing = function (ev) {
	if (this.active.resizing == this) return false;
	if (this.active.resizing != null) this.active.resizing.stop_resizing();
	if (this.active.focused != this) this.focus();

	this.active.resizing = this;
	mouseOffset = mouseCoords(ev);
	this.save_pos('before_resize', 'wh');

	this.node.style.border = 'inset';
	return false;
}

jsxWM.prototype.stop_resizing = function () {
	if (this.active.resizing != this) return false;
	this.active.resizing = null;
	this.node.style.border = '';
	return false;
}

jsxWM.prototype.getControls = function () {
	return new Array("minimize", "maximize", "close");
}
jsxWM.prototype.minimize = function (params) {
	if (this.maximized) return this.maximize();
	if (this.minimized) {
		this.body.style.display = this.body.prev_display;;
		this.minimized = false;
	} else {
		this.body.prev_display = this.body.style.display;
		this.body.style.display = 'none';
		this.minimized = true;
	}
}
jsxWM.prototype.maximize = function (params) {
	if (this.minimized) return this.minimize();
	if (this.maximized) {
		this.restore_pos('before_max');
		this.maximized = false;
	} else {
		this.save_pos('before_max');

		var woff = this.node.clientWidth - this.body.clientWidth;
		var hoff = this.node.clientHeight- this.body.clientHeight;

		this.set_pos({
			'w':window.innerWidth - woff - 40,
			'h':window.innerHeight - hoff - 40,
			'x':20,
			'y':20,
			'z':9999
		});
		this.maximized = true;
	}
}

jsxWM.prototype.close = function (params) {
	this.node.parentNode.removeChild(this.node);
	this.node = null;
	this.body = null;
	return;
}

jsxWM.prototype.skin = function (name) {
	switch (name) {
		case ('minimize'): return '-';
		case ('maximize'): return '^';
		case ('close'): return 'x';
		case ('resize'): return '[=]';
			var img = document.createElement('img');
			img.setAttribute('src', this.skin_path + '/' + name + this.skin_ext);
			return img;
			break;
	}
	return ' ';
}

jsxWM.prototype.focus = function () {
	if (this.active.focused == this) return false;
	if (this.active.focused != null) this.active.focused.unfocus();
	if (!this.lastID) this.lastID = this.node.getAttribute('id');
	this.node.setAttribute('id', 'focused');
	this.clicks = 0;
	this.active.focused = this;
	return true;
}
jsxWM.prototype.unfocus = function () {
	if (this.active.focused != this) return false;
	if (this.lastID) this.node.setAttribute('id', this.lastID);
	this.lastID = undefined;
	this.active.focused = null;
	return true;
}

jsxWM.prototype.dragBar_mouseover = function(ev) {
	var obj = this.jsxWin;
	if (!obj.active.moving) return false;
	if (obj.active.moving == obj) return false;
	var mover = obj.active.moving;
	if (mover.node.style.zIndex < obj.node.style.zIndex) {
		mover.node.style.zIndex = parseInt(obj.node.style.zIndex)+1;
	} else if (mover.node.style.zIndex == obj.node.style.zIndex) {
		mover.node.style.zIndex++;
	}
	return false;
}

jsxWM.prototype.dragBar_mousedown = function(ev) {
	var obj = this.jsxWin;
	obj.focus();
	clearTimeout(clickTimer);
	obj.clicks++;
	if (obj.clicks < 2) {
		clickTimer = setTimeout(function(){obj.clicks = 0;}, 1000);
		return false;
	}

	obj.start_moving(ev);
	return false;
}

jsxWM.prototype.start_moving = function (ev) {
	if (this.active.moving == this) return false;
	if (this.active.moving != null) this.active.moving.stop_moving();
	if (this.active.focused != this) this.focus();

	this.clicks = 0;
	this.active.moving  = this;

	this.node.style.border = 'medium dashed black';

	mouseOffset = getMouseOffset(this.node, ev);
	this.node.prev_left = this.node.style.left;
	this.node.prev_top = this.node.style.top;
	this.node.prev_pos = this.node.style.position;
	this.node.prev_parent = null;
	if (this.node.parentNode != document.body) {
		var ourx = this.node.parentNode.offsetLeft + this.node.offsetLeft;
		var oury = this.node.parentNode.offsetTop + this.node.offsetTop;

		this.node.prev_parent = this.node.parentNode;
		document.body.appendChild(this.node);
		this.node.style.left = ourx+'px';
		this.node.style.top = oury+'px';
	}
	this.node.style.position = 'absolute';
	return true;
}

jsxWM.prototype.stop_moving = function () {
	if (this.active.moving != this) return false;
	this.active.moving = null;
	this.node.style.border = '';
	return true;
}


function makeDroppable(item) {
	if (!item) return;
	var new_item = item.cloneNode(false);
	new_item.dropSite = item;
//	new_item.style.visibility = 'hidden';
//	new_item.style.zIndex = 32767;
	new_item.style.top = item.offsetTop-5;
	new_item.style.left = item.offsetLeft-5;
	new_item.style.width = item.width+10;
	new_item.style.height = item.height+10;
	new_item.style.border = 'thin dotted #00FF00';
	new_item.setAttribute('id', new_item.getAttribute('id')+'_border');
	new_item.onmouseover = function(ev) {
		dropObject = this.dropSite;
	}
	new_item.onmouseout = function(ev) {
		if (!dropObject) return;
		if (dropObject == this.dropSite) dropObject = null;
	}
	item.parentNode.appendChild(new_item);
}

document.onmousemove = mouseMove;
document.onmouseup   = mouseUp;

var dropObject  = null;
var mouseOffset = null;
var dragObjectChanged = false;
var divOver = null;
var clickTimer = null;
var lastMousePos = {x:0,y:0};
var originalMousePos = null;


try {
	var tmp = edit_mode;
} catch (err) {
	edit_mode = true;
}

function getMouseOffset(target, ev){
	ev = ev || window.event;

	var docPos    = getPosition(target);
	var mousePos  = mouseCoords(ev);
	return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
}

function getPosition(e){
	var left = 0;
	var top  = 0;

	while (e.offsetParent){
		left += e.offsetLeft;
		top  += e.offsetTop;
		e     = e.offsetParent;
	}

	left += e.offsetLeft;
	top  += e.offsetTop;

	return {x:left, y:top};
}

function mouseMove(ev){
	ev           = ev || window.event;
	var mousePos = mouseCoords(ev);
	lastMousePos = mousePos;

	with (jsxWM.prototype.active) {
		if (moving) {
			moving.set_pos({
				'x':mousePos.x - mouseOffset.x,
				'y':mousePos.y - mouseOffset.y
			}, 'xy');
			movingChanged = true;
			return true;
		} else if (resizing) {
			var dim = resizing.get_pos(null, 'hw');
			dim.w = parseInt(dim.w);
			dim.h = parseInt(dim.h);
			var newdim = {
				'w':dim.w + (mousePos.x - mouseOffset.x),
				'h':dim.h + (mousePos.y - mouseOffset.y)
			};
			if (newdim.w > 160)
				mouseOffset.x = mousePos.x;
			else newdim.w = dim.w;
				
			if (newdim.h > 220) 
				mouseOffset.y = mousePos.y;
			else newdim.h = dim.h;

			resizing.set_pos(newdim, 'hw');
			return true;
		}
	}
	return false;
}

function mouseCoords(ev){
	if(document.all) {
		return {
			x:event.clientX + document.body.scrollLeft - document.body.clientLeft,
			y:event.clientY + document.body.scrollTop  - document.body.clientTop
		};
	}
	return {x:ev.pageX, y:ev.pageY};
}

function mouseUp() {
	with (jsxWM.prototype.active) {
		if (!resizing && !moving) return false;

		if (resizing) {
			var obj = resizing;
			obj.stop_resizing();
			return true;
		}
		moving.stop_moving();
		return true;

		if (movingChanged) {
			try {
				moving.set_pos({
					'x':Math.floor(moving.offsetLeft/20)*20,
					'y':Math.floor(moving.offsetTop/20)*20
				});
				if (edit_action == 'add') {
					link_camera(moving.node.getAttribute('room_id'), site_id);
					moving.node.setAttribute('site_id', site_id);
					move_camera(
						moving.node.getAttribute('host'),
						moving.node.getAttribute('room_id'),
						moving.node.style.left.substring(0,moving.node.style.left.length-2),
						moving.node.style.top.substring(0,moving.node.style.top.length-2),
						moving.node.style.zIndex,
						moving.node.getAttribute('site_id'),
						moving.node.getAttribute('template_size')
					);
				} else if (edit_action == 'remove') {
					unlink_camera(moving.node.getAttribute('room_id'), site_id);
					remove_camera(moving.node.getAttribute('host'), moving.node.getAttribute('room_id'));
					add_edit_camera(
						moving.node.getAttribute('host'),
						moving.node.getAttribute('room_id'),
						-1,
						'Small',
						'edit_search_results'
					);	
				} else {
					move_camera(
						moving.node.getAttribute('host'),
						moving.node.getAttribute('room_id'),
						moving.node.style.left.substring(0,moving.node.style.left.length-2),
						moving.node.style.top.substring(0,moving.node.style.top.length-2),
						moving.node.style.zIndex,
						moving.node.getAttribute('site_id'),
						moving.node.getAttribute('template_size')
					);
				}
				edit_action = null;
			} catch (err) {}
		}
		moving = null;
		movingChanged = false;
	}
}

function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return {left:curleft,top:curtop};
}

