/**
 * Copyright 2017 Qiyi Inc. All rights reserved.
 *
 * @file:   dao.js
 * @path:   ./webapp/
 * @desc:  Web程序的接口访问类，专门调用后台接口 
 * @author: jarryli
 * @date:   2017-03-27
 */
'use strict';
const http = require('http');
const querystring = require('querystring');
const arrProto = Array.prototype;
const config = {
    'testAuthHost': 'test-auth.your.domain',
    'qipuHost': 'qipu.your.domain'
};
class Dao {

   httpInvoke(method, postData, options) {
      options = Object.assign({
          hostname: '',
          port: 80,
          path: '',
          method: method || 'POST',
          encoding: 'utf8'
        }, options);
        return new Promise((resolve, reject) => {
            let requestObj = typeof (postData) == 'string' ? postData: options;
            let chrunks = [];
            console.log('httpInvoke->requestObj:', requestObj);
            let req = http.request(requestObj, (response) => {
                response.on('data', (chrunk) => {
                    chrunks.push(chrunk);
                });
                response.on('end', () => {
                   let result = Buffer.concat(chrunks).toString(options.encoding);
                   console.log('httpInvokte success:', result);
                   resolve(result);
                });
            }).on('error', (error) => {
                console.log('httpInvokte error:', error);
                reject(error);
            });

            req.write(postData);
            req.end();

        });
    }

    httpGet(url) {
        return this.httpInvoke('GET', url);
    }

    httpPost(postData, options) {
        options = Object.assign({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        }, options);
        return this.httpInvoke('POST', querystring.stringify(postData), options);
    }

    getUserInfo(params) {
        let path = '/auth-api/services/user/resources'
        params = params || { uid: 400000020, appName: 'lequ' };
        // let url = 'http://test-auth.your.domain/auth-api/services/user/resources?uid=400000020&appName=lequ';
        let url = 'http://' + config.testAuthHost + path + '?'+ querystring.stringify(params); 
        console.log('request url:', url);
        return this.httpGet(url);
    }

    getVideo(params) {
        let path = '/int/entity/nocache'
        params = params || { uid: 400000020, appName: 'lequ', entityId: 597436100 };
        // let url = http://qipu.your.domain/int/entity/nocache/597436100.json
        let url = 'http://' + config.qipuHost + path + '/' + params.entityId + '.json'; 
        console.log('request url:', url);
        return this.httpGet(url);
    }
}

module.exports = Dao;
