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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyb3V0ZXMvZXhhbXBsZXMvRXhhbXBsZXNDb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImRlZmluZShbXG4gICAgXCJhY2VcIixcbiAgICBcInNreWxhcmsvc3BhXCIsXG4gICAgXCJza3lsYXJrL2Nzc1wiLFxuICAgIFwic2t5bGFyay9ldmVudGVyXCIsXG4gICAgXCJza3lsYXJrL2ZpbmRlclwiLFxuICAgIFwic2t5bGFyay9hc3luY1wiLFxuICAgIFwianF1ZXJ5XCIsXG4gICAgXCJza3lsYXJrL2xhbmd4XCIsXG4gICAgXCJoYW5kbGViYXJzXCIsXG4gICAgXCJqb3R0ZWRcIixcbiAgICBcInNjcmlwdHMvaGVscGVycy9pc01vYmlsZVwiLFxuICAgIFwic2NyaXB0cy9oZWxwZXJzL1BhcnRpYWxcIixcbiAgICBcInNjcmlwdHMvaGVscGVycy9Gb2xkZXJUcmVlRG9tRXZlbnRcIixcbiAgICBcInRleHQhY29udGVudHMvZXhhbXBsZXMvZXhhbXBsZXMuanNvblwiLFxuICAgIFwidGV4dCFzY3JpcHRzL3JvdXRlcy9leGFtcGxlcy9leGFtcGxlcy5oYnNcIlxuXSwgZnVuY3Rpb24oYWNlLCBzcGEsIGNzcywgZXZlbnRlciwgZmluZGVyLCBhc3luYywgJCwgbGFuZ3gsIGhhbmRsZWJhcnMsIEpvdHRlZCwgaXNNb2JpbGUsXG4gICAgUGFydGlhbCwgRm9sZGVyVHJlZURvbUV2ZW50LCBleGFtcGxlc0pzb24sIGV4YW1wbGVzVHBsKSB7XG4gICAgdmFyIGN1cnJlbnRGaWxlSXRlbTtcbiAgICByZXR1cm4gc3BhLlJvdXRlQ29udHJvbGxlci5pbmhlcml0KHtcbiAgICAgICAga2xhc3NOYW1lOiBcIkV4YW1wbGVzQ29udHJvbGxlclwiLFxuICAgICAgICBwcmVwYXJpbmc6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9ICQobGFuZ3gudHJpbShleGFtcGxlc1RwbCkpO1xuICAgICAgICAgICAgUGFydGlhbC5nZXQoXCJmb2xkZXItdHJlZS1sb29wLXBhcnRpYWxcIik7XG4gICAgICAgICAgICBQYXJ0aWFsLmdldChcImZvbGRlci10cmVlLXBhcnRpYWxcIik7XG4gICAgICAgICAgICB2YXIgdHBsID0gaGFuZGxlYmFycy5jb21waWxlKGxhbmd4LnRyaW0oc2VsZWN0b3IuZmluZChcIiNtYWluXCIpLmh0bWwoKSkucmVwbGFjZShcInt7Jmd0O1wiLCBcInt7PlwiKSk7XG4gICAgICAgICAgICBlLnJvdXRlLmNvbnRlbnQgPSB0cGwoe1xuICAgICAgICAgICAgICAgIG5hbWU6IGUucm91dGUuZGF0YS5uYW1lLFxuICAgICAgICAgICAgICAgIGZvbGRlcnM6IEpTT04ucGFyc2UoZXhhbXBsZXNKc29uKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZ2V0U2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzaXplLFxuICAgICAgICAgICAgICAgICAgICBuYXYgPSAkKFwiLm5hdmJhclwiKSxcbiAgICAgICAgICAgICAgICAgICAgc2QgPSAkKFwiLnNpZGViYXJcIiksXG4gICAgICAgICAgICAgICAgICAgIHdkID0gJCh3aW5kb3cpO1xuICAgICAgICAgICAgICAgIGlmIChpc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNpemUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHdkLmhlaWdodCgpIC0gbmF2LmhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2l6ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3ZC53aWR0aCgpIC0gc2Qud2lkdGgoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogd2QuaGVpZ2h0KCkgLSBuYXYuaGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJChcIi5wYWdlLWNvbnRlbnRcIikuY3NzKGdldFNpemUoKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudGVyZWQ6IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGV2ZW50ZXIub2ZmKHdpbmRvdywgXCJyZXNpemVcIik7XG4gICAgICAgICAgICBldmVudGVyLm9uKHdpbmRvdywgXCJyZXNpemVcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHNlbGYucmVzaXplKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBmaXJzdENsaWNrID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgYmFzZVNlbGVjdG9yID0gJChcIiNwYWdlQ29udGFpbmVyXCIpLFxuICAgICAgICAgICAgICAgIGVkaXRvciA9IGJhc2VTZWxlY3Rvci5maW5kKFwiI2VkaXRvclwiKSxcbiAgICAgICAgICAgICAgICBhcmdzID0ge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogYmFzZVNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICBvbkZpbGU6IGZ1bmN0aW9uKHRhcmdldCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gdGFyZ2V0LmRhdGEoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gZGF0YS5wYXRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgam90dGVkID0gbmV3IEpvdHRlZChlZGl0b3JbMF0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJodG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogXCJjb250ZW50cy9cIiArIHBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0JsYW5rOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBydW5TY3JpcHRzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbnM6IFsnYWNlJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFjZUVkaXRvciA9IGpvdHRlZC5fZ2V0KFwicGx1Z2luc1wiKS5hY2UuZWRpdG9yLmh0bWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWNlRWRpdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNlRWRpdG9yLnNldFRoZW1lKFwiYWNlL3RoZW1lL3R3aWxpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjZUVkaXRvci5nZXRTZXNzaW9uKCkuc2V0VGFiU2l6ZSg0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2VFZGl0b3IuZ2V0U2Vzc2lvbigpLnNldFVzZVdyYXBNb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb25Gb2xkZXI6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJzdENsaWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9tRXZ0LmN1cnJlbnRGb2xkZXIgPSBkb21FdnQuY3VycmVudEZvbGRlci5maW5kKFwiLmZvbGRlcnMgLnNpZGUtbGluazpmaXJzdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkb21FdnQuY3VycmVudFBhdGggPSBkb21FdnQuY3VycmVudEZvbGRlci5maW5kKFwiLmZvbGRlci1lbnRpdHk6Zmlyc3RcIikuZGF0YSgpLnBhdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3RDbGljayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGRvbUV2dCA9IG5ldyBGb2xkZXJUcmVlRG9tRXZlbnQoYXJncyk7XG4gICAgICAgICAgICBkb21FdnQuc2VsZWN0Rm9sZGVyKGJhc2VTZWxlY3Rvci5maW5kKFwiLmVudGl0aWVzIC5mb2xkZXItZW50aXR5OmZpcnN0XCIpLCBhcmdzKTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQuYm9keSkuYWRkQ2xhc3MoXCJleGFtcGxlcy1wYWdlXCIpO1xuICAgICAgICB9LFxuICAgICAgICBleGl0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5yZW1vdmVDbGFzcyhcImV4YW1wbGVzLXBhZ2VcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIl0sImZpbGUiOiJyb3V0ZXMvZXhhbXBsZXMvRXhhbXBsZXNDb250cm9sbGVyLmpzIn0=
