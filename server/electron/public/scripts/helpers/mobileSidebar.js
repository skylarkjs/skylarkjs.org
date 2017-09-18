define([
    "./isMobile",
    "jquery"
], function(isMobile, $) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJoZWxwZXJzL21vYmlsZVNpZGViYXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKFtcbiAgICBcIi4vaXNNb2JpbGVcIixcbiAgICBcImpxdWVyeVwiXG5dLCBmdW5jdGlvbihpc01vYmlsZSwgJCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBtcyA9ICQoXCIubW9iaWxlLWJhclwiKTtcbiAgICAgICAgICAgIGlmICghbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJChcIi53aXRoLXNpZGViYXJcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJChcIjxkaXY+XCIpLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICBjbGFzczogXCJtb2JpbGUtYmFyXCJcbiAgICAgICAgICAgICAgICB9KS5hZGRDb250ZW50KCc8YSBjbGFzcz1cIm1lbnUtYnV0dG9uXCI+PGkgY2xhc3M9XCJmYSBmYS1iYXJzXCI+PC9pPjwvYT4nKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNob3coKTtcbiAgICAgICAgICAgICAgICB9KS5wbGFjZSgkKFwiLm1haW4tY29udGVudHNcIiksIFwiZmlyc3RcIik7XG4gICAgICAgICAgICAgICAgJChcIjxkaXY+XCIpLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICBjbGFzczogXCJzaWRlYmFyLWNsb3NlLWJ0biBwdWxsLXJpZ2h0XCJcbiAgICAgICAgICAgICAgICB9KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9KS5hZGRDb250ZW50KCc8aSBjbGFzcz1cImZhIGZhLWNsb3NlXCI+PC9pPicpLnBsYWNlKCQoXCIuc2lkZWJhclwiKSwgXCJmaXJzdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoXCIubWFpbi1jb250ZW50c1wiKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKFwiLm1haW4tY29udGVudHNcIikuYWRkQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iXSwiZmlsZSI6ImhlbHBlcnMvbW9iaWxlU2lkZWJhci5qcyJ9
