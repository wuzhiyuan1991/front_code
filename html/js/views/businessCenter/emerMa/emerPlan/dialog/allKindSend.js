define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./allKindSend.html");
    var api = require("../vuex/api");
    var backNode = require("./backNode")
    //初始化数据模型
    var newVO = function () {
        return {
            rollbackStep:null,
            user:null,
            effectiveDate:null
        }
    };

    var emerPlanHistory = function () {
        return {
            id : null,
            //编码
            code : null,
            //预案名称
            name : null,
            //步骤 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案,6:发布实施
            step : null,
            //禁用标识 0:启用,1:禁用
            disable : "0",
            //操作时间
            operateTime : (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
            //参与人员
            participant : null,
            //备注描述
            remark : null,
            //处理结果 1:未通过,2:通过,3:回退
            result : null,
            //修订频率
            reviseFrequence : null,
            //修订理由(枚举值用英文逗号拼接）
            reviseReason : null,
            //修订类型 1:定期修订,2:不定期修订
            reviseType : null,
            //回退节点 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案
            rollbackStep : null,
            //预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
            type : null,
            //版本号
            verNo : null,
            //预案版本
            emerPlanVersion : null,
            user:{
                name:LIB.user.name,
                id:LIB.user.id
            },
            fileList:[],
            reviseReasonList:[]
        };
    };

    var detail = LIB.Vue.extend({
        computed:{
            getList:function () {
                var arr = this.getDataDicList('iem_emer_plan_status');
                var list = [];
                var _this = this;
                if(parseInt(this.vo.type) === 3){
                    _.each(arr, function (item, index) {
                        if(index !== 3 && index!==4 && index < parseInt(_this.vo.status)-1){
                            list.push(item);
                        }
                    })
                }else{
                    _.each(arr, function (item, index) {
                        if(index < parseInt(_this.vo.status)-1){
                            list.push(item);
                        }
                    })
                }
                return list;
            },
            getName:function () {
                return this.mainModel.statusListOne[parseInt(this.mainModel.vo.status)-1].name;
            },

        },
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        components:{
            "backNode":backNode
        },

        props: {
            visible: {
                type: Boolean,
                default: false
            },
            vo:{
                type:Object,
                // default:''
            },
            selectDatas:{
                type:Array,
                default:null
            }
        },
        watch:{
            visible:function(val){
                val && this._init()
            }
        },

        data:function(){
            return {
                isBackNode:false,
                nodeFlag: {

                }, // 编辑框相关插入操作记录
                mainModel : {
                    title:"详情",
                    statusListOne:[
                        {name:"方案编制", index:1},
                        {name:"内部评审", index:2},
                        {name:"外部审核", index:3},
                        {name:"法人批准", index:4},
                        {name:"政府备案", index:5},
                        {name:"发布实施", index:6},
                        {name:"结束", index:7},
                    ],
                    vo:newVO(),
                    isReadOnly:true,
                    emerPlanHistory:emerPlanHistory(),
                    rules:{
                        "code" : [LIB.formRuleMgr.length(100)],
                        "name" : [LIB.formRuleMgr.require("预案名称"),
                            LIB.formRuleMgr.length(50)
                        ],
                        "status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("评审状态")),
                        "disable" :LIB.formRuleMgr.require("状态"),
                        "type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("预案类型")),
                        "verNo" : [LIB.formRuleMgr.require("版本号"),
                            LIB.formRuleMgr.length(20)
                        ],
                        "isInitial" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否为初始版本")),
                        "reviseFrequence" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("修订频率")),
                        "compId" : [LIB.formRuleMgr.require("所属公司")],
                        "orgId" : [LIB.formRuleMgr.length(10)],
                        "remark" : [LIB.formRuleMgr.length(1000)],
                        "participant":[LIB.formRuleMgr.length(500)],
                        "result":[LIB.formRuleMgr.require("处理结果")],
                        "rollbackStep":[],
                        "operateTime":[],
                        "user":[],
                        "reviseReasonList":[ { required: true, type: "array", message: '请选择修订理由', min: 1 }],
                        "reviseType":[LIB.formRuleMgr.require("修订理由"),
                            LIB.formRuleMgr.length(20)]
                    },
                },
                tabs: [

                ],
                tableLists:[],
                selectModel: {
                    cargoPointSelectModel:{
                        visible:false,
                        filterData:{
                            id:''
                        }
                    }
                },
                formModel : {

                },
                // 文件参数
                // 文件参数
                uploadModel: {
                    params: {
                        recordId: null,
                        dataType: 'EM1',
                        fileType: 'EM'
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,ppt,pptx"}]
                    },
                    // url: "/riskjudgmentunit/importExcel",
                },

            };
        },

        methods:{
            //    获取文件
            //    this.getFileList(this.uploadModel.params.recordId);

            _init:function () {
                this.mainModel.vo = newVO();
                if(this.vo){
                    this.mainModel.vo = _.cloneDeep(this.vo)
                }
                this.mainModel.vo.shipOptions = null;
                this.mainModel.vo.user = LIB.user.name;
                this.mainModel.vo = _.cloneDeep(this.vo);
                this.mainModel.emerPlanHistory = emerPlanHistory();
                if(this.mainModel.vo.status){
                    var num = parseInt(this.mainModel.vo.status)-1;
                    if(num >6){
                        num = 6
                        this.visible = false;
                        LIB.Msg.info("已经发布");
                    }
                    this.mainModel.title = this.mainModel.statusListOne[num].name;
                }
                this.uploadModel.params.dataType = "EM" + this.mainModel.vo.status;
                this.isBackNode = false;
            },

            doShowBack:function () {
                this.isBackNode = true;
            },

            // 回退
            saveBackNode:function (obj) {
                var _this = this;
                _this.mainModel.emerPlanHistory.effectiveDate = obj.effectiveDate;
                _this.mainModel.emerPlanHistory.remark = obj.remark;
                _this.mainModel.emerPlanHistory.rollbackStep = obj.rollbackStep;
                _this.mainModel.emerPlanHistory.result = '3';

                _this.doSaveSelectPoint();
            },

            // 保存
            doSaveSelectPoint:function () {
                var _this = this;

                if(_this.mainModel.emerPlanHistory.name){
                    _this.mainModel.vo.name = _this.mainModel.emerPlanHistory.name;
                }
                if(_this.mainModel.vo.name){
                    _this.mainModel.emerPlanHistory.name = _this.mainModel.vo.name;
                }

                if(_this.mainModel.vo.reviseFrequence){
                    _this.mainModel.emerPlanHistory.reviseFrequence = _this.mainModel.vo.reviseFrequence;
                }
                if(_this.mainModel.vo.id){
                    _this.mainModel.emerPlanHistory.emerPlanId = _this.mainModel.vo.id;
                }
                if(_this.mainModel.vo.status){
                    _this.mainModel.emerPlanHistory.step = _this.mainModel.vo.status;
                }
                if(_this.mainModel.vo.lastVersionId){
                    if(_this.mainModel.emerPlanHistory.step != '1'){
                        _this.mainModel.emerPlanHistory.emerPlanVersion = {
                            id:_this.mainModel.vo.lastVersionId,
                        }
                    } else{
                        _this.mainModel.emerPlanHistory.emerPlanVersion=null;
                    }
                };

                if(_this.mainModel.emerPlanHistory.reviseType=='2'){
                    _this.mainModel.emerPlanHistory.reviseReason = _this.mainModel.emerPlanHistory.reviseReasonList.join(",")
                };

                var params = [];
                _.each(this.selectDatas, function (item) {
                    _this.mainModel.emerPlanHistory.emerPlanId = item.id;

                    _this.mainModel.emerPlanHistory.emerPlanVersion = item.emerPlanVersion;
                    _this.mainModel.emerPlanHistory.lastVersionId = item.lastVersionId;

                    item.operateTime = _this.mainModel.emerPlanHistory.operateTime;
                    item.fileList = _this.mainModel.emerPlanHistory.fileList;
                    item.user = _this.mainModel.emerPlanHistory.user;
                    item.remark = _this.mainModel.emerPlanHistory.remark;
                    item.participant = _this.mainModel.emerPlanHistory.participant;
                    item.result = _this.mainModel.emerPlanHistory.result;
                    if(_this.mainModel.emerPlanHistory.rollbackStep){
                        item.rollbackStep = _this.mainModel.emerPlanHistory.rollbackStep;
                    }
                    item.emerPlanVersions = {id:item.lastVersionId};
                    item.emerPlanId = item.id;
                    item.step =  item.status;
                    item.versionId = item.lastVersionId;


                    var obj ={
                        code:item.code,
                        createBy:item.createBy,
                        createDate:item.createDate,
                        disable:item.disable,
                        emerPlanId:item.id,
                        // emerPlanVersion:item.emerPlanVersion,
                        emerPlanVersion :{id:item.lastVersionId},

                        fileList:_this.mainModel.emerPlanHistory.fileList,
                        id:null,
                        name:item.name,
                        operateTime:_this.mainModel.emerPlanHistory.operateTime,
                        operatorId:_this.mainModel.emerPlanHistory.user.id,
                        orgId:LIB.user.orgId,
                        participant:_this.mainModel.emerPlanHistory.participant,
                        remark:_this.mainModel.emerPlanHistory.remark,
                        result:_this.mainModel.emerPlanHistory.result,
                        reviseFrequence:item.reviseFrequence,
                        step:item.status,
                        rollbackStep:_this.mainModel.emerPlanHistory.rollbackStep,
                        user:{id:LIB.user.id, name:null},
                    }
                    // params.push(item);
                    params.push(obj);
                });

                this.$refs.ruleform.validate(function (valid) {
                    if(valid){
                        api.createEmerPlanHistories(params).then(function (res) {
                            _this.$dispatch("ev_dtUpdate");
                            _this.isBackNode = false;
                            LIB.Msg.info("保存成功")
                        });
                        _this.visible =  false;
                    }
                })
            },

            getOperateTime:function (val) {
                var str  = (val + "").substr(0, 16);
                return str;
            },

            doClose:function () {
                this.visible = false;
            },

            getUUId:function () {
                api.getUUID().then(function(res){
                    var group={};
                    group.id = res.data;

                });
            },


            // ------------------- 文件 ---------------------
            getFileList:function(id){
                var _this = this;
                api.getFileList({recordId:id}).then(function (res) {
                    _this.mainModel.emerPlanHistory.fileList = res.data;
                })
            },
            uploadClicked: function () {
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                this.mainModel.emerPlanHistory.fileList.push(con);
                LIB.globalLoader.hide();
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
            },
            removeFile: function (fileId, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: "确定删除文件？",
                    onOk: function() {
                        api.deleteFile(null, [fileId]).then(function () {
                            _this.mainModel.emerPlanHistory.fileList.splice(index, 1);
                        })
                    }
                });
            },
            doClickFile: function (index) {
                var files = this.mainModel.emerPlanHistory.fileList;
                var file = files[index];
                // var _this = this;

                window.open("/file/down/" + file.id)

                // 如果是图片
                // if (_.includes(['png', 'jpg', 'jpeg'], file.ext)) {
                //     images = _.filter(files, function (item) {
                //         return _.includes(['png', 'jpg', 'jpeg'], item.ext)
                //     });
                //     this.images = _.map(images, function (content) {
                //         return {
                //             fileId: content.id,
                //             name: content.orginalName,
                //             fileExt: content.ext
                //         }
                //     });
                //     setTimeout(function () {
                //         _this.$refs.imageViewer.view(_.findIndex(images, "id", file.id));
                //         // _this.$refs.imageViewer.view(0)
                //     }, 100);
                // } else {
                //     window.open("/file/down/" + file.id)
                // }
            },
        },
        init: function(){
            this.$api = api;
        }

    });

    return detail;
});