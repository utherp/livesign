(function () {

	var modules,
		window = this,
		$ = window.$,
		undefined,
	
		/** Borrowed from JQuery v1.3.2 **/
		// A simple way to check for HTML strings or ID strings
		// (both of which we optimize for)
		quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
		// Is it a simple selector
		isSimple = /^.[^:#\[\.,]*$/,
		isHtml = /<(.*)>/,
		$jsx,
		wrap_jsx = function (obj) {

		},
		jsx = $jsx = window.jsx = window.$jsx = function (called, context) {
			if (called instanceof Object && called.nodeType)
				return wrap_jsx.apply(this, arguments);

			var i = 2,
				self = {
					'$called':called,
					'$_':[]
				};

			if (!(context instanceof Object) || !context.nodeType) i--;

			self.$base = jsx.get_called(called, context);
			if (!self.$base) return false;

			for (; i < arguments.length; i++)
				self.$_.push(arguments[i]);

			if (self.$_.length === 1 && self.$_[0] instanceof Object)
				self.$_ = self.$_[0];

			var scope = this.scope.slice();
			scope.unshift(self);
			return jsx.init(self);
		};

		this.jsxDefs = {};
		this.jsxScope = {};
		
		jsx.init = function (newscope)  {
			tmp = scope || [];
			tmp.unshift(newscope);
			var scope = tmp;
			
			tmp = $desktop || document.body;
			var $desktop = tmp;

			var $$ = function (i) { return scope[i] || {'$_':[]}; }

			with (scope[0]) {
	
				var $jsx = eval(jsx.init.toSource());
				$jsx.prototype = eval(jsx.init.prototype.toSource());
	
				if ($base.getAttribute('jsxType') == 'define') {
					return function () {
						var scp = {
								'$_':[],
								'$called':$called,
								'$base':$base.cloneNode(true)
							};
	
						for (var i = 0; i < arguments.length; i++)
							scp.$_.push(arguments[i]);
	
						scp.$base.setAttribute('jsxType', 'use');
						scp.$base.setAttribute('jsxDef', $called);
	
						scp.$base = $.extend(scp.$base, $jsx.prototype);
	
						return $jsx.call(scp.$base, scp);
					}
				} else if ($base.getAttribute('jsxType') == 'use') {
					alert('would have rendered this element called '+ $called +', we will just append it!');
					$desktop.appendChild($base);
				} else
					alert('unknown type "'+$base.getAttribute('jsxType')+'"');
			}
			return;
		};

		jsx.init.prototype = {
			'what':null
		};
			/*
			this.parse_opts(opts);
			this.stack_args(arguments, 2);
		
			if (called == '') return this.lib_init();
		
			this.make_actions();
			this.stack_params();
			this.parse_params();
		
			this.stack_scope(this.container);
			this.parse_events();
		//	this.self.params = this.params;
			this.init();
		
			this.reference_instance();
		
			this.call_event('whenCreate');
		
			this.parse_children();
		
			this.render();
		
			return;
		};
*/
		jsx.get_called = function (called, context) {
			if (!called)
				return $('[name=jsx]', context) ? context : document;

			if (called.nodeType)
				return called;

			if (typeof called !== 'string') return false;

			if (typeof context === 'string') {
				if (!isUrl.test(context)) return false;
				return $("<div style='display:none'></div>")
							.data('jsxLoading', true)
							.load(
								context + " [name=jsx][called="+called+"]",
								{'action':'loadJSX', 'called':called},
								function (responseText, textStatus, XMLHttpRequest) { this.$jsx(); }
							)
							.get(0);
			}

			return $('[name=jsx][called='+called+']', context).not('[name=jsx][called='+called+'] *').get(0);
		}


})();
