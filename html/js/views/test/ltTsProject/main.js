define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var ltTsProjectFormModal = require("componentsEx/formModal/ltTsProjectFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "ltTsProject",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "lttsproject/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//项目名称
						title: "项目名称",
						fieldName: "name",
						filterType: "text"
					},
					{
						//项目负责人
						title: "项目负责人",
						fieldName: "ownerName",
						filterType: "text"
					},
					{
						//申请日期
						title: "申请日期",
						fieldName: "applyDate",
						filterType: "date",
						fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.applyDate);
						}
					},
					{
						//批准日期
						title: "批准日期",
						fieldName: "approveDate",
						filterType: "date",
						fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.approveDate);
						}
					},
					{
						//建设单位
						title: "建设单位",
						fieldName: "constructionName",
						filterType: "text"
					},
					// {
					// 	//建设单位负责人
					// 	title: "建设单位负责人",
					// 	fieldName: "constructionOwnerName",
					// 	filterType: "text"
					// },
					// {
					// 	//施工单位负责人
					// 	title: "施工单位负责人",
					// 	fieldName: "builderOwnerName",
					// 	filterType: "text"
					// },
					{
						//施工单位
						title: "施工单位",
						fieldName: "builderName",
						filterType: "text"
					},
					// {
					// 	//建设单位负责人联系电话
					// 	title: "建设单位负责人联系电话",
					// 	fieldName: "constructionOwnerMobile",
					// 	filterType: "text"
					// },
					// {
					// 	//监管单位负责人联系电话
					// 	title: "监管单位负责人联系电话",
					// 	fieldName: "supervisionOwnerMobile",
					// 	filterType: "text"
					// },
					// {
					// 	//施工单位负责人联系电话
					// 	title: "施工单位负责人联系电话",
					// 	fieldName: "builderOwnerMobile",
					// 	filterType: "text"
					// },
//					{
//						//监管单位负责人
//						title: "监管单位负责人",
//						fieldName: "supervisionOwnerName",
//						filterType: "text"
//					},
//					{
//						//监管单位
//						title: "监管单位",
//						fieldName: "supervisionName",
//						filterType: "text"
//					},
					 LIB.tableMgr.column.disable,
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,

//						//预计完成日期
//						title: "预计完成日期",
//						fieldName: "jobEndDate",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.jobEndDate);
////						}
//					},
//					{
//						//开工日期
//						title: "开工日期",
//						fieldName: "jobStartDate",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.jobStartDate);
////						}
//					},
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
                url: "/lttsproject/importExcel"
            },
            exportModel : {
                url: "/lttsproject/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ltTsProjectFormModel : {
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
//			"lttsprojectFormModal":ltTsProjectFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ltTsProjectFormModel.show = true;
//				this.$refs.lttsprojectFormModal.init("create");
//			},
//			doSaveLtTsProject : function(data) {
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
