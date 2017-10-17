define([
    "jquery",
    "skylarkjs",
    "text!./_partials.hbs",
    "handlebars"
], function($, skylarkjs, partialsTpl, handlebars) {
    var langx = skylarkjs.langx;
    var partials = {};
    var selector = $(langx.trim(partialsTpl));
    var _registryPartial = function(name) {
        selector.find("#" + name).forEach(function(partial) {
            handlebars.registerPartial(name, langx.trim($(partial).html()).replace(/\{\{&gt;/g, "{{>"));
            partials[name] = true;
        });
    }
    return {
        get: function(name) {
            if (!partials[name]) _registryPartial(name);
        }
    }
});
