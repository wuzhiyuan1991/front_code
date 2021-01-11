define(function(require){
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	//编辑弹框页面
	var editComponent = require("./dialog/edit");
 	//Vue数据模型
 	var dataModel = function(){
		return{

			moduleCode : LIB.ModuleCode.BD_RiA_HazF,
			tableModel:{
				url : "hazardfactor/list{/curPage}{/pageSize}",
				selectedDatas:[],

				columns:[ {
					title : "",
					fieldName : "id",
					fieldType : "cb",
				},  {
					//title : "编码",
					title: this.$t("gb.common.code"),
					fieldName : "code",
					orderName:"code",
					width:'160px',
					filterType : "text"
				},{
					//title : "名称",
					title: this.$t("gb.common.name"),
					fieldName : "name",
					orderName:"name",
					filterType : "text"
				},
					{
						//title : "上级分类",
						title: this.$t("bd.hal.categoryParent"),
						fieldType : "custom",
						orderName:"parentId",
						render: function(data){
							if(data.parentHazardFactor){
								return data.parentHazardFactor.name;
							}
						},
						filterType : "text",
						filterName : "parentHazardFactor.name",

					},
					{
						//title : "描述",
						title: this.$t("gb.common.describe"),
						fieldName : "description",
						orderName:"description",
						filterType : "text"
					}]
			},
			//控制全部分类组件显示
			mainModel : {
				//显示分类
				showCategory : false,
				showHeaderTools:false,
				//当前grid所选中的行
				selectedRow : []
			},
			editModel : {
				//控制编辑组件显示
				title : "新增",
				//显示编辑弹框
				show : false,
				//编辑模式操作类型
				type : "create",
				id: null
			},
			uploadModel: {
				url: "/hazardfactor/importExcel"
			},
			exportModel : {
				url: "/hazardfactor/exportExcel"
			}
		}
 	};


	var vm = LIB.VueEx.extend({
		template:require("text!./main.html"),
		data:dataModel,
		components : {
			"editcomponent":editComponent
		},
		methods:{
			doCategoryChange : function(obj) {
//            	if(obj.categoryType == "xxx") {
//            	}
            },
			//显示全部分类
			doShowCategory:function(){
				this.mainModel.showCategory = !this.mainModel.showCategory;
			},
			//新增方法
			doAdd : function(){
				this.editModel.show = true;
				this.editModel.title = "新增";
				this.editModel.opType = "create";
				this.editModel.id = null;
				this.$broadcast('ev_editReload', null);
			},
			//修改方法
			doUpdate:function(){
				var rows = this.tableModel.selectedDatas;
				if(rows.length > 1){
					LIB.Msg.warning("无法批量修改数据");
					return;
				}
				var row = rows[0];
				this.editModel.show = true;
				this.editModel.title = "修改";
				this.editModel.opType = "update";
				this.editModel.id = row.id;
				this.$broadcast('ev_editReload',row.id);
			},
			//删除方法
			doDelete:function(){
				var _this = this;
				var deleteIds = _.map(this.tableModel.selectedDatas,function(row){return row.id});
                if(deleteIds.length > 1){
                    LIB.Msg.warning("无法批量删除数据");
                    return;
                }
				LIB.Modal.confirm({
					title:'删除选中数据?',
					onOk:function(){
						api._delete(null,deleteIds).then(function(data){
							 if (data.data && data.error != '0') {
	                                return;
	                            } else {
	                            	_this.emitMainTableEvent("do_update_row_data", {opType:"remove", value: _this.tableModel.selectedDatas});
	                                LIB.Msg.success("删除成功");
	                            }
						});
					}
				});
			},
			//导出方法
			doExport:function(){
				LIB.Modal.confirm({
					title:'导出选中数据?',
					onOk:function(){
//						var rows = LIB.jqxHelper.getSelectedData(gridSel);
//						var deleteIds = _.map(rows,function(row){return row.id});
						LIB.Msg.warning("导出");
					}
				});
			}
		},

		//响应子组件$dispatch的event
		events : {
			"ev_gridRefresh" : function() {
				this.emitMainTableEvent("do_update_row_data", {opType:"add"});
				this.editModel.show = false;
			},
            //edit框点击保存后事件处理
            "ev_editFinshed" : function(data) {
                this.emitMainTableEvent("do_update_row_data", {opType:"update", value: data});
                this.editModel.show = false;
            },
            //edit框点击取消后事件处理
            "ev_editCanceled" : function() {
                this.editModel.show = false;
            }
        }
	});
	return vm;
});