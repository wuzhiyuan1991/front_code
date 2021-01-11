define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
    var cardSelectModal = require("./dialog/cardSelectModal");
	var opStdStepFormModal = require("componentsEx/formModal/opStdStepFormModal");
    var opStdStepItemFormModal = require("componentsEx/formModal/opStdStepItemFormModal");
	var documentSelectModal = require("../documents/documentSelectModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//唯一标识
			code : null,
			//卡票名称
			name : null,
			//发布标识 0:已发布，1:未发布
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
			//修改日期
			// modifyDate : null,
			// 修改人
			// createBy: null,
			//操作票操作步骤
			// opStdSteps : []
            //发令调度员编号
            dispatcherCode:null,
            // 发令调度员姓名
            dispatcherName:null,
            // 调度令编号
            dispatchCode:null,
            opCard: {id: '', name: '', type: '', orgId: ''},
            operators:[],
            supervisors:[],
            auditors:[],
            bizType:'crafts',
		}
	};


	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
            //验证规则
            rules: {
                "code" : [
                    LIB.formRuleMgr.require("编码"),
                    LIB.formRuleMgr.length(50)
				],
                "name" : [
                    LIB.formRuleMgr.require("操作票名称"),
                    LIB.formRuleMgr.length(200)
                ],
                "compId": [LIB.formRuleMgr.require("所属公司")],
                "orgId": [LIB.formRuleMgr.require("所属部门")],
                "remarks" : [LIB.formRuleMgr.length(500)],
                "operators": [
                    {   required: true,
                        validator: function (rule, value, callback) {
                            if(_.isEmpty(value)) {
                                return callback(new Error('请选择操作人'));
                            }
                            return callback();
                        }
                    }
                ],
                "supervisors": [
                    {   required: true,
                        validator: function (rule, value, callback) {
                            if(_.isEmpty(value)) {
                                return callback(new Error('请选择监护人'));
                            }
                            return callback();
                        }
                    }
                ],
                "auditors": [
                    {   required: true,
                        validator: function (rule, value, callback) {
                            if(_.isEmpty(value)) {
                                return callback(new Error('请选择审核人'));
                            }
                            return callback();
                        }
                    }
                ],
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
				queryUrl : "optask/{id}/optaskstep/{opTaskStepId}"
			},
            stepItemFormModel: {
                show : false,
                hiddenFields : ["cardId"],
                queryUrl : "optaskstep/{id}/optaskstepitem/{optaskstepitemId}"
			}
		},
		cardModel : {
			stepCardModel : {
				showContent : true
			},
            processCardModel : {
                showContent : true
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
                    // {
                    //     title : "",
                    //     fieldType : "tool",
                    //     toolType : "move,edit,del"
                    // }
                    ],
                defaultFilterValue:{"criteria.orderValue": {fieldName: "orderNo", orderType: "0"}}
            }),
        },
        selectModel: {
            cardSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            operatorSelectModel: {
                visible: false
            },
            supervisorSelectModel: {
                visible: false
            },
            auditorSelectModel: {
                visible: false
            },
        },
		groups: null,
        activeTabName: '1',
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
            "cardSelectModal":cardSelectModal,
            "operatorSelectModal":userSelectModal,
            "supervisorSelectModal":userSelectModal,
            "auditorSelectModal":userSelectModal,
        },
        computed: {
            isStatusRight: function () {
                return this.mainModel.vo.status === '0';
            },
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            doShowOperatorSelectModal: function () {
                this.selectModel.operatorSelectModel.visible = true;
            },
            doSaveOperators: function (selectedDatas) {
                var _this = this;
                if (selectedDatas) {
                    //两数组去重
                    if (_this.mainModel.vo.operators.length > 0) {
                        _.each(_this.mainModel.vo.operators, function (data) {
                            _.each(selectedDatas, function (item, index) {
                                if (item.id == data.id) {
                                    //_this.mainModel.vo.examPoints.splice(index,1);
                                    selectedDatas.splice(index, 1);
                                    return false
                                }
                            })
                        })
                    }
                    _this.mainModel.vo.operators = _this.mainModel.vo.operators.concat(selectedDatas);
                }
            },
            doRemoveOperators: function (index) {
                this.mainModel.vo.operators.splice(index, 1);
            },
            doShowSupervisorSelectModal: function () {
                this.selectModel.supervisorSelectModel.visible = true;
            },
            doSaveSupervisors: function (selectedDatas) {
                var _this = this;
                if (selectedDatas) {
                    //两数组去重
                    if (_this.mainModel.vo.supervisors.length > 0) {
                        _.each(_this.mainModel.vo.supervisors, function (data) {
                            _.each(selectedDatas, function (item, index) {
                                if (item.id == data.id) {
                                    //_this.mainModel.vo.examPoints.splice(index,1);
                                    selectedDatas.splice(index, 1);
                                    return false
                                }
                            })
                        })
                    }
                    _this.mainModel.vo.supervisors = _this.mainModel.vo.supervisors.concat(selectedDatas);
                }
            },
            doRemoveSupervisors: function (index) {
                this.mainModel.vo.supervisors.splice(index, 1);
            },
            doShowAuditorSelectModal: function () {
                this.selectModel.auditorSelectModel.visible = true;
            },
            doSaveAuditors: function (selectedDatas) {
                var _this = this;
                if (selectedDatas) {
                    //两数组去重
                    if (_this.mainModel.vo.auditors.length > 0) {
                        _.each(_this.mainModel.vo.auditors, function (data) {
                            _.each(selectedDatas, function (item, index) {
                                if (item.id == data.id) {
                                    selectedDatas.splice(index, 1);
                                    return false
                                }
                            })
                        })
                    }
                    _this.mainModel.vo.auditors = _this.mainModel.vo.auditors.concat(selectedDatas);
                }
            },
            doRemoveAuditors: function (index) {
                this.mainModel.vo.auditors.splice(index, 1);
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
				this.$refs.stepFormModal.init("update", {id: this.mainModel.vo.id, opTaskStepId: group.id});
			},
			doShowStepFormModal4Create : function() {
				this.formModel.stepFormModel.show = true;
				this.$refs.stepFormModal.init("create");
			},
			doSaveStep : function(data) {
				if (data) {
					var _this = this;
					api.saveOpTaskStep({id : this.mainModel.vo.id}, data).then(function() {
                        _this._getItems();
                        LIB.Msg.success("新增成功");
					});
				}
			},
			doUpdateStep : function(data) {
				if (data) {
					var _this = this;
					api.updateOpTaskStep({id : this.mainModel.vo.id}, data).then(function() {
                        _this._getItems();
                        LIB.Msg.success("修改成功");
                    });
				}
			},
			doRemoveSteps : function(data) {
				var item = data.entry;
				var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        api.removeOpTaskSteps({id : _this.mainModel.vo.id}, [{id : item.id}]).then(function() {
                            _this._getItems();
                            LIB.Msg.success("删除成功");
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
					taskId : this.mainModel.vo.id
				};
				_.set(param, "criteria.intValue.offset", offset);
				api.moveOpTaskSteps({id : this.mainModel.vo.id}, param).then(function() {
                    _this._getItems();
                    LIB.Msg.success("移动成功");
                });
			},
            // 分组操作 -end-

            // 子项操作 -start-
            doShowStepItemFormModal4Update : function(param) {

                this.formModel.stepItemFormModel.show = true;
                this.$refs.stepItemFormModal.init("update", {id: param.entry.data.stepId, optaskstepitemId: param.entry.data.id});
            },
            doShowStepItemFormModal4Create : function(data) {
				this._groupId = data.entry.id;
                this.formModel.stepItemFormModel.show = true;
                this.$refs.stepItemFormModal.init("create");
            },
            doSaveStepItem : function(data) {
                if (data) {
                    var _this = this;
                    data.taskId = this.mainModel.vo.id;
                    api.saveOpTaskStepItem({id : this._groupId}, data).then(function() {
                        _this._getItems();
                        LIB.Msg.success("保存成功");
                    });
                }
            },
            doUpdateStepItem : function(data) {
                if (data) {
                    var _this = this;
                    api.updateOpTaskStepItem({id : data.stepId}, data).then(function() {
                        _this._getItems();
                        LIB.Msg.success("修改成功");
                    });
                }
            },
            doRemoveStepItems : function(item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        api.removeOpTaskStepItems({id : data.stepId}, [{id : data.id}]).then(function() {
                            _this._getItems();
                            LIB.Msg.success("删除成功");
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
                api.moveOpTaskStepItems({id : data.stepId}, param).then(function() {
                    _this._getItems();
                    LIB.Msg.success("移动成功");
                });
            },
            doSubmit: function () {
				var _this = this;
                LIB.Modal.confirm({
                    title: '确定修改完毕，提交审核?',
                    onOk: function() {
                        api.saveSubmit({id: _this.mainModel.vo.id}).then(function () {
                            _this.mainModel.vo.status = '1';
                            _this._isLastColumnVisible();
                            _this.$dispatch("ev_dtUpdate");
                            LIB.Msg.success("提交成功");
                        })
                    }
                });
            },
            doPublish: function () {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定发布任务?',
                    onOk: function() {
                        api.savePublish({id: _this.mainModel.vo.id}).then(function () {
                            _this.mainModel.vo.disable = '0';
                            _this._isLastColumnVisible();
                            _this.$dispatch("ev_dtUpdate");
                            LIB.Msg.success("发布成功");
                        })
                    }
                });
            },
            doAudit: function () {
                this.$emit("do-audit", this.mainModel.vo.id);
            },
            _getVO: function () {
                var _this = this;
                api.get({id: this.mainModel.vo.id}).then(function (res) {
                    if(res.data) {
                        _.deepExtend(_this.mainModel.vo, res.data);
                    }
                })
            },
			 _getItems: function () {
				var container = this.$els.container;
				var top = container.scrollTop;
				var _this = this;
				api.getGroupAndItem({id: this.mainModel.vo.id}).then(function (res) {
					var groups = res.data.OpTaskStep;
					var items = res.data.OpTaskStepItem;
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
				this.$emit("do-preview", this.mainModel.vo.id);
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
			afterInitData : function() {
                this._getItems();
                this._isLastColumnVisible();
                this.$refs.opcraftsprocessTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.groups = null;
				this.activeTabName = '1';
                this.$refs.opcraftsprocessTable.doClearData();
			},
            afterInit: function (_vo, obj) {
				if(obj.opType === 'create') {
					this.mainModel.vo.orgId = LIB.user.orgId;
                    this._isLastColumnVisible();
                }
            },
            afterDoSave: function(opt, res) {
                if (opt.type === "C") {
                    this._getItems();
                }
            },
            changeTab: function (tabEle) {
                this.activeTabName = tabEle.key;
            },
            doShowOpCardSelectModal: function () {
                this.selectModel.cardSelectModel.filterData = {orgId: this.mainModel.vo.orgId};
                this.selectModel.cardSelectModel.visible = true;
            },
            doSaveOpCard: function (selectedDatas, type) {
			    var _this = this
                if (selectedDatas) {
                    var rows = _.map(selectedDatas, function (item) {
                        return {
                            name: item.name,
                            id: item.id,
                            orgId: item.orgId
                        }
                    });
                    var row = rows[0];
                    if(this.mainModel.opType != 'create' && this.mainModel.vo.opCard.id != row.id) {
                        LIB.Modal.confirm({
                            title: '选择操作票模板后，该模板的操作步骤将覆盖原有的操作步骤，是否继续？',
                            onOk: function() {
                                api.updateCardId({id: _this.mainModel.vo.id}, {id: row.id}).then(function(){
                                    _this.mainModel.vo.opCard = row;
                                    _this.mainModel.vo.opCard.name = row.name;
                                    _this._getItems();
                                });
                            }
                        });
                    }else {
                        _this.mainModel.vo.opCard = row;
                        _this.mainModel.vo.opCard.name = row.name;
                    }
                }
                _this.mainModel.vo.type = type || '1';
            },
        },
		events : {
            'ev_dtAudit' : function() {
                this._getVO();
            }
		},
    	init: function(){
        	this.$api = api;
        },
	});

	return detail;
});