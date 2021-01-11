define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var emerLinkmanFormModal = require("componentsEx/formModal/emerLinkmanFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			orgId: LIB.user.compId,
			compId: LIB.user.compId,
			//组别/单位名称
			name : null,
			//类型 1:内部应急组,2:外部应急单位
			type : 2,
			//单位地址
			address : null,
			//备注
			remarks : null,
			//联系人
			emerLinkmen : [],
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			action: null,
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("单位名称"),
						  LIB.formRuleMgr.length(50)
				],
				"address" : [LIB.formRuleMgr.length(100)],
				"remarks" : [LIB.formRuleMgr.length(500),LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
			emerLinkmanTableModel : LIB.Opts.extendDetailTableOpt({
				url : "emergroup/emerlinkmen/list/{curPage}/{pageSize}",
				columns : [
					{
						title : "联系人",
						fieldName : "name",
					},{
						title : "手机号码",
						fieldName : "mobile",
					},{
						title : "办公电话",
						fieldName : "officePhone",
					},{
						title : "职务",
						fieldName : "duty",
					},{
						title : "备注",
						fieldName : "remarks",
					},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}],
				defaultFilterValue: {"criteria.orderValue": {fieldName: "ifnull(e.modify_date, e.create_date) desc,e.id", orderType: "0"}}

			}),
		},
		formModel : {
			emerLinkmanFormModel : {
				show : false,
				hiddenFields : ["emerGroupId"],
				queryUrl : "emergroup/{id}/emerlinkman/{emerLinkmanId}"
			},
		},
		selectModel : {
		},

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
			"emerlinkmanFormModal":emerLinkmanFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowEmerLinkmanFormModal4Update : function(param) {
				this.formModel.emerLinkmanFormModel.show = true;
				this.$refs.emerlinkmanFormModal.init("update", {id: this.mainModel.vo.id, emerLinkmanId: param.entry.data.id});
			},
			doShowEmerLinkmanFormModal4Create : function(param) {
				this.formModel.emerLinkmanFormModel.show = true;
				this.$refs.emerlinkmanFormModal.init("create");
			},
			doSaveEmerLinkman : function(data) {
				if (data) {
					var _this = this;
					api.saveEmerLinkman({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.emerlinkmanTable);
					});
				}
			},
			doUpdateEmerLinkman : function(data) {
				if (data) {
					var _this = this;
					api.updateEmerLinkman({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.emerlinkmanTable);
					});
				}
			},
			doRemoveEmerLinkmen : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeEmerLinkmen({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.emerlinkmanTable.doRefresh();
				});
			},
			afterInitData : function() {
				this.$refs.emerlinkmanTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.emerlinkmanTable.doClearData();
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