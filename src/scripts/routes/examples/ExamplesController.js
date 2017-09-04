define([
    "ace",
    "skylark/spa",
    "skylark/css",
    "skylark/eventer",
    "skylark/finder",
    "skylark/async",
    "jquery",
    "skylark/langx",
    "handlebars",
    "jotted",
    "scripts/helpers/isMobile",
    "scripts/helpers/Partial",
    "scripts/helpers/FolderTreeDomEvent",
    "text!contents/examples/examples.json",
    "text!scripts/routes/examples/examples.hbs"
], function(ace, spa, css, eventer, finder, async, $, langx, handlebars, Jotted, isMobile,
    Partial, FolderTreeDomEvent, examplesJson, examplesTpl) {
    var currentFileItem;
    return spa.RouteController.inherit({
        klassName: "ExamplesController",
        preparing: function(e) {
            var selector = $(langx.trim(examplesTpl));
            Partial.get("folder-tree-loop-partial");
            Partial.get("folder-tree-partial");
            var tpl = handlebars.compile(langx.trim(selector.find("#main").html()).replace("{{&gt;", "{{>"));
            e.route.content = tpl({
                name: e.route.data.name,
                folders: JSON.parse(examplesJson)
            });
        },
        resize: function() {
            var getSize = function() {
                var size,
                    nav = $(".navbar"),
                    sd = $(".sidebar"),
                    wd = $(window);
                if (isMobile()) {
                    size = {
                        width: "100%",
                        height: wd.height() - nav.height()
                    };
                } else {
                    size = {
                        width: wd.width() - sd.width(),
                        height: wd.height() - nav.height()
                    };
                }
                return size;
            };
            $(".page-content").css(getSize());
        },
        entered: function(evt) {
            this.resize();
            var self = this;
            eventer.off(window, "resize");
            eventer.on(window, "resize", function(e) {
                self.resize();
            });
            var firstClick = false,
                baseSelector = $("#pageContainer"),
                editor = baseSelector.find("#editor"),
                args = {
                    selector: baseSelector,
                    onFile: function(target, callback) {
                        var data = target.data(),
                            path = data.path;
                        editor.empty();
                        var jotted = new Jotted(editor[0], {
                            files: [{
                                type: "html",
                                url: "contents/" + path,
                            }],
                            showBlank: false,
                            runScripts: true,
                            plugins: ['ace']
                        });
                        var aceEditor = jotted._get("plugins").ace.editor.html;
                        if (aceEditor) {
                            aceEditor.setTheme("ace/theme/twilight");
                            aceEditor.getSession().setTabSize(4);
                            aceEditor.getSession().setUseWrapMode(true);
                        }
                        callback();
                    },
                    onFolder: function(target) {
                        if (!firstClick) {
                            // domEvt.currentFolder = domEvt.currentFolder.find(".folders .side-link:first");
                            // domEvt.currentPath = domEvt.currentFolder.find(".folder-entity:first").data().path;
                            // firstClick = true;
                        }
                    }
                };
            var domEvt = new FolderTreeDomEvent(args);
            domEvt.selectFolder(baseSelector.find(".entities .folder-entity:first"), args);
            $(document.body).addClass("examples-page");
        },
        exited: function() {
            $(document.body).removeClass("examples-page");
        }
    });
});
