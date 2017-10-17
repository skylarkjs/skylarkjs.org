define([
    "./isMobile",
    "skylarkjs",
    "ace"
], function(isMobile, skylarkjs, ace) {
    var langx = skylarkjs.langx;
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
