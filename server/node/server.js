#!/bin/env node

let getStartParams = function(reg) {
        let part = process.argv.filter(function(arg) {
            return arg.match(reg);
        });
        return part[0] ? part[0].match(reg)[1] : null;
    },
    express = require('express'),
    serveIndex = require('serve-index'),
    path = require('path'),
    app = express(),
    mode = getStartParams(/--mode=(.*)/),
    port = parseInt(getStartParams(/--port=(\d+)/)) || 9002;

let spaPath = path.join(__dirname, './public');

// static files
app.use(express.static(spaPath));

let handler = (req, res) => res.sendFile(path.join(spaPath, "index.html"))

let routes = ["/", "/guide", "/api", "/examples"]

routes.forEach(route => app.get(route, handler));

// listen port
app.listen(port, function() {
    console.log('skylark site server is running on ' + port);
});
