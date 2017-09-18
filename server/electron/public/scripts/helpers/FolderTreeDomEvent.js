define([
    "./isMobile",
    "./mobileSidebar",
    "skylark/langx",
    "jquery"
], function(isMobile, mobileSidebar, langx, $) {
    var _sectionPrefix = "_section-";
    var FolderTreeDomEvent = langx.klass({
        klassName: "FolderTreeDomEvent",
        activeItem: null,
        currentFolder: null,
        currentFile: null,
        clickTree: {},
        currentPath: null,
        currentSection: null,
        init: function(args) {
            this.clickTree = {};
            mobileSidebar.start();
            var self = this;
            args.selector.find(".entities").delegate(".folder-entity", "click", function(e) {
                self.selectFolder($(e.currentTarget), args);
            });
            args.selector.find(".entities").delegate(".file-entity", "click", function(e) {
                self.selectFile($(e.currentTarget), args);
            });

            args.selector.find(".entities").delegate(".section-entity", "click", function(e) {
                self.selectSection($(e.currentTarget), args)
            });
        },
        selectFolder: function(target, args) {
            var parent = $(target.parent().parent()),
                data = target.data(),
                path = data.path;
            if (parent.hasClass("active")) {
                // 再次点击，保存当前folder中打开的folder和file
                this._setFolderUnActive(parent);
            } else {
                // 点击一级folder
                if (target.hasClass("root")) {
                    this._setFolderUnActive(".folders.menu-main li.active");
                    this.currentRootPath = path;
                    if (!this.clickTree[path]) {
                        // 隐藏一级folder中active的folder
                        // 显示点击folder的内容
                        this._setFolderActive(parent);
                        var firstFolderS = parent.find(".folders.menu-root li:first");
                        if (firstFolderS.length) {
                            firstFileS = firstFolderS.find(".files:first");
                        } else {
                            firstFileS = parent.find(".files.menu-root li:first");
                        }
                        this.clickTree[path] = {
                            type: "root",
                            path: path,
                            currentSub: {
                                selector: firstFolderS
                            }
                        }
                        parent.find(".files:first").removeClass("hide");
                    }
                    this._setFolderActive(parent);
                    this._setFolderActive(this.clickTree[path].currentSub.selector);
                    if (this.clickTree[path].currentSub.file) {
                        this.selectFile(this.clickTree[path].currentSub.file.selector, args, true);
                    } else {
                        this.selectFile(firstFileS.find(".file-entity:first"), args);
                    }
                } else {
                    var parentPath = path.replace(path.replace(/^.*[\\\/]/, ''), "").slice(0, -1);
                    // 显示该folder中第一个file的内容
                    var prevSub = this.clickTree[parentPath].currentSub;
                    // 隐藏二级folder中active的folder
                    this._setFolderUnActive(prevSub.selector);
                    var sub = this.clickTree[parentPath].currentSub = {
                        type: "sub",
                        selector: parent,
                    };
                    // 显示点击folder的内容
                    this.currentRootPath = parentPath;
                    this._setFolderActive(sub.selector);
                    var reg = new RegExp("^" + path);
                    if (prevSub.file && prevSub.file.filePath.match(reg)) {
                        this.selectFile(prevSub.file.selector, args);
                    } else {
                        this.selectFile(parent.find(".file-entity:first"), args);
                    }
                    sub.prevFile = prevSub.file;
                }
            }
        },
        selectFile: function(target, args, selectFileOnly) {
            if (target.length === 0) return;
            var self = this;
            this.hideContent();
            if (args.onFile) args.onFile(target, function() {
                if (selectFileOnly) {
                    var sub = self.clickTree[self.currentRootPath].currentSub;
                    if (sub.file.section) {
                        self.selectSection(sub.file.section, args);
                    } else {
                        window._goTop();
                    }
                    sub.file.selector.parent().parent().toggleClass("active");
                } else {
                    self._updateClickTreeFile(target, args);
                }
            });
        },

        selectSection: function(target, args) {
            this.setSectionActived(target, args);
            if (args.onSection) args.onSection(target);
            this.hideContent();
        },

        hideContent: function() {
            mobileSidebar.hide();
        },

        sectionPrefix: function() {
            return _sectionPrefix;
        },

        setSectionActived: function(target) {
            if (this.currentSection) $(this.currentSection).removeClass("active");
            this.currentSection = $(target.parent().parent());
            this.currentSection.addClass("active");
            this._updateClickTreeSection(target);
        },

        _updateClickTreeFile: function(file, args) {
            var sub = this.clickTree[this.currentRootPath].currentSub;
            // sub.file = null第一次进入不需要管
            if (sub.file) {
                if (args.section) {
                    if (sub.file.filePath === file.data().path) {
                        // 点击相同file
                        var parent = file.parent().parent();
                        if (parent.hasClass("active")) {
                            this._setFileUnActive(file, true);
                        } else {
                            if (sub.file.section) {
                                this.selectSection(sub.file.section, args);
                            } else {
                                window._goTop();
                            }
                            this._setFileActive(sub, file, true);
                        }
                    } else {
                        if (sub.prevFile && sub.prevFile.filePath === file.data().path) {
                            // 再次点击上一次file，选中上一次file中保存的section
                            if (sub.prevFile.section) {
                                this.selectSection(sub.prevFile.section, args);
                            }
                            var prevSection = sub.file.section;
                            this._setFileActive(sub, file, true);
                            sub.file.section = sub.file.section;
                        } else {
                            window._goTop();
                            this._setFileActive(sub, file, true);
                        }
                    }
                } else {
                    this._setFileActive(sub, file, false);
                }
            } else {
                if (args.section) window._goTop();
                this._setFileActive(sub, file, args.section);
            }
        },

        _setFileActive: function(sub, file, needSection) {
            if (sub.file) this._setFileUnActive(sub.file.selector, needSection);
            var parent = file.parent().parent();
            parent.addClass("active");
            if (needSection) parent.find(">.sections").removeClass("hide");
            sub.prevFile = sub.file;
            sub.file = {
                selector: file,
                filePath: file.data().path
            };
        },

        _setFileUnActive: function(file, needSection) {
            var parent = file.parent().parent();
            parent.removeClass("active");
            if (needSection) parent.find(">.sections").addClass("hide");
        },

        _updateClickTreeSection: function(section) {
            this.clickTree[this.currentRootPath].currentSub.file.section = section;
        },

        _setFolderActive: function(selector) {
            // 当前层次的folders与files全部展开，并把第一个folder下的files展开
            var s = $(selector);
            s.addClass("active").find(">.folders").removeClass("hide");
            s.find(">.files").removeClass("hide");
        },

        _setFolderUnActive: function(selector) {
            // 当前层次的folders与files全部展开，并把第一个folder下的files展开
            var s = $(selector);
            s.removeClass("active").find(">.folders").addClass("hide");
            s.find(".files").addClass("hide");
        },

        _toggleFolderActive: function(selector) {
            // 当前层次的folders与files全部展开，并把第一个folder下的files展开
            var s = $(selector);
            s.toggleClass("active").find(">.folders").toggleClass("hide").find(".files:first").toggleClass("hide");
            s.find(">.files").toggleClass("hide");
        }
    });

    FolderTreeDomEvent._sectionPrefix = _sectionPrefix;
    FolderTreeDomEvent.sectionPrefix = function() {
        return _sectionPrefix;
    };
    return FolderTreeDomEvent;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJoZWxwZXJzL0ZvbGRlclRyZWVEb21FdmVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoW1xuICAgIFwiLi9pc01vYmlsZVwiLFxuICAgIFwiLi9tb2JpbGVTaWRlYmFyXCIsXG4gICAgXCJza3lsYXJrL2xhbmd4XCIsXG4gICAgXCJqcXVlcnlcIlxuXSwgZnVuY3Rpb24oaXNNb2JpbGUsIG1vYmlsZVNpZGViYXIsIGxhbmd4LCAkKSB7XG4gICAgdmFyIF9zZWN0aW9uUHJlZml4ID0gXCJfc2VjdGlvbi1cIjtcbiAgICB2YXIgRm9sZGVyVHJlZURvbUV2ZW50ID0gbGFuZ3gua2xhc3Moe1xuICAgICAgICBrbGFzc05hbWU6IFwiRm9sZGVyVHJlZURvbUV2ZW50XCIsXG4gICAgICAgIGFjdGl2ZUl0ZW06IG51bGwsXG4gICAgICAgIGN1cnJlbnRGb2xkZXI6IG51bGwsXG4gICAgICAgIGN1cnJlbnRGaWxlOiBudWxsLFxuICAgICAgICBjbGlja1RyZWU6IHt9LFxuICAgICAgICBjdXJyZW50UGF0aDogbnVsbCxcbiAgICAgICAgY3VycmVudFNlY3Rpb246IG51bGwsXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpY2tUcmVlID0ge307XG4gICAgICAgICAgICBtb2JpbGVTaWRlYmFyLnN0YXJ0KCk7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBhcmdzLnNlbGVjdG9yLmZpbmQoXCIuZW50aXRpZXNcIikuZGVsZWdhdGUoXCIuZm9sZGVyLWVudGl0eVwiLCBcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdEZvbGRlcigkKGUuY3VycmVudFRhcmdldCksIGFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhcmdzLnNlbGVjdG9yLmZpbmQoXCIuZW50aXRpZXNcIikuZGVsZWdhdGUoXCIuZmlsZS1lbnRpdHlcIiwgXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RGaWxlKCQoZS5jdXJyZW50VGFyZ2V0KSwgYXJncyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXJncy5zZWxlY3Rvci5maW5kKFwiLmVudGl0aWVzXCIpLmRlbGVnYXRlKFwiLnNlY3Rpb24tZW50aXR5XCIsIFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0U2VjdGlvbigkKGUuY3VycmVudFRhcmdldCksIGFyZ3MpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2VsZWN0Rm9sZGVyOiBmdW5jdGlvbih0YXJnZXQsIGFyZ3MpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSAkKHRhcmdldC5wYXJlbnQoKS5wYXJlbnQoKSksXG4gICAgICAgICAgICAgICAgZGF0YSA9IHRhcmdldC5kYXRhKCksXG4gICAgICAgICAgICAgICAgcGF0aCA9IGRhdGEucGF0aDtcbiAgICAgICAgICAgIGlmIChwYXJlbnQuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcbiAgICAgICAgICAgICAgICAvLyDlho3mrKHngrnlh7vvvIzkv53lrZjlvZPliY1mb2xkZXLkuK3miZPlvIDnmoRmb2xkZXLlkoxmaWxlXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0Rm9sZGVyVW5BY3RpdmUocGFyZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g54K55Ye75LiA57qnZm9sZGVyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5oYXNDbGFzcyhcInJvb3RcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0Rm9sZGVyVW5BY3RpdmUoXCIuZm9sZGVycy5tZW51LW1haW4gbGkuYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRSb290UGF0aCA9IHBhdGg7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5jbGlja1RyZWVbcGF0aF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOmakOiXj+S4gOe6p2ZvbGRlcuS4rWFjdGl2ZeeahGZvbGRlclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pi+56S654K55Ye7Zm9sZGVy55qE5YaF5a65XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRGb2xkZXJBY3RpdmUocGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaXJzdEZvbGRlclMgPSBwYXJlbnQuZmluZChcIi5mb2xkZXJzLm1lbnUtcm9vdCBsaTpmaXJzdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXJzdEZvbGRlclMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RGaWxlUyA9IGZpcnN0Rm9sZGVyUy5maW5kKFwiLmZpbGVzOmZpcnN0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdEZpbGVTID0gcGFyZW50LmZpbmQoXCIuZmlsZXMubWVudS1yb290IGxpOmZpcnN0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGlja1RyZWVbcGF0aF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJyb290XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3ViOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBmaXJzdEZvbGRlclNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQuZmluZChcIi5maWxlczpmaXJzdFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0Rm9sZGVyQWN0aXZlKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldEZvbGRlckFjdGl2ZSh0aGlzLmNsaWNrVHJlZVtwYXRoXS5jdXJyZW50U3ViLnNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xpY2tUcmVlW3BhdGhdLmN1cnJlbnRTdWIuZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RGaWxlKHRoaXMuY2xpY2tUcmVlW3BhdGhdLmN1cnJlbnRTdWIuZmlsZS5zZWxlY3RvciwgYXJncywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEZpbGUoZmlyc3RGaWxlUy5maW5kKFwiLmZpbGUtZW50aXR5OmZpcnN0XCIpLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnRQYXRoID0gcGF0aC5yZXBsYWNlKHBhdGgucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpLCBcIlwiKS5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaYvuekuuivpWZvbGRlcuS4reesrOS4gOS4qmZpbGXnmoTlhoXlrrlcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZTdWIgPSB0aGlzLmNsaWNrVHJlZVtwYXJlbnRQYXRoXS5jdXJyZW50U3ViO1xuICAgICAgICAgICAgICAgICAgICAvLyDpmpDol4/kuoznuqdmb2xkZXLkuK1hY3RpdmXnmoRmb2xkZXJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0Rm9sZGVyVW5BY3RpdmUocHJldlN1Yi5zZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdWIgPSB0aGlzLmNsaWNrVHJlZVtwYXJlbnRQYXRoXS5jdXJyZW50U3ViID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdWJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwYXJlbnQsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIC8vIOaYvuekuueCueWHu2ZvbGRlcueahOWGheWuuVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRSb290UGF0aCA9IHBhcmVudFBhdGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldEZvbGRlckFjdGl2ZShzdWIuc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChcIl5cIiArIHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJldlN1Yi5maWxlICYmIHByZXZTdWIuZmlsZS5maWxlUGF0aC5tYXRjaChyZWcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEZpbGUocHJldlN1Yi5maWxlLnNlbGVjdG9yLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0RmlsZShwYXJlbnQuZmluZChcIi5maWxlLWVudGl0eTpmaXJzdFwiKSwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3ViLnByZXZGaWxlID0gcHJldlN1Yi5maWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2VsZWN0RmlsZTogZnVuY3Rpb24odGFyZ2V0LCBhcmdzLCBzZWxlY3RGaWxlT25seSkge1xuICAgICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuaGlkZUNvbnRlbnQoKTtcbiAgICAgICAgICAgIGlmIChhcmdzLm9uRmlsZSkgYXJncy5vbkZpbGUodGFyZ2V0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0RmlsZU9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1YiA9IHNlbGYuY2xpY2tUcmVlW3NlbGYuY3VycmVudFJvb3RQYXRoXS5jdXJyZW50U3ViO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3ViLmZpbGUuc2VjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RTZWN0aW9uKHN1Yi5maWxlLnNlY3Rpb24sIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Ll9nb1RvcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN1Yi5maWxlLnNlbGVjdG9yLnBhcmVudCgpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3VwZGF0ZUNsaWNrVHJlZUZpbGUodGFyZ2V0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZWxlY3RTZWN0aW9uOiBmdW5jdGlvbih0YXJnZXQsIGFyZ3MpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VjdGlvbkFjdGl2ZWQodGFyZ2V0LCBhcmdzKTtcbiAgICAgICAgICAgIGlmIChhcmdzLm9uU2VjdGlvbikgYXJncy5vblNlY3Rpb24odGFyZ2V0KTtcbiAgICAgICAgICAgIHRoaXMuaGlkZUNvbnRlbnQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoaWRlQ29udGVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtb2JpbGVTaWRlYmFyLmhpZGUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZWN0aW9uUHJlZml4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBfc2VjdGlvblByZWZpeDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRTZWN0aW9uQWN0aXZlZDogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50U2VjdGlvbikgJCh0aGlzLmN1cnJlbnRTZWN0aW9uKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNlY3Rpb24gPSAkKHRhcmdldC5wYXJlbnQoKS5wYXJlbnQoKSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2xpY2tUcmVlU2VjdGlvbih0YXJnZXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF91cGRhdGVDbGlja1RyZWVGaWxlOiBmdW5jdGlvbihmaWxlLCBhcmdzKSB7XG4gICAgICAgICAgICB2YXIgc3ViID0gdGhpcy5jbGlja1RyZWVbdGhpcy5jdXJyZW50Um9vdFBhdGhdLmN1cnJlbnRTdWI7XG4gICAgICAgICAgICAvLyBzdWIuZmlsZSA9IG51bGznrKzkuIDmrKHov5vlhaXkuI3pnIDopoHnrqFcbiAgICAgICAgICAgIGlmIChzdWIuZmlsZSkge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLnNlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1Yi5maWxlLmZpbGVQYXRoID09PSBmaWxlLmRhdGEoKS5wYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDngrnlh7vnm7jlkIxmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gZmlsZS5wYXJlbnQoKS5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRGaWxlVW5BY3RpdmUoZmlsZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWIuZmlsZS5zZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0U2VjdGlvbihzdWIuZmlsZS5zZWN0aW9uLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuX2dvVG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldEZpbGVBY3RpdmUoc3ViLCBmaWxlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWIucHJldkZpbGUgJiYgc3ViLnByZXZGaWxlLmZpbGVQYXRoID09PSBmaWxlLmRhdGEoKS5wYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5YaN5qyh54K55Ye75LiK5LiA5qyhZmlsZe+8jOmAieS4reS4iuS4gOasoWZpbGXkuK3kv53lrZjnmoRzZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Yi5wcmV2RmlsZS5zZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0U2VjdGlvbihzdWIucHJldkZpbGUuc2VjdGlvbiwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmV2U2VjdGlvbiA9IHN1Yi5maWxlLnNlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0RmlsZUFjdGl2ZShzdWIsIGZpbGUsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Yi5maWxlLnNlY3Rpb24gPSBzdWIuZmlsZS5zZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuX2dvVG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0RmlsZUFjdGl2ZShzdWIsIGZpbGUsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0RmlsZUFjdGl2ZShzdWIsIGZpbGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLnNlY3Rpb24pIHdpbmRvdy5fZ29Ub3AoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRGaWxlQWN0aXZlKHN1YiwgZmlsZSwgYXJncy5zZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfc2V0RmlsZUFjdGl2ZTogZnVuY3Rpb24oc3ViLCBmaWxlLCBuZWVkU2VjdGlvbikge1xuICAgICAgICAgICAgaWYgKHN1Yi5maWxlKSB0aGlzLl9zZXRGaWxlVW5BY3RpdmUoc3ViLmZpbGUuc2VsZWN0b3IsIG5lZWRTZWN0aW9uKTtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBmaWxlLnBhcmVudCgpLnBhcmVudCgpO1xuICAgICAgICAgICAgcGFyZW50LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgaWYgKG5lZWRTZWN0aW9uKSBwYXJlbnQuZmluZChcIj4uc2VjdGlvbnNcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuICAgICAgICAgICAgc3ViLnByZXZGaWxlID0gc3ViLmZpbGU7XG4gICAgICAgICAgICBzdWIuZmlsZSA9IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogZmlsZSxcbiAgICAgICAgICAgICAgICBmaWxlUGF0aDogZmlsZS5kYXRhKCkucGF0aFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBfc2V0RmlsZVVuQWN0aXZlOiBmdW5jdGlvbihmaWxlLCBuZWVkU2VjdGlvbikge1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IGZpbGUucGFyZW50KCkucGFyZW50KCk7XG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICBpZiAobmVlZFNlY3Rpb24pIHBhcmVudC5maW5kKFwiPi5zZWN0aW9uc1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3VwZGF0ZUNsaWNrVHJlZVNlY3Rpb246IGZ1bmN0aW9uKHNlY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY2xpY2tUcmVlW3RoaXMuY3VycmVudFJvb3RQYXRoXS5jdXJyZW50U3ViLmZpbGUuc2VjdGlvbiA9IHNlY3Rpb247XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3NldEZvbGRlckFjdGl2ZTogZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIC8vIOW9k+WJjeWxguasoeeahGZvbGRlcnPkuI5maWxlc+WFqOmDqOWxleW8gO+8jOW5tuaKiuesrOS4gOS4qmZvbGRlcuS4i+eahGZpbGVz5bGV5byAXG4gICAgICAgICAgICB2YXIgcyA9ICQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgcy5hZGRDbGFzcyhcImFjdGl2ZVwiKS5maW5kKFwiPi5mb2xkZXJzXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcbiAgICAgICAgICAgIHMuZmluZChcIj4uZmlsZXNcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9zZXRGb2xkZXJVbkFjdGl2ZTogZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIC8vIOW9k+WJjeWxguasoeeahGZvbGRlcnPkuI5maWxlc+WFqOmDqOWxleW8gO+8jOW5tuaKiuesrOS4gOS4qmZvbGRlcuS4i+eahGZpbGVz5bGV5byAXG4gICAgICAgICAgICB2YXIgcyA9ICQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgcy5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5maW5kKFwiPi5mb2xkZXJzXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcbiAgICAgICAgICAgIHMuZmluZChcIi5maWxlc1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3RvZ2dsZUZvbGRlckFjdGl2ZTogZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIC8vIOW9k+WJjeWxguasoeeahGZvbGRlcnPkuI5maWxlc+WFqOmDqOWxleW8gO+8jOW5tuaKiuesrOS4gOS4qmZvbGRlcuS4i+eahGZpbGVz5bGV5byAXG4gICAgICAgICAgICB2YXIgcyA9ICQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgcy50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKS5maW5kKFwiPi5mb2xkZXJzXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZVwiKS5maW5kKFwiLmZpbGVzOmZpcnN0XCIpLnRvZ2dsZUNsYXNzKFwiaGlkZVwiKTtcbiAgICAgICAgICAgIHMuZmluZChcIj4uZmlsZXNcIikudG9nZ2xlQ2xhc3MoXCJoaWRlXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBGb2xkZXJUcmVlRG9tRXZlbnQuX3NlY3Rpb25QcmVmaXggPSBfc2VjdGlvblByZWZpeDtcbiAgICBGb2xkZXJUcmVlRG9tRXZlbnQuc2VjdGlvblByZWZpeCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3NlY3Rpb25QcmVmaXg7XG4gICAgfTtcbiAgICByZXR1cm4gRm9sZGVyVHJlZURvbUV2ZW50O1xufSk7XG4iXSwiZmlsZSI6ImhlbHBlcnMvRm9sZGVyVHJlZURvbUV2ZW50LmpzIn0=
