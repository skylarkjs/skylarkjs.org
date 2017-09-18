define([], function() {
    var config = {
        "name": "Skylark Home Page",
        "title": "Skylark.js - Official Site",
        "baseUrl": "",
        "homePath": "/",
        "page": {
            "routeViewer": "#pageContainer"
        },
        "plugins": {
            "navbar": {
                hookers: ["starting"],
                controller: {
                    type: "scripts/plugins/navbar/NavbarController"
                }
            },
            // "search": {
            //     hookers: ["starting"],
            //     controller: {
            //         type: "scripts/plugins/search/SearchController"
            //     }
            // }
        },
        "routes": {
            "home": {
                pathto: "/",
                data: {
                    name: 'home',
                    navName: "Home"
                },
                controller: {
                    type: "scripts/routes/home/HomeController"
                }
            },
            "guide": {
                pathto: "/guide",
                data: {
                    name: 'guide',
                    navName: "Guide",
                    search: {
                        container: ".entities"
                    }
                },
                controller: {
                    type: "scripts/routes/guide/GuideController"
                }
            },
            "api": {
                pathto: "/api",
                data: {
                    name: 'api',
                    navName: "API",
                    search: {
                        container: ".entities"
                    }
                },
                controller: {
                    type: "scripts/routes/api/ApiController"
                }
            },
            "examples": {
                pathto: "/examples",
                data: {
                    name: 'examples',
                    navName: "Examples",
                    search: {
                        container: ".entities"
                    }
                },
                lazy: true,
                controller: {
                    type: "scripts/routes/examples/ExamplesController"
                }
            }
        }
    };
    return config;
});


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb25maWcvY29uZmlnLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiU2t5bGFyayBIb21lIFBhZ2VcIixcbiAgICAgICAgXCJ0aXRsZVwiOiBcIlNreWxhcmsuanMgLSBPZmZpY2lhbCBTaXRlXCIsXG4gICAgICAgIFwiYmFzZVVybFwiOiBcIlwiLFxuICAgICAgICBcImhvbWVQYXRoXCI6IFwiL1wiLFxuICAgICAgICBcInBhZ2VcIjoge1xuICAgICAgICAgICAgXCJyb3V0ZVZpZXdlclwiOiBcIiNwYWdlQ29udGFpbmVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJwbHVnaW5zXCI6IHtcbiAgICAgICAgICAgIFwibmF2YmFyXCI6IHtcbiAgICAgICAgICAgICAgICBob29rZXJzOiBbXCJzdGFydGluZ1wiXSxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2NyaXB0cy9wbHVnaW5zL25hdmJhci9OYXZiYXJDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgLy8gICAgIGhvb2tlcnM6IFtcInN0YXJ0aW5nXCJdLFxuICAgICAgICAgICAgLy8gICAgIGNvbnRyb2xsZXI6IHtcbiAgICAgICAgICAgIC8vICAgICAgICAgdHlwZTogXCJzY3JpcHRzL3BsdWdpbnMvc2VhcmNoL1NlYXJjaENvbnRyb2xsZXJcIlxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJyb3V0ZXNcIjoge1xuICAgICAgICAgICAgXCJob21lXCI6IHtcbiAgICAgICAgICAgICAgICBwYXRodG86IFwiL1wiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2hvbWUnLFxuICAgICAgICAgICAgICAgICAgICBuYXZOYW1lOiBcIkhvbWVcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNjcmlwdHMvcm91dGVzL2hvbWUvSG9tZUNvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImd1aWRlXCI6IHtcbiAgICAgICAgICAgICAgICBwYXRodG86IFwiL2d1aWRlXCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZ3VpZGUnLFxuICAgICAgICAgICAgICAgICAgICBuYXZOYW1lOiBcIkd1aWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiBcIi5lbnRpdGllc1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzY3JpcHRzL3JvdXRlcy9ndWlkZS9HdWlkZUNvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImFwaVwiOiB7XG4gICAgICAgICAgICAgICAgcGF0aHRvOiBcIi9hcGlcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhcGknLFxuICAgICAgICAgICAgICAgICAgICBuYXZOYW1lOiBcIkFQSVwiLFxuICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogXCIuZW50aXRpZXNcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2NyaXB0cy9yb3V0ZXMvYXBpL0FwaUNvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImV4YW1wbGVzXCI6IHtcbiAgICAgICAgICAgICAgICBwYXRodG86IFwiL2V4YW1wbGVzXCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZXhhbXBsZXMnLFxuICAgICAgICAgICAgICAgICAgICBuYXZOYW1lOiBcIkV4YW1wbGVzXCIsXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiBcIi5lbnRpdGllc1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxhenk6IHRydWUsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNjcmlwdHMvcm91dGVzL2V4YW1wbGVzL0V4YW1wbGVzQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gY29uZmlnO1xufSk7XG5cbiJdLCJmaWxlIjoiY29uZmlnL2NvbmZpZy5qcyJ9
