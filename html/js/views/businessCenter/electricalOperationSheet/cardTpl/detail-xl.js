define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
   
    
    var content = require("./dialog/content");
    var requireModel = require("./dialog/require");
    var approvalStep = require("./dialog/approvalStep");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var multiInputSelect = require("componentsEx/multiInputSelector/main");
    //初始化数据模型
    var newVO = function () {
        return {
            id : null,
            //唯一标识
            code : null,
            //操作票模板名称
            name : null,
            //所属公司id
            compId : LIB.user.compId,
            //所属部门id
            orgId : LIB.user.orgId,
            //是否分享 0:否,1:是
            isShare : '0',
            //工作内容
            content : null,
            //类型 1:一类,2:二类,3:三类
            type : null,
            //禁用标识 0:启用,1:禁用
            disable : "0",
            //工作地点及设备双重名称
            place : null,
            //备注
            remarks : null,
            //是否需要断电 0:否,1:是
            requireOutage : null,
            //工作的变、配电站名称
            substation : null,
            //安全措施/工作条件/操作项目
            ewCardItems : [],
            attr1:null, // 操作任务
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
        baseRules:{
            "code" : [LIB.formRuleMgr.require("唯一标识"),
                LIB.formRuleMgr.length(100)
            ],
            "name" : [LIB.formRuleMgr.require("操作票模板名称"),
                LIB.formRuleMgr.length(200)
            ],
            "compId" : [LIB.formRuleMgr.require("所属公司")],
            "orgId" : [LIB.formRuleMgr.require("所属部门"),
                LIB.formRuleMgr.length(10)
            ],
            "isShare" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否分享")),
            "content" : [LIB.formRuleMgr.require("工作内容"),
                LIB.formRuleMgr.length(200)
            ],
            "attr1":  [LIB.formRuleMgr.require("工作内容"),
                LIB.formRuleMgr.length(200)
            ],
            "type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("类型")),
            "disable" :LIB.formRuleMgr.require("状态"),
            "place" : [LIB.formRuleMgr.length(200), LIB.formRuleMgr.require("")],
            "remarks" : [LIB.formRuleMgr.length(500)],
            "requireOutage" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
            "substation" : [LIB.formRuleMgr.length(200),LIB.formRuleMgr.require("")],
        },
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            //验证规则
            rules:{
                "code" : [LIB.formRuleMgr.require("唯一标识"),
                    LIB.formRuleMgr.length(100)
                ],
                "name" : [LIB.formRuleMgr.require("操作票模板名称"),
                    LIB.formRuleMgr.length(200)
                ],
                "compId" : [LIB.formRuleMgr.require("所属公司")],
                "orgId" : [LIB.formRuleMgr.require("所属部门"),
                    LIB.formRuleMgr.length(10)
                ],
                "isShare" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否分享")),
                "content" : [LIB.formRuleMgr.require("工作内容"),
                    LIB.formRuleMgr.length(200)
                ],
                "attr1":  [LIB.formRuleMgr.require("工作内容"),
                    LIB.formRuleMgr.length(200)
                ],
                "type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("类型")),
                "disable" :LIB.formRuleMgr.require("状态"),
                "place" : [LIB.formRuleMgr.length(200), LIB.formRuleMgr.require("")],
                "remarks" : [LIB.formRuleMgr.length(500)],
                "requireOutage" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "substation" : [LIB.formRuleMgr.length(200),LIB.formRuleMgr.require("")],
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
            seventhLists: []
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
                title: "",
                fieldType: "tool",
                toolType: "move,edit,del",
                visible: true
            }
        ],
        secondColumns: [
            {
                title: "安全措施",
                fieldName: "content",
                keywordFilterName: "criteria.strValue.keyWordValue_content",
                renderClass: 'textarea-autoheight'
            },
            // {
            //     title : "风险及控制措施",
            //     fieldName : "risk",
            //     keywordFilterName: "criteria.strValue.keyWordValue_risk",
            //     renderClass: 'textarea-autoheight'
            // },
            // {
            //     title : "控制措施",
            //     fieldName : "ctrlMethod",
            //     keywordFilterName: "criteria.strValue.keyWordValue_ctrl_method",
            //     renderClass: 'textarea-autoheight'
            // },
            {
                title: "",
                fieldType: "tool",
                toolType: "move,edit,del"
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
        doShowOptBtn: true
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
        props: ['cardType','isShare'],
        components: {
           
            'content': content,
            'require': requireModel,
            'approvalStep':approvalStep,
            "userSelectModal": userSelectModal,
            'multiInputSelect':multiInputSelect
        },
        computed: {
            // isStatusRight: function () {
            //     if (this.mainModel.vo.status === '0') {
            //         this.tableModel.opCraftsProcessTableModel.columns[2].visible = true;
            //     } else {
            //         this.tableModel.opCraftsProcessTableModel.columns[2].visible = false;
            //     }
            //     this.$refs.opcraftsprocessTable.refreshColumns();
            //     return this.mainModel.vo.status === '0';
            // },
            shareIconStyle: function () {
                return {
                    "backgroundColor": this.mainModel.vo.isShare == '1' ? 'green':'#999'
                }
            },
            shareIconTitle: function () {
                return this.mainModel.vo.isShare == '1' ? '已分享' : '未分享';
            },
            showAuditButton: function () {
                var baseAuth = this.mainModel.isReadOnly && this.mainModel.vo.status === '1' && this.hasAuth('audit');
                if (!this.enableProcess) {
                    return baseAuth
                } else {
                    return baseAuth && this.hasProcessRecord;
                }
            }
        },
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            doPreview: function () {
                this.$emit("do-preview", { id: this.mainModel.vo.id, bizType: this.mainModel.vo.bizType });
            },
            doEnableDisable: function() {
                var _this = this;
                var data = _this.mainModel.vo;
                var params = {
                    id: data.id,
                    orgId: data.orgId,
                    disable: data.disable === "0" ? "1" : "0",
                    isShare: data.disable === "0"?'0':data.isShare
                };
                if(this.$api.updateDisable) {
                    this.$api.updateDisable(null,  params).then(function (res) {
                        data.disable = (data.disable === "0") ? "1" : "0";
                        LIB.Msg.info((data.disable === "0") ? "启用成功" : "停用成功");
                        if(params.disable == '1') data.isShare = '0';
                        _this.$dispatch("ev_dtUpdate");
                    });
                } else {
                    this.$api.update(null,  params).then(function (res) {
                        data.disable = (data.disable === "0") ? "1" : "0";
                        LIB.Msg.info((data.disable === "0") ? "启用成功" : "停用成功");
                        if(params.disable == '1') data.isShare = '0';
                        _this.$dispatch("ev_dtUpdate");
                    });
                }
            },
            doPreview: function () {
                this.$emit("do-preview", { id: this.mainModel.vo.id, bizType: this.mainModel.vo.bizType });
            },
            userModel: function () {
                this.$emit("do-user-model");
            },
            doCheckCard: function () {

            },
            doShowSelectUserModal: function (item, type) {
                this.handlingRole = item;
                this.userSelectModel.signal = item == 'signal'?true: false;
                this.userSelectModel.type = type;
                this.userSelectModel.show = true;
            },

            doSaveSelect: function (datas) {
                if(this.userSelectModel.signal){
                    var data = datas[0];
                }else{
                    var data = datas;
                }
                this.mainModel.vo[this.userSelectModel.type] = _.map(data, function (item) {
                    return {id: item.id, type:1, name:item.name}
                });
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
                    cardTplId : dataModel.mainModel.vo.id
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                api.moveEwWorkItems({id : this.mainModel.vo.id}, param).then(function() {
                    _this.getItemList();
                });
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
                })
            },

            checkboxClick: function () {
                this.doSave();
            },

            afterInit: function () {
                this.tableLists.secondLists = [];
                this.tableLists.firstLists = [];
                this.tableLists.thirdLists = [];
                this.tableLists.forthLists = [];
                this.tableLists.fifthLists = [];
                this.tableLists.sixthLists = [];
                this.mainModel.vo = new newVO();
                this.mainModel.vo.type = this.cardType;

            },
            upDateColumns: function () {
                var obj = _.find(this.firstColumns, function (item) {
                    return item.fieldType == 'tool'
                });

                if(this.isShare) {
                    obj.visible = false;
                }else{
                    obj.visible = true;
                }

                if(this.mainModel.vo.type == '1'){
                    this.$refs.firstList.refreshColumns();
                    this.$refs.secondList.refreshColumns();
                    this.$refs.thirdList.refreshColumns();
                    this.$refs.seventhList.refreshColumns();
                    // this.$refs.eighthList.refreshColumns();
                }else if(this.mainModel.vo.type == '2'){
                    this.$refs.forthList.refreshColumns();
                    this.$refs.fifthList.refreshColumns();
                    // this.$refs.eighthList.refreshColumns();
                }else if(this.mainModel.vo.type == '3'){
                    this.$refs.sixthList.refreshColumns();
                }
            },

            afterInitData: function () {
                  this.getItemList();
                  this.upDateColumns();

                if(this.mainModel.action == 'copy'){
                    this.mainModel.vo.compId = LIB.user.compId;
                    this.mainModel.vo.orgId = LIB.user.orgId;
                }
            },
            doSubmit: function () {
                var _this = this;
                this.beforeDoSave();
                api.submitEwworkcard(null, this.mainModel.vo).then(function (res) {
                })
            },
            // doShare: function () {
            //     var _this = this;
            //     var _vo = _.cloneDeep( this.mainModel.vo);
            //     _vo.isShare = _vo.isShare=='1'?'0':'1';
            //     _this.$api.update(_vo).then(function(res) {
            //         LIB.Msg.info("保存成功");
            //         _this.mainModel.vo.isShare = _vo.isShare;
            //         _this.$dispatch("ev_dtUpdate");
            //     });
            // },

            doShare: function() {
                if (!this.hasAuth('share')) {
                    return LIB.Msg.warning("权限不足");
                }
                var _this = this;
                var data = _this.mainModel.vo;
                if (data.disable === '1') {
                    return LIB.Msg.warning("未启用的操作票不能进行分享操作");
                }
                var _vo = _.cloneDeep( this.mainModel.vo);
                    _vo.isShare = _vo.isShare=='1'?'0':'1';
                _this.$api.update(_vo).then(function (res) {
                    _this.mainModel.vo.isShare = _vo.isShare;
                    LIB.Msg.info((_this.mainModel.vo.isShare === "0") ? "未分享" : "已分享");
                    _this.$dispatch("ev_dtUpdate");
                });
            },

            beforeDoSave: function () {
                if(!this.mainModel.vo.type) this.mainModel.vo.type = this.cardType;
            },

            doSave4Copy: function() {
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

                        if (_data.vo.id != null) {
                            _this.$api.create4copy({id : _data.vo.id}, _vo).then(function(res) {

                                LIB.Msg.info("保存成功");
                                _data.vo.id = res.data.id;

                                //刷新主表数据
                                // _this.init("view", _data.vo.id, res.data);
                                _this.$dispatch("ev_dtCreate");
                                _this.doClose();
                                var router = LIB.ctxPath("/html/main.html#!");
                                var routerPart="/electricalOperation/businessCenter/cardTpl?method=detail&code="+res.data.code+"&id="+_data.vo.id;
                                window.open(router + routerPart);
                            });
                        } else {
                            LIB.Msg.error("缺少复制对象");
                        }
                    }
                });
            },

            doSave: function() {
                if(this.mainModel.action === "copy") {
                    this.doSave4Copy();
                    return;
                }
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