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
                            currentSub: {
                                selector: firstFolderS,
                                file: firstFileS.find(".file-entity:first")
                            }
                        }
                    }
                    this._setFolderActive(parent);
                    parent.find(".files:first").removeClass("hide");
                    this._setFolderActive(this.clickTree[path].currentSub.selector);
                    this.selectFile(this.clickTree[path].currentSub.file, args);
                    if (args.section) {
                        if (this.clickTree[path].currentSub.section) {
                            this.selectSection(this.clickTree[path].currentSub.section, args);
                        } else {
                            window._goTop();
                        }
                    }
                } else {
                    var parentPath = path.replace(path.replace(/^.*[\\\/]/, ''), "").slice(0, -1);
                    // 显示该folder中第一个file的内容
                    var sub = this.clickTree[parentPath].currentSub;
                    // 隐藏二级folder中active的folder
                    this._setFolderUnActive(sub.selector);
                    sub = this.clickTree[parentPath].currentSub = {
                        type: "sub",
                        selector: parent,
                        file: parent.find(".file-entity:first")
                    };
                    // 显示点击folder的内容
                    this.currentRootPath = parentPath;
                    this._setFolderActive(sub.selector);
                    this.selectFile(sub.file, args);
                    if (args.section && sub.section) this.selectSection(sub.section, args);
                }
            }
        },
        // selectFolder: function(target, args) {
        //     // 不够严谨，目前只适用于单层folder，多层folder会有问题
        //     // 实现的功能是点击当前folder隐藏上次展看的folder
        //     // 当上次与当前点击的是同一个folder，这个folder也会被折叠
        //     // 多层次folder需要记录层级结构
        //     var parent = $(target.parent().parent()),
        //         data = target.data(),
        //         path = data.path,
        //         matchPath = function(p1, p2) {
        //             return p1.match(new RegExp(p2)) || p2.match(new RegExp(p1));
        //         };
        //     if (this.currentFolder && !matchPath(path, this.currentFolderPath)) {
        //         this._setFolderActive(this.currentFolder);
        //     }
        //     this.currentFolder = parent;
        //     this._setFolderActive(this.currentFolder);
        //     this.currentFolderPath = path;
        //     this.selectFile(parent.find(".files .file-entity:first"), args);
        //     if (args.onFolder) args.onFolder(target);
        // },
        selectFile: function(target, args) {
            if (target.length === 0) return;
            var data = target.data();
            if (this.activeItem) $(this.activeItem).removeClass("active");
            if (this.currentFile) $(this.currentFile).removeClass("active");
            this.currentFile = $(target.parent());
            this._updateClickTreeFile(target);
            if (this.currentFile) this.currentFile.addClass("active");
            this.currentFilePath = data.path;
            if (args.onFile) args.onFile(target);
            this.activeItem = this.currentFile;
            this.hideContent();
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
            if (this.activeItem) $(this.activeItem).removeClass("active");
            if (this.currentSection) $(this.currentSection).removeClass("active");
            this.currentSection = $(target.parent());
            this.currentSection.addClass("active");
            this._updateClickTreeSection(target);
            this.activeItem = this.currentSection;
        },

        _updateClickTreeFile: function(file) {
            this.clickTree[this.currentRootPath].currentSub.file = file;
        },

        _updateClickTreeSection: function(section) {
            this.clickTree[this.currentRootPath].currentSub.section = section;
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
