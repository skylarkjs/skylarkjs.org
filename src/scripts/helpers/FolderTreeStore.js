define([
    "skylark/langx"
], function(langx) {
    return langx.klass({
        klassName: "FolderTree",
        init: function(args) {
            this.fileData = args.data;
        },

        find: function(path) {
            var info = this._split(path),
                self = this,
                getRoot = function(data, arr, index, char) {
                    var path = arr.slice(0, index).join(char),
                        item = data.filter(function(folder) {
                            return folder.path = path;
                        });
                    if (item.length > 0) {
                        return item[0];
                    } else {
                        index += 1;
                        getRoot(arr, index, char);
                    }
                },
                getParent = function(data, arr, index, char, total) {
                    var path = arr.slice(0, index).join(char),
                        item = data.filter(function(folder) {
                            return folder.path = path;
                        });
                    if (index === total) {
                        return item;
                    } else {
                        index += 1;
                        getParent(item.folders, arr, index, char, total);
                    }
                };
            var rootFolder = getRoot(this.fileData, info.result, 1, info.char),
                parentFolder = getParent(rootFolder.folders, info.result, 2, info.char, info.result.length - 1);
            return parentFolder.files.filter(function(file) {
                return file.path = path;
            })[0];
        },

        _pop: function(path) {
            path.replace(/^.*[\\\/]/, '');
        },

        _divide: function(path) {
            var last = this._pop(path),
                left = path.replace(last, "").slice(0, -1);
            return {
                last: last,
                left: left
            };
        },

        _split: function(path) {
            var last = this.pop(path),
                char = path.replace(last, "").slice(-1);
            return {
                result: (path + last).split(char),
                char: char
            };
        }
    });
});
