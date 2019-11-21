/* TODO:  finish implementing transitions
   TODO:  determine how to handle premature cancelation and/or pausing of the clock
*/

(function (_w) {
    var window = _w, undefined,

    all_windows = {},
    next_rand_win_id = 0,

    WindowWrapper = window.Window = function (props) {
        if (!props) return false;
        if (typeof(props) != 'object')
            return all_windows[props];

        return new Window(props);
    };

/******************************************************************************/

    function Activatable() { }
    Activatable.prototype = {
        enable:function (duration) { /* duration if that of the parent, to determine this window's duration and offset */
            if (!duration) duration = 0;
            if (this._enabled) return this;
            this._enabled = true;
    
            this._running_offset = this._running_duration = 0;
    
            if (this.offset) {
                if (this.offset.indexOf('%') != -1) {
                    if (duration)
                        this._running_offset = duration * (parseFloat(this.offset) / 100);
                    else
                        this._running_offset = 0;
                } else
                    this._running_offset = this.offset;
            }
    
            if (this.duration) {
                if (this.duration.indexOf('%') != -1) {
                    if (duration)
                        this._running_duration = duration * (parseFloat(this.duration) / 100);
                    else 
                        this._running_duration = 0;
                } else
                    this._running_duration = this.duration;
            }
    
            if (this._running_offset > 0) {
                var _obj = this;
                this._active_timeout = setTimeout(function () { _obj.activate(); return true; }, this._running_offset);
            } else
                this.activate();
    
            return this;
        },
    
        disable:function () {
            if (!this._enabled) return this;
    
            if (this.children)
              for (var i = 0; i < this.children.length; i++)
                this.children[i].disable();
    
            this.deactivate();
            this._enabled = false;
            return this;
        },
    
        activate:function () {
            if (this._active) return this;
            this._active = true;
    
            clearTimeout(this._active_timeout);
    
            if (this.elem) this.elem.addClass('active');
            if (typeof(this.when_activate) == 'function')
                this.when_activate();
    
            if (this.children)
              for (var i = 0; i < this.children.length; i++) 
                this.children[i].enable(this._running_duration);
    
            if (this._running_duration) {
                var _obj = this;
                this._active_timeout = setTimeout(function () { _obj.deactivate(); return true; }, this._running_duration);
            }
    
            return this;
        },
    
        deactivate:function () {
            if (!this._active) return this;
            this._active = false;
    
            clearTimeout(this._active_timeout);
    
            if (typeof(this.when_deactivate) == 'function')
                this.when_deactivate();
    
            if (this.children) 
              for (var i = 0; i < this.children.length; i++)
                this.children[i].deactivate();
    
            if (this.elem) this.elem.removeClass('active');
    
            return this;
        }
    };

/******************************************************************************/

    function Positionable () { }
    Positionable.prototype = {
        repos:function (x,y,z) {
            if (x && (typeof(x) == 'object')) return this.repos(x.x,x.y,x.z);
            if (x && (typeof(x) == 'boolean')) return this.repos(this.pos.x, this.pos.y, this.pos.z); 
            if (!arguments.length) {
                var p = this.elem.css(['left', 'top', 'zIndex']);
                if (typeof(this.pos) != 'object') this.pos = {};
                this.pos.x = parseFloat(p.left);
                this.pos.y = parseFloat(p.top);
                this.pos.z = p.zIndex;
                return this.pos;
            }
    
            if (typeof(this.pos) != 'object') this.repos();
            var p = { };
    
            if (typeof(x) == 'number') {
                if (x < 0) p.right = (Math.abs(x)-1) + 'px';
                else p.left = x + 'px';
            }
    
            if (typeof(y) == 'number') {
                if (y < 0) p.bottom = (Math.abs(y)-1) + 'px';
                else p.top = y + 'px';
            }
    
            if (typeof(z) == 'number') p.zIndex = z;
    
            this.elem.css(p);
            this.repos();

            return this;
        },
    
        resize:function (w,h) {
            if (w && (typeof(w) == 'object')) return this.resize(w.w,w.h);
            if (!arguments.length) {
                var s = this.elem.css(['width', 'height']);
                if (typeof(this.size) != 'object') this.size = {};
                this.size.width = s.width;
                this.size.height = s.height;
                return s;
            }
            if (typeof(this.size) != 'object') this.resize();
    
            if (typeof(w) == 'number') this.size.width  = w;
            if (typeof(h) == 'number') this.size.height = h;
    
            this.elem.css(this.size);
            return this;
        }
    };

/**************************************************************************************************/

    function Window (props) {
        this.id = props.id;
        if (!this.id && (typeof(this.id) != 'number'))
            this.id = next_rand_win_id++;

        this.elem = this.create_element(this.id, props.class);

        this.repos(props.x, props.y, props.z);
        this.resize(props.w, props.h);

        if (typeof(props.style) == 'object')
            this.elem.css(props.style);

        if (props.border)
            this.border(props.border);

        if (props.margin)
            this.margin(props.margin);

        if (props.content) {
            this.content = new Content(props.content);
            this.content.apply(this);
        }

        if (props.effects) {
            this.effects = [];
            for (var i = 0; i < props.effects.length; i++)
                this.effects.push(new Effect(this, props.effects[i]));
        }

        if (props.offset) this.offset = props.offset + '';
        if (props.duration) this.duration = props.duration + '';

        this.children = [];
        if (props.children instanceof Array) {
            for (var i = 0; i < props.children.length; i++) 
                this.append(new Window(props.children[i]));
        }

        return;
    }

    Window.prototype = $.extend(new Activatable(), new Positionable(), {
        skew:0,
        offset:0,
        duration:0,
        _enabled:false,
        _active:false,

        create_element:function (id, classes) {
            classes = 'Window ' + (classes ? classes : '');
            return $('<div id="win_'+id+'" class="' + classes + '" />');
        },

        append:function (child, attached) {
            this.children.push(child);
            if (!attached) child.attach(this, true);
            this.elem.append(child.elem);
            return this;
        },

        remove:function (child, detached) {
            for (var i = 0; i < this.children.length; i++)
                if (this.children[i] == child) break;
            if (i == this.children.length) return this;
            this.children.splice(i, 1);
            if (!detached) child.detach(parent, true);
            return this;
        },

        attach:function (parent, appended) {
            if (this.parent) {
                if (this.parent == parent) return this;
                this.parent.remove(this);
            }
            this.parent = parent;
            if (!appended) this.parent.append(this, true);
            return this;
        },

        detach:function (parent, removed) {
            if (this.parent != parent) return this;
            this.parent = false;
            if (!removed) parent.remove(this, true);
            this.elem.detach();
            return this;
        },

        when_activate:function () {
            /* placeholder for starting transitioning effects */
            if (this.effects instanceof Array)
              for (var i = 0; i < this.effects.length; i++)
                this.effects[i].enable(this._running_duration);
            return this;
        },
        when_deactivate:function () {
            /* placeholder for stopping transitioning effects */
            return this;
        },

        border:function (w, c, m) {
            if (w && (typeof(w) == 'object')) return this.border(w.w, w.c, w.m);
            if (!this._border) this._border = { w:0, c:{r:0,g:0,b:0}, m:0 };
            if (!arguments.length) return { w:this._border.borderWidth, c:this._border.borderColor, m:this._border.padding };

            if (!w && (typeof(w) != 'number')) w = this._border.width;
            if (!c && (typeof(c) != 'number')) c = this._border.color;
            if (!m && (typeof(m) != 'number')) m = this._border.padding;
            if (!(c instanceof Color)) c = new Color(c);

            this._border.borderStyle = 'solid';
            this._border.borderWidth = w;
            this._border.padding = m;
            this._border.borderColor = c.rgb();

            this.elem.css(this._border);
            return this;
        },

        margin:function (w) {
            if (!w && (typeof(w) != 'number')) return this.elem.css('marginTop');
            this.elem.css('margin', parseInt(w) + 'px');
            return this;
        }
    });


/**************************************************************************************************/

    function Effect (win, props) {
        this._win = win;
        var inherit = props.inherit;
        if (props.sequence instanceof Array) {
            this.sequence = [];
            var obj = this;
            for (var i = 0; i < props.sequence.length; i++) {
                var fx = new Effect(win, props.sequence[i]);
                fx.when_deactivate = function () { return obj.next(); };
            }
        }

        if (!inherit && props.name) inherit = props.name;

        if (inherit && Effect.builtin[inherit])
                $.extend(this, Effect.builtin[inherit]);

        if (props.name) this.name = props.name;
        if (!this.name) this.name = 'custom';
                
        if (props.seq) this.seq = props.seq;
        if (props.duration || (typeof(props.duration) == 'number'))
            this.duration = props.duration;

        if (props.offset || (typeof(props.offset) == 'number'))
            this.offset = props.offset;

        if (props.repeat || (typeof(props.repeat) == 'number'))
            this.repeat = props.repeat;

        if (props.gap || typeof(props.gap) == 'number')
            this.gap = props.gap;

        if (props.ease) this.ease = props.ease;

        if (!this.init) this.init = {};
        if (props.init instanceof Object) 
            $.extend(this.init, props.init);

        if (props.props instanceof Object)
            $.extend(this.init, props.props);

        return;
    }

    Effect.prototype = $.extend(new Activatable(), {
        seq:0,
        duration:0,
        offset:0,
        repeat:0,
        ease:'linear',
        when_activate:function () {
            this._running_repeat = this.repeat;

            if ((this.sequence instanceof Array) && this.sequence.length) {
                this._sequence_index = 0;
                return this.sequence[0].enable();
            }

            var Win = this._win;
            var Con = Win.content;

            var x = Con.pos.x,
                y = Con.pos.y,
                z = Con.pos.z,
                w = parseFloat(Con.elem.css('width')), //size.width,
                h = parseFloat(Con.elem.css('height')), //size.height,
                W = parseFloat(Win.elem.css('width')),
                H = parseFloat(Win.elem.css('height')),
                opacity = Con.elem.css('opacity');


            for (var i in this.init)
                eval(i + ' = ' + this.init[i]);

            Con.repos(x, y, z);
            Con.resize(w, h);
            Con.elem.css('opacity', opacity);
            var duration = this._running_duration;
            if ((duration+'').match(/[^0-9\.]/))
                duration = eval(this.duration);

            var mod = {};
            for (var i in this.props) {
                var n = false;
                switch (i) {
                    case ('x'): n = 'left';       break;
                    case ('y'): n = 'top';        break;
                    case ('z'): n = 'zIndex';     break;
                    case ('w'): n = 'width';      break;
                    case ('h'): n = 'height';     break;
                    default: n = i;
                }
                var v = eval(this.props[i]);
                mod[n] = v;
            }
            Con.elem.animate(mod, {'duration':duration, 'easing':this.ease, 'queue':false});
        },

        next:function () {
            this._sequence_index++;
            if (this._sequence_index >= this.sequence.length) return this.when_deactivate();
            return this.sequence[this._sequence_index].enable();
        },

        when_deactivate:function () {
            this._running_repeat--;
            if (this._running_repeat <= 0) return true;
            this._sequence_index = -1;
            return this.next();
        }
    });


    Effect.builtin = {
        'scroll in left':{
            init:{ 'x':'W' },
            props:{ 'x':0 },
            duration:'1000 * (W / 100)'  /* 100 pixels per second */
        },
        'scroll in right':{
            init:{ 'x':'0 - w' },
            props:{ 'x':0 },
            duration:'1000 * (w / 100)'  /* 100 pixels per second */
        },
        'scroll in up':{
            init:{ 'y':'H' },
            props:{ 'y':0 },
            duration:'1000 * (h / 100)'  /* 100 pixels per second */
        },
        'scroll in down':{
            init:{ 'y':'0 - h' },
            props:{ 'y':0 },
            duration:'1000 * (h / 100)'  /* 100 pixels per second */
        },

        'scroll out left':{
            init:{ 'x':0 },
            props:{ 'x':'0 - w' },
            duration:'1000 * (w / 100)'  /* 100 pixels per second */
        },
        'scroll out right':{
            init:{ 'x':0 },
            props:{ 'x':'W' },
            duration:'1000 * (w / 100)'  /* 100 pixels per second */
        },
        'scroll out up':{
            init:{ 'y':0 },
            props:{ 'y':'0 - h' },
            duration:'1000 * (h / 100)'  /* 100 pixels per second */
        },
        'scroll out down':{
            init:{ 'y':0 },
            props:{ 'y':'h' },
            duration:'1000 * (h / 100)'  /* 100 pixels per second */
        },

        'blink out':{
            init:{  'opacity':1.0 },
           props:{ 'opacity':0.0 },
        duration:500
        },
        'blink in':{
            init:{ 'opacity':0.0 },
           props:{ 'opacity':1.0 },
        duration:500
        },

        'scroll left':{
            sequence:[ { inherit:'scroll in left' }, { inherit:'scroll out left' } ],
            repeat:-1
        },
        'blink':{
            sequence:[ { inherit:'blink in' }, { inherit:'blink out' } ],
            repeat:-1
        }
            
    };


/**************************************************************************************************/

    function Content (props) { /* type[text,image,video], props vary */
        if (typeof(props) != 'object')
            props = { value:props + '' };

        this.value = props.value;
        this.type = props.type;
        if (!this.type) {
            if (this.value.match(/\.(jpg|png|gif|ico|bmp)$/i))
                this.type = 'image';
            else if (this.value.match(/\.(mov|mpg|mpeg|avi|flv|wmv)$/i))
                this.type = 'video';
            else
                this.type = 'text';
        }

        switch (this.type) {
            case ('image'):
                this.elem = $('<img class="content image" src="' + this.value + '" />');
                break;
            case ('text'):
                this.elem = $('<p class="content text">' + this.value + '</p>');
                break;
            case ('video'):
                /* not yet supported */
            default:
                this.elem = $('<span class="content unsupported" />');
                break;
        }

        if (props.style && (typeof(props.style) == 'object'))
            this.elem.css(props.style);

        this.repos();
        this.resize();
        return;
    }

    Content.prototype = $.extend(new Positionable(), {
        apply:function (win) {
            win.elem.append(this.elem);
            win.elem.css('line-height', win.elem.css('height'));
            return win;
        },
        set:function (value) {
            this.value = value;
            switch (this.type) {
                case ('image'):
                    this.elem.attr('src', value);
                    break;
                case ('text'):
                    this.elem.empty().text(value);
                    break;
                case ('video'):
                    /* not yet implemented */
                default:
                    break;
            }
            return this;
        },
        state:function () {
            return {
                x:this.elem.css('left'),
                y:this.elem.css('top'),
                w:this.elem.css('width'),
                h:this.elem.css('height'),
                visible:this.elem.css('visible'),

            };
        }
    });


/**************************************************************************************************/


    function Color (r, g, b) {
        if ((typeof(r) == 'string') && (r.indexOf('#') == 0)) {
            b = hex2dec(r.substr(5, 2));
            g = hex2dec(r.substr(3, 2));
            r = hex2dec(r.substr(1, 2));
        } else if (r && typeof(r) == 'object') {
            b = r.b;
            g = r.g;
            r = r.r;
        }
        this.r = r;
        this.g = g;
        this.b = b;
        return;
    }

    Color.prototype = {
        rgb:function () {
            return 'rgb( ' + this.r + ', ' + this.g + ', ' + this.b + ')';
        }
    };


/**************************************************************************************************/


    function hex2dec (str) {
        var res = 0;
        for (var i = 0; i < str.length; i++) {
            var v;
            switch (str.substr(i, 1)) {
                case ('A'):
                case ('a'): v = 10; break;
                case ('B'):
                case ('b'): v = 11; break;
                case ('C'):
                case ('c'): v = 12; break;
                case ('D'):
                case ('d'): v = 13; break;
                case ('E'):
                case ('e'): v = 14; break;
                case ('F'):
                case ('f'): v = 15; break;
                case ('0'): v = 0;  break;
                case ('1'): v = 1;  break;
                case ('2'): v = 2;  break;
                case ('3'): v = 3;  break;
                case ('4'): v = 4;  break;
                case ('5'): v = 5;  break;
                case ('6'): v = 6;  break;
                case ('7'): v = 7;  break;
                case ('8'): v = 8;  break;
                case ('9'): v = 9;  break;
                default:
                    /* invalid */
                    return 0;
            }
            res = res << 4;
            res += v;
        }
        return res;
    }


})(this);
