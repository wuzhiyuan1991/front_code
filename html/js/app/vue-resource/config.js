//请参考 1.0 文档 https://github.com/pagekit/vue-resource/blob/master/docs/config.md
define(function(require) {

    var LIB = require('lib');
    var BASE = require('base');
    var VueResource = require('vueResource');
    var Vue = LIB.Vue;


    function LoadingObj() {
        this.list = [];
        this.timer = null;
        this.maxTime = 300;//接口等待多少毫秒开始动画
        this.loading = new LIB.Msg.requestLoading();
        this.minShowTime = 5000; // 最小显示时间（毫秒）
    }
    LoadingObj.prototype.push = function (obj) {

        // 判断请求是否已在队列中
        var hasIn = _.find(this.list, function (item) {
            if(obj.method === 'POST') {
                return item.url === obj.url && item.body === obj.body;
            } else {
                return item.url === obj.url && item.params === obj.params;
            }
        });

        if(hasIn) {
            LIB.Msg.warning("请求正在处理中，请稍候");
            return false;
        }

        // 动画开始显示时间
        obj.animationStartAt = obj.animationStartAt || obj.requestStartAt + this.maxTime;

        // 动画最早结束时间
        obj.animationEndAt = obj.animationStartAt + this.minShowTime;

        this.list.push(obj);

        if(!this.timer) {
            this.startInterval();
        }
        return true;
    };

    LoadingObj.prototype.startInterval = function () {

        var _this = this;

        var fn = function () {

            if(_this.list.length === 0) {
                return _this.clearInterval();
            }
            var _now = Date.now();

            // 保留 还未请求结束的 以及 当前时刻在动画开始和结束时间之间的 请求
            _this.list = _.filter(_this.list, function (item) {
                return (!item.requestEndAt || (_now > item.animationStartAt && _now < item.animationEndAt))&&!item.success;
            });

            // 检查是否需要显示动画
            _.forEach(_this.list, function (item) {

                // 当前时间大于动画开始时间
                if(_now > item.animationStartAt) {
                    _this.loading.show();
                }

            })
        };

        this.timer = setInterval(fn, 50);

    };

    LoadingObj.prototype.clearInterval = function () {
        this.loading.hide();
        clearInterval(this.timer);
        this.timer = null;
    };

    var loadingObj = new LoadingObj();

    //设置全局配置
    var initGlobalSetting = function() {

        LIB.Vue.use(VueResource);

        /**
         global Vue object， 全局模式调用
         Vue.http.get('/someUrl', [options]).then(successCallback, errorCallback);
         Vue.http.post('/someUrl', [body], [options]).then(successCallback, errorCallback);
         in a Vue instance， 在一个vue实例中调用
         this.$http.get('/someUrl', [options]).then(successCallback, errorCallback);
         this.$http.post('/someUrl', [body], [options]).then(successCallback, errorCallback);
         常用方法列表
         get(url, [options])
         head(url, [options])
         delete(url, [options])
         jsonp(url, [options])
         post(url, [body], [options])
         put(url, [body], [options])
         patch(url, [body], [options])

         */
        //http配置请参考  https://github.com/vuejs/vue-resource/blob/master/docs/http.md

        /*********vue resource 测试开始********************************************************/
        Vue.http.options.root = BASE.ctxpath;
        Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';
        Vue.http.headers.common['Cache-Control'] = 'no-cache';
        Vue.http.headers.common['Pragma'] = 'no-cache';
        Vue.http.headers.common['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        //		Vue.http.options.credientials = false;
        //		Vue.http.options.crossDomain = false;
        //拦截器配置

        /****************************************************/
        /**设置异步请求拦截器**/
        Vue.http.interceptors.push(function(req, next) {
            var obj = {
                url: req.url,
                method: req.method,
                requestStartAt: Date.now()
            };

            //json对象转String
            if (req.body) {
                obj.reqObj = req.body;
                req.body = JSON.stringify(req.body);
                obj.body = req.body;
            }

            if(_.isNumber(req.time)) {
                obj.animationStartAt = obj.requestStartAt + req.time;
            }

            if(req.params) {
                obj.params = JSON.stringify(req.params);
            }

            if(req.method !== 'GET' || _.isNumber(req.time)) {
                var success = loadingObj.push(obj);
                if(!success) {
                    return;
                }
            }

            //解决跨域无法传递cookies问题 ，
            req.credentials = true;

            next(function(res) {

                if(obj.method == "PUT" || obj.method == "POST") {
                    //清空无用的criteria
                    var reqObj = obj.reqObj;
                    if(reqObj["criteria"]) {
                        _.chain(reqObj).get("criteria.strValue").each(function(v,k,d){
                            if(_.endsWith(k, "_empty")){
                                delete reqObj.criteria.strValue[k];
                            }
                        }).value();
                        _.chain(reqObj).get("criteria.intValue").each(function(v,k,d){
                            if(_.endsWith(k, "_empty")){
                                delete reqObj.criteria.intValue[k];
                            }
                        }).value();
                        _.chain(reqObj).get("criteria.strValue").isEmpty().value() && (delete reqObj.criteria["strValue"]);
                        _.chain(reqObj).get("criteria.intValue").isEmpty().value() && (delete reqObj.criteria["intValue"]);
                        _.chain(reqObj).get("criteria").isEmpty().value() && (delete reqObj["criteria"]);
                    }
                }

                obj.requestEndAt = Date.now();

                if (res.ok) {
                    var resData = res.data;
                    if (_.isString(resData) && _.startsWith(resData, "{") && _.endsWith(resData, "}")) {
                        res.data = JSON.parse(resData);
                    }
                    if (res.data.error === '0') { //处理正常的请求
                        // var data = res.data = res.data.content;
                        var content = res.data.content;
                        if (_.isString(content) && _.startsWith(content, "{") && _.endsWith(content, "}")) {
                            content= JSON.parse(content);
                        }
                        if(req.method !== 'GET' || _.isNumber(req.time)){
                            obj.success=true;//添加接口访问完成的标志
                        }
                        res.data = content;
                        window.hasLogout = false;
                    } else { //处理异常的请求
                        LIB.globalLoader.hide();
                        res.ok = false;
                        //重新登录错误code,直接跳转登录页面
                        if (res.data.error === "E10017") {
                            window.hasLogout = true;
                            LIB.Modal.error({
                                title: '当前会话已过期,请重新登录',
                                onOk: function() {
                                    var logoutActionUrl = window.localStorage.getItem("logoutActionUrl");//自定义登出地址
                                    if(logoutActionUrl) {
                                        Vue.http.get(logoutActionUrl).then(function(res){
                                            //如果自定义的登出逻辑异常了， 则返回的安全眼默认的登出页面 /logout, 则调用默认登出逻辑
                                            if(res.data == "/logout") {
                                                Vue.http.get(LIB.ctxPath() + "/user/logout").then(function(data) {
                                                    if (data.status == 200) {
                                                        document.location = LIB.ctxPath();
                                                    }
                                                },function () {//如果session失效，则直接跳转到登录页
                                                    document.location = LIB.ctxPath();
                                                });
                                            } else { //调用自定义的登出逻辑
                                                document.location = res.data;
                                            }
                                        }, function(){
                                            document.location = LIB.ctxPath();
                                        });
                                    }else {
                                        document.location = LIB.ctxPath();
                                    }
                                }
                            });
                            return;
                        }
                        LIB.Msg.error('[' + res.data.error + '] :' + res.data.message, 5);
                    }
                } else {
                    LIB.globalLoader.hide();
                    //处理服务器错误
                    LIB.Msg.error('您请求的资源不存在，请联系IT人员', 3);
                }
            });
        });
        /****************************************************/

    };

    //初始化用户配置
    var initCfg = function() {

    };

    return {

        init: function() {

            initGlobalSetting();

            initCfg();

        }
    };

});
