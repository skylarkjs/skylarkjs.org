define([
    "skylark/spa",
    "skylark/async",
    "jquery",
    "skylark/langx",
    "handlebars",
    "scripts/helpers/AceEditor",
    "scripts/helpers/Partial",
    "scripts/helpers/FolderTreeDomEvent",
    "text!contents/api/api.json",
    "text!scripts/routes/api/api.hbs"
], function(spa, async, $, langx, handlebars, AceEditor, Partial, FolderTreeDomEvent, apiJson, apiTpl) {
    return spa.RouteController.inherit({
        klassName: "GuideController",
        preparing: function(e) {
            var selector = $(langx.trim(apiTpl)),
                deferred = new async.Deferred();
            Partial.get("file-section-partial");
            Partial.get("folder-tree-partial");
            Partial.get("folder-tree-loop-partial");
            var tpl = handlebars.compile(langx.trim(selector.find("#main").html()).replace("{{&gt;", "{{>"));
            e.route.content = tpl({
                sectionPrefix: FolderTreeDomEvent.sectionPrefix(),
                name: e.route.data.name,
                folders: JSON.parse(apiJson)
            });
        },
        entered: function(evt) {
            var baseSelector = $("#pageContainer"),
                args = {
                    section: true,
                    currentFile: null,
                    selector: baseSelector,
                    onFile: function(target, callback) {
                        var self = this,
                            data = target.data();
                        require(["text!contents" + data.path], function(tpl) {
                            var content = $("<div>").attr({
                                class: "gudie-contents"
                            }).html(tpl);
                            content.find("#dw__toc").remove();
                            baseSelector.find(".page-content").html(content);
                            content.find("._doc-code_").forEach(function(node) {
                                var div = $("<div>").attr({
                                    class: "ace-code-editor"
                                }).style({
                                    width: "100%",
                                    height: $(node).height()
                                });
                                var matcher = node.className.match(/code-type-(\w+)/);
                                new AceEditor({
                                    node: div[0],
                                    type: matcher && matcher[1] ? matcher[1] : "text",
                                    value: $(node).html()
                                });
                                $(node).html(div);
                            });
                            callback();
                        });
                    },
                    onSection: function(target) {
                        var data = target.data(),
                            sectionId = data.sectionId;
                        $(document.body).animate({
                            "scrollTop": $("#" + sectionId).position().top
                        }, 200, function() {});
                    }
                },
                domEvt = new FolderTreeDomEvent(args);
            baseSelector.find(".sections").addClass("hide");
            domEvt.selectFolder(baseSelector.find(".entities .folder-entity:first"), args);
            $(document.body).addClass("api-page");
        },
        exited: function() {
            $(document.body).removeClass("api-page");
        }
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyb3V0ZXMvYXBpL0FwaUNvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKFtcbiAgICBcInNreWxhcmsvc3BhXCIsXG4gICAgXCJza3lsYXJrL2FzeW5jXCIsXG4gICAgXCJqcXVlcnlcIixcbiAgICBcInNreWxhcmsvbGFuZ3hcIixcbiAgICBcImhhbmRsZWJhcnNcIixcbiAgICBcInNjcmlwdHMvaGVscGVycy9BY2VFZGl0b3JcIixcbiAgICBcInNjcmlwdHMvaGVscGVycy9QYXJ0aWFsXCIsXG4gICAgXCJzY3JpcHRzL2hlbHBlcnMvRm9sZGVyVHJlZURvbUV2ZW50XCIsXG4gICAgXCJ0ZXh0IWNvbnRlbnRzL2FwaS9hcGkuanNvblwiLFxuICAgIFwidGV4dCFzY3JpcHRzL3JvdXRlcy9hcGkvYXBpLmhic1wiXG5dLCBmdW5jdGlvbihzcGEsIGFzeW5jLCAkLCBsYW5neCwgaGFuZGxlYmFycywgQWNlRWRpdG9yLCBQYXJ0aWFsLCBGb2xkZXJUcmVlRG9tRXZlbnQsIGFwaUpzb24sIGFwaVRwbCkge1xuICAgIHJldHVybiBzcGEuUm91dGVDb250cm9sbGVyLmluaGVyaXQoe1xuICAgICAgICBrbGFzc05hbWU6IFwiR3VpZGVDb250cm9sbGVyXCIsXG4gICAgICAgIHByZXBhcmluZzogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gJChsYW5neC50cmltKGFwaVRwbCkpLFxuICAgICAgICAgICAgICAgIGRlZmVycmVkID0gbmV3IGFzeW5jLkRlZmVycmVkKCk7XG4gICAgICAgICAgICBQYXJ0aWFsLmdldChcImZpbGUtc2VjdGlvbi1wYXJ0aWFsXCIpO1xuICAgICAgICAgICAgUGFydGlhbC5nZXQoXCJmb2xkZXItdHJlZS1wYXJ0aWFsXCIpO1xuICAgICAgICAgICAgUGFydGlhbC5nZXQoXCJmb2xkZXItdHJlZS1sb29wLXBhcnRpYWxcIik7XG4gICAgICAgICAgICB2YXIgdHBsID0gaGFuZGxlYmFycy5jb21waWxlKGxhbmd4LnRyaW0oc2VsZWN0b3IuZmluZChcIiNtYWluXCIpLmh0bWwoKSkucmVwbGFjZShcInt7Jmd0O1wiLCBcInt7PlwiKSk7XG4gICAgICAgICAgICBlLnJvdXRlLmNvbnRlbnQgPSB0cGwoe1xuICAgICAgICAgICAgICAgIHNlY3Rpb25QcmVmaXg6IEZvbGRlclRyZWVEb21FdmVudC5zZWN0aW9uUHJlZml4KCksXG4gICAgICAgICAgICAgICAgbmFtZTogZS5yb3V0ZS5kYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgZm9sZGVyczogSlNPTi5wYXJzZShhcGlKc29uKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudGVyZWQ6IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgICAgdmFyIGJhc2VTZWxlY3RvciA9ICQoXCIjcGFnZUNvbnRhaW5lclwiKSxcbiAgICAgICAgICAgICAgICBhcmdzID0ge1xuICAgICAgICAgICAgICAgICAgICBzZWN0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RmlsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6IGJhc2VTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgb25GaWxlOiBmdW5jdGlvbih0YXJnZXQsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHRhcmdldC5kYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlKFtcInRleHQhY29udGVudHNcIiArIGRhdGEucGF0aF0sIGZ1bmN0aW9uKHRwbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gJChcIjxkaXY+XCIpLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogXCJndWRpZS1jb250ZW50c1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuaHRtbCh0cGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQuZmluZChcIiNkd19fdG9jXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VTZWxlY3Rvci5maW5kKFwiLnBhZ2UtY29udGVudFwiKS5odG1sKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQuZmluZChcIi5fZG9jLWNvZGVfXCIpLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGl2ID0gJChcIjxkaXY+XCIpLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IFwiYWNlLWNvZGUtZWRpdG9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuc3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAkKG5vZGUpLmhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2hlciA9IG5vZGUuY2xhc3NOYW1lLm1hdGNoKC9jb2RlLXR5cGUtKFxcdyspLyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBBY2VFZGl0b3Ioe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogZGl2WzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogbWF0Y2hlciAmJiBtYXRjaGVyWzFdID8gbWF0Y2hlclsxXSA6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICQobm9kZSkuaHRtbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKG5vZGUpLmh0bWwoZGl2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG9uU2VjdGlvbjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHRhcmdldC5kYXRhKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VjdGlvbklkID0gZGF0YS5zZWN0aW9uSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2Nyb2xsVG9wXCI6ICQoXCIjXCIgKyBzZWN0aW9uSWQpLnBvc2l0aW9uKCkudG9wXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDAsIGZ1bmN0aW9uKCkge30pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkb21FdnQgPSBuZXcgRm9sZGVyVHJlZURvbUV2ZW50KGFyZ3MpO1xuICAgICAgICAgICAgYmFzZVNlbGVjdG9yLmZpbmQoXCIuc2VjdGlvbnNcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xuICAgICAgICAgICAgZG9tRXZ0LnNlbGVjdEZvbGRlcihiYXNlU2VsZWN0b3IuZmluZChcIi5lbnRpdGllcyAuZm9sZGVyLWVudGl0eTpmaXJzdFwiKSwgYXJncyk7XG4gICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpLmFkZENsYXNzKFwiYXBpLXBhZ2VcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGV4aXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpLnJlbW92ZUNsYXNzKFwiYXBpLXBhZ2VcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIl0sImZpbGUiOiJyb3V0ZXMvYXBpL0FwaUNvbnRyb2xsZXIuanMifQ==
