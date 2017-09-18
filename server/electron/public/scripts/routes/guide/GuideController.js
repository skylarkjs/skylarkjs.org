define([
    "skylark/spa",
    "skylark/async",
    "jquery",
    "skylark/eventer",
    "skylark/langx",
    "handlebars",
    "scripts/helpers/AceEditor",
    "scripts/helpers/Partial",
    "scripts/helpers/FolderTreeDomEvent",
    "text!contents/guide/guide.json",
    "text!scripts/routes/guide/guide.hbs"
], function(spa, async, $, eventer, langx, handlebars, AceEditor, Partial, FolderTreeDomEvent, guideJson, guideTpl) {
    var _heightObj = {},
        _currentRange = null,
        _isClickScroll = false,
        _rangeInfo = {},
        _sectionPrefix = FolderTreeDomEvent.sectionPrefix();
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
        entered: function(evt) {
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
                            evt.route._anchorData = Object.values(_heightObj);
                            callback();
                        });
                    },
                    onSection: function(target) {
                        var data = target.data(),
                            sectionId = data.sectionId;
                        // eventer.off(window, "scroll");
                        if($("#" + sectionId).length) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyb3V0ZXMvZ3VpZGUvR3VpZGVDb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImRlZmluZShbXG4gICAgXCJza3lsYXJrL3NwYVwiLFxuICAgIFwic2t5bGFyay9hc3luY1wiLFxuICAgIFwianF1ZXJ5XCIsXG4gICAgXCJza3lsYXJrL2V2ZW50ZXJcIixcbiAgICBcInNreWxhcmsvbGFuZ3hcIixcbiAgICBcImhhbmRsZWJhcnNcIixcbiAgICBcInNjcmlwdHMvaGVscGVycy9BY2VFZGl0b3JcIixcbiAgICBcInNjcmlwdHMvaGVscGVycy9QYXJ0aWFsXCIsXG4gICAgXCJzY3JpcHRzL2hlbHBlcnMvRm9sZGVyVHJlZURvbUV2ZW50XCIsXG4gICAgXCJ0ZXh0IWNvbnRlbnRzL2d1aWRlL2d1aWRlLmpzb25cIixcbiAgICBcInRleHQhc2NyaXB0cy9yb3V0ZXMvZ3VpZGUvZ3VpZGUuaGJzXCJcbl0sIGZ1bmN0aW9uKHNwYSwgYXN5bmMsICQsIGV2ZW50ZXIsIGxhbmd4LCBoYW5kbGViYXJzLCBBY2VFZGl0b3IsIFBhcnRpYWwsIEZvbGRlclRyZWVEb21FdmVudCwgZ3VpZGVKc29uLCBndWlkZVRwbCkge1xuICAgIHZhciBfaGVpZ2h0T2JqID0ge30sXG4gICAgICAgIF9jdXJyZW50UmFuZ2UgPSBudWxsLFxuICAgICAgICBfaXNDbGlja1Njcm9sbCA9IGZhbHNlLFxuICAgICAgICBfcmFuZ2VJbmZvID0ge30sXG4gICAgICAgIF9zZWN0aW9uUHJlZml4ID0gRm9sZGVyVHJlZURvbUV2ZW50LnNlY3Rpb25QcmVmaXgoKTtcbiAgICB2YXIgY2FsY3VsYXRlSGVpZ2h0ID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgdmFyIGhiID0ge30sXG4gICAgICAgICAgICAgICAgcGFnZVRvcCA9ICQoXCIucGFnZS1jb250ZW50XCIpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgICAgICAgICAgIHZhciBfY2FsY3VsYXRlSGVpZ2h0ID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIGlmICghbm9kZS5pZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vIHZhciB0b3AgPSAkKFwiI1wiICsgbm9kZS5pZCkucG9zaXRpb24oKS50b3A7XG4gICAgICAgICAgICAgICAgdmFyIHRvcCA9ICQoXCIjXCIgKyBub2RlLmlkKVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgICAgICAgICAgICAgaGJbdG9wXSA9IG5vZGUuaWQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJChcImgxXCIpLmZvckVhY2goX2NhbGN1bGF0ZUhlaWdodCk7XG4gICAgICAgICAgICAkKFwiaDJcIikuZm9yRWFjaChfY2FsY3VsYXRlSGVpZ2h0KTtcbiAgICAgICAgICAgICQoXCJoM1wiKS5mb3JFYWNoKF9jYWxjdWxhdGVIZWlnaHQpO1xuICAgICAgICAgICAgcmV0dXJuIF9oZWlnaHRPYmogPSBoYjtcbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlybVJhbmdlID0gZnVuY3Rpb24ocmFuZ2VzLCB2YWx1ZSwgbGVuLCBjb3VudCkge1xuICAgICAgICAgICAgdmFyIHJhbmdlID0gcmFuZ2VzW2NvdW50XTtcbiAgICAgICAgICAgIC8vIGlmIChyYW5nZVswXSA8PSB2YWx1ZSAmJiB2YWx1ZSA8PSByYW5nZVsxXSkge1xuICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwICYmIHJhbmdlWzBdID4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFuZ2VzWzBdXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFyYW5nZVsxXSB8fCAoY291bnQgPT09IGxlbiAmJiB2YWx1ZSA+IHJhbmdlWzFdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByYW5nZXNbbGVuXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmFuZ2VbMF0gPD0gdmFsdWUgJiYgcmFuZ2VbMV0gPj0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFuZ2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25maXJtUmFuZ2UocmFuZ2VzLCB2YWx1ZSwgbGVuLCArK2NvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlUmFuZ2VJbmZvID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgX2hiID0gY2FsY3VsYXRlSGVpZ2h0KCk7XG4gICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKF9oYikuc29ydChmdW5jdGlvbih4LCB5KSB7IHJldHVybiB4IC0geTsgfSksXG4gICAgICAgICAgICAgICAgcmFuZ2VzID0ga2V5cy5tYXAoZnVuY3Rpb24oYSwgaSkgeyByZXR1cm4gW3BhcnNlSW50KGtleXNbaV0pLCBwYXJzZUludChrZXlzW2kgKyAxXSldOyB9KSxcbiAgICAgICAgICAgICAgICBsZW4gPSByYW5nZXMubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBrZXlzOiBrZXlzLFxuICAgICAgICAgICAgICAgIHJhbmdlczogcmFuZ2VzLFxuICAgICAgICAgICAgICAgIGxlbjogbGVuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVdpblNjcm9sbEhhbmRsZXIgPSBmdW5jdGlvbihkb21FdnQpIHtcbiAgICAgICAgICAgIHJldHVybiBldmVudGVyLm9uKHdpbmRvdywgXCJzY3JvbGxcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChfY3VycmVudFJhbmdlICYmIHdpbmRvdy5wYWdlWU9mZnNldCA+IF9jdXJyZW50UmFuZ2VbMF0gJiYgd2luZG93LnBhZ2VZT2Zmc2V0IDwgX2N1cnJlbnRSYW5nZVsxXSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHZhciByYW5nZSA9IGNvbmZpcm1SYW5nZShfcmFuZ2VJbmZvLnJhbmdlcywgd2luZG93LnBhZ2VZT2Zmc2V0LCBfcmFuZ2VJbmZvLmxlbiAtIDEsIDApO1xuICAgICAgICAgICAgICAgIGlmICghcmFuZ2VbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0U2lkZUFuY2hvcihkb21FdnQsIF9oZWlnaHRPYmpbX3JhbmdlSW5mby5rZXlzLnNsaWNlKC0xKVswXV0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2N1cnJlbnRSYW5nZSA9IG51bGw7IC8vIOa7muWKqOWIsOacgOWQjuaXtu+8jOWIneWni+WMllxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gcmFuZ2VbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0U2lkZUFuY2hvcihkb21FdnQsIF9oZWlnaHRPYmpbcmFuZ2VbMF1dKTtcbiAgICAgICAgICAgICAgICAgICAgX2N1cnJlbnRSYW5nZSA9IHJhbmdlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNlbGVjdFNpZGVBbmNob3IgPSBmdW5jdGlvbihkb21FdnQsIGlkKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSAkKFwiI1wiICsgX3NlY3Rpb25QcmVmaXggKyBpZCk7XG4gICAgICAgICAgICBkb21FdnQuc2V0U2VjdGlvbkFjdGl2ZWQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHNlbGVjdG9yLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIOaciemXrumimOeCueWHu+eahOaXtuWAme+8jOS4jeW6lOivpeinpuWPkXdpbmRvd+eahHNjcm9sbO+8jHNjcm9sbOeahHNldFRpbWVvdXTnmoTpl67pophcbiAgICAgICAgICAgICAgICAvLyDkuLTml7bop6PlhrNcbiAgICAgICAgICAgICAgICAkKFwiLnNpZGViYXJcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIFwic2Nyb2xsVG9wXCI6IHNlbGVjdG9yLnBvc2l0aW9uKCkudG9wXG4gICAgICAgICAgICAgICAgfSwgMjAwLCBmdW5jdGlvbigpIHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIHJldHVybiBzcGEuUm91dGVDb250cm9sbGVyLmluaGVyaXQoe1xuICAgICAgICBrbGFzc05hbWU6IFwiR3VpZGVDb250cm9sbGVyXCIsXG4gICAgICAgIF9kb21FdnQ6IG51bGwsXG4gICAgICAgIF9kb21FdnRBcmdzOiBudWxsLFxuICAgICAgICBwcmVwYXJpbmc6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9ICQobGFuZ3gudHJpbShndWlkZVRwbCkpO1xuICAgICAgICAgICAgUGFydGlhbC5nZXQoXCJmaWxlLXNlY3Rpb24tcGFydGlhbFwiKTtcbiAgICAgICAgICAgIFBhcnRpYWwuZ2V0KFwiZm9sZGVyLXRyZWUtbG9vcC1wYXJ0aWFsXCIpO1xuICAgICAgICAgICAgUGFydGlhbC5nZXQoXCJmb2xkZXItdHJlZS1wYXJ0aWFsXCIpO1xuICAgICAgICAgICAgdmFyIHRwbCA9IGhhbmRsZWJhcnMuY29tcGlsZShsYW5neC50cmltKHNlbGVjdG9yLmZpbmQoXCIjbWFpblwiKS5odG1sKCkpLnJlcGxhY2UoXCJ7eyZndDtcIiwgXCJ7ez5cIikpO1xuICAgICAgICAgICAgdmFyIGRvY0RhdGEgPSBKU09OLnBhcnNlKGd1aWRlSnNvbik7XG4gICAgICAgICAgICBlLnJvdXRlLmNvbnRlbnQgPSB0cGwoe1xuICAgICAgICAgICAgICAgIHNlY3Rpb25QcmVmaXg6IF9zZWN0aW9uUHJlZml4LFxuICAgICAgICAgICAgICAgIG5hbWU6IGUucm91dGUuZGF0YS5uYW1lLFxuICAgICAgICAgICAgICAgIGZvbGRlcnM6IGRvY0RhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBlbnRlcmVkOiBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgIHZhciBiYXNlU2VsZWN0b3IgPSAkKFwiI3BhZ2VDb250YWluZXJcIiksXG4gICAgICAgICAgICAgICAgYXJncyA9IHRoaXMuX2RvbUV2dEFyZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNlY3Rpb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBiYXNlU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgICAgIG9uRmlsZTogZnVuY3Rpb24odGFyZ2V0LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB0YXJnZXQuZGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZShbXCJ0ZXh0IWNvbnRlbnRzXCIgKyBkYXRhLnBhdGhdLCBmdW5jdGlvbih0cGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9ICQoXCI8ZGl2PlwiKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IFwiZ3VkaWUtY29udGVudHNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmh0bWwodHBsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LmZpbmQoXCIjZHdfX3RvY1wiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlU2VsZWN0b3IuZmluZChcIi5wYWdlLWNvbnRlbnRcIikuaHRtbChjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LmZpbmQoXCIuX2RvYy1jb2RlX1wiKS5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpdiA9ICQoXCI8ZGl2PlwiKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcImFjZS1jb2RlLWVkaXRvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJChub2RlKS5oZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoZXIgPSBub2RlLmNsYXNzTmFtZS5tYXRjaCgvY29kZS10eXBlLShcXHcrKS8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgQWNlRWRpdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGRpdlswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IG1hdGNoZXIgJiYgbWF0Y2hlclsxXSA/IG1hdGNoZXJbMV0gOiBcInRleHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAkKG5vZGUpLmh0bWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChub2RlKS5odG1sKGRpdik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JhbmdlSW5mbyA9IGNyZWF0ZVJhbmdlSW5mbygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2dC5yb3V0ZS5fYW5jaG9yRGF0YSA9IE9iamVjdC52YWx1ZXMoX2hlaWdodE9iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvblNlY3Rpb246IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB0YXJnZXQuZGF0YSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25JZCA9IGRhdGEuc2VjdGlvbklkO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXZlbnRlci5vZmYod2luZG93LCBcInNjcm9sbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCQoXCIjXCIgKyBzZWN0aW9uSWQpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuYm9keSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2Nyb2xsVG9wXCI6ICQoXCIjXCIgKyBzZWN0aW9uSWQpLnBvc2l0aW9uKCkudG9wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNyZWF0ZVdpblNjcm9sbEhhbmRsZXIoZG9tRXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSwgMjAwMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZG9tRXZ0ID0gdGhpcy5fZG9tRXZ0ID0gbmV3IEZvbGRlclRyZWVEb21FdmVudChhcmdzKTtcbiAgICAgICAgICAgIGRvbUV2dC5zZWxlY3RGb2xkZXIoYmFzZVNlbGVjdG9yLmZpbmQoXCIuZW50aXRpZXMgLmZvbGRlci1lbnRpdHk6Zmlyc3RcIiksIGFyZ3MpO1xuICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5hZGRDbGFzcyhcImd1aWRlLXBhZ2VcIik7XG4gICAgICAgICAgICAvLyBjcmVhdGVXaW5TY3JvbGxIYW5kbGVyKGRvbUV2dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2VhcmNoZWQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2RvbUV2dC5zZWxlY3RTZWN0aW9uKCQoXCIjXCIgKyBfc2VjdGlvblByZWZpeCArIGUuX3ZhbHVlKSwgdGhpcy5fZG9tRXZ0QXJncyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXhpdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoZG9jdW1lbnQuYm9keSkucmVtb3ZlQ2xhc3MoXCJndWlkZS1wYWdlXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiJdLCJmaWxlIjoicm91dGVzL2d1aWRlL0d1aWRlQ29udHJvbGxlci5qcyJ9
