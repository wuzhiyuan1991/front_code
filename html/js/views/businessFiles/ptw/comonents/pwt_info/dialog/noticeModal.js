define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./noticeModal.html");

    //初始化数据模型
    var newVO = function() {
        return {
            enableExpireNotice: null,
            expireNoticeTime:60,
            expireNoticeRoles: null
        }
    };

    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : 'create',
            isReadOnly : false,
            title:"添加",
            //验证规则
            rules:{
                "checkBasis": [LIB.formRuleMgr.require("检查依据"),
                    {
                        validator: function (rule, value, callback) {
                           return callback()
                            callback(error);
                        }
                    }
                ],
            },
            emptyRules:{},
        },
        isShowXBGDField:false,
        list: [],
    };


    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        computed : {

        },
        data:function() {
            return dataModel;
        },
        props: {
            model: {
                type: Object,
                default: null
            }
        },
        
        methods: {
            newVO: newVO,
            init: function (vo) {
                this.mainModel.vo = _.extend({}, vo);
                this.list = this.getPersonList(this.mainModel.vo)
            },
            doSave: function () {
                var list  = _.filter(this.list, function (item) {
                    return item.isCheck;
                });
                if(list.length == 0){
                    LIB.Msg.info('请选择人员');
                    return ;
                }
                if(this.mainModel.vo.enableExpireNotice == '1'){
                    this.model.expireNoticeRoles = JSON.stringify(_.map(list, function (item) {
                        var obj = {name: item.name, type:item.type};
                        if(item.type != '101'){
                            obj.cardSignRoleId = item.cardSignRoleId;
                        }
                        if(item.isCheck){
                            return obj;
                        }
                    }))
                    if(this.mainModel.vo.expireNoticeTime <1 || this.mainModel.vo.expireNoticeTime>240){
                        return LIB.Msg.info('最大240分钟，最小1分钟');
                    }
                    this.model.enableExpireNotice = this.mainModel.vo.enableExpireNotice;
                    this.model.expireNoticeTime = this.mainModel.vo.expireNoticeTime;
                }else{
                    this.model.enableExpireNotice = this.mainModel.vo.enableExpireNotice;
                }
                this.visible = false;
            },
            isCheckVal: function (val) {
                if(this.model.expireNoticeRoles)
                return this.model.expireNoticeRoles.indexOf(val)>-1
                return false;
            },
            getPersonList: function (vo) {
                var _this = this;
                var arr = [{type:'101', name: '作业申请人', isCheck: _this.isCheckVal('作业申请人')}];
                // var obj = {
                //     '2': '作业完成',
                //     '3': '作业取消',
                //     '4': '作业延期'
                // }
                if(vo.signRole && vo.signRole.length>0) {
                    arr = arr.concat(_.map(vo.signRole, function (item) {
                        return {type: item.type, name: item.signCatalog.name, cardSignRoleId: item.id, isCheck: _this.isCheckVal(item.id)}
                    }))
                }
                // for(var key in vo.closeRoles){
                //     var temp = vo.closeRoles[key];
                //     if(temp && temp.length>0){
                //         arr = arr.concat(_.map(temp, function (item) {
                //             return {type: item.signCatalog.type,isCheck: false ,name: item.signCatalog.name+'('+obj[key]+')'}
                //         }))
                //     }
                // }
                // if(vo.enableGasDetection >0){
                //     arr.push({type: '103', name:'气体检测人员', isCheck:false})
                // }
                // if(vo.enableProcessIsolation>0 || vo.enableMechanicalIsolation>0 || vo.enableElectricIsolation>0 || vo.enableSystemMask>0 || vo.enableBlindPlate>0){
                //     arr.push({type: '105', name:'能量隔离解除操作人', isCheck:false})
                //     arr.push({type: '104', name:'能量隔离操作人', isCheck:false})
                // }
                // if(vo.attr1 == '1'){
                //     arr.push({type:'101', name:'危害辨识核对人', isCheck:false})
                // }
                // if(vo.ppeCatalogSetting.length>0){
                //     arr.push({type:'101', name:'个人防护核对人', isCheck:false})
                // }
                return arr;
            }
        }
    });

    return detail;
});