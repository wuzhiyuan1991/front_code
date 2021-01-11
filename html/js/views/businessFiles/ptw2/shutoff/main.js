define(function (require) {
    //基础js
    var LIB = require('lib');
    var commonApi = require("../api");
    var api = require("./vuex/api");
    var stuffApi=require("../stuff/vuex/api")
    _.extend(api,commonApi);
    var tpl = LIB.renderHTML(require("text!./main.html"));
    // 弹框
    var editModal = require('./dialog/editModal');
    var editCancelModal = require("./dialog/editCancelModal");
    LIB.registerDataDic("shut_off_type", [
        ["1","作业完成"],
        ["2","作业取消"],
        ["3","作业延期"],
        ["4","作业续签"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "ptwCatalog",
            checkedGroupIndex:0, // 导航下标
            tabList:[],//数据字典列表
            mainModel:{
                visible:false,
                type:null,
                finishptw:{id:null, name:null},
                cancelptw:{id:null, name:null},
            },

            formModel:{
                edit:{
                    visible:false
                },
                editCancel:{
                    visible:false
                }
            },

            cancelReasonList:null
        };
    };

    var vm = LIB.VueEx.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth],

    	template: tpl,
        data: initDataModel,
        components: {
            "editModal":editModal,
            "editCancelModal":editCancelModal
        },
        computed:{


        },
        methods: {
            saveInfo:function (val) {
                var _this = this;
                api.update(val).then(function (res) {
                    LIB.Msg.info("保存成功");
                    if(_this.mainModel.type == 7){
                        _this.mainModel.finishptw.name = val.name;
                    }else if(_this.mainModel.type == 6){
                        _this.mainModel.cancelptw.name = val.name;
                    }
                })
            },
            doShowEdit:function (val) {
                this.mainModel.type = val;
                if(val == 6){
                    this.formModel.edit.visible = true;
                    this.$refs.edit.init(this.mainModel.cancelptw);
                }else if(val ==7){
                    this.formModel.edit.visible = true;
                    this.$refs.edit.init(this.mainModel.finishptw);
                }
            },
            updateCancelList:function (arr) {
                this.cancelReasonList = arr;
            },
            doShowCancelModal:function () {
                this.formModel.editCancel.visible = true;
            },
            getList:function (type) {
                var _this = this;
                var pms = {type:type};
                api.list(pms).then(function (res) {
                    if(type == 7){
                        _this.mainModel.finishptw = res.data[0];
                    }else if(type == 6){
                        _this.mainModel.cancelptw = res.data[0];
                    }
                })
            },
            getbaseList:function () {
                var _this = this;
                stuffApi.list({type:7}).then(function (res) {
                    _this.cancelReasonList = res.data;
                })
            },

        },
        init: function(){
        	this.$api = api;
            this.__auth__ = this.$api.__auth__;
        },
        ready: function () {
            this.tabList = this.getDataDicList('shut_off_type');
            var _this = this;
            this.getList(6);
            this.getList(7);
            this.getbaseList()
        },
        route:{
            activate:function (transition) {
                var type=this.$route.query.type;
                if(type&&!isNaN(type)) {
                    var index = this.$route.query.type - 1;
                    if(index>3){index=0}
                    this.checkedGroupIndex = index;
                }
                transition.next();
            }
        }
    });

    return vm;
});
