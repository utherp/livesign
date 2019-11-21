/*
	 easy method to add selector filters
	borrowed from James Padolsey, thanks James
		(http://james.padolsey.com/javascript/extending-jquerys-selector-capabilities/)

	Usage:
	 $.newSelector(
		'filter name',
		function (element, index, match) {
			// code, returns true or false for element being a match
		}
	);

	*** OR ***

	$.newSelector( {
		someFilter: function (element, index, match) {
			// code, returns true or false if element is a match
		},
		anotherFilter: function (element, index, match) {
			// ...
		},
		// ...
	});


	Match: 
		0: full filter string
		1: filter name
		2: ?
		3: filter argument string (everything inside the parenthesis:
			e.g. for: ':filterName(blah,pleh)',  match[3] == 'blah,pleh'
*/

(function($){
	$.newSelector = function() {
		if(!arguments) { return; }
		if (typeof(arguments[0])==='object')
			return $.extend($.expr[':'], arguments[0]);
		var obj = {};
		obj[arguments[0]] = arguments[1];
		return $.extend($.expr[':'], obj);
	}
})(jQuery);


function huh() {
	alert('called');
}

/*
var recurse = [
	{a:1, b:2, c:3},
	{a:4, b:5, c:6},
	{a:7, b:8, c:9}
];

var test_init = function () {
	var window = this,
		undefined,
		$nodeargs = []; //{stdargs:[],params:{},children:[]};
	
	for (var i = 0; i < arguments.length; i++)
		$nodeargs.push(arguments[i]);

	var test_run = function () {
		var scopestr = '';
		eval('val $nodeargs = $nodeargs');
//			$nodeargs = $nodeargs;
		for (var i = 1; eval('undefined != $'+i+'_'); i++)
			scopestr == 'var $'+(i+1)+'_ = $'+i+"_;\n" + scopestr;
		eval(scopestr);

		var test_run = eval(arguments.callee.toSource());
		test_run.prototype = arguments.callee.prototype;

		var $1_ = $_,
			$_ = {
				'stdargs':[],
				'params':{},
				'children':[]
			};

		// import argument list
		for (var i = 1; i < arguments.length; i++)
			$_.stdargs.push(arguments[i]);

		if (typeof(_HOOK) == 'function')
			_HOOK();

		var hooked = false;
		var _HOOK = function () {
			var str = '';
			if (hooked) str += 'DUP!\n';
			hooked = true;
			str = 'scopes:\n';
			str += '\t$_: ' + stringify($_) + '\n';
			for (var i = 1; eval('undefined != $'+i+'_'); i++)
				str += '\t$'+i+'_: ' + eval('stringify($'+i+'_)') + '\n';
			str += 'args:\n';
			str += stringify($_.stdargs) + '\n\n';
			str += '\nparams:\n';
			str += stringify($_.params) + '\n\n';

			alert(str);
		}


		if (typeof($1_) == 'object') {
			if (typeof($1_.params) == 'object')
				for (var i in $1_.params)
					$_.params[i] = $1_.params[i];
		}
	
		if ($nodeargs.length) {
			var tmp = $nodeargs.shift();
			$_.children.push(new test_run.apply(this, tmp));
		}
	
		if (!hooked) _HOOK();
	
		if (this.rendered)
			alert('Rendered');
		return test_scope;
	}

	test_run.prototype = {
		'is_it_right':function () { alert('it appears to be correct with "' + this.myval + '"'); },
		'myval':500
	};

	return test_run;
}

function stringify (obj) {
	var str = '';
	switch (typeof(obj)) {
		case ('function'): 
			str += 'Function';
			break;
		case ('object'):
			if (obj == null)
				str += 'NULL';
			else if (obj.constructor == Array) {
				str += 'Array [\n';
				for (var i = 0; i < obj.length; i++)
					str += '\t\t' + i + ': ' + stringify(obj[i]) + '\n';
				str += '\t]';
			} else {
				str += 'Object {\n';
				for (var i in obj)
					str += '\t\t"'+i+'": ' + stringify(obj[i]) + '\n';
				str += '\t}';
			}
			break;
		case ('undefined'):
			str += 'Undefined';
			break;
		default:
			str += '"' + obj + '"';
	}
	return str;
}
*/
