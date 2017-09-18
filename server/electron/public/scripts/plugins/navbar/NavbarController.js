define([
    "skylark/spa",
    "jquery",
    "skylark/router"
], function(spa, $, router) {
    var currentNav,
        setActive = function(selector) {
            if (currentNav) $(currentNav).removeClass("active");
            currentNav = $("." + selector + "-nav");
            if (currentNav) currentNav.addClass("active");
        },
        showThrob = function() {
            var selector = $("#main-wrap"),
                throb = window.addThrob(selector[0], function() {
                    router.one("routing", function(e) {
                        window._goTop();
                    });
                    router.one("routed", function() {
                        throb.remove();
                        selector.css("opacity", 1);
                    });
                });
        };
    return spa.PluginController.inherit({
        starting: function(evt) {
            var spa = evt.spa,
                basePath = spa.getConfig("baseUrl"),
                routes = spa.getConfig("routes"),
                _el = $("#sk-navbar"),
                navClick = function(path, name) {
                    if (router.go(path)) {
                        setActive(name);
                        showThrob();
                    }
                };
            var ul = $("<ul>").attr({
                class: "nav navbar-nav"
            }).delegate(".nav-item", "click", function(e) {
                var target = $(e.target),
                    data = target.data();
                navClick(data.path, data.name);
            });
            var selector = $("#main-wrap");
            router.one("prepared", function(e) {
                var curR = e._args.route;
                setActive(curR.name);
            });
            $(".logo-nav").on("click", function() {
                navClick("/", "home");
            });
            for (var key in routes) {
                if (key === "home") continue;
                var page = routes[key],
                    name = page.data.name,
                    navName = page.data.navName,
                    path = basePath + page.pathto;
                $("<li>").attr({
                    class: name + "-nav"
                }).addContent(
                    $("<a>").attr({
                        class: "nav-item"
                    }).data({
                        name: name,
                        path: path
                    }).html(navName)
                ).appendTo(ul);
            }
            _el.html(ul);
        },
        routed: function() {}
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwbHVnaW5zL25hdmJhci9OYXZiYXJDb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImRlZmluZShbXG4gICAgXCJza3lsYXJrL3NwYVwiLFxuICAgIFwianF1ZXJ5XCIsXG4gICAgXCJza3lsYXJrL3JvdXRlclwiXG5dLCBmdW5jdGlvbihzcGEsICQsIHJvdXRlcikge1xuICAgIHZhciBjdXJyZW50TmF2LFxuICAgICAgICBzZXRBY3RpdmUgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnROYXYpICQoY3VycmVudE5hdikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICBjdXJyZW50TmF2ID0gJChcIi5cIiArIHNlbGVjdG9yICsgXCItbmF2XCIpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnROYXYpIGN1cnJlbnROYXYuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHNob3dUaHJvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gJChcIiNtYWluLXdyYXBcIiksXG4gICAgICAgICAgICAgICAgdGhyb2IgPSB3aW5kb3cuYWRkVGhyb2Ioc2VsZWN0b3JbMF0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByb3V0ZXIub25lKFwicm91dGluZ1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuX2dvVG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByb3V0ZXIub25lKFwicm91dGVkXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb2IucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvci5jc3MoXCJvcGFjaXR5XCIsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICByZXR1cm4gc3BhLlBsdWdpbkNvbnRyb2xsZXIuaW5oZXJpdCh7XG4gICAgICAgIHN0YXJ0aW5nOiBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgIHZhciBzcGEgPSBldnQuc3BhLFxuICAgICAgICAgICAgICAgIGJhc2VQYXRoID0gc3BhLmdldENvbmZpZyhcImJhc2VVcmxcIiksXG4gICAgICAgICAgICAgICAgcm91dGVzID0gc3BhLmdldENvbmZpZyhcInJvdXRlc1wiKSxcbiAgICAgICAgICAgICAgICBfZWwgPSAkKFwiI3NrLW5hdmJhclwiKSxcbiAgICAgICAgICAgICAgICBuYXZDbGljayA9IGZ1bmN0aW9uKHBhdGgsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlci5nbyhwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QWN0aXZlKG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1Rocm9iKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHVsID0gJChcIjx1bD5cIikuYXR0cih7XG4gICAgICAgICAgICAgICAgY2xhc3M6IFwibmF2IG5hdmJhci1uYXZcIlxuICAgICAgICAgICAgfSkuZGVsZWdhdGUoXCIubmF2LWl0ZW1cIiwgXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQoZS50YXJnZXQpLFxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gdGFyZ2V0LmRhdGEoKTtcbiAgICAgICAgICAgICAgICBuYXZDbGljayhkYXRhLnBhdGgsIGRhdGEubmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9ICQoXCIjbWFpbi13cmFwXCIpO1xuICAgICAgICAgICAgcm91dGVyLm9uZShcInByZXBhcmVkXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VyUiA9IGUuX2FyZ3Mucm91dGU7XG4gICAgICAgICAgICAgICAgc2V0QWN0aXZlKGN1clIubmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoXCIubG9nby1uYXZcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBuYXZDbGljayhcIi9cIiwgXCJob21lXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcm91dGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gXCJob21lXCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHZhciBwYWdlID0gcm91dGVzW2tleV0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSBwYWdlLmRhdGEubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbmF2TmFtZSA9IHBhZ2UuZGF0YS5uYXZOYW1lLFxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gYmFzZVBhdGggKyBwYWdlLnBhdGh0bztcbiAgICAgICAgICAgICAgICAkKFwiPGxpPlwiKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IG5hbWUgKyBcIi1uYXZcIlxuICAgICAgICAgICAgICAgIH0pLmFkZENvbnRlbnQoXG4gICAgICAgICAgICAgICAgICAgICQoXCI8YT5cIikuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogXCJuYXYtaXRlbVwiXG4gICAgICAgICAgICAgICAgICAgIH0pLmRhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHBhdGhcbiAgICAgICAgICAgICAgICAgICAgfSkuaHRtbChuYXZOYW1lKVxuICAgICAgICAgICAgICAgICkuYXBwZW5kVG8odWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2VsLmh0bWwodWwpO1xuICAgICAgICB9LFxuICAgICAgICByb3V0ZWQ6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbn0pO1xuIl0sImZpbGUiOiJwbHVnaW5zL25hdmJhci9OYXZiYXJDb250cm9sbGVyLmpzIn0=
