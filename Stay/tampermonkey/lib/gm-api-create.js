/**
 This file guarantees call GM api in a sandbox.
 Reference: https://github.com/greasemonkey/greasemonkey/blob/master/src/bg/api-provider-source.js
 */

'use strict';

(function() {    
    function createGMApisWithUserScript(grants,uuid){
        let source = 'const _uuid = "' + uuid + '";\n\n';
        source += 'let GM = {};\n\n';
        source += 'let retries = 3;\n\n';
        source += 'let __stroge = await _fillStroge();\n\n';
        source += 'let __RMC_CONTEXT = [];\n\n';

        source += 'browser.runtime.sendMessage({ from: "gm-apis", uuid: _uuid, operate: "clear_GM_log" });\n';
        source += 'browser.runtime.onMessage.addListener((request, sender, sendResponse) => {\n';
        source += '\tif (request.from == "background" && request.operate == "fetchRegisterMenuCommand"){\n';
        source += '\tbrowser.runtime.sendMessage({from:"content",data:__RMC_CONTEXT,uuid:_uuid,operate:"giveRegisterMenuCommand"});}\n';
        source += '\telse if (request.from == "background" && request.operate == "execRegisterMenuCommand" && request.uuid == _uuid){\n';
        source += '\t\tconsole.log(__RMC_CONTEXT[request.id]);\n';
        source += '\t\t__RMC_CONTEXT[request.id]["commandFunc"]();}\n';
        source += '\treturn true;\n'
        source += '});\n\n';
        
        if (grants.includes('GM_listValues')) {
            source += GM_listValues.toString() + ';\n\n';
        }
        
        if (grants.includes('GM.listValues')) {
            source += 'GM.listValues = ' + GM_listValues_p.toString() + ';\n\n';
        }
        
        if (grants.includes('GM_deleteValue')) {
            source += GM_deleteValue.toString() + ';\n\n';
        }
        
        if (grants.includes('GM.deleteValue')) {
            source += 'GM.deleteValue = ' + GM_deleteValue_p.toString() + ';\n\n';
        }
        
        if (grants.includes('GM_setValue')) {
            source += GM_setValue.toString() + ';\n\n';
        }
        
        if (grants.includes('GM.setValue')) {
            source += 'GM.setValue = ' + GM_setValue_p.toString() + ';\n\n';
        }
        
        if (grants.includes('GM_getValue')) {
            source += GM_getValue.toString() + ';\n\n';
        }
        
        if (grants.includes('GM.getValue')) {
            source += 'GM.getValue = ' + GM_getValue_p.toString() + ';\n\n';
        }
        
        if (grants.includes('GM.registerMenuCommand')) {
            source += 'GM.registerMenuCommand = ' + GM_registerMenuCommand.toString() + ';\n\n';
        }
        
        if (grants.includes('GM_registerMenuCommand')) {
            source += GM_registerMenuCommand.toString() + ';\n\n';
        }
        
        if (grants.includes('GM_addStyle')) {
            source += GM_addStyle.toString() + ';\n\n';
        }

        if (grants.includes('GM.addStyle')) {
            source += 'GM.addStyle = ' + GM_addStyle.toString() + ';\n\n';
        }

        if (grants.includes('unsafeWindow')) {
            // source += 'let unsafeWindow = (function() {var dummyElem = document.createElement("div");dummyElem.setAttribute("id", "windowDiv"); dummyElem.setAttribute("onclick", "return window;"); let win = dummyElem.onclick();console.log("__INITIAL_SSR_STATE__--------",win);return win;})()' + ';\n\n';
            source += 'let unsafeWindow = (function(){return document.defaultView;})();\n\n';
        }

        if (grants.includes('GM_openInTab')) {
            source += GM_openInTab.toString()+';\n\n';
        }

        if (grants.includes('GM_info')) {
            source += GM_info.toString()+';\n\n';
        }

        if (grants.includes('GM_getResourceURL')){
            // source += ' \n\n';
        }

        if (grants.includes('GM_xmlhttpRequest')) {
            source += GM_xmlhttpRequest.toString() + ';\n\n';
        }

        if (grants.includes('GM.xmlHttpRequest')) {
            source += 'GM.xmlHttpRequest = ' + GM_xmlhttpRequest.toString() + ';\n\n';
        }

        //add GM_log by default
        source +=  GM_log.toString() + ';\n\n';
        
        source += _fillStroge.toString() + ';\n\n';
        return source;
    }

    function _fillStroge(){
        return new Promise((resolve,reject) => {
            browser.runtime.sendMessage({ from: "gm-apis", operate: "GM_listValues", uuid:_uuid }, (response) => {
                resolve(response.body);
            });
        });
    }
    
    function GM_listValues(){
        return __stroge;
    }
    
    function GM_deleteValue(key){
        __stroge[key] = null;
        browser.runtime.sendMessage({ from: "gm-apis", operate: "GM_deleteValue", key: key, uuid:_uuid });
    }
    
    function GM_setValue(key,value){
        __stroge[key] = value;
        browser.runtime.sendMessage({ from: "gm-apis", operate: "GM_setValue", key: key, value: value, uuid:_uuid });
    }
    
    function GM_getValue(key, defaultValue){
        browser.runtime.sendMessage({ from: "gm-apis", operate: "GM_getValue", key: key, defaultValue: defaultValue, uuid:_uuid });
        return __stroge[key] == null ? defaultValue : __stroge[key];
    }
    
    function GM_listValues_p(){
        return new Promise((resolve,reject) => {
            browser.runtime.sendMessage({ from: "gm-apis", operate: "GM_listValues", uuid:_uuid }, (response) => {
                resolve(response.body);
            });
        });
    }
    
    function GM_deleteValue_p(key){
        return new Promise((resolve,reject) => {
            browser.runtime.sendMessage({ from: "gm-apis", operate: "GM_deleteValue", key: key, uuid:_uuid }, (response) => {
                resolve(response.body);
            });
        });
    }
    
    function GM_setValue_p(key,value){
        return new Promise((resolve,reject) => {
            browser.runtime.sendMessage({ from: "gm-apis", operate: "GM_setValue", key: key, value: value, uuid:_uuid }, (response) => {
                resolve(response.body);
            });
        });
    }
    
    function GM_getValue_p(key,defaultValue){
        return new Promise((resolve,reject) => {
            browser.runtime.sendMessage({ from: "gm-apis", operate: "GM_getValue", key: key, defaultValue: defaultValue, uuid:_uuid }, (response) => {
                resolve(response.body);
            });
        });
    }
    
    function GM_log(message){
        return new Promise((resolve,reject) => {
            browser.runtime.sendMessage({ from: "gm-apis", operate: "GM_log", message: message, uuid:_uuid }, (response) => {
                resolve(response.body);
            });
        });
    }
    
    function GM_registerMenuCommand(caption, commandFunc, accessKey){
        let userInfo = {};
        userInfo["caption"] = caption;
        userInfo["commandFunc"] = commandFunc;
        userInfo["accessKey"] = accessKey;
        userInfo["id"] = __RMC_CONTEXT.length;
        __RMC_CONTEXT.push(userInfo);
    }

    function GM_addStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        try {
            style.appendChild(document.createTextNode(css));
        } catch (ex) {
            style.styleSheet.cssText = css;//针对IE

        }
        head.appendChild(style);  
    }

    function unsafeWindowInit() {
        var div = document.createElement('div');
        div.setAttribute('id', 'windowDiv');
        // div.setAttribute('onclick', 'return window;');
        document.body.appendChild(div);
        // console.log("createGMApisWithUserScript---------unsafeWindow------------", window.__INITIAL_SSR_STATE__)
        // let win = div.onclick();
        // setTimeout(function () {
        //     // var div = document.createElement('div');
        //     // div.setAttribute('id', 'windowDiv');
        //     // div.setAttribute('onclick', 'return window;');
        //     // unsafeWindow = div.onclick();
        //     // console.log(unsafeWindow);
        //     win = div.onclick();
        //     console.log(win);
        //     console.log("createGMApisWithUserScript-----------setTimeout-----unsafeWindow-----")
        // }, 1000);
        // return win;
        // console.log("window=----", window.__INITIAL_SSR_STATE__)
        // return window.top.getBrowser().selectedBrowser.contentWindow; 
        return window;
    }
    
//    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//        console.log("abc");
//    });

    function GM_xmlhttpRequest(params) {
       
        let xhr = new XMLHttpRequest();
        var createState = function () {
            var rh = '';
            var fu = params.url;
            if (xhr.readyState > 2) {
                rh = xhr.getAllResponseHeaders();
                if (xhr.readyState == 4) {
                    // if (rh) {
                    //     rh = rh.replace(/TM-finalURL\: .*[\r\n]{1,2}/, '');
                    // }
                    var fi = xhr.getResponseHeader('TM-finalURL');
                    if (fi) fu = fi;
                }
            }
            var o = {
                readyState: xhr.readyState,
                responseHeaders: rh,
                finalUrl: fu,
                status: (xhr.readyState == 4 ? xhr.status : 0),
                statusText: (xhr.readyState == 4 ? xhr.statusText : '')
            };
            if (xhr.readyState == 4) {
                if (!xhr.responseType || xhr.responseType == '') {
                    o.responseXML = (xhr.responseXML ? escape(xhr.responseXML) : null);
                    o.responseText = xhr.responseText;
                    o.response = xhr.response;
                } else {
                    o.responseXML = null;
                    o.responseText = null;
                    o.response = xhr.response;
                }
            } else {
                o.responseXML = null;
                o.responseText = '';
                o.response = null;
            }
            return o;
        };
        var onload = function () {
            var responseState = createState();
            if (responseState.readyState == 4 &&
                responseState.status != 200 &&
                responseState.status != 0 &&
                retries > 0) {
                retries--;
                console.log('api_create: error at onload, should not happen! -> retry :)')
                GM_xmlhttpRequest(params);
                return;
            }
            console.log('responseState------', responseState)
            if (params.onload) {
                params.onload(responseState);
            } 
        };
        var onerror = function() {
            var responseState = createState();
            if (responseState.readyState == 4 &&
                responseState.status != 200 &&
                responseState.status != 0 &&
                retries > 0) {
                retries--;
                console.log('api_create: error at onerror, should not happen! -> retry')
                GM_xmlhttpRequest(params);
                return;
            }
            if (params.onerror) {
                params.onerror(responseState);
            } 
        };

        var onreadystatechange = function (c) {
            var responseState = createState();
            let onreadychange = params.onreadystatechange;
            if (onreadychange) {
                try {
                    if (c.lengthComputable || c.totalSize > 0) {
                        responseState.progress = { total: c.total, totalSize: c.totalSize };
                    } else {
                        var t = Number(getStringBetweenTags(responseState.responseHeaders, 'Content-Length:', '\n').trim());
                        // var t = 2;
                        var l = xhr.responseText ? xhr.responseText.length : 0;
                        if (t > 0) {
                            responseState.progress = { total: l, totalSize: t };
                        }
                    }
                } catch (e) { }
                onreadychange(responseState);
            }
        };

        var getStringBetweenTags = function (source, tag1, tag2) {
            var b = source.search(escapeForRegExp(tag1));
            if (b == -1) {
                return '';
            }
            if (!tag2) {
                return source.substr(b + tag1.length);
            }
            var e = source.substr(b + tag1.length).search(escapeForRegExp(tag2));

            if (e == -1) {
                return '';
            }
            return source.substr(b + tag1.length, e);
        };
        var escapeForRegExpURL = function (str, more) {
            if (more == undefined) more = [];
            var re = new RegExp('(\\' + ['/', '.', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].concat(more).join('|\\') + ')', 'g');
            return str.replace(re, '\\$1');
        };

        var escapeForRegExp = function (str, more) {
            return escapeForRegExpURL(str, ['*']);
        };
        xhr.onload = onload;
        xhr.onerror = onerror;
        xhr.onreadystatechange = onreadystatechange;

        try {
            // method：HTTP 请求方法，必须参数，值包括 POST、GET 和 HEAD，大小写不敏感。
            // url：请求的 URL 字符串，必须参数，大部分浏览器仅支持同源请求。
            // async：指定请求是否为异步方式，默认为 true。如果为 false，当状态改变时会立即调用 onreadystatechange 属性指定的回调函数。
            let asyncT = true;
            if (typeof params.async != undefined){
                asyncT = params.async;
            }
            let method = "GET";
            if (typeof params.method != undefined){
                method = params.method;
            }
            // username：可选参数，如果服务器需要验证，该参数指定用户名，如果未指定，当服务器需要验证时，会弹出验证窗口。
            
            if (typeof params.user != undefined && typeof params.password != undefined){
                xhr.open(method, params.url, params.user, params.password); // 建立连接
            }else{
                xhr.open(method, params.url); // 建立连接
            }
           
            
            // 超时时间，单位是毫秒
            let timeout = params.timeout ? params.timeout : 0;
            xhr.timeout = timeout; 
            // 设置HTTP请求头部的方法。此方法必须在  open() 方法和 send()   之间调用
            // 'Content-type', 'application/x-www-form-urlencoded'
            if (params.headers && JSON.stringify(params.headers) != '{}') {
                Object.keys(params.headers).forEach((key) => {
                    var p = key;
                    if (key.toLowerCase() == 'user-agent' || key.toLowerCase() == 'referer') {
                        p = 'https' + key;
                    }
                    xhr.setRequestHeader(p, params.headers[key]);
                });
            }
            if (typeof (params.overrideMimeType) !== 'undefined') {
                xhr.overrideMimeType(params.overrideMimeType);
            }
            if (typeof (params.responseType) !== 'undefined') {
                xhr.responseType = params.responseType;
            }
            if (params.nocache){
                xhr.setRequestHeader('Cache-Control', 'no-cache');
            }
            // 设置cookie
            // 在发送来自其他域的XMLHttpRequest请求之前，未设置withCredentials 为true，那么就不能为它自己的域设置cookie值。
            // 而通过设置withCredentials 为true获得的第三方cookies，将会依旧享受同源策略，因此不能被通过document.cookie或者从头部相应请求的脚本等访问。
            if(params.cookie){
                xhr.withCredentials = true;
                xhr.setRequestHeader('Cookie', params.cookie);
            }
            xhr.ontimeout = function (e) {
                console.error('Timeout!!')
                if (params.ontimeout){
                    params.ontimeout(e)
                }
            }
            // 可以使用 send() 方法发送请求
            if (typeof (params.data) !== 'undefined') {
                xhr.send(details.data);
            } else {
                xhr.send();
            }
            // if (!body && params.binary) {
            //     xhr.send(params.binary.getBlob('text/plain'));
            // }else{
            //     xhr.send(body);
            // }
        } catch (error) {
            console.log('xhr: error: ' + error);
            if (params.onerror) {
                var resp = {
                    responseXML: '',
                    responseText: '',
                    response: null,
                    readyState: 4,
                    responseHeaders: '',
                    status: 403,
                    statusText: 'Forbidden'
                };
                params.onerror(resp);
            } 
        }
    }

    function GM_info() {
        return "hello"
    }

    function GM_openInTab(url, bg) {
        
    }

    window.createGMApisWithUserScript = createGMApisWithUserScript;

})();
