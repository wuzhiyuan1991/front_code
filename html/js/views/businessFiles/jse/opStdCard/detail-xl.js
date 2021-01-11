define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var opStdStepFormModal = require("componentsEx/formModal/opStdStepFormModal");
    var opStdStepItemFormModal = require("componentsEx/formModal/opStdStepItemFormModal");
	var documentSelectModal = require("../documents/documentSelectModal");
	var auditFormModal = require("../../auditProcess/auditFormModal");
    var opCraftsProcessFormModal = require("componentsEx/formModal/opCraftsProcessFormModal");

    //初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//唯一标识
			code : null,
			//卡票名称
			name : null,
			//专业
			specialityType : null,
			//禁用标识 0未禁用，1已禁用
			disable : '1',
			//所属部门id
			orgId : null,
			//卡票类型 1:操作票,2:维检修作业卡,3:应急处置卡
			type : '1',
			//审核状态 0:待提交,1:待审核,2:已审核
			status : '0',
			//所属公司id
			compId : null,
			//审核时间（已审核状态独有）
			auditDate : null,
			// 审核人
            // auditorId: null,
			user: null,
			//检修内容/操作流程
			content : null,
			//备注
			remarks : null,
            contentModifyDate:null,
            contentModifyUser:null,
			isShare: '0',
            attr1: null
			//修改日期
			// modifyDate : null,
			// 修改人
			// createBy: null,
			//操作票操作步骤
			// opStdSteps : []
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
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
            //验证规则
            rules: {
                "attr1" : [
                    LIB.formRuleMgr.require("编码"),
                    LIB.formRuleMgr.length(50)
				],
                "name" : [
                    LIB.formRuleMgr.require("操作票名称"),
                    LIB.formRuleMgr.length(200)
                ],
                "content" : [
                    LIB.formRuleMgr.require("流程操作名称"),
                    LIB.formRuleMgr.length(200)
                ],
                "compId": [LIB.formRuleMgr.require("所属公司")],
                "orgId": [LIB.formRuleMgr.require("所属部门")],
                "remarks" : [LIB.formRuleMgr.length(500)]
            },
			emptyRules: {}
		},
		groupColumns : [
			{
				title : "操作内容",
				fieldName : "content",
				keywordFilterName: "criteria.strValue.keyWordValue_content",
				renderClass: 'textarea-autoheight'
			},
            {
                title : "风险及控制措施",
                fieldName : "risk",
                keywordFilterName: "criteria.strValue.keyWordValue_risk",
                renderClass: 'textarea-autoheight'
            },
            // {
            //     title : "控制措施",
            //     fieldName : "ctrlMethod",
            //     keywordFilterName: "criteria.strValue.keyWordValue_ctrl_method",
            //     renderClass: 'textarea-autoheight'
            // },
			{
				title : "",
				fieldType : "tool",
				toolType : "move,edit,del"
			}
		],
		formModel : {
			stepFormModel : {
				show : false,
				hiddenFields : ["cardId"],
				queryUrl : "opstdcard/{id}/opstdstep/{opStdStepId}"
			},
            stepItemFormModel: {
                show : false,
                hiddenFields : ["cardId"],
                queryUrl : "opstdstep/{id}/opstdstepitem/{opstdstepitemId}"
			},
            opCraftsProcessFormModel : {
                show : false,
                hiddenFields : ["relId"],
                queryUrl : "opstdcard/{id}/opcraftsprocess/{opCraftsProcessId}"
            },
		},
        tableModel : {
            opCraftsProcessTableModel : LIB.Opts.extendDetailTableOpt({
                url : "optask/opcraftsprocesses/list/{curPage}/{pageSize}",
                columns : [
                    {
                        title:'',
                        fieldType:"sequence",
                        width:40
                    },
                    {
                        title : "工艺流程内容",
                        fieldName : "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title : "",
                        fieldType : "tool",
                        toolType : "move,edit,del"
                    }],
                defaultFilterValue:{"criteria.orderValue": {fieldName: "orderNo", orderType: "0"}}
            }),
        },
		cardModel : {
			stepCardModel : {
				showContent : true
			},
            processCardModel : {
                showContent : true
            }
		},
		selectModel : {
		},
        auditObj: {
            visible: false
		},
        auditProcessModel: {
		    visible: false,
            columns: processColumns,
            values: null
        },
		groups: null,
		fileModel:{
			default : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'W2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'W'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					}
				},
				data : []
			}
		},
        documentModal: {
			visible: false
		},
        enableProcess: false,
        hasProcessRecord: false,
        activeTabName: '1',
        checkedProcessEnable: false
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"stepFormModal":opStdStepFormModal,
			"stepItemFormModal": opStdStepItemFormModal,
			"documentSelectModal": documentSelectModal,
			"auditFormModal": auditFormModal,
            "opcraftsprocessFormModal":opCraftsProcessFormModal,
        },
        computed: {
            isStatusRight: function () {
                if(this.mainModel.vo.status === '0'){
                    this.tableModel.opCraftsProcessTableModel.columns[2].visible = true;
                }else {
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
            }
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            doShowOpCraftsProcessFormModal4Update : function(param) {
                this.formModel.opCraftsProcessFormModel.show = true;
                this.$refs.opcraftsprocessFormModal.init("update", {id: this.mainModel.vo.id, opCraftsProcessId: param.entry.data.id});
            },
            doShowOpCraftsProcessFormModal4Create : function(param) {
                this.formModel.opCraftsProcessFormModel.show = true;
                this.$refs.opcraftsprocessFormModal.init("create");
            },
            doSaveOpCraftsProcess : function(data) {
                if (data) {
                    var _this = this;
                    api.saveOpCraftsProcess({id : this.mainModel.vo.id}, data).then(function() {
                        _this.refreshTableData(_this.$refs.opcraftsprocessTable);
                    });
                }
            },
            doUpdateOpCraftsProcess : function(data) {
                if (data) {
                    var _this = this;
                    api.updateOpCraftsProcess({id : this.mainModel.vo.id}, data).then(function() {
                        _this.refreshTableData(_this.$refs.opcraftsprocessTable);
                    });
                }
            },
            doRemoveOpCraftsProcess : function(item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeOpCraftsProcesses({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
                            _this.$refs.opcraftsprocessTable.doRefresh();
                        });
                    }
                });
            },
            doMoveOpCraftsProcess : function(item) {
                var _this = this;
                var data = item.entry.data;
                var param = {
                    id : data.id
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                api.moveOpCraftsProcess(null, param).then(function() {
                    _this.$refs.opcraftsprocessTable.doRefresh();
                    LIB.Msg.success("移动成功");
                });
            },
            doShowDocumentModal: function() {
                var fileLength = this.fileModel.default.data.length;
                if (fileLength === 9) {
                    LIB.Msg.error("文件数量已到达最大数量限制：9个");
                    return;
                }
				this.documentModal.visible = true;
			},
            doSaveDocuments: function (ret) {
				var fileLength = this.fileModel.default.data.length;
				var totalLength = fileLength + ret.length;
				if (totalLength > 9) {
					LIB.Msg.error("选择文件后总数为 " + totalLength + ", 超过限制最大数量9个， 请重新选择");
					return;
				}
                var _this = this;
				var recordId = this.mainModel.vo.id;
				var params = _.map(ret, function (t) {
					return {
						id: t.fileId,
						recordId: recordId,
                        dataType:"W2",
						fileType:"W"
					}
                });
				api.addPublicDocument(params).then(function (res) {
					_this._getFiles();
                    _this.documentModal.visible = false;
                })
            },
			_getFiles: function() {
				var _this = this;
				var id = this.mainModel.vo.id;
                _this.$api.listFile({recordId: id}).then(function (res) {
                    if (!_this.afterInitFileData && _this.fileModel.default) {
                        _this.fileModel.default.data = _.map(res.data, function (item) {
                            return {
                                fileId: item.id,
                                fileExt: item.ext,
                                orginalName: item.orginalName
                            }
                        });
                    }
                });
			},
			// 分组操作 -start-
			doShowStepFormModal4Update : function(data) {
				var group = data.entry;
				this.formModel.stepFormModel.show = true;
				this.$refs.stepFormModal.init("update", {id: this.mainModel.vo.id, opStdStepId: group.id});
			},
			doShowStepFormModal4Create : function() {
				this.formModel.stepFormModel.show = true;
				this.$refs.stepFormModal.init("create");
			},
			doSaveStep : function(data) {
				if (data) {
					var _this = this;
					api.saveOpStdStep({id : this.mainModel.vo.id}, data).then(function() {
                        _this._getItems();
                        LIB.Msg.success("新增成功");
                        _this._checkModifier();
					});
				}
			},
			doUpdateStep : function(data) {
				if (data) {
					var _this = this;
					api.updateOpStdStep({id : this.mainModel.vo.id}, data).then(function() {
                        _this._getItems();
                        LIB.Msg.success("修改成功");
                        _this._checkModifier();
                    });
				}
			},
			doRemoveSteps : function(data) {
				var item = data.entry;
				var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        api.removeOpStdSteps({id : _this.mainModel.vo.id}, [{id : item.id}]).then(function() {
                            _this._getItems();
                            LIB.Msg.success("删除成功");
                            _this._checkModifier();
                        });
                    }
                });

			},
			doMoveSteps : function(params) {
				var data = params.entry;
				var offset = params.offset;
				var index = params.index;
				if(index === 0 && offset === -1) {
					return;
				}
				if(offset === 1 && index === (this.groups.length - 1)) {
					return;
				}
				var _this = this;
				var param = {
					id : data.id,
					cardId : this.mainModel.vo.id
				};
				_.set(param, "criteria.intValue.offset", offset);
				api.moveOpStdSteps({id : this.mainModel.vo.id}, param).then(function() {
                    _this._getItems();
                    LIB.Msg.success("移动成功");
                    _this._checkModifier();
                });
			},
            // 分组操作 -end-

            // 子项操作 -start-
            doShowStepItemFormModal4Update : function(param) {

                this.formModel.stepItemFormModel.show = true;
                this.$refs.stepItemFormModal.init("update", {id: param.entry.data.stepId, opstdstepitemId: param.entry.data.id});
            },
            doShowStepItemFormModal4Create : function(data) {
				this._groupId = data.entry.id;
                this.formModel.stepItemFormModel.show = true;
                this.$refs.stepItemFormModal.init("create");
            },
            doSaveStepItem : function(data) {
                if (data) {
                    var _this = this;
                    data.cardId = this.mainModel.vo.id;
                    api.saveOpStdStepItem({id : this._groupId}, data).then(function() {
                        _this._getItems();
                        LIB.Msg.success("保存成功");
                        _this._checkModifier();
                    });
                }
            },
            doUpdateStepItem : function(data) {
                if (data) {
                    var _this = this;
                    api.updateOpStdStepItem({id : data.stepId}, data).then(function() {
                        _this._getItems();
                        LIB.Msg.success("修改成功");
                        _this._checkModifier();
                    });
                }
            },
            doRemoveStepItems : function(item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        api.removeOpStdStepItems({id : data.stepId}, [{id : data.id}]).then(function() {
                            _this._getItems();
                            LIB.Msg.success("删除成功");
                            _this._checkModifier();
                        });
                    }
                });

            },
            doMoveStepItems : function(item) {
                var _this = this;
                var data = item.entry.data;
                var param = {
                    id : data.id
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                api.moveOpStdStepItems({id : data.stepId}, param).then(function() {
                    _this._getItems();
                    LIB.Msg.success("移动成功");
                    _this._checkModifier();
                });
            },
            // 子项操作 -end-

            doSubmit: function () {
				var _this = this;
                LIB.Modal.confirm({
                    title: '确定修改完毕，提交审核?',
                    onOk: function() {
                        api.submitOpCard({id: _this.mainModel.vo.id}).then(function () {
                            _this.mainModel.vo.status = '1';
                            _this._isLastColumnVisible();
                            _this.$dispatch("ev_dtUpdate");
                            LIB.Msg.success("提交成功");
                            if (_this.enableProcess) {
                                _this._checkAuditProcess();
                            }
                        })
                    }
                });
            },
            doAudit: function () {
			    if (!!this.auditProcessParam) {
                    this.auditProcessModel.visible = true;
			        return;
                }
				this.auditObj.visible = true;
            },
            doSaveAuditProcessRecord: function (data) {
			    var _this = this;
                var param = this.auditProcessParam;
                param.result = data.result;
                param.remark = data.remark;
                api.saveAuditProcessRecord({id: this.mainModel.vo.id}, param).then(function (res) {
                    LIB.Msg.success("审核操作成功");
                    _this._getVOData();
                    _this._getProcessRecordList();
                    _this._isLastColumnVisible();
                    _this.$dispatch("ev_dtUpdate");
                    _this.auditProcessModel.visible = false;
                    if (_this.enableProcess) {
                        _this._checkAuditProcess();
                    }
                })
            },
            doPass: function (val) {
                var _this = this;
                api.auditOpCard({id: this.mainModel.vo.id, status: val}).then(function (res) {
                    _this.mainModel.vo.status = val === 200 ? '2' : '0';
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.success("审核操作成功");
                    _this._getVOData();
                    _this._isLastColumnVisible();
                    _this.auditObj.visible = false;
                })
            },
			doQuit: function () {
                var _this = this;
                api.quitOpCard({id: this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.status = '0';
                    _this.mainModel.vo.disable = '1';
                    _this._isLastColumnVisible();
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.success("弃审成功");
                })
            },

			_getItems: function () {
				var container = this.$els.container;
				var top = container.scrollTop;
				var _this = this;
				api.getGroupAndItem({id: this.mainModel.vo.id}).then(function (res) {
					var groups = res.data.OpStdStep;
					var items = res.data.OpStdStepItem;
					_this._convertData(groups, items);
					_this.$nextTick(function () {
                        container.scrollTop = top;
                    })
                })	
            },
			_convertData: function (groups, items) {
				// 组按orderNo排序
				var _groups = _.sortBy(groups, function (group) {
					return parseInt(group.orderNo);
                });
				// 项按stepId分组
				var _items = _.groupBy(items, "stepId");
                // 项按orderNo排序, 并将项添加到对应的组中
                _.forEach(_groups, function (group) {
                    group.items = _.sortBy(_items[group.id], function (item) {
                        return parseInt(item.orderNo);
                    });
                });

                this.groups = _groups;
            },
            // 预览
            doPreview: function () {
				this.$emit("do-preview", {id:this.mainModel.vo.id,bizType:this.mainModel.vo.bizType});
            },
			_isLastColumnVisible: function() {
				var lastColumn = _.cloneDeep(_.last(this.groupColumns));
				var length = this.groupColumns.length;

                if (this.mainModel.vo.status !== '0') {
                    lastColumn.visible = false;
                } else {
                    lastColumn.visible = true;
                }
                this.groupColumns.$set(length - 1, lastColumn);
			},
			_checkModifier: function () {
				if (LIB.user.id !== _.get(this.mainModel.vo, "contentModifyUser.id")) {
					this._getVOData();
				}
            },
			_getVOData: function () {
                var _this = this;
				_this.$api.get({id: _this.mainModel.vo.id}).then(function(res) {
					_.deepExtend(_this.mainModel.vo, res.data);
					_this.storeBeforeEditVo();
				});
            },

            // 判断启用审核流之后，当前登陆人是否是当前审批节点审核人，如果是，则后端返回一条审核记录数据，审核提交时返回给后端
            _checkAuditProcess: function () {
                var _this = this;
                api.queryProcessStatus({auditObjectId: this.mainModel.vo.id, auditObjectType: 'OpStdCard'}).then(function (res) {
                    _this.auditProcessParam = res.data;
                    _this.hasProcessRecord = !!res.data;
                })
            },
            _getProcessRecordList: function () {
			    var _this = this;
                api.getProcessRecordList({id: this.mainModel.vo.id}).then(function (res) {
                    _this.auditProcessModel.values = res.data;
                })
            },
			afterInitData : function() {
				this._getItems();
				this._isLastColumnVisible();
                this._checkAuditProcess();
                this._getProcessRecordList();
                this.$refs.opcraftsprocessTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.groups = null;
				this.hasProcessRecord = false;
				this.activeTabName = '1';
                this.auditProcessModel.values = null;
                this.$refs.opcraftsprocessTable.doClearData();
			},
            afterInit: function (_vo, obj) {
				if(obj.opType === 'create') {
					this.mainModel.vo.orgId = LIB.user.orgId;
                    this._isLastColumnVisible();
                }
            },
            beforeDoSave:function() {
                this.mainModel.vo.specialityType = this.$route.query.bizType;
            },
            afterDoSave: function(opt, res) {
                if (opt.type === "U") {
                    this._getVOData();
                }
            },
            doShare: function() {
				if (!this.hasAuth('share')) {
					return LIB.Msg.warning("权限不足");
				}
                var _this = this;
                var data = _this.mainModel.vo;
				if (data.disable === '1') {
                    return LIB.Msg.warning("未启用的操作票不能进行分享操作");
				}
                var params = {
                    id: data.id,
                    isShare: data.isShare === "0" ? "1" : "0"
                };
                api.updateShare(params).then(function (res) {
					data.isShare = (data.isShare === "0") ? "1" : "0";
					LIB.Msg.info((data.isShare === "0") ? "未分享" : "已分享");
                    _this.$dispatch("ev_dtUpdate");
				});
            },
            changeTab: function (tabEle) {
                this.activeTabName = tabEle.key;
            },
            _checkProcessEnable: function () {
                var _this = this;
                api.queryLookupItem().then(function (res) {
                    var lookup = _.find(_.get(res.data, "[0].lookupItems"), "name", "OpStdCard");
                    _this.enableProcess = (_.get(lookup, "value") === '1');
                    _this.checkedProcessEnable = true;
                })
            }
        },
		events : {
		},
    	init: function(){
        	this.$api = api;
        },
		created: function () {
            this._checkProcessEnable();
        }
	});

	return detail;
});