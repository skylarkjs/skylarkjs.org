define([
    "skylark/spa",
    "skylark/langx",
    "skylark/noder",
    "jquery",
    "skylark/eventer",
    "jotted",
    "particles",
    "scripts/helpers/isMobile",
    "text!scripts/routes/home/home.html"
], function(spa, langx, noder, $, eventer, Jotted, particles, isMobile, homeTpl) {
    var activeItem,
        pjs;
    return spa.RouteController.inherit({
        klassName: "HomeController",

        rendering: function(e) {
            e.content = homeTpl;
        },

        entered: function() {
            if (pjs) pjs.fn.vendors.stopAnimation();
            var id = "particles"
            pjs = particles(id);
            $(".footer").html("<div>Copyright © 2016-" +
                (new Date()).getFullYear() +
                "  <a href='http://www.hudaokeji.com'><img src='./assets/images/hudao-logo.png' />Hudaokeji Co.,Ltd.</a> <br> powered by the skylark.js singe page application framework!</div>"
            );
            // if (isMobile()) noder.reverse($("#second-feature")[0]);
            $(document.body).addClass("home-page");
        },
        exited: function() {
            $(document.body).removeClass("home-page");
        }
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyb3V0ZXMvaG9tZS9Ib21lQ29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoW1xuICAgIFwic2t5bGFyay9zcGFcIixcbiAgICBcInNreWxhcmsvbGFuZ3hcIixcbiAgICBcInNreWxhcmsvbm9kZXJcIixcbiAgICBcImpxdWVyeVwiLFxuICAgIFwic2t5bGFyay9ldmVudGVyXCIsXG4gICAgXCJqb3R0ZWRcIixcbiAgICBcInBhcnRpY2xlc1wiLFxuICAgIFwic2NyaXB0cy9oZWxwZXJzL2lzTW9iaWxlXCIsXG4gICAgXCJ0ZXh0IXNjcmlwdHMvcm91dGVzL2hvbWUvaG9tZS5odG1sXCJcbl0sIGZ1bmN0aW9uKHNwYSwgbGFuZ3gsIG5vZGVyLCAkLCBldmVudGVyLCBKb3R0ZWQsIHBhcnRpY2xlcywgaXNNb2JpbGUsIGhvbWVUcGwpIHtcbiAgICB2YXIgYWN0aXZlSXRlbSxcbiAgICAgICAgcGpzO1xuICAgIHJldHVybiBzcGEuUm91dGVDb250cm9sbGVyLmluaGVyaXQoe1xuICAgICAgICBrbGFzc05hbWU6IFwiSG9tZUNvbnRyb2xsZXJcIixcblxuICAgICAgICByZW5kZXJpbmc6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUuY29udGVudCA9IGhvbWVUcGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW50ZXJlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocGpzKSBwanMuZm4udmVuZG9ycy5zdG9wQW5pbWF0aW9uKCk7XG4gICAgICAgICAgICB2YXIgaWQgPSBcInBhcnRpY2xlc1wiXG4gICAgICAgICAgICBwanMgPSBwYXJ0aWNsZXMoaWQpO1xuICAgICAgICAgICAgJChcIi5mb290ZXJcIikuaHRtbChcIjxkaXY+Q29weXJpZ2h0IMKpIDIwMTYtXCIgK1xuICAgICAgICAgICAgICAgIChuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpICtcbiAgICAgICAgICAgICAgICBcIiAgPGEgaHJlZj0naHR0cDovL3d3dy5odWRhb2tlamkuY29tJz48aW1nIHNyYz0nLi9hc3NldHMvaW1hZ2VzL2h1ZGFvLWxvZ28ucG5nJyAvPkh1ZGFva2VqaSBDby4sTHRkLjwvYT4gPGJyPiBwb3dlcmVkIGJ5IHRoZSBza3lsYXJrLmpzIHNpbmdlIHBhZ2UgYXBwbGljYXRpb24gZnJhbWV3b3JrITwvZGl2PlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgLy8gaWYgKGlzTW9iaWxlKCkpIG5vZGVyLnJldmVyc2UoJChcIiNzZWNvbmQtZmVhdHVyZVwiKVswXSk7XG4gICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpLmFkZENsYXNzKFwiaG9tZS1wYWdlXCIpO1xuICAgICAgICB9LFxuICAgICAgICBleGl0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5yZW1vdmVDbGFzcyhcImhvbWUtcGFnZVwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iXSwiZmlsZSI6InJvdXRlcy9ob21lL0hvbWVDb250cm9sbGVyLmpzIn0=
