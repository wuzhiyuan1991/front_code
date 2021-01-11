define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = require("text!./menuHeader.html");
    var api = require("./vuex/api");
    var opts = {
        template: template,
        props: {
            values: {
                type: Array,
                default: function () {
                    return []
                }
            },

            index: {
                type: Number,
                default: ''
            }
        },
        computed: {
            always: function () {
                // var w = window.screen.width;
                var num = parseInt(($('#menu').outerWidth() - 158 - 90 - 22 )) ;
                var count = 0;
                for(var i=0; i<this.values.length; i++){
                    if(this.values[i].routerPath == '/home'){
                        count+=90;
                    }else{
                        count += 20 + this.values[i].name.length * 18 ;
                    }
                    if(count > num){
                        break;
                    }
                }
                var alwaysHeader = this.values.slice(0,i)
                if (alwaysHeader[0].routerPath != '/home' ) {
                    var index= _.findIndex(alwaysHeader,function(item){
                        return item.routerPath == '/home'
                     })
                    if(index >=0){
                        var value =   alwaysHeader[index]
                        alwaysHeader.splice(index,1)
                        alwaysHeader.unshift(value)
                    }
                }
                return alwaysHeader
            },
            notAlways: function () {
                var num = parseInt(($('#menu').outerWidth() - 158 - 90 - 22 )) ;
                var count = 0;
                for(var i=0; i<this.values.length; i++){
                    if(this.values[i].routerPath == '/home'){
                        count+=90;
                    }else{
                        count += 20 + this.values[i].name.length * 18 ;
                    }
                    if(count > num){
                        break;
                    }
                }
                return this.values.slice(i)
            },
            showMoreIcon: function () {
                return this.notAlways.length > 0
            },
            activeItem: function () {
                var path = this.$route.path;
                var paths = path.split('/');
                return '/' + paths[1];
            }
        },
        data: function () {
            return {
                title: '菜单顺序',
                show: false,
                expUrl:"/file/down/",
                sortMenus: [],
                menuCount:6,
                downNumber:null,
                numberAll:null,
                activeIndex:-1,
                isShow:false,
                tableModel: LIB.Opts.extendMainTableOpt(
                    {
                        url: "userexporttask/list{/curPage}{/pageSize}",
                        columns: [
                            {
                                title: "",//编码
                                fieldName: "code",
                                width:40,
                            }, 
                            {
                                title: "开始时间",
                                fieldName: "createDate",
                                width:120,
                            }, 
                            {
                                title: "结束时间",
                                fieldName: "modifyDate",
                                width:120,
                            }, 
                            {
                                title: "时长",
                                fieldName: "create",
                                width:100,
                            }, 
                            {
							title:"状态",
							filterName:"status",
							width: 60,
							render: function(data){
                                if(data.status==="1"){
                                    return "进行中"
                                }else if(data.status==="2"){
                                    return "已结束"
                                }else if(data.status==="3"){
                                    return "失败"
                                }
							},
						},
                            {
                                 title : "文件",
                                width:60,
                                render: function(data){
                                    if(data.status==="2"){
                                        return '<div title=""   style="color: #33adea; cursor: pointer;">' +'下载' + '</div>';
                                    }else{
                                        return  ""
                                    }
                                },
                            },
                           
                            {
                                title : "",//删除工具
                                fieldType : "tool",
                                toolType : "del",
                                width:50,
                                render: function (data) {
                                    if (data.sign) {
                                        var className = data.sign == '2' ? 'status-rect-tag-yellow' : 'status-rect-tag-green';
                                      var text= data.sign == '2'?'删除':''
                                      return    '<div class="status-rect-tag ' + className + '" style="color: #fff;">' +text + '</div>';
                                       
                                    }
                                 },
                            }
                        ]
                    }
                ),
            }
        },
        methods: {
            doRemoveOpMaintSteps:function(val){
                debugger
                var _this=this
                var delId=val.entry.data.id
                api.delDownLoad({id:delId}).then(function(res){
                    _this.$refs.table.doRefresh()
                    LIB.Msg.info("删除成功");
                    _this.downNumber=  _this.downNumber-1
                })
            },
            downLoad:function(e){
                var _this=this
                if(e.el._el.innerHTML=="下载"){
                    
                    window.open(_this.expUrl+e.entry.data.cloudFileId);
                }
            },
            doRefresh:function(){
                this.$refs.table.doRefresh()
                LIB.Msg.info("刷新成功");
            },
            doClose1:function(){
                this.isShow=false
            },
            sureDownLoad:function(){
                this.isShow=true
            },
            doClick: function (name) {
                this.activeItem = name;
            },
            changePath: function (item, name) {
                if (_.startsWith(item.routerPath, "http")) {
                    if(_.isEmpty(item.callBackContent)) {
                        window.open(item.routerPath)
                    } else {
                        eval(item.callBackContent);
                        window.open(item.routerPath);
                    }
                } else {
                    this.$router.go(item.routerPath);
                }
                if (name) {
                    this.activeItem = name;
                }
            },
            classes: function (item) {
                var obj = {};
                obj['header-item-home'] = item.routerPath === "/home";
                obj['v-link-active'] = this.activeItem === item.routerPath;
                return obj;
            },
            doShowModal: function () {
                var _menu = _.map(this.values, function (item) {
                    if (item.routerPath !== '/home') {
                        return {
                            id: item.id,
                            name: item.name
                        }
                    }

                });
                this.sortMenus = _.compact(_menu);
                this.show = true;
                this.activeIndex = -1;
            },
            doDragEnd: function (index) {
                this.activeIndex = index;
            },
            doUp: function (index) {
                if (index === 0) {
                    return
                }
                var _m = this.sortMenus.splice(index, 1);
                this.sortMenus.splice(index - 1, 0, _m[0]);
                this.activeIndex = index;
            },
            doDown: function (index) {
                if (index === this.sortMenus.length - 1) {
                    return
                }
                var _m = this.sortMenus.splice(index, 1);
                this.sortMenus.splice(index + 1, 0, _m[0]);
                this.activeIndex = index;
            },
            doSave: function () {
                var _this = this,
                    _params,
                    _homeMenu,
                    params;

                _params = _.map(this.sortMenus, function (item) {
                    return {
                        id: item.id
                    }
                });
                _homeMenu = _.find(this.values, function (item) {
                    return item.routerPath === '/home';
                });

                if(_homeMenu)
                _params.unshift({
                    id: _homeMenu.id
                });

                params = {
                    objText: JSON.stringify(_params)
                };
                Vue.http.post('user/' + LIB.user.id + '/profile/1', params).then(function () {
                    _this.afterDoSave(_params);
                })
            },
            afterDoSave: function (menus) {
                var res = [];
                var obj = _.groupBy(this.values, 'id');
                _.forEach(menus, function (menu) {
                    res = res.concat(obj[menu.id])
                });
                this.values = res;
                this.show = false;
            },
            _setMenuBoxWidth: function () {
                var width = this.$els.box.clientWidth;
                if (this.$refs.dropdown) {
                    this.$refs.dropdown.$el.style.width = (width - 55) + "px";
                }
            },

        },
        ready: function () {

            this.$nextTick(function () {
                this.$emit("on-ready");
            });
            this._setMenuBoxWidth();
            var _this = this;
            $(window).resize(function () {
                var aa = _.cloneDeep(_this.values);
                _this.values = null;
                _this.values = aa;
                _this.$nextTick(function () {
                    _this._setMenuBoxWidth();
                });
            });
            function httpRequest(paramObj,fun,errFun) {
                var xmlhttp = null;
                /*创建XMLHttpRequest对象，
                 *老版本的 Internet Explorer（IE5 和 IE6）使用 ActiveX 对象：new ActiveXObject("Microsoft.XMLHTTP")
                 * */
                if(window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                }else if(window.ActiveXObject) {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                /*判断是否支持请求*/
                if(xmlhttp == null) {
                    alert('你的浏览器不支持XMLHttp');
                    return;
                }
                /*请求方式，并且转换为大写*/
                var httpType = (paramObj.type || 'GET').toUpperCase();
                /*数据类型*/
                var dataType = paramObj.dataType || 'json';
                /*请求接口*/
                var httpUrl = paramObj.httpUrl || '';
                /*是否异步请求*/
                var async = paramObj.async || true;
                /*请求参数--post请求参数格式为：foo=bar&lorem=ipsum*/
                var paramData = paramObj.data || [];
                var requestData = '';
                for(var name in paramData) {
                    requestData += name + '='+ paramData[name] + '&';
                }
                requestData = requestData == '' ? '' : requestData.substring(0,requestData.length - 1);
                console.log(requestData)
                
                /*请求接收*/
                xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                  /*成功回调函数*/
                  fun(xmlhttp.responseText);
                }else{
                    /*失败回调函数*/
                    errFun;
                }
                }			
                
                /*接口连接，先判断连接类型是post还是get*/
                if(httpType == 'GET') {
                    xmlhttp.open("GET",httpUrl,async);
                xmlhttp.send(null);
                }else if(httpType == 'POST'){
                    xmlhttp.open("POST",httpUrl,async);
                    //发送合适的请求头信息
                    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
                    xmlhttp.send(requestData); 
                }
            }
            var _this = this
            var url = '/userexporttask/list/1/10000'
            /*请求参数*/
            var paramObj = {
              httpUrl: url,
              type: 'GET'
            }
            /*请求调用*/
            httpRequest(
              paramObj,
              function (res) {
            //  console.log(JSON.parse(res).content.list.length);
            _this.numberAll=JSON.parse(res).content.list.length
            _this.downNumber=  _this.numberAll
              }
            )

        },
        events:{
            "ev_download": function (nVal) {
                // console.log(nVal);
                // this._init(nVal);
                this.downNumber=nVal
            },
        }
    };
    return opts;
});
