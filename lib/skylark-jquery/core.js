define("skylark-jquery/core",[ 
	"skylark/skylark", 
	"skylark/langx", 
	"skylark/noder", 
	"skylark/datax", 
	"skylark/eventer", 
	"skylark/finder", 
	"skylark/styler", 
	"skylark/query" 
],function(skylark,langx,noder,datax,eventer,finder,styler,query){ 
	var filter = Array.prototype.filter,
		slice = Array.prototype.slice; 
	 
    (function($){
	    $.fn.jquery = '2.2.0'; 

	    $.camelCase = langx.camelCase; 

	    $.each = langx.each; 

	    $.extend = function(target) { 
	        var deep, args = slice.call(arguments, 1); 
	        if (typeof target == 'boolean') { 
	            deep = target 
	            target = args.shift() 
	        } 
	        if (args.length == 0) {
	            args = [target]; 
	            target = this; 
	        } 
	        args.forEach(function(arg) {  
	        	langx.mixin(target, arg, deep); 
	        }); 
	        return target; 
	    };	 

	    $.grep = function(elements, callback) { 
	        return filter.call(elements, callback) 
	    }; 

	    $.isArray = langx.isArray; 
	    $.isEmptyObject = langx.isEmptyObject; 
	    $.isFunction = langx.isFunction; 
	    $.isWindow = langx.isWindow; 
	    $.isPlainObject = langx.isPlainObject; 
	
	    $.inArray = langx.inArray; 

	    $.makeArray = langx.makeArray; 
	    $.map = langx.map; 

	    $.noop = function() {	    	
	    };
	    
	    $.parseJSON = window.JSON.parse; 

	    $.proxy = langx.proxy;

	    $.trim = langx.trim; 
	    $.type = langx.type; 
	     
	    $.fn.extend = function(props) { 
	        langx.mixin($.fn, props); 
	    };   	    
	    
	    $.fn.serializeArray = function() {
	        var name, type, result = [],
	            add = function(value) {
	                if (value.forEach) return value.forEach(add)
	                result.push({ name: name, value: value })
	            }
	        if (this[0]) langx.each(this[0].elements, function(_, field) {
	            type = field.type, name = field.name
	            if (name && field.nodeName.toLowerCase() != 'fieldset' &&
	                !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
	                ((type != 'radio' && type != 'checkbox') || field.checked))
	                add($(field).val())
	        })
	        return result
	    };
	
	    $.fn.serialize = function() {
	        var result = []
	        this.serializeArray().forEach(function(elm) {
	            result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
	        })
	        return result.join('&')
	    };
    })(query);
	
    (function($){
        $.Event = function Event(type, props) {
            if (type && !langx.isString(type)) {
                props = type;
                type = props.type;
            }
            return eventer.create(type, props);
        };

        $.event = {};

	    $.fn.submit = function(callback) {
	        if (0 in arguments) this.bind('submit', callback)
	        else if (this.length) {
	            var event = $.Event('submit')
	            this.eq(0).trigger(event)
	            if (!event.isDefaultPrevented()) this.get(0).submit()
	        }
	        return this
	    };
	
	    // event 
	    $.fn.triggerHandler = $.fn.trigger;

	    $.fn.delegate = function(selector, event, callback) {
	        return this.on(event, selector, callback)
	    };
	    
	    $.fn.undelegate = function(selector, event, callback) {
	        return this.off(event, selector, callback)
	    };
	
	    $.fn.live = function(event, callback) {
	        $(document.body).delegate(this.selector, event, callback)
	        return this
	    };
	    
	    $.fn.die = function(event, callback) {
	        $(document.body).undelegate(this.selector, event, callback)
	        return this
	    };
	
	    $.fn.bind = function(event, selector, data, callback) {
	        return this.on(event, selector, data, callback)
	    };
	    
	    $.fn.unbind = function(event, callback) {
	        return this.off(event, callback)
	    };    
	
	    $.fn.ready = function(callback) {
	        eventer.ready(callback);
	        return this;
	    };
	    
	    $.fn.hover = function(fnOver, fnOut) {
	        return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
	    };
	
	    $.fn.stop = function() {
	        // todo
	        return this;
	    };
	
	    $.fn.moveto = function(x, y) {
	        return this.animate({
	            left: x + "px",
	            top: y + "px"
	        }, 0.4);
	
	    };
	    
	    $.ready = eventer.ready;
	
	    $.on = eventer.on;
	
	    $.off = eventer.off;    
    })(query);
	    
    (function($){
	    // plugin compatibility
	    $.uuid = 0;
	    $.support = {};
	    $.expr = {};
	
	    $.expr[":"] = $.expr.pseudos = $.expr.filters = finder.pseudos;
	    
	    $.contains = noder.contains; 
	    
	    $.css = styler.css; 
	    
	    $.data = datax.data; 
		 
	    $.offset = {}; 
	    $.offset.setOffset = function(elem, options, i) { 
	        var position = $.css(elem, "position"); 
	
	        // set position first, in-case top/left are set even on static elem 
	        if (position === "static") { 
	            elem.style.position = "relative"; 
	        } 
	
	        var curElem = $(elem), 
	            curOffset = curElem.offset(), 
	            curCSSTop = $.css(elem, "top"), 
	            curCSSLeft = $.css(elem, "left"), 
	            calculatePosition = (position === "absolute" || position === "fixed") && $.inArray("auto", [curCSSTop, curCSSLeft]) > -1, 
	            props = {}, 
	            curPosition = {}, 
	            curTop, curLeft; 
	
	        // need to be able to calculate position if either top or left is auto and position is either absolute or fixed 
	        if (calculatePosition) { 
	            curPosition = curElem.position(); 
	            curTop = curPosition.top; 
	            curLeft = curPosition.left; 
	        } else { 
	            curTop = parseFloat(curCSSTop) || 0; 
	            curLeft = parseFloat(curCSSLeft) || 0; 
	        } 
	
	        if ($.isFunction(options)) { 
	            options = options.call(elem, i, curOffset); 
	        } 
	
	        if (options.top != null) { 
	            props.top = (options.top - curOffset.top) + curTop; 
	        } 
	        if (options.left != null) { 
	            props.left = (options.left - curOffset.left) + curLeft; 
	        } 
	
	        if ("using" in options) { 
	            options.using.call(elem, props); 
	        } else { 
	            curElem.css(props); 
	        } 
	    }; 
    })(query);
     
    (function($){
	    /** 
	     * @license Copyright 2013 Enideo. Released under dual MIT and GPL licenses. 
	     * https://github.com/Enideo/zepto-events-special 
	     */ 
	
	    $.event.special = $.event.special || {}; 
	
	    var bindBeforeSpecialEvents = $.fn.on; 
	
	    //       $.fn.on = function (eventName, data, callback) { 
	    $.fn.on = function(eventName, selector, data, callback, one) { 
	        if (typeof eventName === "object") return bindBeforeSpecialEvents.apply(this, [eventName, selector, data, callback, one]); 
	        var el = this, 
	            $this = $(el), 
	            specialEvent, 
	            bindEventName = eventName; 
	
	        if (callback == null) { 
	            callback = data; 
	            data = null; 
	        } 
	
	        $.each(eventName.split(/\s/), function(i, eventName) { 
	            eventName = eventName.split(/\./)[0]; 
	            if ((eventName in $.event.special)) { 
	                specialEvent = $.event.special[eventName]; 
	                bindEventName = specialEvent.bindType || bindEventName; 
	                /// init enable special events on Zepto 
	                if (!specialEvent._init) { 
	                    specialEvent._init = true; 
	                    /// intercept and replace the special event handler to add functionality 
	                    specialEvent.originalHandler = specialEvent.handler || specialEvent.handle; 
	                    specialEvent.handler = function() { 
	                        /// make event argument writeable, like on jQuery 
	                        var args = Array.prototype.slice.call(arguments); 
	                        args[0] = $.extend({}, args[0]); 
	                        /// define the event handle, $.event.dispatch is only for newer versions of jQuery 
	                        $.event.handle = function() { 
	                            /// make context of trigger the event element 
	                            var args = Array.prototype.slice.call(arguments), 
	                                event = args[0], 
	                                $target = $(event.target); 
	                            $target.trigger.apply($target, arguments); 
	                        } 
	                        specialEvent.originalHandler.apply(this, args); 
	                    } 
	                } 
	                /// setup special events on Zepto 
	                specialEvent.setup && specialEvent.setup.apply(el, [data]); 
	            } 
	        }); 
	
	        return bindBeforeSpecialEvents.apply(this, [bindEventName, selector, data, callback, one]); 
	
	    };
    })(query);

    query.skylark = skylark;
     
    return window.jQuery = window.$ = query; 
}); 