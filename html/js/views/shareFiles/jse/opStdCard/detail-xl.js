define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var opStdStepFormModal = require("componentsEx/formModal/opStdStepFormModal");
    var opStdStepItemFormModal = require("componentsEx/formModal/opStdStepItemFormModal");
	var documentSelectModal = require("../../../businessFiles/jse/documents/documentSelectModal");
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//唯一标识
			code : null,
			//卡票名称
			name : null,
			//专业
			// specialityType : null,
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
            attr1: null
            //修改日期
			// modifyDate : null,
			// 修改人
			// createBy: null,
			//操作票操作步骤
			// opStdSteps : []
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
			}
		},
		cardModel : {
			stepCardModel : {
				showContent : true
			}
		},
		selectModel : {
		},
        auditObj: {
            visible: false
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"stepFormModal":opStdStepFormModal,
			"stepItemFormModal": opStdStepItemFormModal,
			"documentSelectModal": documentSelectModal
        },
        computed: {
            isStatusRight: function () {
                return this.mainModel.vo.status === '0';
            }
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,

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
				api.removeOpStdSteps({id : this.mainModel.vo.id}, [{id : item.id}]).then(function() {
					_this._getItems();
					LIB.Msg.success("删除成功");
                    _this._checkModifier();
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
                api.removeOpStdStepItems({id : data.stepId}, [{id : data.id}]).then(function() {
                    _this._getItems();
                    LIB.Msg.success("删除成功");
                    _this._checkModifier();
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

            doAudit: function () {
				this.auditObj.visible = true;
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
			afterInitData : function() {
				this._getItems();
				this._isLastColumnVisible();
				if (this.mainModel.action === 'copy') {
					var vo = this.mainModel.vo;
					vo.compId = LIB.user.compId;
                    vo.orgId = LIB.user.orgId;
                    vo.status = '1';
                    vo.disable = '1';
                    vo.contentModifyUser = null;
                    vo.contentModifyDate = null;
                    vo.user = null;
                    vo.auditDate = null;
                }
			},
            afterDoCopy: function() {
				this.doClose();
			},
			beforeInit : function() {
				this.groups = null;
			},
            afterInit: function (_vo, obj) {
				if(obj.opType === 'create') {
					this.mainModel.vo.orgId = LIB.user.orgId;
                    this._isLastColumnVisible();
                }
            },
            afterDoSave: function(opt, res) {
                if (opt.type === "U") {
                    this._getVOData();
                }
            }
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});