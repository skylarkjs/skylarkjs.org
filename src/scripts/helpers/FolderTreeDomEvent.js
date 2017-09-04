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
                self.selectFolder($(e.target), args);
            });
            args.selector.find(".entities").delegate(".file-entity", "click", function(e) {
                self.selectFile($(e.target), args);
            });

            args.selector.find(".entities").delegate(".section-entity", "click", function(e) {
                self.selectSection($(e.target), args)
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
            this._toggleCurrentFileS();
            if (this.currentFile) $(this.currentFile).removeClass("active");
            this.currentFile = $(target.parent().parent());
            this.currentFile.addClass("active");
            this._toggleCurrentFileS();
            if (selectFileOnly) return args.onFile(target, function() {
                var sub = self.clickTree[self.currentRootPath].currentSub;
                if(sub.file.section) {
                    self.selectSection(sub.file.section, args);
                } else {
                    window._goTop();
                }
                sub.file.selector.parent().addClass("active");
            });
            var data = target.data();
            this.hideContent();
            if (args.onFile) args.onFile(target, function() {
                self._updateClickTreeFile(target, args);
            });
        },
        _toggleCurrentFileS: function() {
            if (this.currentFile) this.currentFile.find(">.sections").toggleClass("hide");
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
            if (args.section && sub.file) {
                if (sub.file.filePath === file.data().path) {
                    // 点击相同file
                    if (sub.file.section) {
                        this.selectSection(sub.file.section, args);
                    } else {
                        window._goTop();
                    }
                    file.parent().parent().find(".sections:first").toggleClass("hide");
                } else {
                    if (sub.prevFile && sub.prevFile.filePath === file.data().path) {
                        // 再次点击上一次file，选中上一次file中保存的section
                        if (sub.prevFile.section) {
                            this.selectSection(sub.prevFile.section, args);
                        }
                        sub.prevFile = sub.file;
                        sub.file = {
                            selector: file,
                            section: sub.file.section,
                            filePath: file.data().path
                        };
                    } else {
                        window._goTop();
                        sub.prevFile = sub.file;
                        sub.file = {
                            selector: file,
                            filePath: file.data().path
                        };
                    }
                }
            } else {
                window._goTop();
                file.parent().parent().find(".sections:first").removeClass("hide");
                sub.prevFile = sub.file;
                sub.file = {
                    selector: file,
                    filePath: file.data().path
                };
            }
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
