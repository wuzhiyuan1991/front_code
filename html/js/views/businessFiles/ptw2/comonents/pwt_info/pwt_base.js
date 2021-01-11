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
    var baseTransfer=require("../base-transfer");
    var commonApi=require("../../api");
    var api=require("../../cardTpl/vuex/api");
    var rolesModel = require("./dialog/rolesModel");
    var apix = require("../../sign/vuex/api")
    var detail = LIB.Vue.extend({
        props:{
            model:{
                type:Object,
                required:true,
            }
        },
        template: tpl,
        components:{
            "baseinfo":baseinfo,
            "baseTransfer":baseTransfer,
            "weihaibs":weihaibs,
            "gelifh":gelifh,
            "ppe":ppe,
            "gasDetection":gasDetection,
            "workClose":workClose,
            "licenseIssue":licenseIssue,
            securityMeasures:securityMeasures,
            "rolesModel":rolesModel
        },
        data:function(){
            return {
                pwtInfoTypes:model.pwtInfoTypes,
                pwtInfoTypeSelectedIndex:0,
                showRolesModel:false,
                updateRolesType:null
            }
        },
        created:function(){
            var _this=this;
            api.listCatalogs({
                'criteria.intsValue':JSON.stringify({type:[6,7]})
            }).then(function(res){
                var comments={};
                res.data.forEach(function (item) {
                    comments[item.type]=item.name;
                })
                LIB.Vue.set(_this.model,"comments",comments)
            })
        },
        methods:{

            changepwtInfoTypeSelectedIndex:function (val) {
                     var _this = this;
                    _this.pwtInfoTypeSelectedIndex =  val;
                    _this.$refs.according.doSelectItem(val);
            }                                         ,
            _getStuffsKey:function(pmsObj){
                //type,ppeCatalogId,gasType\
                // var pms = Object.assign({}, pmsObj);
                var pms  = _.clone(pmsObj);
                if(pms.realType == 'workMethods'){
                    pms.type="9";
                }
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
            _changeStuff:function(pmsObj,items){
                //type,ppeCatalogId,gasType
                // var pms = Object.assign({}, pmsObj);
                var pms  = _.clone(pmsObj);
                if(pmsObj.realType == 'workMethods'){
                    pms.type = '9';
                    items.forEach(function (item) {
                        item.type = '9';
                    })
                }
                var temp= this.model.ptwCardStuffs.filter(function (item) {
                    if(pms.ppeCatalogId)
                    {
                        return  item.ppeCatalogId!=pms.ppeCatalogId;
                    }
                    if(pms.gasType){
                       return  item.gasType!=pms.gasType;
                    }
                    if(pms.type){
                        if(pms.type == '4'){
                            return  (item.gasType && item.type=='4') || (!item.gasType && item.type!=pms.type);
                        }
                        return  item.type!=pms.type;
                    }
                });
                temp=temp.concat(items);
                this.model.ptwCardStuffs=temp;
            },
            doEditCustomContent:function (pms, reflesh) {
                pms.catlogId = this.model.workCatalog.id;
                var _this=this;
                if(!this.model.workCatalog.id){
                    LIB.Msg.warning("请先选择一个作业类型");
                    return ;
                }
                if(pms.type!=7) {
                    pms['workCatalog.id'] = this.model.workCatalog.id;
                }

                var getfun=commonApi.getCatalogDetail;
                if(pms.gasType){
                    getfun=commonApi.getCatalogList
                }
                getfun(pms)  // 原本 pms
                    .then(function (data) {
                        var keyList=_this._getStuffsKey(pms);
                        var keys=keyList.map(function(item){return item.id});
                        if(reflesh){
                            _this.$refs.transfer.refleshStuffInfo(data,keys,function (items) {
                                _this._changeStuff(pms,items);
                            },pms);
                        }else{
                            _this.$refs.transfer.init(data,keys,function (items) {
                                _this._changeStuff(pms,items);
                            },pms);
                        }
                    });
            },
            doSaveRoles:function (data) {
                var _this = this;
                apix.create(data).then(function(res) {
                    //清空数据
                    LIB.Msg.info("保存成功");
                    if(_this.updateRolesType == 'license')
                        _this.$broadcast('updateData1');
                    else
                        _this.$broadcast('updateData2');
                });

            }
        },
        events : {
            "doRolesModel":function () {
                this.showRolesModel =  true;
                this.updateRolesType = arguments[0]
            },
            "updateRoles":function () {
                this.$broadcast('updateRolesList');
            }
        },
        init: function(){
            this.$api = api;
        }
    });

    return detail;
});