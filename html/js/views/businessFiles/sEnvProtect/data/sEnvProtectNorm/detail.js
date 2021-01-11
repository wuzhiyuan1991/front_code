define(function (require) {
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");

	//初始化数据模型
	var newVO = function () {
		return {
			id : null,
			//编码
			code : null,
			//字段名称
			fieldName : null,
			//指标名称
			standardName : null,
			//监测对象 0:废气,1:废水,3:噪音
			target : 0,
			//禁用标识 0:未禁用,1:已禁用
			disable : "0",
			//公司id
			compId : null,
			//部门id
			// orgId : null,
			//备注
			remark : null,
		}
	};
	//Vue数据
	var dataModel = {
		mainModel: {
			vo: newVO(),
			opType: 'view',
			isReadOnly: true,
			title: "",

			//验证规则
			rules: {
				"code" : [LIB.formRuleMgr.length(100)],
				"fieldName" : [LIB.formRuleMgr.require("字段名称"),
						  LIB.formRuleMgr.length(255)
				],
				"standardName" : [LIB.formRuleMgr.require("指标名称"),
						  LIB.formRuleMgr.length(255)
				],
				"target" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("监测对象")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("公司")],
				// "orgId" : [LIB.formRuleMgr.length(10)],
				"remark" : [LIB.formRuleMgr.require("备注"),LIB.formRuleMgr.length(1000)],
			}
		},
		edit: {
			visible: false,
			vo: { title: null, fieldName: null },
			rowId: null,
			rules: {
				"title": [
					LIB.formRuleMgr.require("名称"),
					LIB.formRuleMgr.length(100)
				],
			}
		},
		tableModel: {

			attendeesTableModel: LIB.Opts.extendDetailTableOpt({
				// url : "testequipment/testusers/list/{curPage}/{pageSize}",
				columns: [
					{
						title: "指标名称",
						fieldName: "title",
						// keywordFilterName: "criteria.strValue.keyWordValue_name"
					}, {
						title: "字段名",
						// width:100,
						fieldName: "fieldName",
						// keywordFilterName: "criteria.strValue.keyWordValue_name"
					}, {
						title: "是否启用",
						// width:100,
						// fieldName: "status",
						// fieldType: "link",
						render: function (data) {
						
							if (data.status == 1) {
								return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
							} else {
								return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
							}
                            
						},
						// keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					// {
					// 	title: "上限",
					// 	fieldName: "toplimit",
					// },
					// {
					// 	title: "下限",
					// 	fieldName: "botlimit",
					// },
					// {
					//     title : "单位",
					//     width:100,
					//     fieldName : "stdUnit",
					//     keywordFilterName: "criteria.strValue.keyWordValue_name"
					// },
					{
						title: "",
						fieldType: "tool",
						toolType: "move,edit"
					}
				]
			}),

	
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
		mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
		template: tpl,
		components: {

		},
		data: function () {
			return dataModel;
		},
		watch:{
			'mainModel.isReadOnly':function(val){
				if (val) {
					this.$refs.attendeesTable.columns[3].visible = false
				}else{
					this.$refs.attendeesTable.columns[3].visible = true
				}
				this.$refs.attendeesTable.refreshColumns()
			}
		},
		methods: {
			newVO: newVO,
			doCancelEdit: function () {
				this.edit.visible = false
				this.edit.rowId = null
				this.edit.vo={ title: null, fieldName: null }
			},
			
			doSaveEdit:function(){
				var _this = this 
				this.$refs.modalruleform.validate(function (valid) {
                    if (valid) {
					_.extend(_this.$refs.attendeesTable.values[_this.edit.rowId],_.clone(_this.edit.vo) )
					_.extend(_this.mainModel.vo.detail[_this.edit.rowId],_.clone(_this.edit.vo) )
							
					_this.edit.visible = false
                    }
                })
			},
			doEditData: function (data) {
				this.edit.visible = true
				this.$refs.modalruleform.resetFields()
				this.edit.rowId = data.cell.rowId
				_.extend(this.edit.vo, data.entry.data)
			},
			doMoveData: function (item) {

				var offset = item.offset;
				var index = item.cell.rowId
				var j = offset + index
				this.$refs.attendeesTable.values.splice(index, 1, this.$refs.attendeesTable.values.splice(j, 1, this.$refs.attendeesTable.values[index])[0])

			},
			doTableCellClick: function (data) {
			
				if (data.cell.colId == 2&&!this.mainModel.isReadOnly) {//状态单元格--修改状态
					// var _this = this;
					// var _data = _.clone(data.entry.data);
					if(_.isEmpty(data.entry.data.title)){
						return LIB.Msg.warning('请先设置指标名')
					}
					data.entry.data.status = data.entry.data.status == "0" ? '1' : "0"
					this.mainModel.vo.detail[data.cell.rowId].status = data.entry.data.status
					
				}
			},
			afterInit:function(){
				if(this.mainModel.opType=='create'){
					this.mainModel.vo.detail=[]
					this.$refs.attendeesTable.values=this.mainModel.vo.detail
				}
			},
			afterInitData:function(){
				this.mainModel.vo.detail=JSON.parse(this.mainModel.vo.detail)
				this.$refs.attendeesTable.values=this.mainModel.vo.detail
				this.$refs.attendeesTable.columns[3].visible = false
				this.$refs.attendeesTable.refreshColumns()
			},
			beforeDoDelete:function(){
				if (typeof this.mainModel.vo.detail != 'string') {
					this.mainModel.vo.detail=JSON.stringify(this.mainModel.vo.detail)
				}
			},
			beforeDoSave:function(){
				
				if (this.mainModel.opType=='create') {
					this.mainModel.vo.detail=[]
					if (this.mainModel.vo.target==0) {
						for (var index = 0; index < 15; index++) {
							this.mainModel.vo.detail.push({
								title: "指标"+(index+1),
								fieldName:'envEl'+(index+1),
								status: 0,
								// toplimit:'',
								// botlimit:''
							})
							
						}
						
					}else if (this.mainModel.vo.target==1) {
						for (var index = 0; index < 15; index++) {
							this.mainModel.vo.detail.push({
								title: "指标"+(index+1),
								fieldName:'cmps'+(index+1),
								status: 0,
								// toplimit:'',
								// botlimit:''
							})
							
						}
					}else if (this.mainModel.vo.target==3) {
						for (var index = 0; index < 15; index++) {
							this.mainModel.vo.detail.push({
								title: "指标"+(index+1),
								fieldName:'env'+(index+1),
								status: 0,
								// toplimit:'',
								// botlimit:''
							})
							
						}
					}
					this.$refs.attendeesTable.values=this.mainModel.vo.detail
				}
				if (typeof this.mainModel.vo.detail != 'string') {
					this.mainModel.vo.detail=JSON.stringify(this.mainModel.vo.detail)
				}
				
			},
			afterDoCancel:function(){
				this.init('view',this.mainModel.vo.id)
			},
			doteal:function(){
			_.each(this.mainModel.vo.detail,function(item){
				if (item.title=='PH') {
					item.toplimit=6
					item.botlimit=9
				}else if (item.title=='COD') {
					item.toplimit=500
					item.botlimit=null
				}else if (item.title=='SS') {
					item.toplimit=400
					item.botlimit=null
				}else if (item.title=='石油类') {
					item.toplimit=20
					item.botlimit=null
				}else if (item.title=='氨氮') {
					item.toplimit=45
					item.botlimit=35
				}else if (item.title=='总氮') {
					item.toplimit=70
					item.botlimit=null
				}else if (item.title=='总磷') {
					item.toplimit=8
					item.botlimit=5
				}
			})	
			},
			afterDoSave:function(){
				
				if (this.mainModel.opType=='create') {
					this.mainModel.vo.detail=JSON.parse(this.mainModel.vo.detail)
				}
			}
		},
		events: {
		},
		init: function () {
			this.$api = api;
		}
	});

	return detail;
});