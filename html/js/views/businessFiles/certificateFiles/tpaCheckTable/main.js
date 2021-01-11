define(function(require){
	//基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    //var detailComponent = require("./detail");
	var detailComponent = require("./detail-xl");
	//导入
    var importProgress = require("componentsEx/importProgress/main");
    //编辑弹框页面
    //var editComponent = require("./edit");
 	//Vue数据模型
    var dataModel = function(){
		return{
			moduleCode : LIB.ModuleCode.BD_HaI_CheL,
			categoryModel : {
				config:[{
					NodeEdit:true,
					title:"业务分类",
					url:"checktabletype/list",
					type:"business"
				}]
			},
			editResult:false,
			tableModel: LIB.Opts.extendMainTableOpt(
				{
				url : "tpachecktable/list{/curPage}{/pageSize}?tableType=20",
				selectedDatas:[],

				columns:[ {
					title : "",
					fieldName : "id",
					fieldType : "cb",
				}, {
					//title : "编码",
					title: this.$t("gb.common.code"),
					fieldName : "code",
					width:'200px',
					orderName:"code",
					fieldType : "link",
					filterType : "text"
				}, {
					//title : "检查表名称",
					title: this.$t("gb.common.CheckTableName"),
					orderName : "name",
					fieldName : "name",
					filterType : "text"
				}, {
					//title : "分类",
					title: this.$t("bd.hal.checkTableClass"),
					orderName:"checktabletype.name",
					fieldName : "checkTableType.name",
					//fieldType:"custom",
					//render: function(data){
					//	if(data.checkTableType){
					//		return data.checkTableType.name;
					//	}
					//},
					filterType : "text",
					filterName : "criteria.strValue.checkTableTypeName"
				}, {
					//title : "类型",
					title: this.$t("gb.common.type"),
					orderName:"type",
					fieldType:"custom",
					render: function(data){
						return LIB.getDataDic("checkTable_type",data.type);
					},
					popFilterEnum : LIB.getDataDicList("checkTable_type"),
					filterType : "enum",
					filterName : "criteria.strsValue.type"
				}, {
					//title : "状态",
					title: this.$t("gb.common.state"),
					orderName : "disable",
					fieldName : "disable",
					filterType : "enum",
					filterName : "criteria.intsValue.disable"
				},
					LIB.tableMgr.column.company,
					//LIB.tableMgr.column.dept,
					{
					//title : "创建时间",
					title: this.$t("gb.common.createTime"),
					fieldName : "createDate",
					filterType : "date"
				}, {
					//title : "修改时间",
					title: this.$t("gb.common.modifyTime"),
					fieldName : "modifyDate",
					filterType : "date"
				}
				]
			}
			),
			//控制全部分类组件显示
			mainModel : {
				//显示分类
				showCategory : false,
				showHeaderTools:false,
				//当前grid所选中的行
				selectedRow : []
			},
			detailModel : {
				//控制编辑组件显示
				title : "新增",
				//显示编辑弹框
				show : false,
				//编辑模式操作类型
				type : "create",
				id: null
			},
			uploadModel: {
				url: "/tpachecktable/importExcel?type=20"
			},
			exportModel : {
				url: "/tpachecktable/exportExcel?type=20"
			},
            templete : {
                url: "/tpachecktable/file/down?type=20"
            },
            importProgress:{
                show: false
            }
			//,
//		editModel : {
//			//控制编辑组件显示
//			title : "新增",
//			//显示编辑弹框
//			show : false,
//			//编辑模式操作类型
//			type : "create",
//			id: null
//		},
//		detailModel : {
//			//控制右侧滑出组件显示
//			show : false
//		}
		}

 	};
 	
		
    //使用Vue方式，对页面进行事件和数据绑定
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
		template
		components
		componentName
		props
		data
		computed
		watch
		methods
		events 
		vue组件声明周期方法 
		created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var tpl = LIB.renderHTML(require("text!./main.html"));
 	var vm = LIB.VueEx.extend({
		template:tpl,
		data:dataModel,
		components : {
//			"editcomponent":editComponent,
			"detailcomponent":detailComponent,
            "importprogress":importProgress
		},
		methods:{
            doImport:function(){
                var _this=this;
                this.importProgress.show = true;
            },
			//业务分类  新增
			doAddCategory : function(obj){
				var _this = this;
				this.editResult = false;
				var data = {
					name:obj.item,
					parentId:obj.parentid,
					code:obj.itemCode
				};
				api.createTableType(data).then(function(res) {
					LIB.Msg.info("已保存!");
					_this.editResult = true;
				});
			},
			//业务分类  修改
			doEditCategory : function(obj){
				var _this = this;
				this.editResult = false;
				var data = {
					id:obj.itemid,
					name:obj.item,
					parentId:obj.parentid,
					code:obj.itemCode
				};
				api.updateTableType(data).then(function(res) {
					LIB.Msg.info("已修改!");
					_this.editResult = true;
				});
			},
			//业务分类  删除
			doDelCategory : function(obj){
				var _this = this;
				this.editResult = false;
				var deleteIds = new Array(obj.itemid);
				api.delTableType(null,deleteIds).then(function(res){
					LIB.Msg.info("已删除!");
					_this.editResult = true;
				});
			},
			//根据分类查询
			doCategoryChange : function(obj) {
				//根据业务分类查询
				var data = {};
				data.columnFilterName = "checkTableTypeId";
				data.columnFilterValue = obj.nodeId;
				this.emitMainTableEvent("do_query_by_filter", {type:"save", value: data});
			
            },
			//显示全部分类
			doShowCategory:function(){
				this.mainModel.showCategory = !this.mainModel.showCategory;
			},
			// doTableCellClick:function(data) {
			// 	if(data.cell.fieldName == "code") {
			// 		this.showDetail(data.entry.data);
			// 	}else{
			// 		this.detailModel.show = false;
			// 	}
			// },
			//显示详情
			showDetail:function(row){
				this.detailModel.show = true;
				this.detailModel.title = "详情";
				this.detailModel.type = "view";
				this.detailModel.id = row.id;
				this.$broadcast('ev_detailReload',"view",row.id);
			},
			//新增方法
			doAdd : function(){
				this.detailModel.show = true;
				this.detailModel.title = "新增";
				this.detailModel.type = "create";
				this.detailModel.id = null;
				this.$broadcast('ev_detailReload',"create", null);
			},
			//修改方法
			doUpdate:function(){
				var rows = this.tableModel.selectedDatas;
				if(rows.length > 1){
					LIB.Msg.warning("无法批量修改数据");
					return;
				}
				var row = rows[0];
				// this.findAuth({pojoName:"checktable",commandType:0,orgId:row.orgId},function(){
					this.detailModel.show = true;
					this.detailModel.title = "修改";
					this.detailModel.type = "update";
					this.detailModel.id = row.id;
					this.$broadcast('ev_detailReload',"update",row.id);
				// });
			},
			//删除方法
			doDelete:function(){
				var _this = this;
				var rows = this.tableModel.selectedDatas;
				var row = rows[0];
				if(rows.length > 1){
					LIB.Msg.warning("无法批量删除数据");
					return;
				}else{
					var delObj = this.tableModel.selectedDatas[0];
					api.del(null,row).then(function(res){
						_this.emitMainTableEvent("do_update_row_data", {opType:"remove", value: _this.tableModel.selectedDatas});
						LIB.Msg.info("已删除!");
					});
				}
			},
			doEnableDisable:function(){
				var _this = this;
				var rows = _this.tableModel.selectedDatas;
				if(rows.length>1){
					LIB.Msg.warning("无法批量启用停用数据");
					return
				}
				var updateIds = rows[0].id,disable = rows[0].disable;
				//0启用，1禁用
				if(disable==0){
					api.batchDisable(null,[updateIds]).then(function (res) {
						_.each(rows, function(row){
							row.disable = 1;
						});
						_this.emitMainTableEvent("do_update_row_data", {opType:"update", value: rows});
						LIB.Msg.info("停用成功!");
					});
				}else{
					api.batchEnable(null,[updateIds]).then(function (res) {
						_.each(rows, function(row){
							row.disable = 0;
						});
						_this.emitMainTableEvent("do_update_row_data", {opType:"update", value: rows});
						LIB.Msg.info("启用成功!");
					});
				}
			},

		},
		//响应子组件$dispatch的event
		events : {
			//edit框点击保存数据后，刷新mian的grid，重新请求数据
			"ev_gridRefresh" : function() {
				this.emitMainTableEvent("do_update_row_data", {opType:"add"});
				//this.editModel.show = false;
			},
			//edit框点击修改后事件处理 修改当前数据
			"ev_editFinshed" : function(data) {
                this.refreshMainTable();
				// this.emitMainTableEvent("do_update_row_data", {opType:"update", value: data});
				//this.detailModel.show = false;
			},
			//edit框点击取消后事件处理
			"ev_editCanceled" : function() {
//				this.editModel.show = false;
				this.detailModel.show = false;
			},
			//edit框点击启用停用后事件处理
			"ev_detailFinshed" : function(data) {
				this.emitMainTableEvent("do_update_row_data", {opType:"update", value: data});
				//this.detailModel.show = false;
			},
			//detail框点击删除后事件处理
			"ev_detailDelFinshed" : function(data) {
				this.emitMainTableEvent("do_update_row_data", {opType:"remove", value: data});
				this.detailModel.show = false;
			},
			//detail框点击关闭后事件处理
			"ev_detailColsed" : function(){
				this.detailModel.show = false;
			}
		}
	});
	
	return vm;
});