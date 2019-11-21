	var blah = {};
	blah.getHeaders = function () {
		return ['you blah1', 'freakin fuckin blah', 'do my head3'];
	}
	blah.tableClass = 'entryTable';
	blah.getRows = function () {
		return new Array(['blah freakin blah 1.1', 'blah freakin blah 1.2', 'blah freakin blah 1.3'],
				['blah freakin blah 2.1', 'blah freakin blah 2.2', 'blah freakin blah 2.3'],
				['cell 3.1', 'cell 3.2', 'cell 3.3'],
				['cell 4.1', 'cell 4.2', 'cell 4.3']
			);
	}
	blah.getBody = function () { return this.list.tmpl; }
	blah.getType = function () { return 'just a list'; }
	blah.entryClick = function (index, node) { }

	blah.list = new jsx('tableList', null, blah);
	var myWin = new jsx('window', null, blah, {'x':300, 'y':300, 'w':300, 'h':200, 'title':'Some List'});

	myWin + ' ';

//	myList + '';
	o = (blah.list.getInstancesByName('listRow'))[0];
	return;
	setTimeout(
		function () {
			var oo=o;
			var d = new Date();
//			while (blah.remainingList.length) o.push(blah.remainingList.shift());
			var s = d.getTime();
			for (var i = 0; i < 100; i++) 
				o.push([i, 'testing', 'unshift']);
			d = new Date();
			var e = d.getTime();
			alert("done\nstart: "+s+"\nend: "+e+"\ntotal: "+(e-s));
			setTimeout(
				function () {
					d = new Date();
					s = d.getTime();
					while(oo.list.length) o.pop();
					d = new Date();
					e = d.getTime();
					alert("done\nstart: "+s+"\nend: "+e+"\ntotal: "+(e-s));
					return;
				},
				2000
			);
		},
		2000
	);

