define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = require("text!./modalForm.html");
    var api = require("../../../api");
    var workardApi = require("../../../workCard/vuex/api");
    var ptwWorkCardSelectModal = require("componentsEx/selectTableModal/ptwWorkCardSelectModal");
    return Vue.extend({
        template: template,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        components: {
            ptwWorkCardSelectModal:ptwWorkCardSelectModal,
        },
        props: {
            visible: Boolean,
            // model: Object,
            title: {type:String,default:"关联作业票"},
            concatList:{type:Array, required: true},//已经关联的列表
        },
        data: function () {
            return {
                contactWorkCardId:null,
                selWorkCard:{},//
                workCatalogList:[],
                selWorkCatalogIndex:0,
                selLevelIndex:0,
                type:"",
                typeName:{
                    add:"新增",
                    edit:"修改",
                },
                workCardRelation:{},//编辑是传过来的relation
                load: false,
                selectModel:{
                    ptwWorkCard: {
                        visible: false,
                        filterData: {'workCatalog.id': null,'workLevelId':null}
                    }
                }
            }
        },
        init:function(){
            var _this=this;
            api.getWorkCatalogLevelList().then(function (data) {
                _this.workCatalogList=data;
            })
        },
        computed: {
            currentWorkCatalog:function(){
                if(this.workCatalogList.length>0){
                    var catalog=this.workCatalogList[this.selWorkCatalogIndex];
                    this.selectModel.ptwWorkCard.filterData["workCatalog.id"]=catalog.id;
                    return catalog;
                }
                return {};
            },
            levelList:function () {
                var list=[];
                if(this.currentWorkCatalog){
                    list=  this.currentWorkCatalog.levelList;
                }
                if(list&&list.length>0){
                    this.selLevelIndex=0;
                }
                return list;

            },
            currentLevel:function () {
                var level= this.levelList[this.selLevelIndex];
                return level||{};
            }

        },
        methods: {
            clearPtw:function(){
                this.selWorkCard={};
            },
            doOpenSelPtwModel:function(){
                this.selectModel.ptwWorkCard.filterData["workLevelId"] =this.currentLevel?this.currentLevel.id:undefined;
                this.selectModel.ptwWorkCard.visible=true;
            },
            doShowDominationAreaSelectModal:function(){
                if(!this.model.orgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.selectModel.dominationAreaSelectModel.visible = true;
                this.selectModel.dominationAreaSelectModel.filterData = {orgId :this.model.orgId};
            },
            doSavePtwWorkCard:function(selectedDatas){
                if (selectedDatas) {
                    this.selWorkCard   = selectedDatas[0];
                }
            },
            showValue:function (data) {
                return data.code?data.code+"（"+ data.workContent +"）":"";
            },
            show: function (title) {
                this.title = title;
                this.visible = true;
            },
            init: function (type,contactWorkCardId,model) {
                var _this=this;
                if(model){
                    this.selWorkCard = model.relCard||{};
                    this.$nextTick(function () {
                        _this.selWorkCatalogIndex=_.findIndex(_this.workCatalogList,{id:model.workCatalogId})||0;
                        _this.selLevelIndex=_.findIndex(_this.levelList,{id:model.workLevelId})||0;
                    })
                    this.workCardRelation=model;
                }
                else{
                    this.workCardRelation={};
                    this.selWorkCard ={};
                }
                this.type=type;
                this.contactWorkCardId=contactWorkCardId;
                this.visible = true;

            },
            doSave: _.debounce(function () {
                var _this=this;
                if(this.selWorkCard&&this.selWorkCard.id===this.contactWorkCardId){
                    LIB.Msg.error("作业票请不要关联自己");
                    return;
                }
                //表示是自己并且是修改
                var isEditMyself=_this.type==="edit"&&_this.selWorkCard
                    &&_this.selWorkCard.id==_this.workCardRelation.relCard.id;

                if(!isEditMyself){
                    if(_this.selWorkCard&&this.selWorkCard.id&& this.concatList.some(function (item) {
                        return item.relCardId!=""&&item.relCard.id==_this.selWorkCard.id
                    })){
                        LIB.Msg.error("此作业票已被关联过");
                        return;
                    }
                }
                var apiFun=_this.type==="add"?workardApi.saveWorkCardRelations: workardApi.updateWorkCardRelation;
                var savedata= {
                    id:this.workCardRelation.id,
                    workCardId:this.contactWorkCardId,
                    workCatalogId:this.currentWorkCatalog.id,
                    workLevelId:this.currentLevel?(this.currentLevel.id||""):"",
                    relCardId:this.selWorkCard.id||"",
                    relCard:{id:this.selWorkCard.id||""},
                };

                if(_this.type=="add"){
                    savedata=[savedata];
                }
                apiFun({id:this.contactWorkCardId},savedata).then(function () {
                    LIB.Msg.success("保存成功",1);
                    _this.$emit("on-success",_this.model);
                    _this.visible=false;
                })

            }, 300),
            doCancel: function () {
                this.visible = false;
            }
        },
        watch: {
            visible: function (val) {
                if (val && !this.load) {
                    this.load = true;
                }
                else{
                    this.selectedWorLevelId=null;
                    this.selWorkCard={};
                    this.selWorkCatalogIndex=0;
                    this.selLevelIndex=0;
                    this.load=false;
                }
            }
        }
    })
})