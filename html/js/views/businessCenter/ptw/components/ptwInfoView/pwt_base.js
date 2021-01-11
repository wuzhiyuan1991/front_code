define(function(require){
    var LIB = require('lib');
    var model = require("../../model");
    var tpl = require("text!./ptw_base.html");
    var baseinfo=require("./baseinfo");
    var weihaibs=require("./weihaibs");
    var securityMeasures=require("./security-measures");
    var gelifh=require("./gelifh");
    var ppe=require("./ppe");
    var gasDetection=require("./gas-detection");
    var workClose=require("./work-close");
    var licenseIssue=require("./license-issue");
    var commonApi=require("../../api");
    var detail = LIB.Vue.extend({
        props:{
            model:{
                type:Object,
                required:true,
            },
            workcard:{
                type:Object,
                required:true,
            },
        },
        template: tpl,
        components:{
            "baseinfo":baseinfo,
            "weihaibs":weihaibs,
            "gelifh":gelifh,
            "ppe":ppe,
            "gasDetection":gasDetection,
            "workClose":workClose,
            "licenseIssue":licenseIssue,
            securityMeasures:securityMeasures,
        },
        data:function(){
            return {
                pwtInfoTypes:[],
                pwtInfoTypeSelectedKey:"1",
                pwtInfoTypeSelectedIndex:0,
            }
        },
        methods:{
            initPtwInfoTypes:function(){
                // "1":"基本信息",
                //     "2":"危害辨识",
                //     "3":"安全措施",
                //     "4":"个人防护",
                //     "5":"能量隔离",
                //     "6":"气体检测",
                //     "7":"许可签发",
                //     "8":"作业关闭",
                // console.log(this.model, this.workcard)
                var types=_.extend({},model.pwtInfoTypes);
                if(!this.model.ppeCatalogSetting){
                    delete types["4"];
                }
                if(this.model.enableGasDetection=="0"){
                    delete types["6"];
                }
                if(this.model.enableMechanicalIsolation=="0"&&this.model.enableProcessIsolation=="0"&&
                    this.model.enableElectricIsolation=="0"&&this.model.enableSystemMask=="0"&&(this.model.enableBlindPlate=="0" || this.model.enableBlindPlate==undefined)){
                    delete types["5"];
                }
                var arr=[];
                var isShowWeiHai = false;
                if(this.model.workTpl){
                    if(this.model.workTpl.attr1 == '1'){
                        isShowWeiHai = true;
                    }
                }
                for (key in types){
                    if(key != '2')
                        arr.push({key:key,name:types[key]})
                    if(key == '2' && isShowWeiHai){
                        arr.push({key:key,name:types[key]})
                    }
                }
                this.pwtInfoTypes=arr;
            },
            onTabSelected:function(index,item){
                this.pwtInfoTypeSelectedKey=item.key;
            },
            changepwtInfoTypeSelectedIndex:function (val) {
                     var _this = this;
                    _this.pwtInfoTypeSelectedIndex =  val;
                    _this.$refs.according.doSelectItem(val);

            }                                         ,
            _getStuffsKey:function(pms){
                //type,ppeCatalogId,gasType
                return  this.model.ptwCardStuffs.filter(function (item) {
                    var b;
                    if(pms.gasType){
                        b=item.gasType==pms.gasType;
                    }
                    else if(pms.type){
                        b=item.type==pms.type&&!item.gasType;
                    }
                    if(pms.ppeCatalogId)
                    {
                        b=b&&item.ppeCatalogId==pms.ppeCatalogId;
                    }
                    return b;
                })
            },
            _changeStuff:function(pms,items){
                //type,ppeCatalogId,gasType
                var temp= this.model.ptwCardStuffs.filter(function (item) {
                    if(pms.ppeCatalogId)
                    {
                        return  item.ppeCatalogId!=pms.ppeCatalogId;
                    }
                    if(pms.gasType){
                       return  item.gasType!=pms.gasType;
                    }
                    if(pms.type){
                        return  item.type!=pms.type;
                    }
                });
                temp=temp.concat(items);
                this.model.ptwCardStuffs=temp;
            },
            doEditCustomContent:function (pms) {
                //type,ppeCatalogId
                var _this=this;
                if(!this.model.workCatalog.id){
                    LIB.Msg.warning("请先选择一个作业类型");
                    return ;
                }
                pms['workCatalog.id']=this.model.workCatalog.id;
                //var pms={type:pms.type,:this.selectedWorkCatalogId};
                var getfun=commonApi.getCatalogDetail;
                if(pms.gasType){
                       getfun=commonApi.getCatalogList
                }
                getfun(pms)
                    .then(function (data) {
                        var keyList=_this._getStuffsKey(pms);
                        var keys=keyList.map(function(item){return item.id});
                        _this.$refs.transfer.init(data,keys,function (items) {
                            _this._changeStuff(pms,items);
                        });
                    });
            },
            updatePwtInfoTypes:function () {
            }
        },
        events : {
            'reFreshInfo':function () {
                var _this=this;
                this.pwtInfoTypeSelectedKey="1";
                this.pwtInfoTypeSelectedIndex=0;
                this.initPtwInfoTypes();
            }
        },
        init: function(){

        },
        watch:{
          'model.id':function () {
              var _this=this;
              this.pwtInfoTypeSelectedKey="1";
              this.pwtInfoTypeSelectedIndex=0;
              this.initPtwInfoTypes();
          }
        }
    });

    return detail;
});