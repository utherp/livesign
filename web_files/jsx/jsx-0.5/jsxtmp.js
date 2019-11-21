(function() {
	var window = this,
		undefined,
		isUrl = /^(?:https?:\/\/)?(?:(?:[-\w\.]+)+(:\d+)?)?(?:\/(?:[\w/_\.]*(?:\?\S+)?)?)?/,
		isHTML= /<\s*\w+.*>/;
	var	jsx = function (src, name) {
			if (!src) src = window.document;
			if (typeof src === 'string') {
				if (isUrl.test(src)) {
					src = fetch_tmpl(src);
					if (typeof src !== 'object') return false;
				} else if (isHTML.test(src)) {
					src = $(src).get();
					if (typeof src !== 'object') return false;
				} else {
					var tmp = $(src);
					if (!tmp.length) return false;
					src = tmp.get();
				}
			}
			var $jsx = eval(jsx.tmpl.toSource());
			jsx.prototype = $jsx.prototype = new jsx();
			var jsx = $jsx;

			var tmp = new $jsx(src);

			if (typeof src !== 'object') return false;

			var $jsxDefs = parse_templates(src);

			return function (name) {
				if (!$jsxDefs || !$jsxDefs[name]) return false;
				var $lastDefs = $jsxDefs;
				var jsx = eval($jsx.tmpl.toSource());
				var $jsx = jsx;
				return new $jsx.apply(this, arguments);
			}
		};

	var $jsx.tmpl = jsx.tmpl = function () {
		var $jsxDefs = {};
		if (typeof $lastDefs === 'object')
			for (var i in $lastDefs) $jsxDefs[i] = $lastDefs[i];
	
		/* stack jsx scopes ($_ => $1_, $1_ => $2_, ect ect..) */ 
		var scopestr = '';
		for (var i = 1; eval('undefined != $'+i+'_'); i++)
			scopestr == 'var $'+(i+1)+'_ = $'+i+"_;\n" + scopestr;
		eval(scopestr);

		var $1_ = $_;
		var $_ = {};
		$_.stdargs = [];
		for (var i = 1; i < arguments.length; i++)
			$_.stdargs.push(arguments[i]);
	};

	var $jsx.tmpl.prototype = {
		scope:function () {
			alert("this is the value of $_: '"+$_+"'\n"
				+ "this is the value of $1_: '"+$1_+"'");
			return;
		}
	};

})();






	

/*
			/* stack jsx scopes ($_ => $1_, $1_ => $2_, ect ect..) * / 
			var scopestr = '';
			for (var i = 1; eval('undefined != $'+i+'_'); i++)
				scopestr == 'var $'+(i+1)+'_ = $'+i+"_;\n" + scopestr;
			eval(scopestr);
/*

