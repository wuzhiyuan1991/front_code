define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");

    var ivCheckbox=require('components/iviewCheckbox');

    var importProgress = require("componentsEx/importProgress/main");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var exercisePlanSelectModal = require("componentsEx/selectTableModal/exercisePlanSelectModal");
    var riskAnalysisFormModal = require("componentsEx/formModal/riskAnalysisFormModal");
    var selfEvaluationQuestionFormModal = require("componentsEx/formModal/selfEvaluationQuestionFormModal");
    var selfEvaluationTaskFormModal = require("componentsEx/formModal/selfEvaluationTaskFormModal");
    var exerciseParticipantFormModal = require("componentsEx/formModal/exerciseParticipantFormModal");
    var doSelfFormModal = require("componentsEx/formModal/doSelfFormModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

    var selfEvaluationTask = require("./dialog/selfEvaluationTask");

    var exerciseResourceFormModal = require("componentsEx/formModal/exerciseResourceFormModal");
    var assessmentTask = require("./dialog/assessmentTask");
    var exercisesummary = require("./dialog/exercisesummary");
    var internalOrganization = require("./dialog/internalOrganization");
    var outOrganization = require("./dialog/outOrgnization");

    LIB.registerDataDic("iem_exercise_scheme_resoure_type", [
        ["1","作业场所配备"],
        ["2","个人防护装备"],
        ["3","救援车辆配备"],
        ["4","救援物资配备"],
    ]);

    //初始化数据模型
    var newVO = function() {
        return {
            id : null,
            //编码
            code : null,
            //状态 0:未发布,1:已发布
            status : '0',
            //注意事项
            announcements : null,
            //场景概述
            scenarioOverview : null,
            //禁用标识 0:启用,1:禁用
            disable : "0",
            //演练地点
            exerciseAddress : null,
            //演练参加人员职责
            participantDuty : null,
            //演练形式 1:桌面推演,2:现场演习
            form : null,
            //演练实施步骤
            executionStep : null,
            //演练科目
            subjects : null,
            //应急演练组织机构
            exerciseOrgan : null,
            //演练科目类型
            subjectType : null,
            //演练时间
            exerciseDate : null,
            //
            purpose : null,
            //所属公司id
            compId : null,
            //所属部门id
            orgId : null,
            //演练时长（时）
            hour : 0,
            //演练时长（分）
            minute : 0,
            //备注
            remarks : null,
            //演练计划
            exercisePlan : {id:'', name:''},
            //危险性分析
            riskAnalyses : [],
            //自评问卷问题
            selfEvaluationQuestions : [],
            //演练自评任务
            selfEvaluationTasks : [],
            //演练人员
            exerciseParticipants : [],
            //演练物资
            exerciseResources : [],
            // 参演人员类型
            Participant:[

            ],
            selfEvaluationMode:"1",
            selfEvaluatorNum:0,
            pictures:[], // 应急演练组织机构图片
            attr1:null, // 计划实施延迟的原因
        }
    };
    //Vue数据
    var dataModel = {
        mainModel : {
            innerDutyPersonList:[],
            exercisePlanPersonList:[],
            organizationPersonList:[],
            analyseList:[], //危险性分析列表
            vo : newVO(),
            opType : 'view',
            isReadOnly : true,
            title:"",
            exercisePlan:[],
            //验证规则
            rules:{
                "code" : [LIB.formRuleMgr.length(100)],
                "status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("状态")),
                "announcements" : [LIB.formRuleMgr.require("注意事项"),
                    LIB.formRuleMgr.length(2000)
                ],
                "scenarioOverview" : [LIB.formRuleMgr.require("场景概述"),
                    LIB.formRuleMgr.length(2000)
                ],
                "disable" :LIB.formRuleMgr.require("状态"),
                "exerciseAddress" : [LIB.formRuleMgr.require("演练地点"),
                    LIB.formRuleMgr.length(100)
                ],
                "participantDuty" : [LIB.formRuleMgr.require("演练参加人员职责"),
                    LIB.formRuleMgr.length(2000)
                ],
                "form" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("演练形式")),
                "executionStep" : [LIB.formRuleMgr.require("演练实施步骤"),
                    LIB.formRuleMgr.length(2000)
                ],
                "subjects" : [LIB.formRuleMgr.require("演练科目"),
                    LIB.formRuleMgr.length(200)
                ],
                "exerciseOrgan" : [LIB.formRuleMgr.require("应急演练组织机构"),
                    LIB.formRuleMgr.length(2000)
                ],
                "subjectType" : [LIB.formRuleMgr.require("演练科目类型"),
                    LIB.formRuleMgr.length(100)
                ],
                "attr1" : [LIB.formRuleMgr.length(500)],
                "exerciseDate" : [{
                    required:true,
                    validator: function(rule, value, callback){
                        if(value == null || !value){
                            return callback(new Error("请选择演练时间"));
                        }
                        return callback();
                    }
                }],
                "purpose" : [LIB.formRuleMgr.require("演练目的"),
                    LIB.formRuleMgr.length(2000)
                ],
                "compId" : [LIB.formRuleMgr.require("所属公司")],
                "orgId" : [LIB.formRuleMgr.length(10)],
                "hour" :  [{
                    required:true,
                    validator: function(rule, value, callback){
                       if(!value && value!=0) {
                            return callback(new Error("请输入小时"));
                        }
                        if(!dataModel.mainModel.vo.minute && dataModel.mainModel.vo.minute!=0) {
                            return callback(new Error("请输入分钟"));
                        }

                        if(dataModel.mainModel.vo.minute % 1 != 0 || value % 1 != 0){
                            return callback(new Error("请输入整数"));
                        }

                        if(dataModel.mainModel.vo.minute == 0 && value==0){
                            return callback(new Error("分钟和小时不能同时为 0"));
                        }
                        if(value > 23){
                            return callback(new Error("小时数不能大于23"));
                        }

                        if(dataModel.mainModel.vo.minute > 59){
                            return callback(new Error("分钟数不能大于59"));
                        }

                        return callback();
                    }
                }],
                "minute" : [
                    {
                        required:true,
                        validator: function(rule, value, callback){
                            if(!value && value!=0) {
                                return callback(new Error("请输入分钟"));
                            }

                            if(dataModel.mainModel.vo.hour == 0 && value==0){
                                return callback(new Error("分钟和小时不能同时为 0"));
                            }

                            return callback();
                        }
                    }
                ],
                "remarks" : [LIB.formRuleMgr.length(2000)],
                "exercisePlan.id" : [LIB.formRuleMgr.require("演练计划")],
            }
        },
        tableModel : {
            riskAnalysisTableModel : LIB.Opts.extendDetailTableOpt({
                url : "exercisescheme/riskanalyses/list/1/100",
                columns : [
                    // LIB.tableMgr.ksColumn.code,
                    {

                        title : "序号",
                        fieldType : "sequence",
                        width:40,
                    },
                    {
                        title : "事故类型",
                        fieldName : "accidentPattern",
                        width:80
                    },
                    // {
                    //     title : "可能发生的地点",
                    //     fieldName : "possibleLocations",
                    // },
                    {
                        title : "事故发生的区域、地点或装置的名称",
                        fieldName : "possibleEquipments",
                        width:120
                    },{
                        title : "事故发生的可能时间，事故危害严重程度及其影响范围",
                        fieldName : "possibleScenarios",
                        width:120
                    },
                    {
                        title : "事故前可能发生的征兆",
                        fieldName : "possibleSigns",
                        width:120
                    },{
                        title : "可能发生的次生衍生事故",
                        fieldName : "possibleDerivativeAccidents",
                        width:120
                    },
                    {
                        title : "",
                        fieldType : "tool",
                        toolType : "edit,del",
                        width:40,
                    }
                ]
            }),
            selfEvaluationQuestionTableModel : LIB.Opts.extendDetailTableOpt({
                url : "exercisescheme/selfevaluationquestions/list/{curPage}/{pageSize}",
                columns : [
                    {
                        title : "序号",
                        fieldType : "sequence",
                        width:50,
                    },
                    {
                        title : "评价内容",
                        fieldName : "content",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                        width:150
                    },
                    {
                        title : "题型",
                        fieldName : "type",
                        render:function (data) {
                            var arr = ["单选", "多选", "问答"];
                            return arr[parseInt(data.type)-1];
                        },
                        width:60
                    },

                    {
                        title : "答案集合",
                        fieldName : "selfEvaluationOpts",
                        render:function (data) {
                            var listr = '';
                            if(data.selfEvaluationOpts && data.selfEvaluationOpts.length>0){
                                for(var i=0; i<data.selfEvaluationOpts.length; i++){
                                    // listr += "答案" + (i+1)  + ":" + data.selfEvaluationOpts[i].content;
                                    listr += data.selfEvaluationOpts[i].content;
                                    if( i<data.selfEvaluationOpts.length-1){
                                        listr += "， "
                                    }

                                }
                            }
                            return listr;
                        },
                        width:200
                    },
                    {
                        title : "",
                        fieldType : "tool",
                        toolType : "edit,del，move",
                        width:120
                    }]
            }),
            selfEvaluationTaskTableModel : LIB.Opts.extendDetailTableOpt({
                url : "exercisescheme/selfevaluationtasks/list/{curPage}/{pageSize}",
                columns : [
                    LIB.tableMgr.ksColumn.code,
                    {
                        title : "名称",
                        fieldName : "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },{
                        title : "",
                        fieldType : "tool",
                        toolType : "edit,del"
                    }]
            }),
            exerciseParticipantTableModel1 : LIB.Opts.extendDetailTableOpt({
                url : "exercisescheme/exerciseparticipants/list/{curPage}/{pageSize}",
                defaultFilterValue : {"criteria.intsValue.type":["1"], "criteria.intsValue.isInsider":["1"]},  //  1:内部人员,0:外部人员

                columns : [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title : "姓名",
                        fieldName : "name",
                        render:function (data) {
                            if(data.user){
                                return data.user.username;
                            }
                        },
                        width:90
                    },
                    {
                        title : "手机",
                        fieldName : "name",
                        render:function (data) {
                            if(data.user){
                                return data.user.mobile;
                            }
                        },
                        width:120
                    },
                    {
                        title : "岗位",
                        fieldName : "name",
                        render: function (data) {
                            if (data.user && data.user.positionList) {
                                var posNames = "";
                                data.user.positionList.forEach(function (e) {
                                    if (e.postType == 0 && e.name) {
                                        posNames += (e.name + ",");
                                    }
                                });
                                posNames = posNames.substr(0, posNames.length - 1);
                                return posNames;

                            }
                        },
                        width:180
                    },

                    {
                       title:"职责",
                       fieldName : "name",
                       render: function (data) {
                            if ( data.emerPositions) {
                                var posNames = "";
                                data.emerPositions.forEach(function (e) {
                                    if ( e.remarks) {
                                        posNames += (e.remarks + ",");
                                    }
                                });
                                posNames = posNames.substr(0, posNames.length - 1);
                                return posNames;

                            }
                        },
                    },
                    {
                        title : "部门",
                        fieldName : "name",
                        render:function (data) {
                            if(data.user && data.user.org && data.user.org.name){
                                return data.user.org.name;
                            }
                        },
                        width:160
                    },
                    {
                        title: "是否参与人员问卷",
                        fieldName: "isSelfEvaluator",
                        render: function (data) {
                            if(data.isSelfEvaluator == '1'){
                                return LIB.getCheckbox(true)
                            }
                            else{
                                return LIB.getCheckbox(false);
                            }
                        },
                        visible:false,
                        width:160
                    },
                    {
                        title: "公司",
                        fieldName: "data.user.orgId",
                        render:function (data) {
                            if(data.user  && data.user.orgId){
                               return  LIB.getDataDic('org', data.user.orgId).compName
                            }
                            // return  LIB.getDataDic('org', data.orgId).compName
                        },
                        width:160
                    },
                    {
                        title : "",
                        fieldType : "tool",
                        toolType : "del",
                        width:60
                    }]
            }),
            exerciseParticipantTableModel2 : LIB.Opts.extendDetailTableOpt({
                url : "exercisescheme/exerciseparticipants/list/{curPage}/{pageSize}",
                defaultFilterValue : {"criteria.intsValue.type":["1"], "criteria.intsValue.isInsider":["0"]},  //外部  1:内部人员,0:外部人员

                columns : [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title : "姓名",
                        fieldName : "name",
                    },
                    {
                        title : "联系方式",
                        fieldName : "mobile",
                    },
                    {
                        title : "职务",
                        fieldName : "position",
                    },
                    {
                        title : "机构",
                        fieldName : "organization",
                    },
                    {
                        title : "",
                        fieldType : "tool",
                        toolType : "del,edit"
                    }]
            }),

            exerciseResourceTableModel : LIB.Opts.extendDetailTableOpt({
                url : "exercisescheme/exerciseresources/list/{curPage}/{pageSize}",
                columns : [
                    {
                        title : "序号",
                        fieldType : "sequence",
                        width:70,
                    },
                    {
                        title : "名称",
                        fieldName : "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title : "资源类型",
                        fieldName : "type",
                        render:function (data) {
                            return LIB.getDataDic("iem_exercise_scheme_resoure_type", data.type);

                        }
                    },
                    {
                        title : "规格型号",
                        fieldName : "specification",
                    },
                    {
                        title : "数量",
                        fieldName : "quantity",
                        render:function (data) {
                            return data.quantity  + " ";
                        }
                    },
                    {
                        title : "单位",
                        fieldName : "unit",
                    },
                    {
                        title : "",
                        fieldType : "tool",
                        toolType : "edit,del"
                    }
                ]
            }),
        },
        formModel : {
            riskAnalysisFormModel : {
                show : false,
                hiddenFields : ["exerciseSchemeId"],
                queryUrl : "exercisescheme/{id}/riskanalysis/{riskAnalysisId}"
            },
            selfEvaluationQuestionFormModel : {
                show : false,
                hiddenFields : ["exerciseSchemeId"],
                queryUrl : "exercisescheme/{id}/selfevaluationquestion/{selfEvaluationQuestionId}"
            },
            selfEvaluationTaskFormModel : {
                show : false,
                hiddenFields : ["exerciseSchemeId"],
                queryUrl : "exercisescheme/{id}/selfevaluationtask/{selfEvaluationTaskId}"
            },
            exerciseParticipantFormModel : {
                show : false,
                hiddenFields : ["exerciseSchemeId"],
                queryUrl : "exercisescheme/{id}/exerciseparticipant/{exerciseParticipantId}"
            },
            exerciseResourceFormModel : {
                show : false,
                hiddenFields : ["exerciseSchemeId"],
                queryUrl : "exercisescheme/{id}/exerciseresource/{exerciseResourceId}"
            },
            doSelfFormModel:{
                visible:false
            },
            internalFormModel:{
                show:false
            },
            internalFormModel2:{
                show:false
            },
        },
        selectModel:{
            exercisePlanSelectModel : {
                visible : false,
                filterData : {orgId : LIB.user.orgId}
            },
            userSelectModel : {
                visible : false,
                filterData :  {compId : null}
            },
        },
        filterTabId:0 ,// 顶部导航栏
        isEdit:false,// 评估，总结 按钮显示
        dialogModel:{
            selfEvaluationTaskFormModel:{
                visible:false
            }
        },
        uploadModel: {
            initUrl:"/exercisescheme/{id}/selfevaluationquestions/importExcel",
            url:null,
            params: {
                recordId: null,
                dataType: 'YLFA0',
                fileType: 'YLFA'
            },
            filters: {
                max_file_size: '20mb',
                mime_types: [{ title: "files", extensions: "jpg,jpeg,png"}]
            },
        },
        exportModel : {
            initUrl:"/exercisescheme/{id}/selfevaluationquestions/exportExcel",
            url:null
        },
        templete : {
            url:"/selfevaluationquestion/file/down"
        },
        importProgress:{
            show: false
        },
        //人员类型 1:演练负责人,2:参演人员,3:评价人员,4:观摩人员
        userType:[{id:1, name:"演练组织人"},{id:2, name:"参演人员"},{id:3, name:"评价人员"},{id:4, name:"观摩人员"},],
        userTypeIndex:0, // 人员种类序号
        //是否内部人员 1:内部人员,0:外部人员
        insider : [{id:1,name:"内部人员"},{id:0,name:"外部人员"}],
        insiderIndex:0,
        tabList:["全部","基本信息","演练准备","危险性分析","参演单位及人员","演练自评问卷"],
        tabListIndex:0,

        isUpdateInfo:{
            purpose:false,
            exerciseOrgan:false,
            participantDuty:false,
            scenarioOverview:false,
            executionStep:false,
            announcements:false,
            remarks:false,
        } ,// 更新
        isAll:false, // 用于控制编辑按钮单选
        updateRules:{
            "announcements" : [LIB.formRuleMgr.require("注意事项"),
                LIB.formRuleMgr.length(2000)
            ],
            "scenarioOverview" : [LIB.formRuleMgr.require("场景概述"),
                LIB.formRuleMgr.length(2000)
            ],
            "executionStep" : [LIB.formRuleMgr.require("演练实施步骤"),
                LIB.formRuleMgr.length(2000)
            ],
            "participantDuty" : [LIB.formRuleMgr.require("演练参加人员职责"),
                LIB.formRuleMgr.length(2000)
            ],
            "exerciseOrgan" : [LIB.formRuleMgr.require("应急演练组织机构"),
                LIB.formRuleMgr.length(2000)
            ],
            "subjectType" : [LIB.formRuleMgr.require("演练科目类型"),
                LIB.formRuleMgr.length(100)
            ],
            "purpose" : [LIB.formRuleMgr.require("演练目的"),
                LIB.formRuleMgr.length(2000)
            ],
        }

    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	 el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     _XXX    			//内部方法
     doXXX 				//事件响应方法
     beforeInit 		//初始化之前回调
     afterInit			//初始化之后回调
     afterInitData		//请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave		//请求 新增/更新 接口后回调
     beforeDoDelete		//请求 删除 接口前回调
     afterDoDelete		//请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "exerciseplanSelectModal": exercisePlanSelectModal,
            "riskanalysisFormModal": riskAnalysisFormModal,
            "selfevaluationquestionFormModal": selfEvaluationQuestionFormModal,
            "selfevaluationtaskFormModal": selfEvaluationTaskFormModal,
            "exerciseparticipantFormModal": exerciseParticipantFormModal,
            "selfEvaluationTask": selfEvaluationTask,
            "exerciseresourceFormModal": exerciseResourceFormModal,
            "userSelectModal": userSelectModal,
            "assessmentTask": assessmentTask,
            "exercisesummary": exercisesummary,
            "doSelfFormModal": doSelfFormModal,
            "importprogress": importProgress,
            "internalOrganization":internalOrganization,
            "outOrganization":outOrganization
        },
        computed: {
            emerPlanTypeList: function () {
                // 1:综合应急预案,2:专项应急预案,3:现场处置方案
                return [
                    {id: "1", value: "综合应急预案"},
                    {id: "2", value: "专项应急预案"}
                ]
            },
            getSelfEvaluationMode: function () {
                var val = this.mainModel.vo.selfEvaluationMode;
                if (val == '2') {
                    return "全部人员参与自评"
                } else if (val == '3') {
                    return "随机选择人员自评（人数 " + this.mainModel.vo.selfEvaluatorNum + " ）"
                } else {
                    return "部分人员参与自评";
                }
            },
        },
        props: {
            exercisePlanObj: {
                type: Object,
                default: null
            },
            isNewCopy:{
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return dataModel;
        },
        watch: {
            'mainModel.vo.id': function (val) {
                if (val) {
                    this.exportModel.url = this.exportModel.initUrl.replace("{id}", val);
                    this.uploadModel.url = this.uploadModel.initUrl.replace("{id}", val);
                }
            }
        },
        methods: {
            doSavePersonList:function (val) {
                this.mainModel.innerDutyPersonList = val;
            },
            doCopyOrganizationPerson:function () {
               var len = this.mainModel.innerDutyPersonList.length;
               var _this = this;
               var param = [];
                var data = this.mainModel.exercisePlanPersonList;
                for (var i = 0; i < data.length; i++) {
                    var obj = {
                        isInsider: this.insider[this.insiderIndex].id,
                        type: this.userType[this.userTypeIndex].id,
                        user: {id: data[i].id, name: data[i].name}
                    };
                    param.push(obj);
                }
               if(len > 0){
                   LIB.Modal.confirm({
                       title:"是否覆盖人员",
                       onOk:function () {
                           api.updateOrganizationPersonList({id:_this.mainModel.vo.id},{orgId:LIB.user.orgId}).then(function (res) {
                               _this.refreshTableData(_this.$refs.exerciseparticipantTable1);

                           });
                       }
                   })
               }else{
                   api.updateOrganizationPersonList({id:_this.mainModel.vo.id},{orgId:LIB.user.orgId}).then(function (res) {
                       _this.refreshTableData(_this.$refs.exerciseparticipantTable1);
                   });
               }
            },

            doImport: function () {
                var _this = this;
                _this.importProgress.show = true;
            },
            doExportExcel: function () {
                var _this = this;
                LIB.Modal.confirm({
                    title: '导出数据?',
                    onOk: function () {
                        window.open(_this.exportModel.url);
                    }
                });
            },
            doSaveSelfModel: function (data) {
                var _this = this;
                if (data) {
                    var param = {
                        id: this.mainModel.vo.id,
                        selfEvaluationMode: data.selfEvaluationMode,
                        selfEvaluatorNum: data.selfEvaluatorNum,
                        orgId: LIB.user.orgId
                    }
                    api.updateSelfevaluationmode(param).then(function (res) {
                        _this.mainModel.vo.selfEvaluationMode = param.selfEvaluationMode;
                        _this.mainModel.vo.selfEvaluatorNum = param.selfEvaluatorNum;
                        LIB.Msg.info("保存成功");
                        _this.updateTableColumns()
                    })
                }
            },

            afterDoCopy: function () {
                this.isNewCopy = false;
            },

            afterDoSave: function () {
                this.isNewCopy = false;
            },

            updateTableColumns: function () {
                // 改变主列表的 种类属性显示
                var obj = _.find(this.tableModel.exerciseParticipantTableModel1.columns, function (item) {
                    return item.fieldName == 'isSelfEvaluator';
                });
                if (this.mainModel.vo.selfEvaluationMode == 1 && this.userTypeIndex == 1 && this.insiderIndex == '0') {
                    obj.visible = true;
                } else {
                    obj.visible = false;
                }

                this.$refs.exerciseparticipantTable1.columns = this.tableModel.exerciseParticipantTableModel1.columns.concat([]);
                this.$refs.exerciseparticipantTable1.refreshColumns();
                return;

                if (this.mainModel.vo.selfEvaluationMode == '1') {
                    if (obj) {
                        this.tableModel.exerciseParticipantTableModel1.columns.splice(4, 1);
                    }
                    if (this.mainModel.vo.selfEvaluationMode == '1') {
                        this.tableModel.exerciseParticipantTableModel1.columns.splice(4, 0, {
                            title: "是否参与自评",
                            fieldName: "isSelfEvaluator",
                            fieldType: "cb",
                            // render: function (data) {
                            //     if(data.isSelfEvaluator == '1'){
                            //         return `<span  @click="console.log('hajhajaj')" style="color: #fff;width: 16px;height: 16px;display: block;border: 1px solid #d9d9d9;border-radius: 3px;background-color: #aacd03;text-align: center;padding: 2px;font-size: xx-small;" class="ivu-icon ivu-icon-checkmark-round"></span>`
                            //     }
                            //     else{
                            //         return `<span @click="console.log('hajhajaj')" class="" style="width: 16px;height: 16px;display: block;border: 1px solid #d9d9d9;border-radius: 3px;background-color: #fff;box-sizing: border-box;"></span>`;
                            //     }
                            // },
                            width: 170
                        })
                    }
                } else {
                    if (obj) {
                        this.tableModel.exerciseParticipantTableModel1.columns.splice(4, 1)
                        this.updateTableColumnsParam();
                    }
                }
            },

            updateTableColumnsParam: function () {
                var params = [
                    {
                        value: {
                            columnFilterName: "criteria.intsValue.id",
                            columnFilterValue: [this.mainModel.vo.id]
                        },
                        type: "save"
                    }
                ];

                this.$refs.exerciseparticipantTable1.columns = this.tableModel.exerciseParticipantTableModel1.columns.concat([]);
                this.$refs.exerciseparticipantTable1.refreshColumns();
                this.$refs.exerciseparticipantTable1.doQueryByFilter();
            },

            doShowSelfModel: function () {
                this.formModel.doSelfFormModel.visible = true;
            },

            // 点击是否参与自评
            selectInner: function (obj) {
                var _this = this;
                if(this.mainModel.vo.status != 0){
                    return;
                }
                if (obj.cell.colId == '5' && this.mainModel.vo.selfEvaluationMode == 1) {
                    // _this.refreshTableData(_this.$refs.exerciseparticipantTable1);
                    if (obj.entry.data.isSelfEvaluator == '1') {
                        obj.entry.data.isSelfEvaluator = '0'
                    } else {
                        obj.entry.data.isSelfEvaluator = '1'
                    }
                    // this.doUpdateExerciseParticipant(obj.entry.data)
                    var data = obj.entry.data;
                    if (data) {
                        var _this = this;
                        data.compId = LIB.user.compId;
                        data.orgId = LIB.user.orgId;
                        api.updateExerciseParticipant({id: this.mainModel.vo.id}, data).then(function () {
                            LIB.Msg.info("保存成功")
                        });
                    }
                }
            },

            doUpdateInfo: function (val) {
                for (var item in this.isUpdateInfo) {
                    if (val == item) {
                        this.isUpdateInfo[item] = true;
                    } else {
                        this.isUpdateInfo[item] = false;
                    }
                }
                this.isAll = true;
            },

            beforeDoPublish: function () {
                debugger
                var isTrue = true;

                if (!this.mainModel.vo.purpose) {
                    LIB.Msg.error("未填写演练目的");
                    return;
                }
                if (!this.mainModel.vo.exerciseOrgan) {
                    LIB.Msg.error("未填写应急演练组织机构");
                    return;
                }
                // if (!this.mainModel.vo.participantDuty) {
                //     LIB.Msg.error("未填写演练参加人员职责");
                //     return;
                // }
                if (!this.mainModel.vo.scenarioOverview) {
                    LIB.Msg.error("未填写场景概述");
                    return;
                }
                if (!this.mainModel.vo.executionStep) {
                    LIB.Msg.error("未填写演练实施步骤");
                    return;
                }
                if (!this.mainModel.vo.announcements) {
                    LIB.Msg.error("未填写演练注意事项");
                    return;
                }
                this.doPublish();
            },

            doSaveInfo: function (val) {
                var isTrue = false;
                if (val == "purpose") {
                    this.$refs.ruleform1.validate(function (valid) {
                        if (valid) {
                            isTrue = valid;
                        }
                    })
                }
                if (val == "exerciseOrgan") {
                    this.$refs.ruleform2.validate(function (valid) {
                        if (valid) {
                            isTrue = valid;
                        }
                    })
                }

                if (val == "participantDuty") {
                    this.$refs.ruleform3.validate(function (valid) {
                        if (valid) {
                            isTrue = valid;
                        }
                    })
                }

                if (val == "scenarioOverview") {
                    this.$refs.ruleform4.validate(function (valid) {
                        if (valid) {
                            isTrue = valid;
                        }
                    })
                }
                if (val == "executionStep") {
                    this.$refs.ruleform5.validate(function (valid) {
                        if (valid) {
                            isTrue = valid;
                        }
                    })
                }
                if (val == "announcements") {
                    this.$refs.ruleform6.validate(function (valid) {
                        if (valid) {
                            isTrue = valid;
                        }
                    })
                }
                if (val == "remarks") {
                    this.$refs.ruleform7.validate(function (valid) {
                        if (valid) {
                            isTrue = valid;
                        }
                    })
                }

                // 校验失败返回
                if (!isTrue) return;

                var _this = this;
                this.mainModel.vo.orgId = LIB.user.orgId;
                api.updateInfo(this.mainModel.vo).then(function (res) {
                    for (var item in _this.isUpdateInfo) {
                        _this.isUpdateInfo[item] = false;
                    }
                    LIB.Msg.info("保存成功");
                });

                this.isAll = false;
            },


            getDateInfo: function (val) {
                if (val) {
                    return (val + '').substr(0, 16);
                } else {
                    return ''
                }
            },

            // 移动
            doMoveQuestion: function (item) {

                var _this = this;
                var param = {};
                _.set(param, 'id', item.entry.data.id);
                _.set(param, 'exerciseScheme.id', this.mainModel.vo.id);
                _.set(param, "criteria.intValue.offset", item.offset);

                api.saveEmerQuestionOrderNo(null, param).then(function () {
                    _this.refreshTableData(_this.$refs.selfevaluationquestionTable);

                });
            },

            beforeDoSave: function () {
                // this.mainModel.vo.exerciseDate += " 00:00:00";
                // if(this.mainModel.vo.exerciseDate.indexOf("00")<0){
                //     // this.mainModel.vo.exerciseDate += " 00:00:00";
                // }

                if (!this.mainModel.vo.orgId) {
                    this.mainModel.vo.orgId = LIB.user.orgId;
                }
            },
            doPublish: function () {
                var _this = this;

                var param = {
                    id: this.mainModel.vo.id,
                    orgId: LIB.user.orgId,
                    compId: LIB.user.compId
                };
                api.publish(param).then(function (res) {
                    LIB.Msg.info("发布成功");
                    _this.afterDoSave({type: "U"}, res.body);
                    _this.changeView("view");
                    _this.$dispatch("ev_dtUpdate");
                    _this.storeBeforeEditVo();
                    _this.mainModel.vo.status = '1';
                    _this.doDeleteTool();
                })
            },
            doFinish: function () {
                var _this = this;
                if (this.mainModel.vo.status !== '2') {
                    LIB.Msg.error("当前状态无法完成");
                    return;
                }
                var param = {
                    id: this.mainModel.vo.id,
                    orgId: LIB.user.orgId,
                    compId: LIB.user.compId
                };
                api.finish(param).then(function (res) {
                    LIB.Msg.info("操作成功");
                    _this.mainModel.vo.status = '3';
                    _this.$dispatch("ev_dtUpdate");
                })
            },

            confirmEnd: function () {
                var _this = this;
                var param = {
                    id: this.mainModel.vo.id,
                    orgId: LIB.user.orgId,
                    compId: LIB.user.compId
                };
                LIB.Modal.confirm({
                    title: "该方案对应的应急演练已经实施结束，确认？",
                    onOk: function () {
                        api.implement(param).then(function (res) {
                            LIB.Msg.info("保存成功");
                            _this.afterDoSave({type: "U"}, res.body);
                            _this.changeView("view");
                            _this.$dispatch("ev_dtUpdate");
                            _this.storeBeforeEditVo();
                            _this.mainModel.vo.status = '2';
                            _this.doDeleteTool();
                        })
                    }
                })
            },

            newVO: newVO,

            // 更新温泉
            updateFun: function () {
                this.refreshTableData(this.$refs.selfevaluationquestionTable);
                return false;
            },


            getScroll: function (data) {

                var allTop = $('#scrolldiv').scrollTop();

                var $div = $(".locationTarget");
                var height = 0;
                for (var i = 0; i < $div.length; i++) {
                    height += $div[i].clientHeight;
                    if (height > allTop) {
                        break;
                    }
                }
                this.tabListIndex = i + 1;
            },

            // 显示隐藏
            doChangeTab: function (index) {
                var $div = $(".locationTarget");
                var height = 0;
                for (var i = 0; i < index - 1; i++) {
                    height += $div[i].clientHeight;
                }
                $('#scrolldiv').scrollTop(height);
                var _this = this;
                this.$nextTick(function (res) {
                    _this.tabListIndex = index;
                });
            },

            doItemEdit: function () {
                if (this.filterTabId == 2) {

                } else if (this.filterTabId == 3) {

                }
            },
            doSaveUserOUter: function (data) {
                var param = [];
                for (var i = 0; i < data.length; i++) {
                    var obj = {
                        isInsider: this.insider[this.insiderIndex].id,
                        type: this.userType[this.userTypeIndex].id,
                        mobile:data[i].mobile,
                        name:data[i].name,
                        position:data[i].duty,
                        organization:data[i].emerGroup?data[i].emerGroup.name:null
                    };
                    param.push(obj);
                }
                this.doSaveExerciseParticipant(param);
            },
            doSaveUserInner: function (data) {
                if (this.insiderIndex == 0) {
                    var param = [];

                    for (var i = 0; i < data.length; i++) {
                        var obj = {
                            isInsider: this.insider[this.insiderIndex].id,
                            type: this.userType[this.userTypeIndex].id,
                            user: {id: data[i].id, name: data[i].name}
                        };
                        param.push(obj);
                    }

                } else {
                    var param = [{
                        isInsider: this.insider[this.insiderIndex].id,
                        type: this.userType[this.userTypeIndex].id,
                        //联系方式
                        mobile: data.mobile,
                        //机构
                        organization: data.organization,
                        //职务
                        position: data.position,
                        name: data.name
                    }]
                }

                this.doSaveExerciseParticipant(param);
            },
            // 过滤
            doChangeInsider: function (index) {
                this.insiderIndex = index;
                this.doChangeUserType(this.userTypeIndex);
            },
            doChangeUserType: function (index) {
                this.userTypeIndex = index;
                this.updateTableColumns();
                var params = [
                    {
                        value: {
                            columnFilterName: "criteria.intsValue.type",
                            columnFilterValue: [this.userType[this.userTypeIndex].id + ''],
                        },
                        type: "save"
                    },
                    {
                        value: {
                            columnFilterName: "id",
                            columnFilterValue: this.mainModel.vo.id,
                        },
                        type: "save"
                    },
                ];

                if (this.userTypeIndex == 1 && this.insiderIndex == '0') {
                    this.$refs.exerciseparticipantTable1.refreshColumns();

                }

                if (this.insiderIndex == 0) {
                    this.$refs.exerciseparticipantTable1.doQueryByFilter(params); // 内部
                } else {
                    this.$refs.exerciseparticipantTable2.doQueryByFilter(params); // 外部
                }
            },

            doShowExercisePlanSelectModal: function () {
                this.selectModel.exercisePlanSelectModel.visible = true;
                this.selectModel.exercisePlanSelectModel.filterData = {orgId: this.mainModel.vo.orgId};

            },
            doSaveExercisePlan: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.exercisePlan = selectedDatas[0];
                    this.mainModel.exercisePlan = selectedDatas;
                }
            },
            doShowRiskAnalysisFormModal4Update: function (param) {
                this.formModel.riskAnalysisFormModel.show = true;
                this.$refs.riskanalysisFormModal.init("update", {id: this.mainModel.vo.id, riskAnalysisId: param.id});
            },
            doShowRiskAnalysisFormModal4Create: function (param) {
                this.formModel.riskAnalysisFormModel.show = true;
                this.$refs.riskanalysisFormModal.init("create");
            },

            //危险性
            doSaveRiskAnalysis: function (data) {
                if (data) {
                    var _this = this;
                    api.saveRiskAnalysis({id: this.mainModel.vo.id}, data).then(function () {
                        // _this.refreshTableData(_this.$refs.riskanalysisTable);
                        _this.doQueryAnalysesList()

                    });
                }
            },
            doUpdateRiskAnalysis: function (data) {
                if (data) {
                    var _this = this;
                    api.updateRiskAnalysis({id: this.mainModel.vo.id}, data).then(function () {
                        // _this.refreshTableData(_this.$refs.riskanalysisTable);
                        _this.doQueryAnalysesList()
                    });
                }
            },
            doRemoveRiskAnalysis: function (item) {
                var _this = this;
                // var data = item.entry.data;
                var data = item;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeRiskAnalyses({id: _this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                            // _this.$refs.riskanalysisTable.doRefresh();
                            _this.doQueryAnalysesList();
                        });
                    }
                });
            },
            doShowSelfEvaluationQuestionFormModal4Update: function (param) {
                this.formModel.selfEvaluationQuestionFormModel.show = true;
                this.$refs.selfevaluationquestionFormModal.init("update", {id: this.mainModel.vo.id, selfEvaluationQuestionId: param.entry.data.id});
            },
            doShowSelfEvaluationQuestionFormModal4Create: function (param) {
                this.formModel.selfEvaluationQuestionFormModel.show = true;
                this.$refs.selfevaluationquestionFormModal.init("create");
            },
            doSaveSelfEvaluationQuestion: function (data) {
                if (data) {
                    var _this = this;
                    data.compId = LIB.user.compId;
                    data.orgId = LIB.user.orgId;
                    api.saveSelfEvaluationQuestion({id: this.mainModel.vo.id}, data).then(function () {
                        _this.refreshTableData(_this.$refs.selfevaluationquestionTable);
                    });
                }
            },
            doUpdateSelfEvaluationQuestion: function (data) {
                if (data) {
                    var _this = this;
                    data.compId = LIB.user.compId;
                    data.orgId = LIB.user.orgId;
                    api.updateSelfEvaluationQuestion({id: this.mainModel.vo.id}, data).then(function () {
                        _this.refreshTableData(_this.$refs.selfevaluationquestionTable);
                    });
                }
            },
            doRemoveSelfEvaluationQuestion: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeSelfEvaluationQuestions({id: _this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                            _this.$refs.selfevaluationquestionTable.doRefresh();

                        });
                    }
                });
            },
            doShowSelfEvaluationTaskFormModal4Update: function (param) {
                this.formModel.selfEvaluationTaskFormModel.show = true;
                this.$refs.selfevaluationtaskFormModal.init("update", {id: this.mainModel.vo.id, selfEvaluationTaskId: param.entry.data.id});
            },
            doShowSelfEvaluationTaskFormModal4Create: function (param) {
                this.formModel.selfEvaluationTaskFormModel.show = true;
                this.$refs.selfevaluationtaskFormModal.init("create");
            },
            doSaveSelfEvaluationTask: function (data) {
                if (data) {
                    var _this = this;
                    data.compId = LIB.user.compId;
                    data.orgId = LIB.user.orgId;
                    api.saveSelfEvaluationTask({id: this.mainModel.vo.id}, data).then(function () {
                        LIB.Msg.info("保存成功")
                        _this.refreshTableData(_this.$refs.selfevaluationtaskTable);
                    });
                }
            },
            doUpdateSelfEvaluationTask: function (data) {
                if (data) {
                    var _this = this;
                    data.compId = LIB.user.compId;
                    data.orgId = LIB.user.orgId;
                    api.updateSelfEvaluationTask({id: this.mainModel.vo.id}, data).then(function () {
                        LIB.Msg.info("保存成功")

                        _this.refreshTableData(_this.$refs.selfevaluationtaskTable);
                    });
                }
            },
            doRemoveSelfEvaluationTask: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeSelfEvaluationTasks({id: _this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                            LIB.Msg.info("删除成功")

                            _this.$refs.selfevaluationtaskTable.doRefresh();
                        });
                    }
                });
            },
            doShowExerciseParticipantFormModal4Update: function (param) {
                this.formModel.exerciseParticipantFormModel.show = true;
                this.$refs.exerciseparticipantFormModal.init("update", {id: this.mainModel.vo.id, exerciseParticipantId: param.entry.data.id});
            },
            doShowExerciseParticipantFormModal4Create: function (param) {
                if (this.insiderIndex == 0) {
                    this.selectModel.userSelectModel.filterData = {compId: this.mainModel.vo.compId};
                    this.selectModel.userSelectModel.visible = true;

                    return;
                }
                this.formModel.exerciseParticipantFormModel.show = true;
                this.$refs.exerciseparticipantFormModal.init("create");
            },
            doSaveExerciseParticipant: function (data) {
                if (data) {
                    var _this = this;
                    data.compId = LIB.user.compId;
                    data.orgId = LIB.user.orgId;

                    if (_this.insiderIndex == 0) {
                        api.saveExerciseParticipants({id: this.mainModel.vo.id}, data).then(function () {
                            LIB.Msg.info("保存成功")
                            _this.refreshTableData(_this.$refs.exerciseparticipantTable1);
                        });
                        return;
                    }

                    api.saveExerciseParticipants({id: this.mainModel.vo.id}, data).then(function () {
                        LIB.Msg.info("保存成功")
                        _this.refreshTableData(_this.$refs.exerciseparticipantTable2);
                    });
                }
            },
            doUpdateExerciseParticipant: function (data) {
                if (data) {
                    var _this = this;
                    data.compId = LIB.user.compId;
                    data.orgId = LIB.user.orgId;
                    api.updateExerciseParticipant({id: this.mainModel.vo.id}, data).then(function () {
                        LIB.Msg.info("保存成功")
                        if (_this.insiderIndex == 0) {
                            _this.refreshTableData(_this.$refs.exerciseparticipantTable1);
                        } else {
                            _this.refreshTableData(_this.$refs.exerciseparticipantTable2);
                        }
                    });
                }
            },
            doRemoveExerciseParticipant: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeExerciseParticipants({id: _this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                            LIB.Msg.info("删除成功")
                            if (_this.insiderIndex == 0) {
                                _this.$refs.exerciseparticipantTable1.doRefresh();
                            } else {
                                _this.$refs.exerciseparticipantTable2.doRefresh();
                            }
                        });
                    }
                });
            },
            doShowExerciseResourceFormModal4Update: function (param) {
                this.formModel.exerciseResourceFormModel.show = true;
                this.$refs.exerciseresourceFormModal.init("update", {id: this.mainModel.vo.id, exerciseResourceId: param.entry.data.id});
            },
            doShowExerciseResourceFormModal4Create: function (param) {
                this.formModel.exerciseResourceFormModel.show = true;
                this.$refs.exerciseresourceFormModal.init("create");
            },
            doSaveExerciseResource: function (data) {
                if (data) {
                    var _this = this;
                    api.saveExerciseResource({id: this.mainModel.vo.id}, data).then(function () {
                        LIB.Msg.info("保存成功");
                        _this.refreshTableData(_this.$refs.exerciseresourceTable);
                    });
                }
            },
            doUpdateExerciseResource: function (data) {
                if (data) {
                    var _this = this;
                    api.updateExerciseResource({id: this.mainModel.vo.id}, data).then(function () {
                        LIB.Msg.info("保存成功");
                        _this.refreshTableData(_this.$refs.exerciseresourceTable);
                    });
                }
            },
            doRemoveExerciseResource: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeExerciseResources({id: _this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                            _this.$refs.exerciseresourceTable.doRefresh();
                        });
                    }
                });
            },

            doQueryAnalysesList: function () {
                var _this = this;
                api.queryAnalysesList({id: this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.analyseList = res.data.list;
                })
            },

            afterInitData: function () {

                this.getFileList(this.mainModel.vo.id);

                this.updateTableColumns() //刷新

                if(this.mainModel.vo.exercisePlan){
                    this.queryUsers(this.mainModel.vo.exercisePlan.id)
                }

                // 防止复制报错
                if(this.mainModel.vo.exerciseEstimate && this.mainModel.vo.exerciseEstimate.exerciseEstimateDetails){
                    this.mainModel.vo.exerciseEstimate.exerciseEstimateDetails.forEach(function (item) {
                        delete item.exerciseEstimate;
                    })
                }

                // 操作列的工具顯示
                this.doDeleteTool();

                this.doQueryAnalysesList();
                // this.$refs.riskanalysisTable.doQuery({id : this.mainModel.vo.id});
                this.$refs.selfevaluationquestionTable.doQuery({id: this.mainModel.vo.id});
                // this.$refs.selfevaluationtaskTable.doQuery({id : this.mainModel.vo.id});
                this.$refs.exerciseparticipantTable1.doQuery({id: this.mainModel.vo.id});
                this.$refs.exerciseparticipantTable2.doQuery({id: this.mainModel.vo.id});
                this.$refs.exerciseresourceTable.doQuery({id: this.mainModel.vo.id});
            },

            queryUsers:function (id) {
                var _this = this;
                var obj = {
                    "criteria.orderValue.fieldName":"modifyDate",
                    "criteria.orderValue.orderType":1,
                    disable:0,
                    pageNo:1,pageSize:9999,
                    id:	id
                };

                api.queryUsers(obj).then(function (res) {
                    _this.mainModel.exercisePlanPersonList = res.data.list;
                })
            },

            doDeleteTool: function () {
                var resourceColumn = this.tableModel.exerciseResourceTableModel.columns;
                // var riskAnalysisTableModel =this.tableModel.riskAnalysisTableModel.columns;
                var exerciseParticipantTableModel1 = this.tableModel.exerciseParticipantTableModel1.columns;
                var exerciseParticipantTableModel2 = this.tableModel.exerciseParticipantTableModel2.columns;
                var selfEvaluationQuestionTableModel = this.tableModel.selfEvaluationQuestionTableModel.columns;

                if (parseInt(this.mainModel.vo.status) > 0) {
                    resourceColumn[resourceColumn.length - 1].fieldType = ""
                    exerciseParticipantTableModel1[exerciseParticipantTableModel1.length - 1].fieldType = ""
                    exerciseParticipantTableModel2[exerciseParticipantTableModel2.length - 1].fieldType = ""
                    selfEvaluationQuestionTableModel[selfEvaluationQuestionTableModel.length - 1].fieldType = ""
                } else {
                    resourceColumn[resourceColumn.length - 1].fieldType = "tool"
                    exerciseParticipantTableModel1[exerciseParticipantTableModel1.length - 1].fieldType = "tool"
                    exerciseParticipantTableModel2[exerciseParticipantTableModel2.length - 1].fieldType = "tool"
                    selfEvaluationQuestionTableModel[selfEvaluationQuestionTableModel.length - 1].fieldType = "tool"
                }

                this.$refs.selfevaluationquestionTable.columns = selfEvaluationQuestionTableModel;
                this.$refs.selfevaluationquestionTable.refreshColumns();
                this.$refs.exerciseparticipantTable1.columns = exerciseParticipantTableModel1;
                this.$refs.exerciseparticipantTable1.refreshColumns();

                this.$refs.exerciseparticipantTable2.columns = exerciseParticipantTableModel2;
                this.$refs.exerciseparticipantTable2.refreshColumns();
                this.$refs.exerciseresourceTable.columns = resourceColumn;
                this.$refs.exerciseresourceTable.refreshColumns();

            },

            afterInit: function () {
                //  chushihau
                var _this =  this;
                this.tableModel = _.cloneDeep(dataModel.tableModel);
                this.doDeleteTool();
                if (this.mainModel.opType == "create" && this.exercisePlanObj) {
                    this.mainModel.vo.exerciseAddress = this.exercisePlanObj.dominationArea.name;
                    this.mainModel.vo.subjects = this.exercisePlanObj.subjects;
                    if (this.exercisePlanObj.form != '3') {
                        this.mainModel.vo.form = this.exercisePlanObj.form
                    }
                    var arr = [];
                    this.mainModel.vo.subjectType = '';
                    _.each(this.exercisePlanObj.subjectType.split(","), function (item) {
                        arr.push(LIB.getDataDic("emer_exercise_subjects_type",item));
                    });
                    this.mainModel.vo.subjectType = arr.join('，');

                    this.mainModel.vo.exercisePlan = {id: this.exercisePlanObj.id}
                }
            },
            beforeInit: function () {
                //  chushihau
                this.tableModel = _.cloneDeep(dataModel.tableModel);

                // this.$refs.riskanalysisTable.doClearData();
                this.mainModel.analyseList = [];
                this.$refs.selfevaluationquestionTable.doClearData();
                // this.$refs.selfevaluationtaskTable.doClearData();
                this.$refs.exerciseparticipantTable1.doClearData();
                this.$refs.exerciseparticipantTable2.doClearData();
                this.$refs.exerciseresourceTable.doClearData();
                this.mainModel.opType = arguments[1].opType; // 骚操作

                this.mainModel.vo.exerciseEstimate = null;
                this.mainModel.vo.exerciseSummary = null;
                this.mainModel.vo.id = null;
                this.filterTabId = 0;

                for (var item in this.isUpdateInfo) {
                    this.isUpdateInfo[item] = false;
                }
                this.mainModel.vo.pictures = [];
                this.isAll = false;
            },

            doPageEdit: function () {
                if (this.filterTabId == 2) {
                    this.$refs.assessment.doItemEdit();
                }
                if (this.filterTabId == 3) {
                    this.$refs.exercisesummary.doItemEdit();
                }
                this.isEdit = !this.isEdit;
            },
            doPageCancel: function () {
                if (this.filterTabId == 2) {
                    this.$refs.assessment.doCancelEdit();
                }
                if (this.filterTabId == 3) {
                    this.$refs.exercisesummary.doCancelEdit();
                }
                this.isEdit = !this.isEdit;
            },

            doPageSave: function () {
                if (this.filterTabId == 2) {
                    this.$refs.assessment.doSave();
                }
                if (this.filterTabId == 3) {
                    this.$refs.exercisesummary.doSave();
                }
                // this.isEdit =  !this.isEdit;
            },

            getClass: function (val) {
                if (val === this.filterTabId) {
                    return 'activexx main-special-item';
                } else {
                    return 'main-special-item';
                }
            },

            doFilterBySpecial: function (val, type) {
                var _this = this;
                this.filterTabId = val;

                this.$nextTick(function () {
                    if (val == 1) {
                        _this.dialogModel.selfEvaluationTaskFormModel.visible = true;
                        _this.$refs.selfevaluationquestion._init(type);
                    }
                    if (val == 3) {
                        _this.$refs.exercisesummary._init(this.mainModel.vo);
                        _this.isEdit = false;
                        if (type) {
                            _this.doPageEdit();
                        }
                    }
                    if (val == 2) {
                        _this.$refs.assessment._init(this.mainModel.vo);
                        _this.isEdit = false;
                        if (type) {
                            _this.doPageEdit();
                        }
                    }
                });

            },

            updateassessment: function (obj) {
                this.$set("mainModel.vo.exerciseEstimate", obj);
            },

            updatesummary: function (obj) {
                // this.mainModel.vo.exerciseSummary = obj;
                LIB.Msg.info("保存成功");
                this.$set("mainModel.vo.exerciseSummary", obj);
            },

            doShowInternalFormModell:function () {
                if(this.insiderIndex == 0) this.formModel.internalFormModel.show = true;
                else this.formModel.internalFormModel2.show = true;
            },


            // ------------------- 文件 ---------------------
            getFileList: function (id) {
                var _this = this;
                api.getFileList({recordId: id}).then(function (res) {
                    var pictures = [];
                    if(res.data) {
                        _.each(res.data, function(file){
                            pictures.push(LIB.convertFileData(file))
                        });
                        _this.mainModel.vo.pictures = pictures;
                    }
                })
            },
            uploadClicked: function () {
                this.uploadModel.params.recordId = this.mainModel.vo.id;
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                this.mainModel.vo.pictures.push(LIB.convertFileData(con));
                LIB.globalLoader.hide();
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
            },
            removeFile: function (fileId, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: "确定删除文件？",
                    onOk: function () {
                        api.deleteFile(null, [fileId]).then(function () {
                            _this.mainModel.vo.pictures.splice(index, 1);
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
        events : {
        },
        init: function(){
            this.$api = api;
        }
    });

    return detail;
});