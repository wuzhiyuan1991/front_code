define(function (require) {
    var LIB=require("lib");
    var Vue = require("vue");
    var template = require("text!./modal-sel-cardtpl.html");
    var api=require("../api");
    return Vue.extend({
        template: template,
        props:{
            visible:{
                type:Boolean,
                default:false,
            },
            disabled:{//作业类是否启用选择
                type:Boolean,
                default:false,
            },
        },
        data: function () {
            return {
                load:false,
                modalTitle:"选择作业票模板",
                workCatalogList:[],
                selWorkCatalogIndex:0,
                selLevelIndex:0,
                selectedWorkCatalogId:undefined,
                tplList:[],
                selTplIndex:0,
                callBack:null,
                tplId:""
            }
        },
        computed:{
            currentWorkCatalog:function(){
                if(this.workCatalogList.length>0){
                    return this.workCatalogList[this.selWorkCatalogIndex];
                }
                return {};
            },
            levelList:function () {
               if(this.currentWorkCatalog){
                    return  this.currentWorkCatalog.levelList;
               }
            },
            currentLevel:function () {
                if(this.levelList&&this.levelList.length>0){
                    return this.levelList[this.selLevelIndex];
                }
            }
        },
        init:function(){
            var _this=this;
            api.getWorkCatalogLevelList().then(function (data) {
                _this.workCatalogList=data;
                // _this.queryTpl();
            })
        },
        watch:{
            // selWorkCatalogIndex:function(){
            //     this.selLevelIndex=0;
            //     this.updateno=true;
            //     this.queryTpl();
            // },
            // selLevelIndex:function (val) {
            //     if(this.updateno){
            //         this.updateno=false;
            //         return;
            //     }
            //     this.queryTpl();
            // }
        },
        methods: {
            doChangeWorkCatalog:function(){
                this.selLevelIndex=0;
                this.updateno=true;
                this.queryTpl();
            },
            doChangeWorkLevel:function(){
                    if(this.updateno){
                        this.updateno=false;
                        return;
                    }
                    this.queryTpl();
            },
            init:function(pms,cb){

                var _this=this;
                this.selTplIndex = 0;
                this.tplId=pms.id;
                this.selWorkCatalogIndex=0;
                if(pms.disabled!==undefined){
                    this.disabled=pms.disabled;
                }
                if(pms.workCatalogId){
                    var index=_.findIndex(this.workCatalogList,{id:pms.workCatalogId});
                    if(index!==this.selWorkCatalogIndex){
                        this.selWorkCatalogIndex=index;
                    }
                }
                this.visible=true;
                this.callback=cb;
                this.$nextTick(function () {
                    if(pms.workLevelId) {
                        _this.selLevelIndex = _.findIndex(_this.levelList, {id: pms.workLevelId});
                    }
                })
                setTimeout(function () {
                    _this.queryTpl();

                },200)
                _this.$nextTick(function () {
                        setTimeout(function () {
                            if(pms.id){
                                for(var i=0; i<_this.tplList.length; i++){
                                    if(pms.id == _this.tplList[i].id){
                                        _this.selTplIndex = i;
                                    }
                                }

                            }
                        },300)
                    });
            },
            queryTpl:function(){
                var _this=this;
                api.getWorkCarTplList({
                    'workCatalog.id':_this.currentWorkCatalog.id,
                    'workLevelId':_this.currentLevel?_this.currentLevel.id:null,
                    'disable':'0',
                }).then(function (data) {
                    _this.tplList=data;
                    if(_this.tplId){
                        _this.tplId="";
                    }
                    else{
                        _this.selTplIndex = 0;
                    }
                    //
                    // if(_this.id){
                    //     for(var i=0; i<_this.tplList.length; i++){
                    //         console.log(_this.id, _this.tplList[i].id)
                    //         if(_this.id == _this.tplList[i].id){
                    //             _this.selTplIndex = i;
                    //         }
                    //     }
                    // }

                    _this.$nextTick(function () {
                        _this.$refs.radioGroup.updateModel();
                    })
                })
            },
            doSave:function (cb) {
                if(!this.tplList[this.selTplIndex]){
                    LIB.Msg.error("请选择一个模板", 1);
                    return;
                }
                var selData={
                    tplName:this.tplList[this.selTplIndex].name,
                    tplId:this.tplList[this.selTplIndex].id,
                    workCardCatalogId:this.currentWorkCatalog.id,
                    workLevelId:this.currentLevel?this.currentLevel.id:null,
                    enableOperatingType: this.tplList[this.selTplIndex].enableOperatingType //取值用到
                };
                if(this.callback){
                    this.callback.call(this.$parent,selData);
                }
                this.$emit("on-success",selData);

                this.visible=false;
            },
            doClose:function () {
                this.visible=false;
            }
        }
    })
})