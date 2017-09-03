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
                    _toggleCurrentFile: function() {
                        if (this.currentFile) this.currentFile.parent().parent().find(">.sections").toggleClass("hide");
                    },
                    selector: baseSelector,
                    onFile: function(target) {
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
                            self._toggleCurrentFile();
                            var old = this.currentFile;
                            self.currentFile = target;
                            self._toggleCurrentFile();
                            window._goTop();
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
