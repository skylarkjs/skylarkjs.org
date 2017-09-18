define([
    "jquery",
    "skylark/langx",
    "text!./_partials.hbs",
    "handlebars"
], function($, langx, partialsTpl, handlebars) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJoZWxwZXJzL1BhcnRpYWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKFtcbiAgICBcImpxdWVyeVwiLFxuICAgIFwic2t5bGFyay9sYW5neFwiLFxuICAgIFwidGV4dCEuL19wYXJ0aWFscy5oYnNcIixcbiAgICBcImhhbmRsZWJhcnNcIlxuXSwgZnVuY3Rpb24oJCwgbGFuZ3gsIHBhcnRpYWxzVHBsLCBoYW5kbGViYXJzKSB7XG4gICAgdmFyIHBhcnRpYWxzID0ge307XG4gICAgdmFyIHNlbGVjdG9yID0gJChsYW5neC50cmltKHBhcnRpYWxzVHBsKSk7XG4gICAgdmFyIF9yZWdpc3RyeVBhcnRpYWwgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHNlbGVjdG9yLmZpbmQoXCIjXCIgKyBuYW1lKS5mb3JFYWNoKGZ1bmN0aW9uKHBhcnRpYWwpIHtcbiAgICAgICAgICAgIGhhbmRsZWJhcnMucmVnaXN0ZXJQYXJ0aWFsKG5hbWUsIGxhbmd4LnRyaW0oJChwYXJ0aWFsKS5odG1sKCkpLnJlcGxhY2UoL1xce1xceyZndDsvZywgXCJ7ez5cIikpO1xuICAgICAgICAgICAgcGFydGlhbHNbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICBpZiAoIXBhcnRpYWxzW25hbWVdKSBfcmVnaXN0cnlQYXJ0aWFsKG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iXSwiZmlsZSI6ImhlbHBlcnMvUGFydGlhbC5qcyJ9
