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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJoZWxwZXJzL0ZvbGRlclRyZWVTdG9yZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoW1xuICAgIFwic2t5bGFyay9sYW5neFwiXG5dLCBmdW5jdGlvbihsYW5neCkge1xuICAgIHJldHVybiBsYW5neC5rbGFzcyh7XG4gICAgICAgIGtsYXNzTmFtZTogXCJGb2xkZXJUcmVlXCIsXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsZURhdGEgPSBhcmdzLmRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluZDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgdmFyIGluZm8gPSB0aGlzLl9zcGxpdChwYXRoKSxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBnZXRSb290ID0gZnVuY3Rpb24oZGF0YSwgYXJyLCBpbmRleCwgY2hhcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IGFyci5zbGljZSgwLCBpbmRleCkuam9pbihjaGFyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBkYXRhLmZpbHRlcihmdW5jdGlvbihmb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9sZGVyLnBhdGggPSBwYXRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtWzBdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFJvb3QoYXJyLCBpbmRleCwgY2hhcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFBhcmVudCA9IGZ1bmN0aW9uKGRhdGEsIGFyciwgaW5kZXgsIGNoYXIsIHRvdGFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXRoID0gYXJyLnNsaWNlKDAsIGluZGV4KS5qb2luKGNoYXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGRhdGEuZmlsdGVyKGZ1bmN0aW9uKGZvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmb2xkZXIucGF0aCA9IHBhdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSB0b3RhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UGFyZW50KGl0ZW0uZm9sZGVycywgYXJyLCBpbmRleCwgY2hhciwgdG90YWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciByb290Rm9sZGVyID0gZ2V0Um9vdCh0aGlzLmZpbGVEYXRhLCBpbmZvLnJlc3VsdCwgMSwgaW5mby5jaGFyKSxcbiAgICAgICAgICAgICAgICBwYXJlbnRGb2xkZXIgPSBnZXRQYXJlbnQocm9vdEZvbGRlci5mb2xkZXJzLCBpbmZvLnJlc3VsdCwgMiwgaW5mby5jaGFyLCBpbmZvLnJlc3VsdC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRGb2xkZXIuZmlsZXMuZmlsdGVyKGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZS5wYXRoID0gcGF0aDtcbiAgICAgICAgICAgIH0pWzBdO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9wb3A6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgICAgIHBhdGgucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9kaXZpZGU6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgICAgIHZhciBsYXN0ID0gdGhpcy5fcG9wKHBhdGgpLFxuICAgICAgICAgICAgICAgIGxlZnQgPSBwYXRoLnJlcGxhY2UobGFzdCwgXCJcIikuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsYXN0OiBsYXN0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3NwbGl0OiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgICAgICB2YXIgbGFzdCA9IHRoaXMucG9wKHBhdGgpLFxuICAgICAgICAgICAgICAgIGNoYXIgPSBwYXRoLnJlcGxhY2UobGFzdCwgXCJcIikuc2xpY2UoLTEpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IChwYXRoICsgbGFzdCkuc3BsaXQoY2hhciksXG4gICAgICAgICAgICAgICAgY2hhcjogY2hhclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iXSwiZmlsZSI6ImhlbHBlcnMvRm9sZGVyVHJlZVN0b3JlLmpzIn0=
