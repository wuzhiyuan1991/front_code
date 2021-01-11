define(function (require) {
    var LIB = require('lib');
    var tpl = require("text!./main.html");
    var baseinfo = require("./baseinfo");
    var weihaibs = require("./weihaibs");
    var securityMeasures=require("./security-measures");
    var gelifh = require("./gelifh");
    var ppe = require("./ppe");
    var gasDetection = require("./gas-detection");
    var licenseIssue = require("./license-issue");
    var workClose = require("./work-close");
    var commonApi = require("../../api");
    var model = require("../../model");
    var propMixins = require("./mixins");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var detail = LIB.Vue.extend({
        template: tpl,
        components: {
            "baseinfo": baseinfo,
            "weihaibs": weihaibs,
            "gelifh": gelifh,
            "ppe": ppe,
            "gasDetection": gasDetection,
            "licenseIssue": licenseIssue,
            "workClose":workClose,
            "userSelectModal": userSelectModal,
             securityMeasures:securityMeasures,
        },
        data: function () {
            return {
                model:model.cardTpl(),
                permitModel:model.permitDetail(),
                pwtInfoTypes: model.pwtInfoTypes,
                pwtInfoTypeSelectedKey:"1",
                pwtInfoTypeSelectedIndex:0,
                userMulti: false,
                userType: "",
                showUserSelectModal: false,
                selectIndex:undefined,//当人事可增可减的时候
                pms:null,//父组件传过来的参数

                isFromJson: false,
            }
        },
        methods: {
            init:function(model,permitModel,pms){
                this.model=model;
                this.permitModel=permitModel;
                this.pms=pms;
                this.pwtInfoTypeSelectedKey="1";
                this.pwtInfoTypeSelectedIndex=0;
                this.initPtwInfoTypes();
            },
            initPtwInfoTypes:function(){
                // "1":"基本信息",
                //     "2":"危害辨识",
                //     "3":"安全措施",
                //     "4":"个人防护",
                //     "5":"能量隔离",
                //     "6":"气体检测",
                //     "7":"许可签发",
                //     "8":"作业关闭",
                var types=_.extend({},model.pwtInfoTypes);
                if(!this.model.ppeCatalogSetting){
                    delete types["4"];
                }
                if(this.model.enableGasDetection=="0"){
                    delete types["6"];
                }
                if(this.model.enableMechanicalIsolation=="0"&&this.model.enableProcessIsolation=="0"&&
                    this.model.enableElectricIsolation=="0"&&this.model.enableSystemMask=="0"){
                    delete types["5"];
                }
                var arr=[];
                for (key in types){
                    arr.push({key:key,name:types[key]})
                }
                this.pwtInfoTypes=arr;
            },
            onTabSelected:function(index,item){
                var _this = this;
                if(this.pwtInfoTypeSelectedKey == '3'){
                    this.$broadcast('setInputValue');
                }
                _this.$nextTick(function () {
                    _this.pwtInfoTypeSelectedKey=item.key;
                })
            },
            setInputValue:function () {
                if(this.pwtInfoTypeSelectedKey == '3'){
                    this.$broadcast('setInputValue');
                }
            },
            changeTpl:function(model){
                this.model=model;
                this.initPtwInfoTypes();
                this.$broadcast("changeTpl",model);
            },
            selectUserInit: function (type, multi,index, isFromJson) {
                this.userMulti = !!multi;
                this.userType = type;
                this.showUserSelectModal = true;
                this.selectIndex=index;
                this.isFromJson = isFromJson;
            },
            doSaveUser: function (selectedDatas) {
                var _this = this;
                if (selectedDatas) {

                    if(this.isFromJson || this.isFromJson===0){
                         this.$broadcast("updateUserSelect", selectedDatas, this.isFromJson)
                        return ;
                    }

                    if(this.userType=="ppeUser"){
                        _.extend(this.permitModel.ppeVerifier,{
                            id:selectedDatas[0].id, name: selectedDatas[0].name
                        })
                    }
                    else{
                        this.permitModel.selworkPersonnels[this.userType] = selectedDatas.map(function (item) {
                            return {
                                type: _this.userType,
                                user: {id: item.id, name: item.name},
                            }
                        });
                    }
                    if(["4","5","6"].indexOf(this.userType)>-1){//作业人员改变清空资格证人员
                        this.permitModel.tempWorkStuffs.certificateList.forEach(function(cert){
                            cert.ptwWorkPersonnels.splice(0);
                        })
                    }
                }
            },
            _getStuffsKey: function (pms) {
                //type,ppeCatalogId,gasType
                return this.model.ptwCardStuffs.filter(function (item) {
                    var b;
                    if (pms.type) {
                        b = item.type == pms.type;
                    }
                    if (pms.ppeCatalogId) {
                        b = b && item.ppeCatalogId == pms.ppeCatalogId;
                    }
                    if (pms.gasType) {
                        b = b && item.gasType == pms.gasType;
                    }
                    return b;
                })
            },
            _changeStuff: function (pms, items) {
                //type,ppeCatalogId,gasType
                var temp = this.model.ptwCardStuffs.filter(function (item) {
                    if (pms.ppeCatalogId) {
                        return item.ppeCatalogId != pms.ppeCatalogId;
                    }
                    if (pms.gasType) {
                        return item.gasType != pms.gasType;
                    }
                    if (pms.type) {
                        return item.type != pms.type;
                    }
                });
                temp = temp.concat(items);
                this.model.ptwCardStuffs = temp;
            },
            doEditCustomContent: function (pms) {
                //type,ppeCatalogId
                var _this = this;
                if (!this.model.workCatalog.id) {
                    LIB.Msg.warning("请先选择一个作业类型");
                    return;
                }
                pms['workCatalog.id'] = this.model.workCatalog.id;
                //var pms={type:pms.type,:this.selectedWorkCatalogId};
                var getfun = commonApi.getCatalogDetail;
                if (pms.gasType) {
                    getfun = commonApi.getCatalogList
                }
                getfun(pms)
                    .then(function (data) {
                        var keyList = _this._getStuffsKey(pms);
                        var keys = keyList.map(function (item) {
                            return item.id
                        });
                        _this.$refs.transfer.init(data, keys, function (items) {
                            _this._changeStuff(pms, items);
                        });
                    });
            }
        },
        events: {
            "setInputValEv":function () {
                this.setInputValue();
            }
        },
        init: function () {

        }
    });
    return detail;
});