define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    //var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    
	//Legacy模式
//	var checkObjectFormModal = require("componentsEx/formModal/checkObjectFormModal");

    
    var initDataModel = function () {
        return {
			moduleCode : LIB.ModuleCode.BD_HaI_InsO,
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "checkobject/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [ {
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
						//title : "受检对象名称",
						title:this.$t("bd.hal.nameOfSubject"),
						orderName : "name",//排序字段
						fieldName : "name",
						filterType : "text"
					}, {
						//title : "负责人",
						title:this.$t("gb.common.personInCharge"),
						orderName:"user.username",//排序字段
						fieldName : "firstUser.username",
						//fieldType:"custom",
						//render: function(data){
						//	if(data.firstUser){
						//		return data.firstUser.username;
						//	}
						//},
						filterType : "text",
						filterName : "criteria.strValue.username"
					},
					//	{
					//	//title : "组织机构",
					//	title:this.$t("gb.common.organizatInfo"),
					//	orderName:"organization.name",
					//	fieldName : "organization.name",
					//	//fieldType:"custom",
					//	//render: function(data){
					//	//	if(data.organization){
					//	//		return data.organization.name;
					//	//	}
					//	//},
					//	filterType : "text",
					//	filterName : "criteria.strValue.orgname"
					//},
						LIB.tableMgr.column.company,
						LIB.tableMgr.column.dept,
						{
						//title : "状态",
						title:this.$t("gb.common.state"),
						orderName : "disable",//排序字段
						fieldName : "disable",
						filterType : "enum",
						filterName : "criteria.intsValue.disable"
					}, {
						//title : "创建时间",
						title:this.$t("gb.common.createTime"),
						fieldName : "createDate",
						filterType : "date"
					}, {
						//title : "修改时间",
						title:this.$t("gb.common.modifyTime"),
						fieldName : "modifyDate",
						filterType : "date"
					}]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/checkobject/importExcel"
            },
            exportModel : {
            	 url: "/checkobject/exportExcel"
            },
			//Legacy模式
//			formModel : {
//				checkObjectFormModel : {
//					show : false,
//				}
//			}
            
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
		//Legacy模式
//		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
			//Legacy模式
//			"checkobjectFormModal":checkObjectFormModal,
            
        },
        methods: {
			//doDisable:function(){
				//var row = dataModel.mainModel.vo;
				//var _this = this;
				//this.findAuth({pojoName:"checkobject",commandType:1,orgId:row.orgId},function(){
				//	var diable = dataModel.mainModel.vo.disable==0?1:0;
				//	var ids = new Array();
				//	ids.push(dataModel.mainModel.vo.id);
				//	api.batchUpdate({disable:diable},ids).then(function(res){
				//		var info = diable==0?'启用':'停用';
				//		LIB.Msg.info("已"+info+"!");
                //
				//		dataModel.mainModel.vo.disable = diable;
				//		_this.$dispatch("ev_detailFinshed",dataModel.mainModel.vo);
				//	});
				//});
			//},
			////启用停用
			//doOpen:function(){
			//	//执行启用
			//	var _this = this;
			//	var rows = this.tableModel.selectedDatas;
			//	if(rows.length>1){
			//		LIB.Msg.warning("不支持多个启用！");
			//		return
			//	}
			//	var checkObject = rows[0];
             //   checkObject.disable = "0";
			//	api.update(null,checkObject).then(function(data){
			//		if(data.data && data.error != '0'){
			//			return;
			//		}else{
			//			LIB.Msg.info("已启用");
             //           _this.refreshMainTable();
			//		}
			//	});
			//},
			//doClose:function(){
			//	//执行停用
             //   var _this = this;
             //   var rows = this.tableModel.selectedDatas;
             //   if(rows.length>1){
             //       LIB.Msg.warning("不支持多个停用！");
             //       return
             //   }
             //   var checkObject = rows[0];
             //   checkObject.disable = "1";
             //   api.update(null,checkObject).then(function(data){
             //       if(data.data && data.error != '0'){
             //           return;
             //       }else{
             //           LIB.Msg.info("已停用");
             //           _this.refreshMainTable();
             //       }
             //   });
			//},
			//启用停用
			doEnableDisable:function(){
				var _this = this;
				var rows = _this.tableModel.selectedDatas;
				if(rows.length>1){
					LIB.Msg.warning("无法批量修改启用停用");
					return
				}
				var checkObject = rows[0];
				//0启用，1禁用
				if(checkObject.disable=='0'){
					checkObject.disable="1"
					api.update(null,checkObject).then(function (res) {
						_this.refreshMainTable();
						LIB.Msg.info("停用成功!");
					});
				}else{
					checkObject.disable ="0"
					api.update(null,checkObject).then(function (res) {
						_this.refreshMainTable();
						LIB.Msg.info("启用成功!");
					});
				}
			},

			doDetailFinshed:function(){
				this.refreshMainTable();
			}
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.checkObjectFormModel.show = true;
//				this.$refs.checkobjectFormModal.init("create");
//			},
//			doSaveCheckObject : function(data) {
//				this.doSave(data);
//			}

        },
        //events: {
			//"ev_detailFinshed" : function() {
			//	this.refreshMainTable();
			//},
        //},
        ready: function(){
        	this.$api = api;
        }
    });

    return vm;
});
