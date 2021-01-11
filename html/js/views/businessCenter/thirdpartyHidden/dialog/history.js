define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./history.html");
    //初始化数据模型
    var newVO = function () {
        return {
            desps: []
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO()
        },
        historyColumns:[
            {
                title:"节点",
                fieldType:"custom",
                render: function(data){
                    if(data.desp){
                        return data.desp;
                    }
                }
            },
            {
                title:"处理人",
                fieldType:"custom",
                width:"135px",
                render: function(data){
                    return _.reduce(data.assignees, function(memo, assignee, index){
                        if(index > 0) memo += ",";
                        memo += assignee.username;
                        return memo;
                    }, "");
                }
            },
            {
                title:"时间",
                fieldType:"custom",
                width:"160px",
                render: function(data){
                    if(data && data.date){
                        return data.date;
                    }
                }
            },
            {
                title:"处理结果",
                fieldType:"custom",
                render: function(data){
                    if(data && data.operationName){
                        return data.operationName;
                    }
                }
            },
            {
                title:"原因/结果",
                fieldType:"custom",
                render: function(data){
                    if(data && data.suggestion){
                        return data.suggestion;
                    }
                }
            }
        ]
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
        data: function () {
            return dataModel;
        },
        props: {
            poolId: [String]
        },
        methods: {
            doClose: function () {
                this.$dispatch("ev_detailColsed");
                LIB.Msg.info("关闭");
            },
            initData: function () {
                if (this.poolId) {
                    dataModel.mainModel.vo.desps = [];
                    var _desps = dataModel.mainModel.vo.desps;
                    api.history({id: this.poolId}).then(function (res) {
                        //初始化图片数据
                        _.each(res.data, function (obj) {
                            _desps.push({'desp' : obj.desp, "date" : obj.date, 'assignees' : obj.assignees, 'operationName' : obj.operationName, 'suggestion' : obj.suggestion});
                        });
                    })
                }
            },

        },
        watch: {
            poolId: function () {
                this.initData();
            }
        },
        //ready: function () {
            //this.initData();
        //},
        events:{
            init:function(){
                this.initData();
            }
        }
    });

    return detail;
});