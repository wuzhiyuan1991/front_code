define(function(require){
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./certFormModal.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var certTypeSelectModal = require("componentsEx/selectTableModal/certTypeSelectModal");

    //初始化数据模型
    var newVO = function() {
        return {
            id : null,
            //唯一标识
            code : null,
            //证书状态 0:无证,1:有效,2:失效
            status : null,
            //禁用标识 0未禁用，1已禁用
            disable : "0",
            //所属公司id
            compId : null,
            //所属部门id
            orgId : null,
            //发证机构
            certifyingAuthority : null,
            //生效日期
            effectiveDate : null,
            //失效日期
            expiryDate : null,
            //证件编号
            idNumber : null,
            //是否需要复审 0:不要,1:需要
            isRecheckRequired : '0',
            //领证日期
            issueDate : null,
            //作业类别
            jobClass : null,
            //操作项目
            jobContent : null,
            //提前提醒复审的月数
            noticeMonthsInAdvance : null,
            //复审周期（月）
            retrialCycle : null,
            //持有人
            user : {id:'', name:''},
            //关联课程
            course : {id:'', name:''},
            //证书类型
            certType : {id:'', name:''},
            certTypeId: null,
            //证书复审记录
            certRetrials : [],
            //证书文件
            cloudFiles : [],
            //证书复审被提醒人
            users : [],
            trainTaskId: null,
            //备注
            remark:null
        }
    };

    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : 'view',
            isReadOnly : false,
            title: "添加证书",
            //验证规则
            rules:{
                "isRecheckRequired" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "noticeMonthsInAdvance" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
                "retrialCycle" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
                "user.id" : [LIB.formRuleMgr.require("证书持有人")],
                "certType.id" : [LIB.formRuleMgr.require("证书类型")],
                "idNumber" : [LIB.formRuleMgr.require("证书编号"), LIB.formRuleMgr.length(100)],
                "jobClass" : [LIB.formRuleMgr.require("作业类别"), LIB.formRuleMgr.length(100)],
                "jobContent" : [LIB.formRuleMgr.require("操作项目"), LIB.formRuleMgr.length(100)],
                "issueDate" : [LIB.formRuleMgr.require("领证日期")],
                "effectiveDate" : [LIB.formRuleMgr.require("生效日期")],
                "expiryDate" : [LIB.formRuleMgr.require("生效日期")],
                "certifyingAuthority" : [LIB.formRuleMgr.length(100)],
                // "cloudFiles": [{required: true, type: "array", message: "请上传证书照片"}]
            }
        },
        selectModel : {
            userSelectModel : {
                visible : false,
                filterData : {orgId : null}
            },
            certTypeSelectModel : {
                visible : false,
                filterData : {orgId : null}
            }
        },
        uploadModel: {
            params: {
                recordId: null,
                dataType: 'O1',
                fileType: 'O'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "png,jpg,jpeg,gif" }]
            }
        },
    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components : {
            "userSelectModal": userSelectModal,
            "certtypeSelectModal": certTypeSelectModal
        },
        computed: {
            checkRequiredList: function () {
                return this.getDataDicList('itm_cert_is_recheck_required');
            }
        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            uploadClicked: function () {
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                console.log(con);
                LIB.globalLoader.hide();
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
            },
            afterInit: function (data) {
                var _this = this;
                var vo = this.mainModel.vo;
                if (this.mainModel.opType === 'create') {
                    vo.course = data.course;
                    vo.user = data.user;
                    vo.trainTaskId = data.trainTaskId;
                    api.getUUID().then(function (res) {
                        vo.id = res.data;
                        _this.uploadModel.params.recordId = res.data;
                    })
                }
            },
            afterInitData : function() {
                this.uploadModel.params.recordId = this.mainModel.vo.id;
            },



            doShowUserSelectModal : function(type) {
                this.selectModel.userSelectModel.visible = true;
                //this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveUsers : function(selectedDatas) {
                var rows = _.map(selectedDatas, function (row) {
                    return {
                        id: row.id,
                        name: row.name
                    }
                });
                this.mainModel.vo.users = rows;
            },

            doShowCertTypeSelectModal : function() {
                this.selectModel.certTypeSelectModel.visible = true;
            },
            doSaveCertType : function(selectedDatas) {
                if (!_.isArray(selectedDatas) || _.isEmpty(selectedDatas)) {
                    return;
                }
                var row = selectedDatas[0];
                this.mainModel.vo.certType = row;
                this.mainModel.vo.certTypeId = row.id;
            },

        }
    });

    return detail;
});