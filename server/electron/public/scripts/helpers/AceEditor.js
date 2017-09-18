define([
    "./isMobile",
    "skylark/langx",
    "ace",
    // "ace/ext-beautify"
], function(isMobile, langx, ace) {
    return langx.klass({
        editor: null,
        init: function(args) {
            this.editor = ace.edit(args.node);
            this.editorSession = this.editor.getSession();
            this.editor.setKeyboardHandler("ace/keyboard/vim");
            if (args.type === "js") args.type = "javascript";
            this.editor.renderer.setShowGutter(!isMobile());
            this.editor.setTheme("ace/theme/twilight");
            this.editorSession.setTabSize(4);
            this.editorSession.setUseWrapMode(true);
            this.set("mode", args.type);
            if (args.type === "html") {
                args.value = args.value.replace(/&lt;/g, "<");
                args.value = args.value.replace(/&gt;/g, ">");
            }
            // var reg = new RegExp("^" + args.value.match(/^(\s+)[^\s]/)[1]);
            // value = args.value.split("\n").map(function(text) {
            //     if (args.type === "html") {
            //         text = text.replace(/&lt;/g, "<");
            //         text = text.replace(/&gt;/g, ">");
            //     }
            //     return text.replace(reg, "");
            // }).filter(function(line) { return line != "" }).join("\n");

            this.set("value", args.value);

            // var beautify = ace.require("ace/ext/beautify");
            // beautify.beautify(this.editorSession);
        },

        _beautifyCode: function() {
            var lines = this.editorSession.doc.getAllLines()
            for (var i = 0, l = lines.length; i < l; i++) {
                if (lines[i].indexOf(foo) != -1)
                    fooLineNumbers.push(i)
            }
            return fooLineNumbers
        },

        set: function(key, value) {
            // TODO document, and wire up the rest of the ace api that makes sense
            var self = this;
            if (key == "value") {
                this.editorSession.setValue(value);
            } else if (key == "theme") {
                if (typeof value == "string") value = "ace/theme/" + value;
                this.editor.setTheme(value);
            } else if (key == "mode") {
                // TODO get mode name string from instance
                if (typeof value != "string") {
                    this.editorSession.setMode(value);
                }
                // TODO couldn't define/require return a promise?
                // require(["ace/mode/" + value], function(modeModule) {
                self.editorSession.setMode("ace/mode/" + value);
                // });
            } else if (key == "readOnly") {
                this.editor.setReadOnly(value);
            } else if (key == "tabSize") {
                this.editorSession.setTabSize(value);
            } else if (key == "softTabs") {
                this.editorSession.setUseSoftTabs(value);
            } else if (key == "wordWrap") {
                // TODO this is buggy, file github issue
                this.editorSession.setUseWrapMode(value);
            } else if (key == "printMargin") {
                this.editor.renderer.setPrintMarginColumn(value);
            } else if (key == "showPrintMargin") {
                this.editor.setShowPrintMargin(value);
            } else if (key == "highlightActiveLine") {
                this.editor.setHighlightActiveLine(value);
            } else if (key == "fontSize") {
                this.$(this.domNode).style(key, value);
                // domStyle.set(this.domNode, key, value);
            } else if (key == "showGutter") {
                this.editor.renderer.setShowGutter(value);
            }
        },

        getValue: function(key) {
            return this.editorSession.getValue();
        },

        gotoLine: function(num) {
            this.editor.gotoLine(num);
        },

        find: function(str) {
            this.editor.find(str);
        }
    })
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJoZWxwZXJzL0FjZUVkaXRvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoW1xuICAgIFwiLi9pc01vYmlsZVwiLFxuICAgIFwic2t5bGFyay9sYW5neFwiLFxuICAgIFwiYWNlXCIsXG4gICAgLy8gXCJhY2UvZXh0LWJlYXV0aWZ5XCJcbl0sIGZ1bmN0aW9uKGlzTW9iaWxlLCBsYW5neCwgYWNlKSB7XG4gICAgcmV0dXJuIGxhbmd4LmtsYXNzKHtcbiAgICAgICAgZWRpdG9yOiBudWxsLFxuICAgICAgICBpbml0OiBmdW5jdGlvbihhcmdzKSB7XG4gICAgICAgICAgICB0aGlzLmVkaXRvciA9IGFjZS5lZGl0KGFyZ3Mubm9kZSk7XG4gICAgICAgICAgICB0aGlzLmVkaXRvclNlc3Npb24gPSB0aGlzLmVkaXRvci5nZXRTZXNzaW9uKCk7XG4gICAgICAgICAgICB0aGlzLmVkaXRvci5zZXRLZXlib2FyZEhhbmRsZXIoXCJhY2Uva2V5Ym9hcmQvdmltXCIpO1xuICAgICAgICAgICAgaWYgKGFyZ3MudHlwZSA9PT0gXCJqc1wiKSBhcmdzLnR5cGUgPSBcImphdmFzY3JpcHRcIjtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnJlbmRlcmVyLnNldFNob3dHdXR0ZXIoIWlzTW9iaWxlKCkpO1xuICAgICAgICAgICAgdGhpcy5lZGl0b3Iuc2V0VGhlbWUoXCJhY2UvdGhlbWUvdHdpbGlnaHRcIik7XG4gICAgICAgICAgICB0aGlzLmVkaXRvclNlc3Npb24uc2V0VGFiU2l6ZSg0KTtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yU2Vzc2lvbi5zZXRVc2VXcmFwTW9kZSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0KFwibW9kZVwiLCBhcmdzLnR5cGUpO1xuICAgICAgICAgICAgaWYgKGFyZ3MudHlwZSA9PT0gXCJodG1sXCIpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnZhbHVlID0gYXJncy52YWx1ZS5yZXBsYWNlKC8mbHQ7L2csIFwiPFwiKTtcbiAgICAgICAgICAgICAgICBhcmdzLnZhbHVlID0gYXJncy52YWx1ZS5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHZhciByZWcgPSBuZXcgUmVnRXhwKFwiXlwiICsgYXJncy52YWx1ZS5tYXRjaCgvXihcXHMrKVteXFxzXS8pWzFdKTtcbiAgICAgICAgICAgIC8vIHZhbHVlID0gYXJncy52YWx1ZS5zcGxpdChcIlxcblwiKS5tYXAoZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICAgLy8gICAgIGlmIChhcmdzLnR5cGUgPT09IFwiaHRtbFwiKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLyZsdDsvZywgXCI8XCIpO1xuICAgICAgICAgICAgLy8gICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXCIpO1xuICAgICAgICAgICAgLy8gfSkuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHsgcmV0dXJuIGxpbmUgIT0gXCJcIiB9KS5qb2luKFwiXFxuXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnNldChcInZhbHVlXCIsIGFyZ3MudmFsdWUpO1xuXG4gICAgICAgICAgICAvLyB2YXIgYmVhdXRpZnkgPSBhY2UucmVxdWlyZShcImFjZS9leHQvYmVhdXRpZnlcIik7XG4gICAgICAgICAgICAvLyBiZWF1dGlmeS5iZWF1dGlmeSh0aGlzLmVkaXRvclNlc3Npb24pO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9iZWF1dGlmeUNvZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGxpbmVzID0gdGhpcy5lZGl0b3JTZXNzaW9uLmRvYy5nZXRBbGxMaW5lcygpXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChsaW5lc1tpXS5pbmRleE9mKGZvbykgIT0gLTEpXG4gICAgICAgICAgICAgICAgICAgIGZvb0xpbmVOdW1iZXJzLnB1c2goaSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmb29MaW5lTnVtYmVyc1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgLy8gVE9ETyBkb2N1bWVudCwgYW5kIHdpcmUgdXAgdGhlIHJlc3Qgb2YgdGhlIGFjZSBhcGkgdGhhdCBtYWtlcyBzZW5zZVxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKGtleSA9PSBcInZhbHVlXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRvclNlc3Npb24uc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJ0aGVtZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcInN0cmluZ1wiKSB2YWx1ZSA9IFwiYWNlL3RoZW1lL1wiICsgdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0b3Iuc2V0VGhlbWUodmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJtb2RlXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIGdldCBtb2RlIG5hbWUgc3RyaW5nIGZyb20gaW5zdGFuY2VcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0b3JTZXNzaW9uLnNldE1vZGUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBUT0RPIGNvdWxkbid0IGRlZmluZS9yZXF1aXJlIHJldHVybiBhIHByb21pc2U/XG4gICAgICAgICAgICAgICAgLy8gcmVxdWlyZShbXCJhY2UvbW9kZS9cIiArIHZhbHVlXSwgZnVuY3Rpb24obW9kZU1vZHVsZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWRpdG9yU2Vzc2lvbi5zZXRNb2RlKFwiYWNlL21vZGUvXCIgKyB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInJlYWRPbmx5XCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRvci5zZXRSZWFkT25seSh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBcInRhYlNpemVcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yU2Vzc2lvbi5zZXRUYWJTaXplKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwic29mdFRhYnNcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yU2Vzc2lvbi5zZXRVc2VTb2Z0VGFicyh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBcIndvcmRXcmFwXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIHRoaXMgaXMgYnVnZ3ksIGZpbGUgZ2l0aHViIGlzc3VlXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0b3JTZXNzaW9uLnNldFVzZVdyYXBNb2RlKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwicHJpbnRNYXJnaW5cIikge1xuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLnJlbmRlcmVyLnNldFByaW50TWFyZ2luQ29sdW1uKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwic2hvd1ByaW50TWFyZ2luXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRvci5zZXRTaG93UHJpbnRNYXJnaW4odmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJoaWdobGlnaHRBY3RpdmVMaW5lXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRvci5zZXRIaWdobGlnaHRBY3RpdmVMaW5lKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwiZm9udFNpemVcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuJCh0aGlzLmRvbU5vZGUpLnN0eWxlKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIC8vIGRvbVN0eWxlLnNldCh0aGlzLmRvbU5vZGUsIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJzaG93R3V0dGVyXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRvci5yZW5kZXJlci5zZXRTaG93R3V0dGVyKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXRWYWx1ZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lZGl0b3JTZXNzaW9uLmdldFZhbHVlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ290b0xpbmU6IGZ1bmN0aW9uKG51bSkge1xuICAgICAgICAgICAgdGhpcy5lZGl0b3IuZ290b0xpbmUobnVtKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5kOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLmZpbmQoc3RyKTtcbiAgICAgICAgfVxuICAgIH0pXG59KTtcbiJdLCJmaWxlIjoiaGVscGVycy9BY2VFZGl0b3IuanMifQ==
