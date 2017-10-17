define([
    "jquery",
    "./isMobile",
    "skylarkjs"
], function($, isMobile, skylarkjs) {
    return {
        start: function() {
            var self = this,
                ms = $(".mobile-bar");
            if (!ms.length) {
                $(".with-sidebar").on("click", function() {
                    self.hide();
                });
                $("<div>").attr({
                    class: "mobile-bar"
                }).addContent('<a class="menu-button"><i class="fa fa-bars"></i></a>').on("click", function() {
                    self.show();
                }).place($(".main-contents"), "first");
                $("<div>").attr({
                    class: "sidebar-close-btn pull-right"
                }).on("click", function() {
                    self.hide();
                }).addContent('<i class="fa fa-close"></i>').place($(".sidebar"), "first");
            }
        },

        hide: function() {
            $(".main-contents").removeClass("open");
        },

        show: function() {
            $(".main-contents").addClass("open");
        }
    }
});
