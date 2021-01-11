define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./gas-detection.html");
    var api=require("../../api");
    var model=require("../../model");
    var propMixins=require("./mixins");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    return Vue.extend({
        mixins:[propMixins],
        template: template,
        components:{
            "userSelectModal":userSelectModal,
        },
        props:{
            model:{
                type:Object,
                required:true,
            }
        },
        computed:{

        },
        data: function () {
            return {
                enum:model.enum,
                gasTypeList:[],
                showUserSelectModal:false,
                checkGasCheckCycle:false,
                checkGasCheckNoticeTime:false,
            }
        },
        created:function(){
            var  _this=this;
        },
        methods: {
            changeTpl:function(){
                var _this=this;
                this.$nextTick(function () {
                    _this.initData();
                })
            },
            initData:function(){
                var temp=[];
                for (key in model.gasType){
                    var item={
                        type:key,
                        name:model.gasType[key],
                        items:this._getGasItems({type:key}),
                    };
                    temp.push(item);
                }
                this.gasTypeList=temp;
                this.checkGasCheckCycle=this.permitModel.gasCheckCycle>0;
                this.checkGasCheckNoticeTime=this.permitModel.gasCheckNoticeTime>0;
            },
            _getGasItems:function(data){
                return  this.permitModel.tempWorkStuffs.gas.filter(function (item) {
                    return  item.gasType==data.type;
                })
            },
            doShowSelUser:function(){
                this.showUserSelectModal=true;
            },
            doSaveUser:function(datas){
                if(datas){
                    var data=datas[0]
                }
                _.extend(this.permitModel.gasInspector,{
                    id:data.id,
                    name:data.name
                });
            },
            doChangeItem:function (pms,item) {
                var data=this.permitModel.tempWorkStuffs.gas;
                var checked=pms[0];
                var itemIndex=_.findIndex(data,{id:item.id,gasType:item.gasType});
                data[itemIndex].attr1=checked;

            },
            doChangeCheckMethod:function (val) {
                if(val==2){//重置部位
                    this.permitModel.gasCheckPosition=["1"];
                }
            },
            changeCycle:function (val) {
                  if(!val){
                      this.checkGasCheckNoticeTime=false;
                  }
            },
            doChangeGasCheckType:function (val) {
                this.checkGasCheckCycle=false;
                this.permitModel.gasCheckCycleUnit="1";
                this.permitModel.gasCheckCycle="1";
                this.checkGasCheckNoticeTime=false;
                this.permitModel.gasCheckNoticeTime="1";
                // if(val==1){//初始化重置
                //    this.checkGasCheckCycle=false;
                //    this.permitModel.gasCheckCycleUnit="1";
                //    this.permitModel.gasCheckCycle="1";
                //    this.checkGasCheckNoticeTime=false;
                //    this.permitModel.gasCheckNoticeTime="1";
                // }
            }

        },
        watch:{
            'permitModel':function(){
                this.initData();
             },

        }
    })
})
