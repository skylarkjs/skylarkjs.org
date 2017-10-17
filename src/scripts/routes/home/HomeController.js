define([
    "jquery",
    "skylarkjs",
    "jotted",
    "particles",
    "scripts/helpers/isMobile",
    "text!scripts/routes/home/home.html"
], function($, skylarkjs, Jotted, particles, isMobile, homeTpl) {
    var activeItem,
        pjs,
        spa = skylarkjs.spa,
        langx = skylarkjs.langx,
        noder = skylarkjs.noder,
        eventer = skylarkjs.eventer;
    return spa.RouteController.inherit({
        klassName: "HomeController",

        rendering: function(e) {
            e.content = homeTpl;
        },

        rendered: function() {
            if (pjs) pjs.fn.vendors.stopAnimation();
            var id = "particles"
            pjs = particles(id);
            var div = $("<div>").appendTo($(".footer"));
            $("<p>").appendTo(div).html("<i>Copyright © 2016-" +
                (new Date()).getFullYear() +
                "</i><a href='http://www.hudaokeji.com'><img src='./assets/images/hudao-logo.png' />Hudaokeji Co.,Ltd.</a> "
            );
            $("<p>").appendTo(div).html("powered by the skylark.js singe page application framework!");
            // var qq = $("<p>").appendTo(div);
            // $("<a>").attr({

            // }).html("<i class='fa fa-qq'></i><span style='padding: 0 5px;'>418640032</span>").css({
            //     padding: "0 20px"
            // }).appendTo(qq);
            // var twitter = $("<p>").appendTo(div);
            // $("<a>").attr({
            //     href: "https://twitter.com/jsskylark",
            //     target: "_blank"
            // }).html("<i class='fa fa-twitter'></i><span style='padding: 0 5px;'>https://twitter.com/jsskylark</span>").appendTo(twitter);
            // if (isMobile()) noder.reverse($("#second-feature")[0]);
            $(document.body).addClass("home-page");
        },
        exited: function() {
            $(document.body).removeClass("home-page");
        }
    });
});
