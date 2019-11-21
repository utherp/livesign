var setUtil = {
	isset:function () {
		if (!arguments.length) return false;
		var p;
		p = (arguments.length > 1)?setUtil.climb_to(arguments):arguments[0];
		return (undefined == p || p == null)?false:true;
	},
	
	climb_to:function (args, i, create, asWhat) {
		if (undefined == create) create = null;
		if (undefined == asWhat || asWhat == null) asWhat = false;
		with (setUtil) {
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
		last = (tmp.length == 1)?tmp[0]:setUtil.climb_to(tmp, 0, true, false);
		last[lastVal] = value;
		return value;
	},

	getVal:function () {
		if (!arguments.length) return null;
		return (arguments.length == 1)?arguments[0]:setUtil.climb_to(arguments);
	},
	
	istype:function (type) {
		var p;
		with (setUtil) 
			p = (arguments.length > 2)?climb_to(arguments, 1):arguments[1];
		return (typeof(p) == type && p != null)?true:false;
	}
};

