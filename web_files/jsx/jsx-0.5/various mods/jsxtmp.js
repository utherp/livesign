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
		jsxScope = [{
			name:'root',
			'$_':[]
			'desktop':document.body,
			'window':this
			'defs':{}
		}],
		jsx = $jsx = window.jsx = window.$jsx = function (named, context) {
//			if (named instanceof Object && named.nodeType)
//				return wrap_jsx.apply(this, arguments);

			var i = 2,
				self = {
					'name':named,
					'$_':[]
				};

			if (!(context instanceof Object) || !context.nodeType) i--;

			self.base = this.find_named(named, context);
			if (!self.base) return false;

			for (; i < arguments.length; i++)
				self.$_.push(arguments[i]);

			if (self.$_.length === 1 && self.$_[0] instanceof Object)
				self.$_ = self.$_[0];

			var scope = this.scope?this.scope.slice():jsxScope.slice();
			scope.unshift(self);
			return jsx.init.call(this, scope);
		};

		jsx.extend = function (scope) {
			$.extend(scope[0].base, jsx.prototype);
			scope[0].base.scope = scope;
			return;
		}

		jsx.init = function (scope)  {
			var $$ = scope;
			var $self = $$[0];
			$self.type = $self.type || $self.base.getAttribute('jsx:type');

			var $top = scope[scope.length-1];
			var $param = function (name) {
				for (var i = 0; i < $$.length; i++)
					if (util.isset($$, i, name))
						return $$[i][name];
				return NULL;
			}

			if ($self.type.indexOf('define') === 0) {// == 'define') {
				return function () {
					var self = {
						'$_':[],
						'name':$self.name,
						'base':$self.base.cloneNode(true)
					};
					var scope = $$.slice();
					scope.unshift(self);
	
					if (arguments.length == 1 && arguments[0] instanceof Object)
						self.$_ = arguments[0];
					else for (var i = 0; i < arguments.length; i++)
						self.$_.push(arguments[i]);
	
					jsx.extend();
	
					return jsx.init.call(self.base, self);
				}
			} else if ($base.getAttribute('jsxType') == 'use') {
				alert('would have rendered this element named '+ $self.name +', we will just append it!');
				$param('desktop').append($self.base);
			} else
				alert('unknown type "'+$self.base.type+'"');
		};

		/*
		 *  Text type: 
		 *  	This type is a DOM placeholder for
		 *  	text data, when set, it replaces
		 *  	previous text
		 *
		 */
		jsx.text.prototype = {
			set:function () { /* placeholders */ },
			clear:function () { /* placeholders */ },
		};


		/*
		 * 	Anchor type:
		 * 		A DOM placeholder for some element,
		 * 		depending on spec, could be anything
		 *
		 */
		jsx.anchor.prototype = {
			set:function () { /* placeholders */ },
			clear:function () { /* placeholders */ },
			/* inherits from frame's containing obj */
		};


		self == window_maker
		self == title

		<div window_maker:jsx:name='#!$_.window_name' jsx:name='window_maker' jsx:type='define define'>
			<span window_maker:use='markup' window_maker:class='#!$_.class'><span window_maker:style='#!$_.style' jsx:type=text jsx:name=title jsx:default='this is my title'/></span>
			<div window_maker:jsx:type='#!$_.content_type' />
		</div>

		window_maker({class:myWindow, content_type:'product list', window_name:'myWindowDef'});


		<div jsx:name='myWindowDef' jsx:type='define'>
			<span class='myWindow'>
				<span jsx:type=text jsx:name=title />
			</span>
			<div jsx:type='product list' />
		</div>

		<table>
			<tr jsx:name='product' jsx:type='list'>
				<td product:use='markup' product:class='#!$_[0]' />
				<td><span jsx:type=text jsx:name=some_string /></td>
			</tr>
		</table>

		<table jsx:name='products' jsx:type='define product list frame'>
			<thead>...</thead>
			<tbody products:content=1>
				<tr jsx:name='product' jsx:type='list'>....</tr>
			</tbody>
		</table>

		<tr jsx:name='product' jsx:type='define'>...</tr>
		<table jsx:name=products jsx:type='define product list frame'>
			<thead>the table header.....</thead>
			<tbody products::content=1></tbody>
		</table>


		<table jsx:type='define products as product list frame'>
			<thead>...</thead>
			<tbody products::content=1></tbody>
		</table>

		define product { }

		define products as product list

		/*
		 * 	Frame type:
		 * 		A DOM branch wrapper, much like an
		 * 		anchor, except the target is wrapped
		 * 		much like a <table> wraps a list of <tr>'s
		 *
		 */
		jsx.frame.prototype = {
			set:function () { /* placeholders */ },
			clear:function () { /* placeholders */ },
			/* inherits from frame's containing obj */
		};

		
		/*
		 * 	List type:
		 * 		The list block describes the branch, which
		 * 		is cloned for each set of values in the 
		 * 		list's array.  Consiter wrapping a list
		 * 		with a frame type.  e.g. a TR list might be
		 * 		wrapped with a TABLE frame
		 *
		 */
		jsx.list.prototype = {
			push:function () { /* placeholders */ },
			pop:function () { /* placeholders */ },
			shift:function () { /* placeholders */ },
			unshift:function () { /* placeholders */ },
			slice:function () { /* placeholders */ },
			splice:function () { /* placeholders */ },
			insert:function () { /* placeholders */ },
			remove:function () { /* placeholders */ },
			clear:function () { /* placeholders */ },
		};


		/*
		 * 	Desktop type:
		 * 		Much like a list, except the branches attached
		 * 		to a desktop are positioned absolutely within
		 * 		the desktop's area.
		 *
		 */
		jsx.desktop.prototype = {
			insert:function (elem) { alert('inserting window onto self '); return true; },
			remove:function (elem) { alert('removing window from self'); return true; }
		};


		/*
		 * 	Window type:
		 * 		Much like a frame, except the branch specifies
		 * 		elements for resizing, moving and any number
		 * 		of extendable control hooks
		 *
		 */
		jsx.window.prototype = {
			attach:function (desktop) { alert('attaching self to desktop'); return true; },
			detach:function (desktop) { alert('detaching self from desktop'); return true; }
		};
	


		jsx.init.prototype = {
			'what':null
		};
			/*
			this.parse_opts(opts);
			this.stack_args(arguments, 2);
		
			if (named == '') return this.lib_init();
		
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
		jsx.get_named = function (named, context) {
			if (!named)
				return $('[name=jsx]', context) ? context : document;

			if (named.nodeType)
				return named;

			if (typeof named !== 'string') return false;

			if (typeof context === 'string') {
				if (!isUrl.test(context)) return false;
				return $("<div style='display:none'></div>")
							.data('jsxLoading', true)
							.load(
								context + " [name=jsx][named="+named+"]",
								{'action':'loadJSX', 'named':named},
								function (responseText, textStatus, XMLHttpRequest) { this.$jsx(); }
							)
							.get(0);
			}

			return $('[name=jsx][named='+named+']', context).not('[name=jsx][named='+named+'] *').get(0);
		}


})();
