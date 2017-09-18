define([
    "skylark/spa",
    "jquery",
    "skylark/router",
    "skylark/eventer",
    "caret",
    "atwho"
], function(spa, $, router, eventer, caret, atwho) {
    return spa.PluginController.inherit({
        _createUi: function() {
            var self = this,
                searchBar = $("<div>").attr({
                    class: "search-bar"
                });
            $("<input>").attr({
                class: "f-input js-search-field",
                name: "q",
                type: "text",
                placeholder: "Search...(eg:#xxx)",
                value: "",
                tabindex: 1,
                autocomplete: "off",
                maxlength: 240
            }).appendTo(searchBar);
            return searchBar;
        },
        starting: function(evt) {
            var spa = evt.spa,
                self = this,
                basePath = spa.getConfig("baseUrl"),
                routes = spa.getConfig("routes");
            router.on("routed", function(e) {
                var r = e._args.current.route,
                    searchConfig = r.getConfigData("search");
                if (searchConfig) {
                    if (!searchConfig.searchBar) {
                        var searchBar = self._createUi();
                        searchConfig.searchBar = searchBar;
                    }
                    searchConfig.searchBar.place($(searchConfig.container), "first");
                    searchConfig.searchBar.find("input").atwho({
                        at: "#",
                        data: r._anchorData || [],
                        callbacks: {
                            beforeReposition: function(offset) {
                                offset.top += 20;
                            }
                        }
                    }).on("change", function(e) {
                        var target = $(e.target);
                        r.trigger(eventer.create("searched", {
                            _value: target.val().slice(1)
                        }));
                        setTimeout(function() {
                            target.val("").blur();
                        }, 500);
                    });
                }
            });
        },
        routed: function() {

        }
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwbHVnaW5zL3NlYXJjaC9TZWFyY2hDb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImRlZmluZShbXG4gICAgXCJza3lsYXJrL3NwYVwiLFxuICAgIFwianF1ZXJ5XCIsXG4gICAgXCJza3lsYXJrL3JvdXRlclwiLFxuICAgIFwic2t5bGFyay9ldmVudGVyXCIsXG4gICAgXCJjYXJldFwiLFxuICAgIFwiYXR3aG9cIlxuXSwgZnVuY3Rpb24oc3BhLCAkLCByb3V0ZXIsIGV2ZW50ZXIsIGNhcmV0LCBhdHdobykge1xuICAgIHJldHVybiBzcGEuUGx1Z2luQ29udHJvbGxlci5pbmhlcml0KHtcbiAgICAgICAgX2NyZWF0ZVVpOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBzZWFyY2hCYXIgPSAkKFwiPGRpdj5cIikuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcInNlYXJjaC1iYXJcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJChcIjxpbnB1dD5cIikuYXR0cih7XG4gICAgICAgICAgICAgICAgY2xhc3M6IFwiZi1pbnB1dCBqcy1zZWFyY2gtZmllbGRcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcInFcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJTZWFyY2guLi4oZWc6I3h4eClcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICAgICAgICB0YWJpbmRleDogMSxcbiAgICAgICAgICAgICAgICBhdXRvY29tcGxldGU6IFwib2ZmXCIsXG4gICAgICAgICAgICAgICAgbWF4bGVuZ3RoOiAyNDBcbiAgICAgICAgICAgIH0pLmFwcGVuZFRvKHNlYXJjaEJhcik7XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoQmFyO1xuICAgICAgICB9LFxuICAgICAgICBzdGFydGluZzogZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICB2YXIgc3BhID0gZXZ0LnNwYSxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBiYXNlUGF0aCA9IHNwYS5nZXRDb25maWcoXCJiYXNlVXJsXCIpLFxuICAgICAgICAgICAgICAgIHJvdXRlcyA9IHNwYS5nZXRDb25maWcoXCJyb3V0ZXNcIik7XG4gICAgICAgICAgICByb3V0ZXIub24oXCJyb3V0ZWRcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciByID0gZS5fYXJncy5jdXJyZW50LnJvdXRlLFxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hDb25maWcgPSByLmdldENvbmZpZ0RhdGEoXCJzZWFyY2hcIik7XG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaENvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlYXJjaENvbmZpZy5zZWFyY2hCYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWFyY2hCYXIgPSBzZWxmLl9jcmVhdGVVaSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoQ29uZmlnLnNlYXJjaEJhciA9IHNlYXJjaEJhcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hDb25maWcuc2VhcmNoQmFyLnBsYWNlKCQoc2VhcmNoQ29uZmlnLmNvbnRhaW5lciksIFwiZmlyc3RcIik7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaENvbmZpZy5zZWFyY2hCYXIuZmluZChcImlucHV0XCIpLmF0d2hvKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0OiBcIiNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHIuX2FuY2hvckRhdGEgfHwgW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmVSZXBvc2l0aW9uOiBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0LnRvcCArPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIudHJpZ2dlcihldmVudGVyLmNyZWF0ZShcInNlYXJjaGVkXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdmFsdWU6IHRhcmdldC52YWwoKS5zbGljZSgxKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQudmFsKFwiXCIpLmJsdXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICByb3V0ZWQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIl0sImZpbGUiOiJwbHVnaW5zL3NlYXJjaC9TZWFyY2hDb250cm9sbGVyLmpzIn0=
