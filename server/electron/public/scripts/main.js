require.config({
    baseUrl: "./",
    waitSeconds: 60,
    packages: [{
        name: "skylark",
        location: "lib/skylark"
    }, {
        name: "ace",
        main: "ace",
        location: "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.8"
    }],

    paths: {
        "skylark-all": "lib/skylarkjs-all.min",
        "skylark-utils": "http://registry.skylarkjs.org/packages/skylark-utils/v0.9.0/skylark-utils",
        "skylark-router": "http://registry.skylarkjs.org/packages/skylark-router/v0.9.0/skylark-router",
        "caret": "https://cdn.bootcss.com/Caret.js/0.3.1/jquery.caret",
        "atwho": "https://cdn.bootcss.com/at.js/1.5.4/js/jquery.atwho",
        "bootstrap": "https://cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min",
        "handlebars": "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.amd.min",
        "jotted": "https://cdn.jsdelivr.net/jotted/1.5.1/jotted.min",
        "jquery": "lib/skylark-jquery-all.min",
        "particles": "lib/particles",
        "tether": "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
        "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"],
            exports: "$"　
        }
    }

});
require(["skylark-all"], function() {
    require([
        "skylark-utils/noder",
        "skylark-router",
        "skylark/spa",
        "scripts/config/config",
        "jquery"
    ], function(noder, router, spa, config, $) {
        router.useHistoryApi = false;
        router.useHashbang = false
        window._goTop = function(time) {
            time = time || 200;
            $(document.body).animate({
                "scrollTop": 0
            }, time, function() {
                goTopShown = false;
            });
            $(".go-top-btn").css({
                opacity: 0
            }).hide();
        };
        window.addThrob = function(node, callback) {
            $(node).css("opacity", 0.5);
            return noder.throb(node, {
                callback: callback
            });
        };
        var goTop = function(selector) {
            var goTopShown = false;
            selector.css({
                opacity: 0
            }).on("click", function() {
                window._goTop();
            });

            $(window).scroll(function() {
                if (goTopShown && window.scrollY > 0) return;
                if (window.scrollY > 100) {
                    selector.css({
                        opacity: 1
                    }).show();
                    goTopShown = true;
                } else {
                    selector.css({
                        opacity: 0
                    }).hide();
                    goTopShown = false;
                }
            });
        };
        var main = $("#main-wrap")[0],
            throb = window.addThrob(main, function() {
                require(["bootstrap"], function() {
                    var app = spa(config);
                    return app.prepare().then(function() {
                        main.style.opacity = 1;
                        router.one("prepared", function(e) {
                            throb.remove();
                        });
                        return app.run();
                    });
                });
            });
        goTop($(".go-top-btn"));
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $("#sk-navbar").delegate(".nav-item", "click", function(e) {
                $('#sk-navbar').collapse('hide');
            });
            $(".logo-nav").on("click", function() {
                $('#sk-navbar').collapse('hide');
            })
            $(".navbar").addClass("navbar-default");
        }
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcbiAgICBiYXNlVXJsOiBcIi4vXCIsXG4gICAgd2FpdFNlY29uZHM6IDYwLFxuICAgIHBhY2thZ2VzOiBbe1xuICAgICAgICBuYW1lOiBcInNreWxhcmtcIixcbiAgICAgICAgbG9jYXRpb246IFwibGliL3NreWxhcmtcIlxuICAgIH0sIHtcbiAgICAgICAgbmFtZTogXCJhY2VcIixcbiAgICAgICAgbWFpbjogXCJhY2VcIixcbiAgICAgICAgbG9jYXRpb246IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvYWNlLzEuMi44XCJcbiAgICB9XSxcblxuICAgIHBhdGhzOiB7XG4gICAgICAgIFwic2t5bGFyay1hbGxcIjogXCJsaWIvc2t5bGFya2pzLWFsbC5taW5cIixcbiAgICAgICAgXCJza3lsYXJrLXV0aWxzXCI6IFwiaHR0cDovL3JlZ2lzdHJ5LnNreWxhcmtqcy5vcmcvcGFja2FnZXMvc2t5bGFyay11dGlscy92MC45LjAvc2t5bGFyay11dGlsc1wiLFxuICAgICAgICBcInNreWxhcmstcm91dGVyXCI6IFwiaHR0cDovL3JlZ2lzdHJ5LnNreWxhcmtqcy5vcmcvcGFja2FnZXMvc2t5bGFyay1yb3V0ZXIvdjAuOS4wL3NreWxhcmstcm91dGVyXCIsXG4gICAgICAgIFwiY2FyZXRcIjogXCJodHRwczovL2Nkbi5ib290Y3NzLmNvbS9DYXJldC5qcy8wLjMuMS9qcXVlcnkuY2FyZXRcIixcbiAgICAgICAgXCJhdHdob1wiOiBcImh0dHBzOi8vY2RuLmJvb3Rjc3MuY29tL2F0LmpzLzEuNS40L2pzL2pxdWVyeS5hdHdob1wiLFxuICAgICAgICBcImJvb3RzdHJhcFwiOiBcImh0dHBzOi8vY2RuLmJvb3Rjc3MuY29tL2Jvb3RzdHJhcC8zLjMuNi9qcy9ib290c3RyYXAubWluXCIsXG4gICAgICAgIFwiaGFuZGxlYmFyc1wiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2hhbmRsZWJhcnMuanMvNC4wLjEwL2hhbmRsZWJhcnMuYW1kLm1pblwiLFxuICAgICAgICBcImpvdHRlZFwiOiBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9qb3R0ZWQvMS41LjEvam90dGVkLm1pblwiLFxuICAgICAgICBcImpxdWVyeVwiOiBcImxpYi9za3lsYXJrLWpxdWVyeS1hbGwubWluXCIsXG4gICAgICAgIFwicGFydGljbGVzXCI6IFwibGliL3BhcnRpY2xlc1wiLFxuICAgICAgICBcInRldGhlclwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL3RldGhlci8xLjQuMC9qcy90ZXRoZXIubWluXCIsXG4gICAgICAgIFwidGV4dFwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL3JlcXVpcmUtdGV4dC8yLjAuMTIvdGV4dFwiXG4gICAgfSxcbiAgICBzaGltOiB7XG4gICAgICAgIFwiYm9vdHN0cmFwXCI6IHtcbiAgICAgICAgICAgIGRlcHM6IFtcImpxdWVyeVwiXSxcbiAgICAgICAgICAgIGV4cG9ydHM6IFwiJFwi44CAXG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xucmVxdWlyZShbXCJza3lsYXJrLWFsbFwiXSwgZnVuY3Rpb24oKSB7XG4gICAgcmVxdWlyZShbXG4gICAgICAgIFwic2t5bGFyay11dGlscy9ub2RlclwiLFxuICAgICAgICBcInNreWxhcmstcm91dGVyXCIsXG4gICAgICAgIFwic2t5bGFyay9zcGFcIixcbiAgICAgICAgXCJzY3JpcHRzL2NvbmZpZy9jb25maWdcIixcbiAgICAgICAgXCJqcXVlcnlcIlxuICAgIF0sIGZ1bmN0aW9uKG5vZGVyLCByb3V0ZXIsIHNwYSwgY29uZmlnLCAkKSB7XG4gICAgICAgIHJvdXRlci51c2VIaXN0b3J5QXBpID0gZmFsc2U7XG4gICAgICAgIHJvdXRlci51c2VIYXNoYmFuZyA9IGZhbHNlXG4gICAgICAgIHdpbmRvdy5fZ29Ub3AgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgICAgICAgICB0aW1lID0gdGltZSB8fCAyMDA7XG4gICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIFwic2Nyb2xsVG9wXCI6IDBcbiAgICAgICAgICAgIH0sIHRpbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGdvVG9wU2hvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJChcIi5nby10b3AtYnRuXCIpLmNzcyh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgfSkuaGlkZSgpO1xuICAgICAgICB9O1xuICAgICAgICB3aW5kb3cuYWRkVGhyb2IgPSBmdW5jdGlvbihub2RlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgJChub2RlKS5jc3MoXCJvcGFjaXR5XCIsIDAuNSk7XG4gICAgICAgICAgICByZXR1cm4gbm9kZXIudGhyb2Iobm9kZSwge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnb1RvcCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICB2YXIgZ29Ub3BTaG93biA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZWN0b3IuY3NzKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgICB9KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5fZ29Ub3AoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChnb1RvcFNob3duICYmIHdpbmRvdy5zY3JvbGxZID4gMCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA+IDEwMCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvci5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgICAgICAgICB9KS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIGdvVG9wU2hvd24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgICAgICAgICAgIH0pLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgZ29Ub3BTaG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgbWFpbiA9ICQoXCIjbWFpbi13cmFwXCIpWzBdLFxuICAgICAgICAgICAgdGhyb2IgPSB3aW5kb3cuYWRkVGhyb2IobWFpbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZShbXCJib290c3RyYXBcIl0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXBwID0gc3BhKGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcHAucHJlcGFyZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYWluLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyLm9uZShcInByZXBhcmVkXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvYi5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcC5ydW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgZ29Ub3AoJChcIi5nby10b3AtYnRuXCIpKTtcbiAgICAgICAgaWYgKC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgICAgICAgICAgJChcIiNzay1uYXZiYXJcIikuZGVsZWdhdGUoXCIubmF2LWl0ZW1cIiwgXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgJCgnI3NrLW5hdmJhcicpLmNvbGxhcHNlKCdoaWRlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoXCIubG9nby1uYXZcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKCcjc2stbmF2YmFyJykuY29sbGFwc2UoJ2hpZGUnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAkKFwiLm5hdmJhclwiKS5hZGRDbGFzcyhcIm5hdmJhci1kZWZhdWx0XCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiJdLCJmaWxlIjoibWFpbi5qcyJ9
