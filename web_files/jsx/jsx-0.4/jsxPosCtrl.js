jsxPosCtrl = {
	pos_types:{
		'x':'left',
		'y':'top',
		'w':'width',
		'h':'height',
		'z':'zIndex'
	},
	restore_pos:function (name, types, node) {
		if (undefined == this.stored_pos) this.stored_pos = {};
		if (undefined != name)
			return (undefined != this.stored_pos[name])?this.set_pos(this.stored_pos[name], types, node):false;
	
		return (undefined != this.stored_pos['_last'])?this.set_pos(this.stored_pos['_last'], types, node):false;
	},
	save_pos:function (name, types, node) {
		if (undefined == this.stored_pos) this.stored_pos = {};
		this.stored_pos[name] = this.get_pos(null, types, node);
		this.stored_pos['_last'] = this.stored_pos[name];
		return;
	},
	get_pos:function (name, types, node) {
		if (undefined == this.stored_pos) this.stored_pos = {};
		if (undefined != name && name != null) {
			if (undefined == this.stored_pos[name]) return false;
			if (undefined == types) return this.stored_pos[name];
			types = types.split('');
			var pos = {};
			for (var i=0; i<types.length;i++)
				if (undefined != this.stored_pos[name][types[i]])
					pos[types[i]] = this.stored_pos[name][types[i]];
			return pos;
		}
	
		var pos = {};
		if (undefined == node || node == null)
			if (undefined == this.style) return false;
			else node = this;
	
		if (undefined == types) types = 'xyzwh';
		types = types.split('');
	
		for (var i = 0; i < types.length; i++)
			if (undefined != this.pos_types[types[i]])
				pos[types[i]] = node.style[this.pos_types[types[i]]];
		
		return pos;
	},
	set_pos:function (pos, types, node) {
		if (undefined == node || node == null)
			if (undefined == this.style) return false;
			else node = this;
	
		if (typeof(pos) != 'object') return false;

		if (undefined == types) types = 'xyzwh';
		if (typeof(types) != 'object') types = types.split('');
	
		for (var n in types)
			if (undefined != pos[types[n]] && undefined != this.pos_types[types[n]]) {
				if (isNaN(pos[types[n]])) continue;
//				if (types[n] != 'z') pos[types[n]] += 'px';
				node.style[this.pos_types[types[n]]] = pos[types[n]];
			}
	
		return true;
	}
}

