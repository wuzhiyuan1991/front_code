define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//唯一标识
			code : null,
			//文件夹名
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//所属部门id
			orgId : null,
			//类型 1:文件夹,2:文件
			type : null,
			//所属公司id
			compId : null,
			//dataType:1:公开文件,2:已审核,10:待审核,11:已驳回
			dataType : null,
			//文件大小
			fileSize : null,
            deleteFlag: null
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
	        rules:{
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length(100)
				]
	        }
		},
		historyList: null,
        auditModel: {
            visible: false,
            remark: ''
        },
        submitModel: {
            visible: false,
            remark: ''
        },
        recoverModel: {
            visible: false,
            remark: ''
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
		data:function(){
			return dataModel;
		},
		computed: {
			showAuditButton: function () {
				return this.mainModel.vo.dataType === '10';
            },
            showSubmitButton: function () {
                return this.mainModel.vo.dataType === '11';
            },
            showDeleteButton: function () {
                return this.mainModel.vo.deleteFlag === '1';
            }
		},
		methods:{
			newVO : newVO,
            toggleOpen: function (item) {
				item.open = !item.open
            },
            doSubmit: function () {
                this.submitModel.visible = true;
                this.submitModel.remark = '';
            },
            doSubmitPass: function (pass) {
                var _this = this;
                var params = {
                    id: this.mainModel.vo.id,
                    remark: this.submitModel.remark,
                    dataType: pass
                };
                api.submit(params).then(function () {
                    LIB.Msg.success("提交成功");
                    _this.submitModel.visible = false;
                    _this.$dispatch("ev_dtUpdate");
                    _this.mainModel.vo.dataType = pass;
                    _this._getHistoryList();
                })
            },
            doRecover: function () {
                this.recoverModel.visible = true;
                this.recoverModel.remark = '';
            },
            doSureRecover: function () {
                var _this = this;
                var params = {
                    id: this.mainModel.vo.id,
                    remark: this.recoverModel.remark,
                    deleteFlag: 0
                };
                api.update({_bizType: 'recover'}, params).then(function () {
                    LIB.Msg.success("恢复成功");
                    _this.recoverModel.visible = false;
                    _this.$dispatch("ev_dtUpdate");
                    _this.mainModel.vo.deleteFlag = '0';
                    _this._getHistoryList();
                })
            },
            doAudit: function () {
                this.auditModel.visible = true;
                this.auditModel.remark = '';
            },
            doPass: function (pass) {
                var _this = this;
                var params = {
                    id: this.mainModel.vo.id,
                    remark: this.auditModel.remark,
                    dataType: pass
                };

                api.audit(params).then(function () {
                    LIB.Msg.success("审核成功");
                    _this.mainModel.vo.dataType = pass;
                    _this.auditModel.visible = false;
                    _this.$dispatch("ev_dtUpdate");
                    _this._getHistoryList();
                })

            },
            _getActionText: function (t) {
				var o = {
					'1': '审核通过',
					'2': '审核驳回',
					'3': '提交审核',
                    '4': '重命名',
					'5': '删除',
					'6': '上传',
					'7': '重新上传',
					'8': '恢复',
					'9': '移动'
				};
				return o[t] || '';
            },
			_getHistoryList: function () {
				var defaultRemark = "未填写内容";
				var _this = this;
				api.getHistoryList({documentLibraryId: this.mainModel.vo.id}).then(function (res) {
					var lastIndex = res.data.length - 1;
					_this.historyList = _.map(res.data, function (item, index) {
						return {
							date: item.createDate,
							username: _.get(item, "user.name", "管理员"),
							remark: item.remark || defaultRemark,
							open: true,
							action: _this._getActionText(item.type),
							isLast: index === lastIndex
						}
                    })
                })
            },
			afterInitData: function () {
				this._getHistoryList();
            },
			beforeInit: function () {
				this.historyList = null;
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