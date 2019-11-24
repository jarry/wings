/**
 * Copyright 2017 Qiyi Inc. All rights reserved.
 *
 * @file:   server.js
 * @path:   ./webapp/
 * @desc:  Web程序的启动类 
 * @author: jarryli
 * @date:   2017-03-27
 */

'use strict';

const http = require('http');
const url = require('url');
const Router = require('./router');
const Controller = require('./controller');
const os = require('os');

class Server { 
    constructor() {}

   /**
    * @start
    * @param {Function} doRequest - see {@link Controller}
    * @param {Object} mapping URL映射集合
    * @param {Object} controllers 控制器集合
    */
    static start(doRequest, mappingList, controllers, port) {
        port = port || 50501;
        console.log('server start:');
        let onRequest = (request, response) => {
            var pathname = url.parse(request.url).pathname;
            console.log('[Server>start]:[your request pathname is]', pathname);
            doRequest(controllers, mappingList[pathname], request, response);
        };
        http.createServer(onRequest).listen(port, os.hostname);
        console.log('[Server>start]:[port:'+ port +' Server has started.]', os.hostname);
    };

}

(function(root) {
    let action = process.argv[2];
    let port = process.argv[3];
    console.log('[action:' + action + '][port: ' + port + '][argv:' + process.argv + ']');
    switch (action) {
        case '--startup':
            let controller = new Controller();
            let controllers = [];
            let mappingList = Object.assign({}, Router.getMapping(controller));
            console.log('mappingList:controller', mappingList, controller);
            controllers.push(controller);
            Server.start(Router.doRequest, mappingList, controllers, port);
        break;
        case '--shutdown':
        // shutdown();
        break;
        default:
        console.log('unknow argument. please input correct arguments.');
        break;
    }
})(this);

module.exports = Server; 
