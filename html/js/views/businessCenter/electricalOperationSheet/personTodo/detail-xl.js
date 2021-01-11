define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
   
    
    var content = require("./dialog/content");
    var requireModel = require("./dialog/require");
    var approvalStep = require("./dialog/approvalStep");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var userFormModal = require('./dialog/outUserFormModal');
    var multiInputSelect = require("componentsEx/multiInputSelector/main");

    var myImageView = require("./dialog/myImageView")
    LIB.registerDataDic("iew_work_card_out_inline", [
        ["1","内部"],
        ["2","外部"]
    ]);
    //初始化数据模型
    var newVO = function () {
        return {
            attr2: null,
            attr4: null, // 部门
            attr3: null, //
            dept: null,
            supervisor: null,
            attr4Obj: null,
            attr1:null,
            id : null,
            //唯一标识
            code : null,
            //所属公司id
            compId : LIB.user.compId,
            //所属部门id
            orgId : null,
            //类型 1:一类,2:二类,3:三类
            type : null,
            //禁用标识 0:启用,1:禁用
            disable : "0",
            //工作内容
            content : null,
            //未拆除或未拉开的接地线编号
            groundLeadNumber : null,
            //未拆除或未拉开的接地线组数
            groundLeadQuantity : null,
            //未拆除或未拉开的接地刀闸数量
            groundSwitchQuantity : null,
            //通知站场人员方式 1:线下,2:线上
            noticeMode : null,
            //通知时间
            noticeTime : null,
            //工作地点及设备双重名称
            place : null,
            //计划结束时间
            planEndTime : null,
            //计划开始时间
            planStartTime : null,
            //实际结束时间
            realEndTime : null,
            //实际开始时间
            realStartTime : null,
            //备注
            remarks : null,
            //是否需要断电 0:否,1:是
            requireOutage : null,
            //签发意见
            signOpinion : null,
            //签发结果 0:未签发,1:通过,2:不通过
            signResult : null,
            //签发时间
            signTime : null,
            //状态 0:待提交,1:待签发,2:待移交,3:待核对,4:待开工,5:作业中,6:待关闭,7:已关闭
            status : '0',
            //工作的变、配电站名称
            substation : null,
            //班组
            workTeam : null,
            //工作负责人
            user : {id:LIB.user.id, name:LIB.user.name},
            //电气票模板
            ewCardTpl : {id:'', name:''},
            //工作票延期
            ewWorkDelays : [],
            //待办
            ewWorkTodos : [],
            //开工时间记录
            ewWorkRecords : [],
            //安全措施/工作条件/操作项目
            ewWorkItems : [],
            //工作负责人变动
            ewPrincipalChanges : [],
            //工作人员变动
            ewWorkerChanges : [],
            //人脸签名
            ewFaceSignatures : [],
            //附件
            cloudFiles : [],
            //工作班成员
            ewWorkers : [],
            ewWorkers1:[],
            ewWorkers2:[],
            //电气票
            ewWorkCards : [],
            operator: null,
            signer: {name: null, id: null}
        }
    };

    var processColumns = [
        {
            title: "审批节点名称",
            fieldName: "auditProcessName"
        },
        {
            title: "审批人",
            fieldName: "auditorName"
        },
        {
            title: "审批结果",
            render: function (data) {
                var m = {
                    "1": "通过",
                    "2": "退回",
                    "0": "待审批"
                };

                return m[data.result] || "";
            }
        },
        {
            title: "审批意见",
            fieldName: "remark"
        },
        {
            title: "审批时间",
            fieldName: "auditDate"
        }
    ];

    //Vue数据
    var dataModel = {
        filterData:null,
        tableIndex:'1',
        mainModel: {
            orgType: '1', // 1 内部   2 外部
            attr3Type: '1', // 1 内部   2 外部
            beforeEditVo:{},
            firstCard:null,
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            //验证规则
            rules:{
                "attr3": [LIB.formRuleMgr.require("工作负责人(监护人)")],
                "attr4": [LIB.formRuleMgr.require("单位")],
                "attr1": [LIB.formRuleMgr.require("操作任务")],
                "code" : [LIB.formRuleMgr.require("唯一标识"),
                    LIB.formRuleMgr.length(100)
                ],
                "compId" : [LIB.formRuleMgr.require("所属公司")],
                "orgId" : [LIB.formRuleMgr.require("操作票作业地点"),
                    LIB.formRuleMgr.length(100)
                ],
                "ewWorkers2": [
                    {
                        validator: function (rule, value, callback) {
                            //
                            if(dataModel.mainModel.vo.ewWorkers2.length==0 && dataModel.mainModel.vo.ewWorkers1.length==0){
                                return callback(new Error('请填写工作班成员'));
                            }
                            return callback()
                        }
                    }
                ],"ewWorkers1": [
                    {
                        validator: function (rule, value, callback) {
                            //
                            if(dataModel.mainModel.vo.ewWorkers2.length==0 && dataModel.mainModel.vo.ewWorkers1.length==0){
                                return callback(new Error('请填写工作班成员'));
                            }
                            return callback()
                        }
                    }
                ],

                "type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("类型")),
                "disable" :LIB.formRuleMgr.require("状态"),
                "content" : [LIB.formRuleMgr.length(200), (LIB.formRuleMgr.require("工作任务 - 工作内容"))],
                "groundLeadNumber" : [LIB.formRuleMgr.length(100)],
                "groundLeadQuantity" : [LIB.formRuleMgr.length(100)],
                "groundSwitchQuantity" : [LIB.formRuleMgr.length(100)],
                "noticeMode" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "noticeTime" : [LIB.formRuleMgr.allowStrEmpty],
                "place" : [LIB.formRuleMgr.length(200),(LIB.formRuleMgr.require("工作任务 - 工作地点及设备双重名称"))],
                'planEndTime': [{
                    required: true,
                    message: '计划结束时间'
                }, {
                    validator: function (rule, val, callback) {
                        var vo = dataModel.mainModel.vo;
                        if (new Date(vo.planStartTime).getTime() >= new Date(vo.planEndTime).getTime() ) {
                            callback(new Error("结束检查时间应大于开始检查时间"))
                        } else {
                            callback()
                        }
                    }
                }],
                "planStartTime" : (LIB.formRuleMgr.require("计划开始时间")),
                "realEndTime" : (LIB.formRuleMgr.require("计划结束时间")),
                "realStartTime" : [LIB.formRuleMgr.allowStrEmpty],
                "remarks" : [LIB.formRuleMgr.length(500)],
                "requireOutage" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "signOpinion" : [LIB.formRuleMgr.length(255)],
                "signResult" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "signTime" : [LIB.formRuleMgr.allowStrEmpty],
                "status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "substation" : [LIB.formRuleMgr.length(200), (LIB.formRuleMgr.require("工作的变、配电站名称及设备名称"))],
                "workTeam" : [LIB.formRuleMgr.length(200), (LIB.formRuleMgr.require("班组"))],
                "user.id" : [LIB.formRuleMgr.allowStrEmpty],
                "ewCardTpl.id" : [LIB.formRuleMgr.allowStrEmpty],
            },
            emptyRules: {}
        },
        tableLists: {
            firstLists: [],
            secondLists: [],
            thirdLists: [],
            forthLists: [],
            fifthLists: [],
            sixthLists: [],
            seventhLists: [],
            eighthLists:[]
        },
        firstColumns: [
            {
                title: "序号",
                fieldType: "sequence",
                width: 70,
            },
            {
                title: "安全措施",
                fieldName: "content",
                keywordFilterName: "criteria.strValue.keyWordValue_content",
                renderClass: 'textarea-autoheight'
            },
            {
                title: '执行情况',
                fieldName: 'result',
                visible: true,
                render: function (data) {
                    if(data.result == '1') return '<i class="ivu-icon ivu-icon-ios-checkmark-outline" style="font-size:18px;margin-right: 5px ;color: orange;"></i>已执行';
                    else return '未执行'
                },

                width:100
            },
            {
                title: "",
                fieldType: "tool",
                toolType: "move,edit,del"
            }
        ],
        secondColumns: [
            {
                title: "序号",
                fieldType: "sequence",
                width: 70,
            },
            {
                title: "安全措施",
                fieldName: "content",
                keywordFilterName: "criteria.strValue.keyWordValue_content",
                renderClass: 'textarea-autoheight'
            },
            {
                title: '执行情况',
                fieldName: 'result',
                visible: true,
                render: function (data) {
                    if(data.result == '1') return '<i class="ivu-icon ivu-icon-ios-checkmark-outline" style="font-size:18px;margin-right: 5px ;color: orange;"></i>已执行';
                    else return '未执行'
                },
                width:100
            },
            {
                title: "",
                fieldType: "tool",
                toolType: ""
            }
        ],
        formModel: {
            stepFormModel: {
                show: false,
                hiddenFields: ["cardId"],
                queryUrl: "opstdcard/{id}/opstdstep/{opStdStepId}"
            },
            stepItemFormModel: {
                show: false,
                hiddenFields: ["cardId"],
                queryUrl: "opstdstep/{id}/opstdstepitem/{opstdstepitemId}"
            },
            opCraftsProcessFormModel: {
                show: false,
                hiddenFields: ["relId"],
                queryUrl: "opstdcard/{id}/opcraftsprocess/{opCraftsProcessId}"
            },
        },
        TypeTableModel: LIB.Opts.extendMainTableOpt(
            {
                url: "",
                selectedDatas: [],
                columns: [
                    LIB.tableMgr.column.cb,
                    {
                        title: "工作的变、配电站名称及设备名称",
                        // fieldName: "content",
                        filterType: "text",
                        width: 250
                    },
                    {
                        title: "工作任务 - 工作地点及设备双重名称",
                        // fieldName: "content",
                        filterType: "text",
                        width: 280
                    },
                    {
                        title: "工作任务 - 工作内容",
                        // fieldName: "content",
                        filterType: "text",
                        width: 180
                    },

                    _.extend(_.clone(LIB.tableMgr.column.company), { width: 150 }),
                    LIB.tableMgr.column.dept,


                ],

            }
        ),
        tableModel: {
            opCraftsProcessTableModel: LIB.Opts.extendDetailTableOpt({
                url: "optask/opcraftsprocesses/list/{curPage}/{pageSize}",
                columns: [
                    {
                        title: '',
                        fieldType: "sequence",
                        width: 40
                    },
                    {
                        title: "工艺流程内容",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "move,edit,del"
                    }],
                defaultFilterValue: { "criteria.orderValue": { fieldName: "orderNo", orderType: "0" } }
            }),
        },
        selectType: {
            show: false
        },
        userSelectModel:{
            show:false,
            signal: false
        },
        cardModel: {
            stepCardModel: {
                showContent: true
            },
            processCardModel: {
                showContent: true
            }
        },
        selectModel: {
        },
        auditObj: {
            visible: false
        },
        auditProcessModel: {
            visible: false,
            columns: processColumns,
            values: null
        },
        contentModel: {
            show: false
        },
        require: {
            show: false
        },
        transform:{
            show:false
        },
        approval:{
            show:false
        },
        groups: null,
        fileModel: {
            default: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'W2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                        fileType: 'W'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                    }
                },
                data: []
            }
        },
        documentModal: {
            visible: false
        },
        enableProcess: false,
        hasProcessRecord: false,
        activeTabName: '1',
        checkedProcessEnable: false,
        userFormModel: {
            show: false
        },
        tableKey: 'signTab',
        users: [],
        userDeptModel: {
            show: false,
            users: [],
            rules: {
                "id" : [LIB.formRuleMgr.require("唯一标识")],
            }
        },
        fileList:[],
        doShowOptBtn: {
            val1: true,
            val2: true,
            val3: true
        },
        updateTab: false,
        byTpl: false
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
        props: ['cardType', 'isHistory'],
        components: {
           'userFormModal':userFormModal,
            'content': content,
            'require': requireModel,
            'approvalStep':approvalStep,
            "userSelectModal": userSelectModal,
            'multiInputSelect':multiInputSelect,
            'myImageView': myImageView
        },
        computed: {
            shareIconStyle: function () {
                return {
                    "backgroundColor": this.mainModel.vo.isShare === '0' ? '#999' : 'green'
                }
            },
            isStatusRight: function () {
                if (this.mainModel.vo.status === '0') {
                    this.tableModel.opCraftsProcessTableModel.columns[2].visible = true;
                } else {
                    this.tableModel.opCraftsProcessTableModel.columns[2].visible = false;
                }
                this.$refs.opcraftsprocessTable.refreshColumns();
                return this.mainModel.vo.status === '0';
            },
            shareIconStyle: function () {
                return {
                    "backgroundColor": this.mainModel.vo.isShare === '0' ? '#999' : 'green'
                }
            },
            shareIconTitle: function () {
                return this.mainModel.vo.isShare === '0' ? '未分享' : '已分享';
            },
            showAuditButton: function () {
                var baseAuth = this.mainModel.isReadOnly && this.mainModel.vo.status === '1' && this.hasAuth('audit');
                if (!this.enableProcess) {
                    return baseAuth
                } else {
                    return baseAuth && this.hasProcessRecord;
                }
            },
            getShowBtn: function () {
                if(this.mainModel.isReadOnly){
                    return true;
                }else{
                    return !this.doShowOptBtn.val3
                }
            },
            showPanelMask: function () {
                return this.mainModel.opType === 'create' || (this.mainModel.opType === 'update' && this.mainModel.action === 'copy') || this.byTpl;
            },
        },
        data: function () {
            return dataModel;
        },
        watch: {
          "mainModel.vo.id": function (val) {
              // if(val){
              //     var _this = this;
              //     this.updateTab = false;
              //     this.$nextTick(function () {
              //         _this.updateTab = true;
              //     })
              // }
          }
        },
        methods: {
            newVO: newVO,
            doChangeSelect: function (str) {
                if(str == 'attr3' && this.mainModel.attr3Type == '2'){
                    this.mainModel.vo[str] = null;
                    this.mainModel.vo.supervisor = {id: null, name: null};
                }
                if(str == 'attr4' && this.mainModel.orgType == '2'){
                    this.mainModel.vo[str] = null;
                }
            },
            doSubmit1: function () {
                var _this = this;
                LIB.Modal.confirm({ title: '确定提交?',
                    onOk: function () {
                        _this.doSubmit()
                    }
                })
            },
            getLargeCount :function(val) {
                return parseInt(this.mainModel.vo.status) >= parseInt(val);
            },
            getArrayItemsLists: function (arr1, type, dataType) {
                var arr = [];
                // var temp = _.filter(arr1, function (item) {
                //     return item.type == type;
                // }) || [];
                var temp = arr1 || [];
                for(var i=0; i<temp.length; i++){
                    arr = arr.concat(this.getItemFileLists(temp[i], dataType))
                }
                return arr;
            },
            getItemFileLists: function (data, type) {
                var arr = [];
                if(arr.length == 0 && data.cloudFiles && data.cloudFiles.length>0) {
                    arr = _.filter(data.cloudFiles, function (item) {
                        return item.dataType == type;
                    }) || [];
                }
                if(arr.length == 0 && data.ewFaceSignatures && data.ewFaceSignatures.length>0){
                    arr = _.filter(data.ewFaceSignatures, function (item) {
                        return item.dataType == type;
                    });
                }
                return arr;
            },
            getFileLists: function (data, type) {
                var arr = [];
                arr = _.filter(data, function (item) {
                    return item.dataType == type;
                }) || [];
                if(arr.length == 0 && this.mainModel.vo.ewFaceSignatures && this.mainModel.vo.ewFaceSignatures.length>0){
                    arr = _.filter(this.mainModel.vo.ewFaceSignatures, function (item) {
                        return item.dataType == type;
                    });
                }
                return arr;
            },
            doShowDeptUserModal: function() {
                this.userDeptModel.users = {id:null, name: null}
                this.userDeptModel.show = true;
            },
            doSaveDeptUser: function (datas) {
                this.userDeptModel.users = {id: datas[0].id, name: datas[0].name};
            },
            doPreview: function () {
                this.$emit("do-preview", { id: this.mainModel.vo.id, bizType: this.mainModel.vo.bizType });
            },
            userModel: function () {
                this.cardType = this.mainModel.vo.type;
                var _this = this;
                this.$nextTick(function () {
                    _this.$emit("do-user-model");
                })
            },
            doCheckCard: function () {

            },
            doSaveOutUser: function (arr) {
                var _this = this;
                _.each(arr, function (item) {
                    var obj = _.find(_this.mainModel.vo.ewWorkers2 || [], function (worker) {
                        return worker.name == item.name;
                    });
                    if(!obj) _this.mainModel.vo.ewWorkers2.push(item)
                })
            },
            doShowSelectUserFormModal: function () {
                  this.userFormModel.show = true;
            },

            doShowSelectUserModal: function (item, type) {
                this.handlingRole = item;
                this.userSelectModel.signal = item == 'signal'?true: false;
                this.userSelectModel.type = type;

                if(type == 'supervisor'){
                    this.filterData = { "criteria.strsValue": JSON.stringify({excludeIds:_.pluck(this.mainModel.vo.ewWorkers1, "user.id")||[]})};
                }
                else if(type == 'ewWorkers1' && this.mainModel.attr3Type=='1'){
                    this.filterData = { "criteria.strsValue": JSON.stringify({excludeIds:[this.mainModel.vo.supervisor && this.mainModel.vo.supervisor.id] || []})};
                }
                else this.filterData = {}
                this.userSelectModel.show = true;
            },

            doSaveSelect: function (datas) {
                if(this.userSelectModel.signal) {
                    var data = datas[0];
                }else {
                    var data = datas;
                }

                if(this.userSelectModel.type == 'supervisor'){
                    this.mainModel.vo[this.userSelectModel.type] = data;
                }else{
                    this.mainModel.vo[this.userSelectModel.type] = _.map(data, function (item) {
                        return {type:1, user:{name: item.name, id: item.id}, name: item.name}
                    });
                }
            },

            doShowUpdateContent: function (item) {
                this.doShowContent(item.entry.data.type, item.entry.data);
            },
            doRemoveContent: function (item) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.delEwworkitem({id: _this.mainModel.vo.id},[{id: item.entry.data.id}]).then(function () {
                            LIB.Msg.success("删除成功");
                            _this.getItemList()
                        });
                    }
                });
            },
            doMoveEwWorkItem : function(item) {
                var _this = this;
                var data = item.entry.data;
                var param = {
                    id : data.id,
                    type:data.type,
                    workCardId : dataModel.mainModel.vo.id
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                api.moveEwWorkItems({id : this.mainModel.vo.id}, param).then(function() {
                    _this.getItemList();
                });
            },

            doRefreshTable: function () {
                var arr =['firthList', 'secondList', 'thirdList', 'forthList', 'fifthList', 'sixthList', 'seventhList', 'eighthList'];
                // this.$refs.ewworkitemTable.doRefresh();
                // for(var i=0; i<arr.length; i++){
                //     if(this.$refs[arr[i]]){
                //         this.$refs[arr[i]].doRefresh();
                //     }
                // }
            },

            doShowContent: function (val, obj) {
                var temp = {ewWorkCard: {id: this.mainModel.vo.id}, type: val}
                this.$refs.content.init(temp, obj);
                this.contentModel.show=true
            },

            doSaveContent: function (obj) {
                var _this = this;
                if(obj.id){
                    api.updateEwworkitem({id: this.mainModel.vo.id},obj).then(function (res) {
                        LIB.Msg.info('保存成功');
                        _this.getItemList()
                    })
                }else{
                    api.createEwworkitem({id: this.mainModel.vo.id}, obj).then(function (res) {
                        LIB.Msg.info('保存成功');
                        _this.getItemList()
                    })
                }
            },

            getItemList: function () {
                var _this = this;
                api.queryEwworkitem({id: this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.ewWorkItems = res.data.list;
                    _this.tableLists.firstLists = _.filter(res.data.list,function (item) {
                        return item.type == '1'
                    });
                    _this.tableLists.secondLists = _.filter(res.data.list,function (item) {
                        return item.type == '2'
                    });
                    _this.tableLists.thirdLists = _.filter(res.data.list,function (item) {
                        return item.type == '3'
                    });
                    _this.tableLists.forthLists = _.filter(res.data.list,function (item) {
                        return item.type == '4'
                    });
                    _this.tableLists.fifthLists = _.filter(res.data.list,function (item) {
                        return item.type == '5'
                    });
                    _this.tableLists.sixthLists = _.filter(res.data.list,function (item) {
                        return item.type == '6'
                    });
                    _this.tableLists.seventhLists = _.filter(res.data.list,function (item) {
                        return item.type == '7'
                    });
                    _this.tableLists.eighthLists = _.filter(res.data.list,function (item) {
                        return item.type == '8'
                    });
                })
            },

            afterInit: function () {
                this.tableLists.secondLists = [];
                this.tableLists.firstLists = [];
                this.tableLists.thirdLists = [];
                this.tableLists.forthLists = [];
                this.tableLists.fifthLists = [];
                this.tableLists.sixthLists = [];
                this.tableLists.seventhLists = [];
                this.tableLists.eighthLists = [];
                this.fileList = [];
                this.tableIndex = '1';
                this.mainModel.attr3Type = '1';
                this.mainModel.orgType = '1';
                this.mainModel.vo.dept =null,
                this.mainModel.vo.supervisor =null,
                this.byTpl = false;
                this.mainModel.vo = new newVO();
                this.mainModel.vo.type = this.cardType;
                if(this.mainModel.opType == 'create') this.updateTab = true;

                this.upDateColumns();
            },
            initWorkers: function () {
                // this.mainModel.vo.ewWorkers = [].concat(this.mainModel.vo.ewWorkers1).concat(this.mainModel.vo.ewWorkers2)
                this.mainModel.vo.ewWorkers1 = [];
                this.mainModel.vo.ewWorkers2 = [];
                if(this.mainModel.vo.ewWorkers){
                    this.mainModel.vo.ewWorkers2= _.filter(this.mainModel.vo.ewWorkers, 'type', '2');
                    this.mainModel.vo.ewWorkers1= _.map(_.filter(this.mainModel.vo.ewWorkers, 'type', '1'), function (item) {
                        return {id: item.id, name: item.user.name, user:item.user, type:1}
                    });
                }
            },
            afterInitFileData: function (data) {
                this.fileList = data;
            },
            doClose: function() {
                this.updateTab = false;
                this.$dispatch("ev_dtClose");

            },
            initInfo: function () {
                if(this.mainModel.vo.dept) this.mainModel.orgType = '1';
                else this.mainModel.orgType = '2';

                if(this.mainModel.vo.supervisor) this.mainModel.attr3Type = '1';
                else this.mainModel.attr3Type = '2';
            },
            afterInitData: function () {
                // this.$refs.tabs.currentName = '1';
                this.updateTab = true;
                this.initInfo();
                this.initWorkers();
                this.upDateColumns();
                this.getItemList();
            },
            checkboxClick: function () {
                  this.doSave();
            },
            upDateColumns: function () {
                var _this = this;
                var obj = _.find(this.firstColumns, function (item) {
                    return item.fieldType == 'tool'
                });
                var result = _.find(this.firstColumns, function (item) {
                    return item.fieldName=='result'
                });
                result.visible = false;
                if(this.mainModel.vo.status=='0'){
                    this.doShowOptBtn.val1 = true;
                    this.doShowOptBtn.val2 = true;
                    this.doShowOptBtn.val3 = true;
                    obj.toolType = "move,edit,del"
                }else if(this.mainModel.vo.status=='1'){
                    this.doShowOptBtn.val1 = true;
                    this.doShowOptBtn.val2 = true;
                    this.doShowOptBtn.val3 = false;
                    obj.toolType = "move,edit,del"
                }else if(this.mainModel.vo.status=='2'){
                    this.doShowOptBtn.val1 = true;
                    this.doShowOptBtn.val2 = false;
                    this.doShowOptBtn.val3 = true;

                    obj.toolType = ""
                }else if(this.mainModel.vo.status == '3'){
                    this.doShowOptBtn.val1 = false;
                    this.doShowOptBtn.val2 = false;
                    this.doShowOptBtn.val3 = false;
                    result.visible = false;
                    obj.toolType = "";
                } else{
                    this.doShowOptBtn.val1 = false;
                    this.doShowOptBtn.val2 = false;
                    this.doShowOptBtn.val3 = false;
                    result.visible = true;
                    obj.toolType = "";
                }

                if(this.isHistory) {
                    this.doShowOptBtn.val1 = false;
                    this.doShowOptBtn.val2 = false;
                    // result.visible = true;
                    obj.toolType = "";
                }

                // if(this.mainModel.vo.status>2) result.visible = true;
                // else result.visible = false;
                //
                // if(this.mainModel.vo.status>0) obj.toolType = "";
                // else obj.toolType = "move,edit,del";

                var arr = ['firstList', 'secondList','thirdList','seventhList','eighthList','forthList','fifthList', 'sixthList'];
                _.each(arr, function (item) {
                    if(_this.$refs[item]){
                        _this.$refs[item].refreshColumns();
                    }
                });

                // if(this.mainModel.vo.type == '1'){
                //     this.$refs.firstList.refreshColumns();
                //     this.$refs.secondList.refreshColumns();
                //     this.$refs.thirdList.refreshColumns();
                //     this.$refs.seventhList.refreshColumns();
                //     this.$refs.eighthList.refreshColumns();
                // }else if(this.mainModel.vo.type == '2'){
                //     this.$refs.forthList.refreshColumns();
                //     this.$refs.fifthList.refreshColumns();
                //     this.$refs.eighthList.refreshColumns();
                // }else if(this.mainModel.vo.type == '3'){
                //     this.$refs.sixthList.refreshColumns();
                // }
            },
            transformShow: function () {
                this.userDeptModel.users = []
                this.transform.show = true;
            },
            doSubmit: function () {
                var _this = this;
                this.beforeDoSave();
                api.submitEwworkcard(null, this.mainModel.vo).then(function (res) {
                    LIB.Msg.info("提交成功");
                    _this.$dispatch("ev_dtUpdate");
                    _this.doClose();
                })
            },
            beforeDoSave: function () {
                var _this = this;
                var arr = ['firstLists', 'secondLists', 'thirdLists', 'forthLists', 'fifthLists', 'sixthLists', 'seventhLists', 'eighthLists']  // _this.tableLists.thirdLists
                _this.mainModel.vo.ewWorkItems = [];
                _.each(arr, function (item) {
                    if(_this.tableLists[item]);
                    _this.mainModel.vo.ewWorkItems =_this.mainModel.vo.ewWorkItems.concat(_this.tableLists[item]);
                })
                if(this.mainModel.vo.ewCardTpl && !this.mainModel.vo.ewCardTpl.id){
                    delete this.mainModel.vo.ewCardTpl;
                }
                this.mainModel.vo.ewWorkers = [].concat(this.mainModel.vo.ewWorkers1).concat(this.mainModel.vo.ewWorkers2)
                if(!this.mainModel.vo.type) this.mainModel.vo.type = this.cardType;
                if(this.mainModel.attr3Type == '1'){this.mainModel.vo.attr3 =  this.mainModel.vo.supervisor?this.mainModel.vo.supervisor.id:null}

                if(this.mainModel.orgType != '1') this.mainModel.vo.dept = null;
                if(this.mainModel.attr3Type != '1') this.mainModel.vo.supervisor = null;
            },
            signEwworkcard: function (obj) {
                var _this = this;
                api.signEwworkcard(null, obj).then(function (res) {
                    _this.approval.show = false;
                    _this.$dispatch("ev_dtUpdate");
                    _this.doClose();
                });
            },
            handoverEwworkcard: function () {
                var _this = this;
                this.$refs.deptruleform.validate(function (valid) {
                    if(valid){
                        api.handoverEwworkcard(null, {operatorId:_this.userDeptModel.users.id, id:_this.mainModel.vo.id}).then(function (res) {
                            LIB.Msg.info(' 移交通知成功');
                            _this.$dispatch("ev_dtUpdate");
                            _this.transform.show = false;
                            _this.doClose();
                        });
                    }
                })
            },
            afterDoSave: function() {
                this.byTpl = false;
            },
            doSave: function() {
                if(this.mainModel.action === "copy") {
                    this.doSave4Copy();
                    return;
                }
                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if (this.beforeDoSave() === false) {
                    return;
                }

                var _this = this;
                var _data = this.mainModel;

                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        if (_this.afterFormValidate && !_this.afterFormValidate()) {
                            return;
                        }
                        var _vo = _this.buildSaveData() || _data.vo;
                        if (_data.vo.id == null || _this.mainModel.opType==='create') {
                            _this.$api.create(_vo).then(function(res) {
                                //清空数据
                                //_.deepExtend(_vo, _this.newVO());
                                //_this.opType = "view";
                                LIB.Msg.info("保存成功");
                                _data.vo.id = res.data.id;
                                if(_this.mainModel.dept){

                                }
                                _this._getResultCodeByRequest(res.data.id);
                                _this.afterDoSave({ type: "C" }, res.body);
                                if(_this.fileModel) {
                                    _.each(_this.fileModel,function (item) {
                                        item.cfg && item.cfg.params && (item.cfg.params.recordId = _data.vo.id);
                                    });
                                }
                                _this.changeView("view");
                                _this.$dispatch("ev_dtCreate");
                                _this.storeBeforeEditVo();
                            });
                        } else {
                            _vo = _this._checkEmptyValue(_vo);
                            _this.$api.update(_vo).then(function(res) {
                                LIB.Msg.info("保存成功");
                                _this.afterDoSave({ type: "U" }, res.body);
                                _this.changeView("view");
                                _this.$dispatch("ev_dtUpdate");
                                _this.storeBeforeEditVo();
                            });
                        }
                    } else {
                        //console.error('doSave error submit!!');
                    }
                });
            },
            getUUId: function () {
                var _vo = this.mainModel.vo;
                api.getUUID().then(function (res) {
                    _vo.id = res.data;
                });
            },
            afterDoCancel: function () {
                this.byTpl = false;
            },
            initByTpl: function (obj, type) {
                this.storeBeforeEditVo(); // 保存旧的
                this.byTpl = true;
                // this.mainModel.opType = type=='update'?'update':'create';
                // var tempVo = _.cloneDeep(this.mainModel.vo)
                // 区分新增还是更新
                if(type == 'update'){
                    this.mainModel.opType = "update";
                    // this.mainModel.vo.id = tempVo.id;
                    // this.mainModel.vo.ewWorkCards = tempVo.ewWorkCards;
                    // this.mainModel.vo.compId = tempVo.compId;
                    // this.mainModel.vo.user = {id: tempVo.user.id, name: tempVo.user.name};
                    // this.mainModel.vo.ewWorkers1 = tempVo.ewWorkers1;
                    // this.mainModel.vo.ewWorkers2 = tempVo.ewWorkers2;
                    // this.mainModel.vo.workTeam = tempVo.workTeam;
                    // this.mainModel.vo.planStartTime = tempVo.planStartTime;
                    // this.mainModel.vo.planEndTime = tempVo.planEndTime;
                }else{
                    this.getUUId();
                    this.mainModel.opType = 'create';
                    this.tableIndex = '1';
                    this.mainModel.vo = new newVO();
                    this.mainModel.vo.compId = LIB.user.compId;
                    this.mainModel.vo.user = {id: LIB.user.id, name: LIB.user.name}
                }
                _.extend(this.mainModel.vo, _.pick(obj, 'content', 'type', 'place', 'remarks', 'requireOutage', 'substation', 'ewCardItems', 'attr1'));
                this.mainModel.isReadOnly = false;
                this.mainModel.vo.ewCardTpl = {id: obj.id, name: obj.name};
                this.upDateColumns();
                this.deelContentList(obj.ewCardItems);
            },
            beforeInitByTpl: function (obj, type) {
                var _this = this;
                this.tableIndex = '1';
                api.queryEwcardtpl({id: obj.id}).then(function (res) {
                    _this.initByTpl(res.data, type);
                })
            },
            deelContentList: function (data) {
                var _this = this;
                var res = {data:{list: data}};
                _.each(res.data.list, function (item) {
                    delete item.id;
                });
                _this.tableLists.firstLists = _.filter(res.data.list,function (item) {
                    return item.type == '1'
                });
                _this.tableLists.secondLists = _.filter (res.data.list,function (item) {
                    return item.type == '2'
                });
                _this.tableLists.thirdLists = _.filter(res.data.list,function (item) {
                    return item.type == '3'
                });
                _this.tableLists.forthLists = _.filter(res.data.list,function (item) {
                    return item.type == '4'
                });
                _this.tableLists.fifthLists = _.filter(res.data.list,function (item) {
                    return item.type == '5'
                });
                _this.tableLists.sixthLists = _.filter(res.data.list,function (item) {
                    return item.type == '6'
                });
                _this.tableLists.seventhLists = _.filter(res.data.list,function (item) {
                    return item.type == '7'
                });
                _this.tableLists.eighthLists = _.filter(res.data.list,function (item) {
                    return item.type == '8'
                });
            },
            getNewTime: function (obj) {
                if(obj){
                    return (new Date(obj)).Format("yyyy-MM-dd hh:mm");
                } else {
                    return "";
                }
            },
        },

        //     doRemoveStepItems : function(item) {
        //         var _this = this;
        //         var data = item.entry.data;
        //         LIB.Modal.confirm({
        //             title: '删除当前数据?',
        //             onOk: function() {
        //                 api.removeOpStdStepItems({id : data.stepId}, [{id : data.id}]).then(function() {
        //                     _this._getItems();
        //                     LIB.Msg.success("删除成功");
        //                     _this._checkModifier();
        //                 });
        //             }
        //         });
        //     },

        events: {
            "ev_dtReload_init": function (obj, type) {
                this.beforeInitByTpl(obj, type)
            }
        },
        init: function () {
            this.$api = api;
        },
        created: function () {
            // this._checkProcessEnable();
        }
    });

    return detail;
});