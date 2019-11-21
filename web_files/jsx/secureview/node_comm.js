var node_comm = {
	process_response:function () {
		if (ie)
			if (this.script.readyState != 'loaded' && this.script.readyState != 'complete') return;
			else this.onreadystatechange = null;

		this.script.parentNode.removeChild(this.script);

		var query = this.request_queue.shift();
		if (undefined == query || query == null) {
			this.loading = false;
			alert('Node Comm error! no query available!');
			return true;
		}

		if (this.response_cache[query.id] == 'RESV') 
			query.callback(-1);
		else
			query.callback(this.response_cache[query.id]);

		delete(this.response_cache[query.reqId]);
		return this.process_queue();
	},
	query_error:function () {
		var query = this.request_queue.shift();
		if (undefined == query || query == null) {
			this.loading = false;
			alert('Node Comm error! no query available!');
			return true;
		}
		query.callback(-1);
		delete(node_comm.response_cache[query.id]);
		return this.process_queue();
	},
	request_queue:new Array(),
	response_cache:{},
	generate_id:function () {
		var id;
		do {
			id = Math.round((Math.random() * 1000));
		} while (undefined != this.response_cache[id]);
		this.response_cache[id] = 'RESV';
		return id;
	},
	make_request:function (node_id, path, params, callback) {
		if (undefined == node_id || undefined == path) return false;
		if (undefined == params || params == null || typeof(params) != 'object') return false;
		if (undefined == callback || callback == null) return false;

		var reqId = this.generate_id();
		var url = '/nodes/' + node_id + '/' + path + '?&reqid='+reqId;
		for (var i in params) url += '&'+i+'='+params[i];

		var request = {
			'callback':callback,
			'url':url,
			'id':reqId
		};
			
		return this.queue_request(request);
	},
	queue_request:function (request) {
		this.request_queue.push(request);
		if (!this.loading) return this.process_queue();
		return true;
	},
	prepare_script:function () {
		this.script_box = document.getElementById('scriptbox');
		if (undefined == this.script_box || this.script_box == null) {
			this.script_box = document.createElement('span');
			this.script_box.style['visibility'] = 'hidden';
			this.script_box.style['height'] = this.script_box.style['width'] = '0px';
			this.script_box.setAttribute('id', 'scriptbox');
			document.body.appendChild(this.script_box);
		}

		var obj = this;
		var func = function () { return obj.process_response();};
		if (ie) this.prepare_script = function () { this.script.onreadystatechange = func; };
		else {
			var efunc = function () { return obj.query_error(); }
			this.prepare_script = function () {
				this.script.onload = func;
				this.script.onerror = efunc;
			}
		}
		return this.prepare_script();
	},
	make_script:function (url) {
		var obj = this;
		if (this.script != null && this.script.parentNode != null) {
			this.script.parentNode.removeChild(this.script);
			this.script = null
		}
		this.script = document.createElement('script');
		this.script.setAttribute('type', 'text/javascript');
		this.prepare_script();

		this.script.setAttribute('src', url);
		this.script_box.appendChild(this.script);

		return true;
	},
	process_queue:function () {
		if (!this.request_queue.length) {
			this.loading = false;
			return true;
		}
		this.loading = true;
	
		var query = this.request_queue[0];
		return this.make_script(query.url);
	}
};


