/**
 * Created by yyt on 2017/6/16.
 */
define(function (require) {
    var LIB = require('lib');

    ////右侧滑出详细页
    var tpl = require("text!./contacts.html");
    var scrolloutside = require("components/directives/scrolloutside");
    //右侧滑出详细页
    //var tpl = require("text!./detail.html");
    //初始化数据模型
    var newVO = function () {
        return {
            id:null,
            type:"2"
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            showTabs: false
        },
        //select 数据源
        typeList:[],
        //tabs 数据源 tab页签
        todoList:[],
        //tabs 数据源
        tabsList:[],
        //tabs开关
        isShowTabs:false,
        index:0,
        //滚动控制器
        scrollDisable: false,
        //滚动加载数据的页码
        loadIndex:2,
        completed:true,

    };
//Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        template: tpl,
        components: {
        },
        data: function () {
            return dataModel;
        },
        computed:{
        },
        watch:{
            "mainModel.vo.type":function(val,nVal){
                var _this = this;
                if(nVal){
                    var resource = _this.$resource("/todo/mine/{currentPage}/{pageSize}");
                    var baseParam = {
                        currentPage: _this.loadIndex,
                        pageSize:20,
                        "criteria.intValue":{status:_this.index},
                        type:_this.mainModel.vo.type
                    };
                    resource.get(baseParam).then(function(res){
                        _this.tabsList = res.data.list;
                    });
                }
            }
        },
        methods: {
            //关闭
            doClose: function () {
                this.$dispatch("ev_detailShutDown");
            },
            //控制台点击切换
            doTabs:function(data){
                var _this = this;
                _this.index = parseInt(data.key) - 1;
                if(_this.index==1){
                    _this.completed  = false;
                }else{
                    _this.completed  = true;
                }
                var resource = _this.$resource("/todo/mine/{currentPage}/{pageSize}");
                var baseParam = {
                    currentPage: 1,
                    pageSize:20,
                    "criteria.intValue":{status:_this.index},
                    type:_this.mainModel.vo.type
                };
                resource.get(baseParam).then(function(res){
                    _this.tabsList = res.data.list;
                })

            },
            getDataDic: function(type,key){
                var result = LIB.setting.dataDic[type] || {};
                if (!_.isEmpty(result) && key) {
                    result = result[key] || "";
                }
                //异步绑定时，key可能是null
                if (!key) {
                    return "";
                }
                return result;
            },
            //待办跳转路由链接
            doTodo:function(type,id,isComplete){
                var router = LIB.ctxPath("/html/main.html#!");
                if((type == 1 || type == 2 || type == 3 || type == 11) && isComplete == 1) {
                    window.isClickPoolTotalExecutBtn = true;
                    var routerPart="/businessCenter/hiddenGovernance/total?method=detail&opt=isClickPoolTotalExecutBtn&id="+id;
                    window.open(router + routerPart);
                    //this.$router.go(routerPart);
                }else if(type == 1) {
                    //window.isClickPoolRegistExecutBtn = true;
                    window.isClickPoolAssignExecutBtn = true;
                    //var routerPart="/businessCenter/hiddenGovernance/regist?method=detail&id="+id;
                    var routerPart="/businessCenter/hiddenGovernance/assign?method=detail&opt=isClickPoolAssignExecutBtn&id="+id;
                    window.open(router + routerPart);
                    //this.$router.go(routerPart);
                }else if(type == 2) {
                    window.isClickPoolReformExecutBtn = true;
                    var routerPart="/businessCenter/hiddenGovernance/reform?method=detail&opt=isClickPoolReformExecutBtn&id="+id;
                    window.open(router + routerPart);
                    //this.$router.go(routerPart);
                }else if(type == 3) {
                    window.isClickPoolVerifyExecutBtn = true;
                    var routerPart="/businessCenter/hiddenGovernance/verify?method=detail&opt=isClickPoolVerifyExecutBtn&id="+id;
                    window.open(router + routerPart);
                    //this.$router.go(routerPart);
                }else if(type == 5) {
                    window.isClickCheckTaskExecutBtn = true;
                    var routerPart="/businessCenter/hiddenDanger/inspectionTask?method=detail&opt=isClickCheckTaskExecutBtn&id="+id;
                    window.open(router + routerPart);
                    //this.$router.go(routerPart);
                }else if(type == 11) {
                    window.isClickPoolAssignExecutBtn = true;
                    var routerPart="/businessCenter/hiddenGovernance/assign?method=detail&opt=isClickPoolAssignExecutBtn&id="+id;
                    window.open(router + routerPart);
                    //this.$router.go(routerPart);
                }
            },
            //加载
            loadMore :function(data) {
                var _this = this;
                if(data.clientHeight + data.scrollTop >= data.scrollHeight - 50){
                    //防止为了重复请求
                    if (!this.scrollDisable) {
                        this.scrollDisable = true;
                        var resource = _this.$resource("/todo/mine/{currentPage}/{pageSize}");
                        var baseParam = {
                            currentPage: _this.loadIndex,
                            pageSize:20,
                            "criteria.intValue":{status:_this.index},
                            type:_this.mainModel.vo.type
                        };
                        resource.get(baseParam).then(function(res){
                            var  list = res.data.list;
                            //isLastPage 如果为ture 就说明就是最后一页 不加载数据
                            if(res.body.isLastPage){
                                return;
                            }
                            _.each(list,function(item){
                                _this.tabsList.push(item);
                            })
                            _this.loadIndex++;
                            _this.scrollDisable = false;
                        })
                    }
                }

            },
            doreload:function(){
                var _this = this;
                //清空数据
                _this.isShowTabs = false;
                _this.typeList = [];
                _this.todoList =[];
                _this.tabsList = [];
                //select下拉
                _this.typeList = LIB.getDataDicList('todo_type');
                //tab页签
                for ( var i in LIB.setting.dataDic.tool_type){
                    var arr ={name:LIB.setting.dataDic.tool_type[i]}
                    _this.todoList.push(arr);
                }
                //初始化加载数据
                var resource = _this.$resource("/todo/mine/{currentPage}/{pageSize}");
                var baseParam = {
                    currentPage: 1,
                    pageSize:20,
                    "criteria.intValue":{status:0},
                    type:_this.mainModel.vo.type
                }
                resource.get(baseParam).then(function(res){
                    _this.tabsList = res.data.list;
                    _this.isShowTabs = true;
                });
            }
        },
        events: {
            "ev_detailContactsReload": function (){
                this.doreload();
            }
        },

        ready : function() {
            //this.doreload();
        }
    });

    return detail;
})