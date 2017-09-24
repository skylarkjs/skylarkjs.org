define([
    "skylarkjs/spa",
    "jquery",
    "skylarkjs/router",
    "skylarkjs/eventer",
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
                var r = e.current.route,
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
