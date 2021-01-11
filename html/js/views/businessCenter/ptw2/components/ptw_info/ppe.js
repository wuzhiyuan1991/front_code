define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./ppe.html");
    var api=require("../../api");
    var propMixins=require("./mixins");
    return Vue.extend({
        mixins:[propMixins],
        template: template,
        components:{
        },
        computed:{

        },
        data: function () {
            return {
                allTypeList:[],
                load:false,
                ppeList:[],
                enablePPEs:[],
            }
        },
        init:function(){
           var  _this=this;

        },
        methods: {
            initData:function(){
                var _this=this;
                var ppeList= this.allTypeList.filter(function (item) {
                    return _this.model.ppeCatalogSetting? _this.model.ppeCatalogSetting.indexOf(item.id)>-1:true;
                });
                _this.initPPEList(ppeList);
                var m=JSON.parse(JSON.stringify(ppeList));
                _this.ppeList=m;
            },
            changeTpl:function(){
                var _this=this;
                this.$nextTick(function () {
                    _this.enablePPEs.splice(0);
                    _this.permitModel.ppeCatalogSetting="";
                    _this.initData();
                })
            },
            _getPPEItems:function(data){
                return    this.permitModel.tempWorkStuffs.ppes.filter(function (item) {
                    return  item.type==6&&item.ppeCatalogId==data.id;
                })
            },
            _getEnable:function(item){
                var _this=this;
                if(_this.permitModel.ppeCatalogSetting){
                    Vue.set(item,'enable',!!_this.permitModel.ppeCatalogSetting.match(new RegExp(item.id)));
                    if(item.enable){
                        _this.enablePPEs.push(item.id);
                    }
                }
                else{
                    item.enable=false;
                }
            },
            initPPEList:function(data){
                var _this=this;
                data.forEach(function (item) {
                        item.ppes=_this._getPPEItems(item);
                        _this._getEnable(item);
                });
            },
            doChangePEE:function(item){
                var indexOf=this.enablePPEs.indexOf(item.id);
                if(item.enable){
                    if(indexOf===-1){
                        this.enablePPEs.push(item.id)
                    }
                }
                else if(indexOf>-1){
                    this.enablePPEs.splice(indexOf,1);
                }
                this.permitModel.ppeCatalogSetting=this.enablePPEs.join(",");
            },
            doChangePPEItem:function (pms,ppeItem) {//设置permit的work
                 var data=this.permitModel.tempWorkStuffs.ppes;
                 var checked=pms[0];
                 var itemIndex=_.findIndex(data,{id:ppeItem.id,ppeCatalogId:ppeItem.ppeCatalogId});
                 data[itemIndex].attr1=checked;

            },
            doChangePPEText:function(pms,ppeItem){
                var data=this.permitModel.tempWorkStuffs.ppes;
                var itemIndex=_.findIndex(data,{id:ppeItem.id,ppeCatalogId:ppeItem.ppeCatalogId});
                data[itemIndex].content=ppeItem.content;
            },
            doChangeUser:function () {
                this.showSelUser("ppeUser")
            }
        },
        watch:{
            'permitModel':function(val){
                var _this=this;
                api.getPPETypes().then(function (data) {//模板里面的ppe
                    _this.allTypeList=data;
                    _this.initData();
                })
            },

        }
    })
})
