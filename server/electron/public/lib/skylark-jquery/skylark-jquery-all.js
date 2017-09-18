/**
 * skylark-jquery - The skylark plugin library for fully compatible API with jquery.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
  	  require = globals.require,
  	  isAmd = (typeof define === 'function' && define.amd),
  	  isCmd = (!isAmd && typeof exports !== 'undefined');

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (!isAmd && !define) {
	var map = {};
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps,
                exports: null
            };
            require(id);
        } else {
            resolved[id] = factory;
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.exports) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(window, args);
        }
        return module.exports;
    };
  }

  factory(define,require);

  if (isAmd) {
    define([
      "skylark-jquery/core",
      "skylark-jquery/callbacks",
      "skylark-jquery/deferred",
      "skylark-jquery/ajax"
    ],function($){
      return $;
    });
  } else {    
    var jQuery ;
    require([
      "skylark-jquery/core",
      "skylark-jquery/callbacks",
      "skylark-jquery/deferred",
      "skylark-jquery/ajax"
    ],function($){
      jQuery = $;
    });

    if (isCmd) {
      exports = jQuery;
    } else {
      globals.jQuery = globals.$ = jQuery;
    }
  }

})(function(define,require) {

define("skylark-jquery/core",[ 
	"skylark/langx", 
	"skylark/noder", 
	"skylark/datax", 
	"skylark/eventer", 
	"skylark/finder", 
	"skylark/styler", 
	"skylark/query" 
],function(langx,noder,datax,eventer,finder,styler,query){ 
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
     
    return window.jQuery = window.$ = query; 
});


define("skylark-jquery/deferred",[
    "skylark-jquery/core"
], function($) {

    /*
        (function ($) {
            $.Deferred = async.Deferred;
            $.when = async.when;
        })(Zepto);
    */

    //     This module is borrow from zepto.deferred.js
    //     (c) 2010-2014 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.
    //
    //     Some code (c) 2005, 2013 jQuery Foundation, Inc. and other contributors

    var slice = Array.prototype.slice

    function Deferred(func) {
        var tuples = [
                // action, add listener, listener list, final state
                ["resolve", "done", $.Callbacks({ once: 1, memory: 1 }), "resolved"],
                ["reject", "fail", $.Callbacks({ once: 1, memory: 1 }), "rejected"],
                ["notify", "progress", $.Callbacks({ memory: 1 })]
            ],
            state = "pending",
            promise = {
                state: function() {
                    return state
                },
                always: function() {
                    deferred.done(arguments).fail(arguments)
                    return this
                },
                then: function( /* fnDone [, fnFailed [, fnProgress]] */ ) {
                    var fns = arguments
                    return Deferred(function(defer) {
                        $.each(tuples, function(i, tuple) {
                            var fn = $.isFunction(fns[i]) && fns[i]
                            deferred[tuple[1]](function() {
                                var returned = fn && fn.apply(this, arguments)
                                if (returned && $.isFunction(returned.promise)) {
                                    returned.promise()
                                        .done(defer.resolve)
                                        .fail(defer.reject)
                                        .progress(defer.notify)
                                } else {
                                    var context = this === promise ? defer.promise() : this,
                                        values = fn ? [returned] : arguments
                                    defer[tuple[0] + "With"](context, values)
                                }
                            })
                        })
                        fns = null
                    }).promise()
                },

                promise: function(obj) {
                    return obj != null ? $.extend(obj, promise) : promise
                }
            },
            deferred = {}

        $.each(tuples, function(i, tuple) {
            var list = tuple[2],
                stateString = tuple[3]

            promise[tuple[1]] = list.add

            if (stateString) {
                list.add(function() {
                    state = stateString
                }, tuples[i ^ 1][2].disable, tuples[2][2].lock)
            }

            deferred[tuple[0]] = function() {
                deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments)
                return this
            }
            deferred[tuple[0] + "With"] = list.fireWith
        })

        promise.promise(deferred)
        if (func) func.call(deferred, deferred)
        return deferred
    }

    $.when = function(sub) {
        var resolveValues = slice.call(arguments),
            len = resolveValues.length,
            i = 0,
            remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
            deferred = remain === 1 ? sub : Deferred(),
            progressValues, progressContexts, resolveContexts,
            updateFn = function(i, ctx, val) {
                return function(value) {
                    ctx[i] = this
                    val[i] = arguments.length > 1 ? slice.call(arguments) : value
                    if (val === progressValues) {
                        deferred.notifyWith(ctx, val)
                    } else if (!(--remain)) {
                        deferred.resolveWith(ctx, val)
                    }
                }
            }

        if (len > 1) {
            progressValues = new Array(len)
            progressContexts = new Array(len)
            resolveContexts = new Array(len)
            for (; i < len; ++i) {
                if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
                    resolveValues[i].promise()
                        .done(updateFn(i, resolveContexts, resolveValues))
                        .fail(deferred.reject)
                        .progress(updateFn(i, progressContexts, progressValues))
                } else {
                    --remain
                }
            }
        }
        if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
        return deferred.promise()
    }

    $.Deferred = Deferred

    return $;

});


define("skylark-jquery/callbacks",[
    "skylark-jquery/core"
], function($) {

    //     This module is borrow from zepto.callback.js
    //     (c) 2010-2014 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.

    // Create a collection of callbacks to be fired in a sequence, with configurable behaviour
    // Option flags:
    //   - once: Callbacks fired at most one time.
    //   - memory: Remember the most recent context and arguments
    //   - stopOnFalse: Cease iterating over callback list
    //   - unique: Permit adding at most one instance of the same callback
    $.Callbacks = function(options) {
        options = $.extend({}, options)

        var memory, // Last fire value (for non-forgettable lists)
            fired, // Flag to know if list was already fired
            firing, // Flag to know if list is currently firing
            firingStart, // First callback to fire (used internally by add and fireWith)
            firingLength, // End of the loop when firing
            firingIndex, // Index of currently firing callback (modified by remove if needed)
            list = [], // Actual callback list
            stack = !options.once && [], // Stack of fire calls for repeatable lists
            fire = function(data) {
                memory = options.memory && data
                fired = true
                firingIndex = firingStart || 0
                firingStart = 0
                firingLength = list.length
                firing = true
                for (; list && firingIndex < firingLength; ++firingIndex) {
                    if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        memory = false
                        break
                    }
                }
                firing = false
                if (list) {
                    if (stack) stack.length && fire(stack.shift())
                    else if (memory) list.length = 0
                    else Callbacks.disable()
                }
            },

            Callbacks = {
                add: function() {
                    if (list) {
                        var start = list.length,
                            add = function(args) {
                                $.each(args, function(_, arg) {
                                    if (typeof arg === "function") {
                                        if (!options.unique || !Callbacks.has(arg)) list.push(arg)
                                    } else if (arg && arg.length && typeof arg !== 'string') add(arg)
                                })
                            }
                        add(arguments)
                        if (firing) firingLength = list.length
                        else if (memory) {
                            firingStart = start
                            fire(memory)
                        }
                    }
                    return this
                },
                remove: function() {
                    if (list) {
                        $.each(arguments, function(_, arg) {
                            var index
                            while ((index = $.inArray(arg, list, index)) > -1) {
                                list.splice(index, 1)
                                // Handle firing indexes
                                if (firing) {
                                    if (index <= firingLength) --firingLength
                                    if (index <= firingIndex) --firingIndex
                                }
                            }
                        })
                    }
                    return this
                },
                has: function(fn) {
                    return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
                },
                empty: function() {
                    firingLength = list.length = 0
                    return this
                },
                disable: function() {
                    list = stack = memory = undefined
                    return this
                },
                disabled: function() {
                    return !list
                },
                lock: function() {
                    stack = undefined;
                    if (!memory) Callbacks.disable()
                    return this
                },
                locked: function() {
                    return !stack
                },
                fireWith: function(context, args) {
                    if (list && (!fired || stack)) {
                        args = args || []
                        args = [context, args.slice ? args.slice() : args]
                        if (firing) stack.push(args)
                        else fire(args)
                    }
                    return this
                },
                fire: function() {
                    return Callbacks.fireWith(this, arguments)
                },
                fired: function() {
                    return !!fired
                }
            }

        return Callbacks
    };

    return $;

});


define("skylark-jquery/ajax",[
    "skylark-jquery/core",
    "skylark-jquery/deferred"
], function($) {
    //     zepto.ajax.js
    //     (c) 2010-2014 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.

    var jsonpID = 0,
        document = window.document,
        key,
        name,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        scriptTypeRE = /^(?:text|application)\/javascript/i,
        xmlTypeRE = /^(?:text|application)\/xml/i,
        jsonType = 'application/json',
        htmlType = 'text/html',
        blankRE = /^\s*$/,
        originAnchor = document.createElement('a');

    originAnchor.href = window.location.href;

    // trigger a custom event and return false if it was cancelled
    function triggerAndReturn(context, eventName, data) {
        var event = $.Event(eventName)
        $(context).trigger(event, data)
        return !event.isDefaultPrevented()
    }

    // trigger an Ajax "global" event
    function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) return triggerAndReturn(context || document, eventName, data)
    }

    // Number of active Ajax requests
    $.active = 0;

    function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
    }

    function ajaxStop(settings) {
        if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
    }

    // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
    function ajaxBeforeSend(xhr, settings) {
        var context = settings.context
        if (settings.beforeSend.call(context, xhr, settings) === false ||
            triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
            return false

        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
    }

    function ajaxSuccess(data, xhr, settings, deferred) {
        var context = settings.context,
            status = 'success'
        settings.success.call(context, data, status, xhr)
        if (deferred) deferred.resolveWith(context, [data, status, xhr])
        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
        ajaxComplete(status, xhr, settings)
    }
    // type: "timeout", "error", "abort", "parsererror"
    function ajaxError(error, type, xhr, settings, deferred) {
        var context = settings.context
        settings.error.call(context, xhr, type, error)
        if (deferred) deferred.rejectWith(context, [xhr, type, error])
        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
        ajaxComplete(type, xhr, settings)
    }
    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
    function ajaxComplete(status, xhr, settings) {
        var context = settings.context
        settings.complete.call(context, xhr, status)
        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
        ajaxStop(settings)
    }

    // Empty function, used as default callback
    function empty() {}

    $.ajaxJSONP = function(options, deferred) {
        if (!('type' in options)) return $.ajax(options)

        var _callbackName = options.jsonpCallback,
            callbackName = ($.isFunction(_callbackName) ?
                _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
            script = document.createElement('script'),
            originalCallback = window[callbackName],
            responseData,
            abort = function(errorType) {
                $(script).triggerHandler('error', errorType || 'abort')
            },
            xhr = { abort: abort },
            abortTimeout

        if (deferred) deferred.promise(xhr)

        $(script).on('load error', function(e, errorType) {
            clearTimeout(abortTimeout)
            $(script).off().remove()

            if (e.type == 'error' || !responseData) {
                ajaxError(null, errorType || 'error', xhr, options, deferred)
            } else {
                ajaxSuccess(responseData[0], xhr, options, deferred)
            }

            window[callbackName] = originalCallback
            if (responseData && $.isFunction(originalCallback))
                originalCallback(responseData[0])

            originalCallback = responseData = undefined
        })

        if (ajaxBeforeSend(xhr, options) === false) {
            abort('abort')
            return xhr
        }

        window[callbackName] = function() {
            responseData = arguments
        }

        script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
        document.head.appendChild(script)

        if (options.timeout > 0) abortTimeout = setTimeout(function() {
            abort('timeout')
        }, options.timeout)

        return xhr;
    }

    $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function() {
            return new window.XMLHttpRequest()
        },
        // MIME types mapping
        // IIS returns Javascript as "application/x-javascript"
        accepts: {
            script: 'text/javascript, application/javascript, application/x-javascript',
            json: jsonType,
            xml: 'application/xml, text/xml',
            html: htmlType,
            text: 'text/plain'
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true
    }

    function mimeToDataType(mime) {
        if (mime) mime = mime.split(';', 2)[0]
        return mime && (mime == htmlType ? 'html' :
            mime == jsonType ? 'json' :
            scriptTypeRE.test(mime) ? 'script' :
            xmlTypeRE.test(mime) && 'xml') || 'text'
    }

    function appendQuery(url, query) {
        if (query == '') return url
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
    }

    // serialize payload and append it to the URL for GET requests
    function serializeData(options) {
        if (options.processData && options.data && $.type(options.data) != "string")
            options.data = $.param(options.data, options.traditional)
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
            options.url = appendQuery(options.url, options.data), options.data = undefined
    }

    $.ajax = function(options) {
        var settings = $.extend({}, options || {}),
            deferred = $.Deferred && $.Deferred(),
            urlAnchor
        for (key in $.ajaxSettings)
            if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

        ajaxStart(settings)

        if (!settings.crossDomain) {
            urlAnchor = document.createElement('a')
            urlAnchor.href = settings.url
            urlAnchor.href = urlAnchor.href
            settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
        }

        if (!settings.url) settings.url = window.location.toString()
        serializeData(settings)

        var dataType = settings.dataType,
            hasPlaceholder = /\?.+=\?/.test(settings.url)
        if (hasPlaceholder) dataType = 'jsonp'

        if (settings.cache === false || (
                (!options || options.cache !== true) &&
                ('script' == dataType || 'jsonp' == dataType)
            ))
            settings.url = appendQuery(settings.url, '_=' + Date.now())

        if ('jsonp' == dataType) {
            if (!hasPlaceholder)
                settings.url = appendQuery(settings.url,
                    settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
            return $.ajaxJSONP(settings, deferred)
        }

        var mime = settings.accepts[dataType],
            headers = {},
            setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr(),
            nativeSetHeader = xhr.setRequestHeader,
            abortTimeout

        if (deferred) deferred.promise(xhr)

        if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
        setHeader('Accept', mime || '*/*')
        if (mime = settings.mimeType || mime) {
            if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
            xhr.overrideMimeType && xhr.overrideMimeType(mime)
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
            setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

        if (settings.headers)
            for (name in settings.headers) setHeader(name, settings.headers[name])
        xhr.setRequestHeader = setHeader

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = empty
                clearTimeout(abortTimeout)
                var result, error = false
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
                    result = xhr.responseText

                    try {
                        // http://perfectionkills.com/global-eval-what-are-the-options/
                        if (dataType == 'script')(1, eval)(result)
                        else if (dataType == 'xml') result = xhr.responseXML
                        else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
                    } catch (e) { error = e }

                    if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
                    else ajaxSuccess(result, xhr, settings, deferred)
                } else {
                    ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
                }
            }
        }

        if (ajaxBeforeSend(xhr, settings) === false) {
            xhr.abort()
            ajaxError(null, 'abort', xhr, settings, deferred)
            return xhr
        }

        if (settings.xhrFields)
            for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async, settings.username, settings.password)

        for (name in headers) nativeSetHeader.apply(xhr, headers[name])

        if (settings.timeout > 0) abortTimeout = setTimeout(function() {
            xhr.onreadystatechange = empty
            xhr.abort()
            ajaxError(null, 'timeout', xhr, settings, deferred)
        }, settings.timeout)

        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null)
        return xhr
    }

    // handle optional data/success arguments
    function parseArguments(url, data, success, dataType) {
        if ($.isFunction(data)) dataType = success, success = data, data = undefined
        if (!$.isFunction(success)) dataType = success, success = undefined
        return {
            url: url,
            data: data,
            success: success,
            dataType: dataType
        }
    }

    $.get = function( /* url, data, success, dataType */ ) {
        return $.ajax(parseArguments.apply(null, arguments))
    }

    $.post = function( /* url, data, success, dataType */ ) {
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return $.ajax(options)
    }

    $.getJSON = function( /* url, data, success */ ) {
        var options = parseArguments.apply(null, arguments)
        options.dataType = 'json'
        return $.ajax(options)
    }

    $.fn.load = function(url, data, success) {
        if (!this.length) return this
        var self = this,
            parts = url.split(/\s/),
            selector,
            options = parseArguments(url, data, success),
            callback = options.success
        if (parts.length > 1) options.url = parts[0], selector = parts[1]
        options.success = function(response) {
            self.html(selector ?
                $('<div>').html(response.replace(rscript, "")).find(selector) : response)
            callback && callback.apply(self, arguments)
        }
        $.ajax(options)
        return this
    }

    var escape = encodeURIComponent

    function serialize(params, obj, traditional, scope) {
        var type, array = $.isArray(obj),
            hash = $.isPlainObject(obj)
        $.each(obj, function(key, value) {
            type = $.type(value)
            if (scope) key = traditional ? scope :
                scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
            // handle data in serializeArray() format
            if (!scope && array) params.add(value.name, value.value)
            // recurse into nested objects
            else if (type == "array" || (!traditional && type == "object"))
                serialize(params, value, traditional, key)
            else params.add(key, value)
        })
    }

    $.param = function(obj, traditional) {
        var params = []
        params.add = function(key, value) {
            if ($.isFunction(value)) value = value()
            if (value == null) value = ""
            this.push(escape(key) + '=' + escape(value))
        }
        serialize(params, obj, traditional)
        return params.join('&').replace(/%20/g, '+')
    };

    var
        /* Prefilters
         * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
         * 2) These are called:
         *    - BEFORE asking for a transport
         *    - AFTER param serialization (s.data is a string if s.processData is true)
         * 3) key is the dataType
         * 4) the catchall symbol "*" can be used
         * 5) execution will start with transport dataType and THEN continue down to "*" if needed
         */
        prefilters = {},

        /* Transports bindings
         * 1) key is the dataType
         * 2) the catchall symbol "*" can be used
         * 3) selection will start with transport dataType and THEN go to "*" if needed
         */
        transports = {},
        rnotwhite = (/\S+/g);


    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports(structure) {

        // dataTypeExpression is optional and defaults to "*"
        return function(dataTypeExpression, func) {

            if (typeof dataTypeExpression !== "string") {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            var dataType,
                i = 0,
                dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];

            if (jQuery.isFunction(func)) {

                // For each dataType in the dataTypeExpression
                while ((dataType = dataTypes[i++])) {

                    // Prepend if requested
                    if (dataType[0] === "+") {
                        dataType = dataType.slice(1) || "*";
                        (structure[dataType] = structure[dataType] || []).unshift(func);

                        // Otherwise append
                    } else {
                        (structure[dataType] = structure[dataType] || []).push(func);
                    }
                }
            }
        };
    }

    $.ajaxPrefilter = addToPrefiltersOrTransports(prefilters);
    $.ajaxTransport = addToPrefiltersOrTransports(transports);

    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend(target, src) {
        var key, deep,
            flatOptions = jQuery.ajaxSettings.flatOptions || {};

        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
            }
        }
        if (deep) {
            jQuery.extend(true, target, deep);
        }

        return target;
    }

    // Creates a full fledged settings object into target
    // with both ajaxSettings and settings fields.
    // If target is omitted, writes into ajaxSettings.
    $.ajaxSetup = function(target, settings) {
        return settings ?

            // Building a settings object
            ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

            // Extending ajaxSettings
            ajaxExtend(jQuery.ajaxSettings, target);
    };

    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

        var inspected = {},
            seekingTransport = (structure === transports);

        function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                if (typeof dataTypeOrTransport === "string" &&
                    !seekingTransport && !inspected[dataTypeOrTransport]) {

                    options.dataTypes.unshift(dataTypeOrTransport);
                    inspect(dataTypeOrTransport);
                    return false;
                } else if (seekingTransport) {
                    return !(selected = dataTypeOrTransport);
                }
            });
            return selected;
        }

        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
    }

    return $;

});


},this);