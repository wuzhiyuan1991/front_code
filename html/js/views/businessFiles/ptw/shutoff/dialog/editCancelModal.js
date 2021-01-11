define(function(require){
    var LIB = require('lib');
    var api = require("../../stuff/vuex/api");

    var shutoffApi = require("../vuex/api")
    //数据模型
    var tpl = require("text!./editCancelModal.html");

    //初始化数据模型
    var newVO = function() {
        return {
            name:null,
            type:null,
            id:null
        }
    };

    //Vue数据
    var dataModel = {
        list:[],
        type:15, // 类型 数据字典 iptw_catalog_type
        doSelectTaskIndex:-1,
        mainModel : {
            vo : newVO(),
            title:"添加",
            type:'',
            inputLabel:null,
            //验证规则
            rules:{
                "code" : [LIB.formRuleMgr.length(100)],
                "name" :LIB.formRuleMgr.require("状态"),
                // "retrialDate" : [LIB.formRuleMgr.require("预定复审时间")],
                // "result" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("复审结果")),
                // "uploadDate" : [LIB.formRuleMgr.allowStrEmpty],
                // "cert.id" : [LIB.formRuleMgr.require("证书")],
                // "uploader.id" : [LIB.formRuleMgr.allowStrEmpty],
            },
        },

    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components : {},
        props: {
            visible:{
                type:Boolean,
                default:false
            },
            selectOrgId:String
        },
        watch:{
            "visible":function (val) {
                val && this.init();
            }
        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            init:function(){
                this.getList(true);
            },
            doCancel:function () {
                this.visible = false;
            },
            onMoveRow:function (val, obj) {
                var _this = this;
                var params = {
                    type:this.type,
                    criteria: {intValue: {offset: val}},
                    offset:val,
                    id:obj.id
                };
                api.order(params).then(function (res) {
                    _this.$emit("do-update", _this.list);
                })
            },
            doEditCatalogType:function (item,name, that) {
                var temp=_.extend({},item);
                temp.name=name;
                var _this = this;
                api.update(temp).then(function(){
                    item.name=name;
                    _this.getList(true);
                    LIB.Msg.info("保存成功");
                    that.modalEdit.show = false;
                })
            },
            doSaveCatalogType:function (items, that) {
                var _this = this;
                var pms={type:7,compId:this.selectOrgId,orgId:this.selectOrgId}
                items.forEach(function(item){
                    _.extend(item,pms);
                });
                api.createBatch(items).then(function () {
                    _this.getList(true);
                    that.modalAdd.show = false;
                })
            },
            doDelCataLogType:function(data,index, that){
                var _this = this;
                api.removeSingle(null, data).then(function (res) {
                    LIB.Msg.info('删除成功');
                    that.values.splice(index,1);
                    if(that.values.length===0){
                        that.selectedIndex=-1;
                    }
                    else if(that.values.length<that.selectedIndex+1){
                        that.selectedIndex=that.values.length-1;
                    }
                    _this.getList(true);
                })
            },
            doDelCataLogTypeAll:function(values,that){
                var _this = this;
                shutoffApi.removeAll({type:7}).then(function (res) {
                    LIB.Msg.info('删除成功');
                    // that.values.splice(0);
                    _this.list.splice(0);
                    _this.getList(true);
                })
            },
            _getPms:function(){
                var pms={
                    type:7,
                    "criteria.intsValue":JSON.stringify({disable:[0]}),
                    compId:this.selectOrgId
                };
                return pms;
            },
            getList :function (reload) {
                var _this = this;
                var pms = this._getPms();
                if(!reload && this.currentTab.load){return}
                api.list(pms).then(function (res) {
                    _this.list = res.data;
                    _this.$emit("do-update", _this.list);
                })
            }
        }
    });

    return detail;
});