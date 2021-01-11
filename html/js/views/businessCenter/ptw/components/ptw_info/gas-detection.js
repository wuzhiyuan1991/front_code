define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./gas-detection.html");
    var api=require("../../api");
    var model=require("../../model");
    var propMixins=require("./mixins");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var ptwWorkerSelectModal = require("componentsEx/selectTableModal/ptwWorkerRolesSelectModal");
    return Vue.extend({
        mixins:[propMixins],
        template: template,
        components:{
            "userSelectModal":userSelectModal,
            "ptwWorkerSelectModal": ptwWorkerSelectModal
        },
        props:{
            model:{
                type:Object,
                required:true,
            }
        },
        computed:{
            getRoleName: function () {
                var str = '';
                var _this = this;
                if(this.model.ptwCardSignRoles){
                    var obj = _.find(this.model.ptwCardSignRoles, function (item) {
                        return item.id == _this.permitModel.gasDetectionRoleId;
                    });
                    if(obj) return obj.signCatalog.name;
                }

                return ""
            }
        },
        data: function () {
            return {
                enum:model.enum,
                gasTypeList:[],
                showUserSelectModal:false,
                showPtwSelectModal : false,
                checkGasCheckCycle:false,
                checkGasCheckNoticeTime:false,
                enableGasInspector: false,
                ptwWorkerFilterData:{
                    type:1,
                    compId: LIB.user.compId
                },
                enableGasDetectionNotice:null,
                enableGasDetectionInCycle:null
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
                if(this.model.enableGasDetection==1) this.permitModel.enableGasDetection=1;
                if(this.model.enableGasDetectionSigner=='1') this.permitModel.enableGasDetectionSigner='1';
                this.enableGasInspector = LIB.getBusinessSetStateByNamePath('ptw.enableWorkRole.enableGasInspector',LIB.user.compId);
                // this.enableGasDetectionNotice = LIB.getBusinessSetStateByNamePath('ptw.enableGasDetectionNotice');
                // this.enableGasDetectionInCycle = LIB.getBusinessSetStateByNamePath('ptw.enableGasDetectionInCycle');
                this.enableGasDetectionNotice = model.getSystembusinessset('enableGasDetectionNotice');
                this.enableGasDetectionInCycle = model.getSystembusinessset('enableGasDetectionInCycle');
                if(this.model.enableGasDetection ==2 && !this.permitModel.workTpl) this.permitModel.enableGasDetection ='0';

            },
            _getGasItems:function(data){
                return  this.permitModel.tempWorkStuffs.gas.filter(function (item) {
                    return  item.gasType==data.type;
                })
            },
            doShowSelUser:function(){
                if(this.enableGasInspector ) return this.showPtwSelectModal=true;
                else return this.showUserSelectModal=true;
            },
            doSaveUser:function(datas){
                if(datas){
                    var data=datas[0]
                }
                if(this.enableGasInspector) data = data.user;
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
    });
});
