define([
    "jquery",
    "skylarkjs",
    "handlebars",
    "scripts/helpers/AceEditor",
    "scripts/helpers/Partial",
    "scripts/helpers/FolderTreeDomEvent",
    "text!contents/guide/guide.json",
    "text!scripts/routes/guide/guide.hbs"
], function($, skylarkjs, handlebars, AceEditor, Partial, FolderTreeDomEvent, guideJson, guideTpl) {
    var _heightObj = {},
        _currentRange = null,
        _isClickScroll = false,
        _rangeInfo = {},
        _sectionPrefix = FolderTreeDomEvent.sectionPrefix(),
        spa = skylarkjs.spa,
        langx = skylarkjs.langx,
        noder = skylarkjs.noder,
        eventer = skylarkjs.eventer;
    var calculateHeight = function(node) {
            var hb = {},
                pageTop = $(".page-content")[0].getBoundingClientRect().top;
            var _calculateHeight = function(node) {
                if (!node.id) return;
                // var top = $("#" + node.id).position().top;
                var top = $("#" + node.id)[0].getBoundingClientRect().top;
                hb[top] = node.id;
            };
            $("h1").forEach(_calculateHeight);
            $("h2").forEach(_calculateHeight);
            $("h3").forEach(_calculateHeight);
            return _heightObj = hb;
        },
        confirmRange = function(ranges, value, len, count) {
            var range = ranges[count];
            // if (range[0] <= value && value <= range[1]) {
            if (count === 0 && range[0] > value) {
                return ranges[0]
            } else if (!range[1] || (count === len && value > range[1])) {
                return ranges[len];
            } else if (range[0] <= value && range[1] >= value) {
                return range;
            } else {
                return confirmRange(ranges, value, len, ++count);
            }
        },
        createRangeInfo = function() {
            var _hb = calculateHeight();
            var keys = Object.keys(_hb).sort(function(x, y) { return x - y; }),
                ranges = keys.map(function(a, i) { return [parseInt(keys[i]), parseInt(keys[i + 1])]; }),
                len = ranges.length;
            return {
                keys: keys,
                ranges: ranges,
                len: len
            };
        },

        createWinScrollHandler = function(domEvt) {
            return eventer.on(window, "scroll", function(e) {
                if (_currentRange && window.pageYOffset > _currentRange[0] && window.pageYOffset < _currentRange[1]) return;
                var range = confirmRange(_rangeInfo.ranges, window.pageYOffset, _rangeInfo.len - 1, 0);
                if (!range[1]) {
                    selectSideAnchor(domEvt, _heightObj[_rangeInfo.keys.slice(-1)[0]]);
                    return _currentRange = null; // 滚动到最后时，初始化
                }
                if (window.pageYOffset > range[0]) {
                    selectSideAnchor(domEvt, _heightObj[range[0]]);
                    _currentRange = range;
                }
            });
        },

        selectSideAnchor = function(domEvt, id) {
            var selector = $("#" + _sectionPrefix + id);
            domEvt.setSectionActived(selector);
            if (selector.length) {
                // 有问题点击的时候，不应该触发window的scroll，scroll的setTimeout的问题
                // 临时解决
                $(".sidebar").animate({
                    "scrollTop": selector.position().top
                }, 200, function() {});
            }
        };

    return spa.RouteController.inherit({
        klassName: "GuideController",
        _domEvt: null,
        _domEvtArgs: null,
        preparing: function(e) {
            var selector = $(langx.trim(guideTpl));
            Partial.get("file-section-partial");
            Partial.get("folder-tree-loop-partial");
            Partial.get("folder-tree-partial");
            var tpl = handlebars.compile(langx.trim(selector.find("#main").html()).replace("{{&gt;", "{{>"));
            var docData = JSON.parse(guideJson);
            e.route.content = tpl({
                sectionPrefix: _sectionPrefix,
                name: e.route.data.name,
                folders: docData
            });
        },
        rendered: function(evt) {
            var baseSelector = $("#pageContainer"),
                args = this._domEvtArgs = {
                    section: true,
                    selector: baseSelector,
                    onFile: function(target, callback) {
                        var data = target.data();
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
                            _rangeInfo = createRangeInfo();
                            // evt.route._anchorData = Object.values(_heightObj);
                            callback();
                        });
                    },
                    onSection: function(target) {
                        var data = target.data(),
                            sectionId = data.sectionId;
                        // eventer.off(window, "scroll");
                        if ($("#" + sectionId).length) {
                            $(document.body).animate({
                                "scrollTop": $("#" + sectionId).position().top
                            }, 200, function() {
                                // setTimeout(function() {
                                //     createWinScrollHandler(domEvt);
                                // }, 2000)
                            });
                        }
                    }
                },
                domEvt = this._domEvt = new FolderTreeDomEvent(args);
            domEvt.selectFolder(baseSelector.find(".entities .folder-entity:first"), args);
            $(document.body).addClass("guide-page");
            // createWinScrollHandler(domEvt);
        },

        searched: function(e) {
            this._domEvt.selectSection($("#" + _sectionPrefix + e._value), this._domEvtArgs);
        },

        exited: function() {
            $(document.body).removeClass("guide-page");
        }
    });
});
