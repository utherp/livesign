document.onmousemove = mouseMove;
document.onmouseup   = mouseUp;

var dragObject  = null;
var dropObject  = null;
var mouseOffset = null;
var dragObjectChanged = false;
var divOver = null;
var clickTimer = null;
var clicks = 0;
var clickObj = null;
var lastMousePos = {x:0,y:0};
var originalMousePos = null;
var resizeObject = null;


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

	if (dragObject) {
		dragObject.style.position = 'absolute';
		dragObject.style.top      = mousePos.y - mouseOffset.y;
		dragObject.style.left     = mousePos.x - mouseOffset.x;
		dragObjectChanged = true;
		return false;
	} else if (resizeObject) {
		var w = parseInt(resizeObject.style.width);
		var h = parseInt(resizeObject.style.height);
		var width = (w + (mousePos.x - mouseOffset.x));
		var height = (h + (mousePos.y - mouseOffset.y));
		if (width > 160) {
			mouseOffset.x = mousePos.x;
			resizeObject.style.width  = width+'px';
		}
		if (height > 160) {
			mouseOffset.y = mousePos.y;
			resizeObject.style.height = height+'px';
		}
		return false;
	}
}

function mouseCoords(ev){
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}

function mouseUp() {
	if (resizeObject) resizeObject = false;
	if (!dragObject) return false;
/*	if (!dropObject) {
		dragObject.style.left = dragObject.getAttribute('prev_x');
		dragObject.style.top = dragObject.getAttribute('prev_y');
		dragObject.style.position = dragObject.getAttribute('prev_pos');
		if (dragObject.prev_parent) {
			dragObject.prev_parent.appendChild(dragObject);
			dragObject.prev_parent = null;
		}
	} else
*/
	if (dragObjectChanged) {
		try {
			if (edit_mode && site_id) {
				dragObject.style.left = Math.floor(dragObject.offsetLeft/20)*20;
				dragObject.style.top = Math.floor(dragObject.offsetTop/20)*20;
				if (edit_action == 'add') {
					link_camera(dragObject.getAttribute('room_id'), site_id);
					dragObject.setAttribute('site_id', site_id);
					move_camera(
						dragObject.getAttribute('host'),
						dragObject.getAttribute('room_id'),
						dragObject.style.left.substring(0,dragObject.style.left.length-2),
						dragObject.style.top.substring(0,dragObject.style.top.length-2),
						dragObject.style.zIndex,
						dragObject.getAttribute('site_id'),
						dragObject.getAttribute('template_size')
					);
				} else if (edit_action == 'remove') {
					unlink_camera(dragObject.getAttribute('room_id'), site_id);
					remove_camera(dragObject.getAttribute('host'), dragObject.getAttribute('room_id'));
					add_edit_camera(
						dragObject.getAttribute('host'),
						dragObject.getAttribute('room_id'),
						-1,
						'Small',
						'edit_search_results'
					);	
				} else {
					move_camera(
						dragObject.getAttribute('host'),
						dragObject.getAttribute('room_id'),
						dragObject.style.left.substring(0,dragObject.style.left.length-2),
						dragObject.style.top.substring(0,dragObject.style.top.length-2),
						dragObject.style.zIndex,
						dragObject.getAttribute('site_id'),
						dragObject.getAttribute('template_size')
					);
				}
				edit_action = null;
			}
		} catch (err) {}

	}
	dragObject = null;
	dragObjectChanged = false;
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

function makeResizable(item, drag_bar) {
	if (!item) return;
	if (!drag_bar) drag_bar = item;
	var this_item = item;
	var this_dragbar = drag_bar;
	drag_bar.onmousedown = function (ev) {
		var our_item = this_item;
		resizeObject = our_item;
		mouseOffset = mouseCoords(ev);
		our_item.setAttribute('prev_width', our_item.style.width);
		our_item.setAttribute('prev_height', our_item.style.height);
		return false;
	}
}


function makeDraggable(item, drag_bar) {
	if(!item) return;
	if (!drag_bar) drag_bar = item;
	var this_item = item;
	var this_dragbar = drag_bar;
	drag_bar.onmousedown = function(ev) {
//		if (!edit_mode) return false;
		var our_item = this_item;
		if (clickObj != this) {
			clicks = 0;
			clickObj = this;
		}
		clearTimeout(clickTimer);
		clicks++;
		if (clicks < 2) {
			clickTimer = setTimeout('clicks = 0', 1000);
			return false;
		}
		clickObj = null;
		clicks = 0;
		dragObject  = our_item;
		mouseOffset = getMouseOffset(this, ev);
		our_item.setAttribute('prev_x', our_item.style.left);
		our_item.setAttribute('prev_y', our_item.style.top);
		our_item.setAttribute('prev_pos', our_item.style.position);
		our_item.prev_parent = null;
		if (our_item.parentNode != document.body) {
			var ourx = our_item.parentNode.offsetLeft + our_item.offsetLeft;
			var oury = our_item.parentNode.offsetTop + our_item.offsetTop;
	
//			alert(our_item.parentNode.offsetTop +'+'+our_item.offsetTop+' : '+our_item.parentNode.offsetLeft+'+'+our_item.offsetLeft);
			our_item.prev_parent = our_item.parentNode;
			document.body.appendChild(our_item);
			our_item.style.left = ourx+'px';
			our_item.style.top = oury+'px';
//			our_item.style.left = ourpos.x+'px';
//			our_item.style.top = ourpos.y+'px';
		}
		our_item.style.position = 'absolute';
		return false;
	}

	item.onmouseover = function(ev) {
		if (dragObject) {
			if (dragObject == this) return false;
			if (dragObject.style.zIndex < this.style.zIndex) {
				dragObject.style.zIndex = this.style.zIndex+1;
//				var z = this.style.zIndex;
//				this.style.zIndex = dragObject.style.zIndex;
//				dragObject.style.zIndex = z;
			} else if (dragObject.style.zIndex == this.style.zIndex) {
				dragObject.style.zIndex++;
			}
		}
	}
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


