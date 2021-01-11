define(function (require) {
    var Vue = require("vue");
    var template = require("text!./modal-sel-workcatalog.html");
    var api = require("../api");
    var LIB=require("lib");
    return Vue.extend({
        template: template,
        data: function () {
            return {
                modalTitle: "选择作业类型",
                title:"作业类型",
                visible: false,
                workCatalogList: [],
                selectedWorkCatalogId: undefined,
                selectedWorLevelId: undefined,
                callback: null,
                modalStyle: {
                    minWidth: '500px',
                    maxWidth: '600px'
                }
            }
        },
        init: function () {
            var _this=this;
            api.getWorkCatalogLevelList().then(function (data) {
                if(!data||data.length===0){return}
                _this.workCatalogList = data;
                _this.selectedWorkCatalogId = _this.workCatalogList[0].id;
                var level=_this.workCatalogList[0].levelList;
                _this.selectedWorLevelId = level && level.length > 0 ? level[0].id : undefined;
            })
        },
        watch:{
            'selectedWorkCatalogId':function(){
                var selWorkCatalog = _.findWhere(this.workCatalogList, {id: this.selectedWorkCatalogId});
                if(selWorkCatalog.levelList&&selWorkCatalog.levelList.length>0){
                    this.selectedWorLevelId=selWorkCatalog.levelList[0].id;
                }
                else{
                    this.selectedWorLevelId=undefined;
                }
            }

        },
        methods: {
            init:function(id, levelId, cb, name) {
                this.selectedWorkCatalogId = id ? id : this.workCatalogList[0].id;
                this.selectedWorLevelId = levelId;
                this.visible = true;
                this.callback = cb;
                this.title = name;
                this.modalTitle = "选择" + name;
            },
            show:function(){
                this.selectedWorkCatalogId= this.workCatalogList[0].id;
                var level=this.workCatalogList[0].levelList;
                this.selectedWorLevelId=level && level.length > 0 ? level[0].id : undefined;
                this.visible=true;
            },
            doSave: function (cb) {
                var selWorkCatalog = _.findWhere(this.workCatalogList, {id: this.selectedWorkCatalogId});
                var workLevel;
                if(selWorkCatalog.levelList&&selWorkCatalog.levelList.length>0){
                    workLevel=_.findWhere(selWorkCatalog.levelList,{id:this.selectedWorLevelId})
                }
                if (this.callback) {
                    this.callback.call(this.$parent, selWorkCatalog,workLevel)
                } else {
                    this.$emit("on-save", {
                        workCatalog: selWorkCatalog,
                        workLevel: workLevel,
                    })
                }
                this.visible = false;
            },
            doClose: function () {
                this.visible = false;
            },
            doWorkCataLogMore: function () {
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart="/ptw/catalog";
                window.open(router + routerPart);
            }
        }

    })
})