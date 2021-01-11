define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var ltOsDanWorkRegisterFormModal = require("componentsEx/formModal/ltOsDanWorkRegisterFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "ltOsDanWorkRegister",
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
	                url: "ltosdanworkregister/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 // LIB.tableMgr.column.disable,
					_.extend({}, LIB.tableMgr.column.dept, {title: "作业部门"}),
					{
						//作业地点
						title: "作业地点",
						fieldName: "workAddress",
						filterType: "text"
					},
					{
						//作业开始日期
						title: "作业开始日期",
						fieldName: "startDate",
						filterType: "date"
					},
					{
						//作业结束日期
						title: "作业结束日期",
						fieldName: "endDate",
						filterType: "date"
					},
					{
						//部门负责人
						title: "部门负责人",
						fieldName: "ownerName",
						filterType: "text"
					},
					{
						//作业内容
						title: "作业内容",
						fieldName: "content",
						filterType: "text"
					},
					{
						//作业类型
						title: "作业类型",
						fieldName: "type",
						filterType: "text"
					},
					{
						//分管领导意见
						title: "分管领导意见",
						fieldName: "leaderAdvice",
						filterType: "text"
					},
					{
						//直接作业人员
						title: "直接作业人员",
						fieldName: "mainWorkerName",
						filterType: "text"
					},
					{
						//现场指挥人员
						title: "现场指挥人员",
						fieldName: "commanderName",
						filterType: "text"
					},
					{
						//现场监护人员
						title: "现场监护人员",
						fieldName: "guardianName",
						filterType: "text"
					},
					{
						//安全管理部门意见
						title: "安全管理部门意见",
						fieldName: "deptAdvice",
						filterType: "text"
					},
					{
						//安全措施
						title: "安全措施",
						fieldName: "measure",
						filterType: "text"
					},

//					{
//						//辅助作业人员
//						title: "辅助作业人员",
//						fieldName: "subWorkerName",
//						filterType: "text"
//					},
//					 LIB.tableMgr.column.company,

//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ltosdanworkregister/importExcel"
            },
            exportModel : {
                url: "/ltosdanworkregister/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ltOsDanWorkRegisterFormModel : {
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
//			"ltosdanworkregisterFormModal":ltOsDanWorkRegisterFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ltOsDanWorkRegisterFormModel.show = true;
//				this.$refs.ltosdanworkregisterFormModal.init("create");
//			},
//			doSaveLtOsDanWorkRegister : function(data) {
//				this.doSave(data);
//			}

        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
