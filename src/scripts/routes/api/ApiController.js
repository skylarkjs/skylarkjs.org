define([
    "skylarkjs/spa",
    "jquery",
    "skylarkjs/langx",
    "handlebars",
    "scripts/helpers/AceEditor",
    "scripts/helpers/Partial",
    "scripts/helpers/FolderTreeDomEvent",
    "text!contents/api/api.json",
    "text!scripts/routes/api/api.hbs"
], function(spa, $, langx, handlebars, AceEditor, Partial, FolderTreeDomEvent, apiJson, apiTpl) {
    return spa.RouteController.inherit({
        klassName: "GuideController",
        preparing: function(e) {
            var selector = $(langx.trim(apiTpl)),
                deferred = new langx.Deferred();
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
