/**
 * skylark-jquery - The skylark plugin library for fully compatible API with jquery.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define("skylark-jquery/callbacks",["skylark-jquery/core"],function(n){return n.Callbacks=function(t){t=n.extend({},t);var e,i,r,u,o,c,f=[],s=!t.once&&[],l=function(n){for(e=t.memory&&n,i=!0,c=u||0,u=0,o=f.length,r=!0;f&&c<o;++c)if(f[c].apply(n[0],n[1])===!1&&t.stopOnFalse){e=!1;break}r=!1,f&&(s?s.length&&l(s.shift()):e?f.length=0:h.disable())},h={add:function(){if(f){var i=f.length,c=function(e){n.each(e,function(n,e){"function"==typeof e?t.unique&&h.has(e)||f.push(e):e&&e.length&&"string"!=typeof e&&c(e)})};c(arguments),r?o=f.length:e&&(u=i,l(e))}return this},remove:function(){return f&&n.each(arguments,function(t,e){for(var i;(i=n.inArray(e,f,i))>-1;)f.splice(i,1),r&&(i<=o&&--o,i<=c&&--c)}),this},has:function(t){return!(!f||!(t?n.inArray(t,f)>-1:f.length))},empty:function(){return o=f.length=0,this},disable:function(){return f=s=e=void 0,this},disabled:function(){return!f},lock:function(){return s=void 0,e||h.disable(),this},locked:function(){return!s},fireWith:function(n,t){return!f||i&&!s||(t=t||[],t=[n,t.slice?t.slice():t],r?s.push(t):l(t)),this},fire:function(){return h.fireWith(this,arguments)},fired:function(){return!!i}};return h},n});