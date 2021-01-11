define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./baseinfo.html");
    var formItemRow=require("./form-item-row");
    var editText=require("./edit-text");
    var baseTransfer=require("../base-transfer");
    var moddalSelWorkCatalog=require("../modal-sel-workcatalog");
    var baseSettingModel = require("./dialog/baseSettingModel");
    var noticeModal = require("./dialog/noticeModal");
    var commonApi=require("../../api");
    var apiList = require('./dialog/api');
    return Vue.extend({
        template: template,
        components:{
            "formItemRow":formItemRow,
            "editText":editText,
            "baseTransfer":baseTransfer,
            "moddalSelWorkCatalog":moddalSelWorkCatalog,
            "baseSettingModel": baseSettingModel,
            "noticeModal": noticeModal
        },
        props:{
            model:{
                type:Object,
                required:true,
            }
        },
        computed:{
             equipmentList:function () {
                 return  this.model.ptwCardStuffs.filter(function (item) {
                     return  item.type==1;
                 })
             },
            workMethodsList:function () {
                 var list = this.model.ptwCardStuffs.filter(function (item) {
                     return  item.type==9;
                 });
                return list;
            },
             certificateList:function () {
                return  this.model.ptwCardStuffs.filter(function (item) {
                    return  item.type==2;
                })
            }
        },
        data: function () {
            return {
                stuffMap:null,
                settingModel:{
                    show:false
                },
                list:null,
                baseSetting:null,
                noticeModel: {
                    show : false,
                    vo: null
                }
            }
        },
        watch:{
            // "model": function (val) {
            //     console.log(val)
            //     var _this = this;
            //     if(val.columnSetting.length <5){
            //         apiList.queryDefaultSetting().then(function(res){
            //             _this.list = res.body
            //         })
            //     }else if(val.columnSetting.length>5){
            //         this.list = JSON.parse(this.model.columnSetting);
            //     }
            // },
            "model.columnSetting":function (val) {
                var _this = this;
                if(val.length <5){
                    apiList.queryDefaultSetting().then(function(res){
                        _this.list = res.body;
                        _this.model.columnSetting = JSON.stringify(res.body);
                    })
                }else if(val.length>5){
                    this.list = JSON.parse(this.model.columnSetting);
                }
            }
        },
        created:function(){
            
        },
        methods: {
            doShowNotice: function () {
                this.noticeModel.show = true;
                this.$refs.notice.init(this.model);
            },
            changeSetting:function (list) {
                  this.model.columnSetting = JSON.stringify(list);
                  this.settingModel.show = false;
            },
            initSettingModel:function () {
                this.$refs.setting.init(this.model.columnSetting);
                this.settingModel.show = true;
            },
            doEditCode:function (name) {
                var _this=this;
                this.$refs.editText.init(name,'code',this.model)
            },
            doEditname:function (name) {
                this.$refs.editText.init(name,'name',this.model)
            },
            doEditWorkType:function (name) {
                this.$refs.workCatalog.init(this.model.workCatalogId,this.model.workLevelId, function (item,workLevel) {
                    this.model.workCatalog=item;   //这个this 是在子页面apply 重新绑定的
                    this.model.workCatalogId=item.id;
                    if(workLevel){
                        this.model.workLevel=workLevel;
                        this.model.workLevelId=workLevel.id;
                    }
                    else{
                        this.model.workLevel={};
                        this.model.workLevelId=undefined;
                        }
                    this.model.ptwCardStuffs=[];
                    //  this.model.workCatalog.id=item.id;
                    //  this.model.workCatalog.name=item.name;
                }, name);
            },
            doCustomContent:function(type,realType){
                this.$emit("on-custom-content",{type:type,realType:realType});
            }
        },
        events:{
            'getJsonStr': function () {
            },
        }
    })
})
