define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
	// LIB.registerDataDic("icm_project_three_simultaneous_nature", [
	// 	["1","新建项目"],
	// 	["2","扩建项目"],
	// 	["3","改建项目"],
	// 	["4","迁建项目"],
	// 	["5","恢复项目"],
	// 	["6","技术改造"],
	// 	["7","技术引进"]
	// ]);
	//
	// LIB.registerDataDic("icm_project_three_simultaneous_phase", [
	// 	["1","可行性研究"],
	// 	["2","项目立项"],
	// 	["3","初步设计"],
	// 	["4","详细设计"],
	// 	["5","施工建设"],
	// 	["6","试生产"]
	// ]);

	// LIB.registerDataDic("icm_project_three_simult_task_type", [
	// 	["1","职业病防护"],
	// 	["2","安全防护"],
	// 	["3","防火防护"],
	// 	["4","环境防护"]
	// ]);
	//
	// LIB.registerDataDic("icm_project_three_simult_task_examine_nature", [
	// 	["1","许可"],
	// 	["2","备案"]
	// ]);
	//
	// LIB.registerDataDic("icm_project_three_simult_task_phase", [
	// 	["1","可行性研究"],
	// 	["2","项目立项"],
	// 	["3","初步设计"],
	// 	["4","详细设计"],
	// 	["5","施工建设"],
	// 	["6","试生产"]
	// ]);
	//
	// LIB.registerDataDic("icm_project_three_simult_task_task_nature", [
	// 	["1","公司内部"],
	// 	["2","委托外包"]
	// ]);
	// LIB.registerDataDic("icm_project_three_simult_task_detail_operate", [
	// 	["1","内部评审"],
	// 	["2","外部评审"],
	// 	["3","申请审查"]
	// ]);


	var initDataModel = function () {
        return {
            moduleCode: "projThrSimultaneous",
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
	                url: "projthrsimultaneous/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
						 LIB.tableMgr.column.cb,
						 LIB.tableMgr.column.code,
						{
							//项目名称
							title: "项目名称",
							fieldName: "name",
							filterType: "text",
							width:300
						},
						{
							//项目简述
							title: "项目简述",
							fieldName: "description",
							filterType: "text",
							width:300
						},
						{
							//项目计划启动时间
							title: "项目计划启动时间",
							fieldName: "planStartDate",
							filterType: "date",
//						fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.planStartDate);
						},
						width:155
						},
						{
							//项目计划完成时间
							title: "项目计划完成时间",
							fieldName: "planEndDate",
							filterType: "date",
						// fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.planEndDate);
						},
						width:155
						},
						{
							//项目实际启动时间
							title: "项目实际启动时间",
							fieldName: "realStartDate",
							filterType: "date",
							// fieldType: "custom",
							render: function (data) {
								return LIB.formatYMD(data.realStartDate);
							},
							width:155
						},
						{
							//项目实际完成时间
							title: "项目实际完成时间",
							fieldName: "realEndDate",
							filterType: "date",
						// fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.realEndDate);
						},
						width:155
						},
						{
							//项目性质 1:新建项目,2:扩建项目,3:改建项目,4:迁建项目,5:恢复项目,6:技术改造,7:技术引进
							title: "项目性质",
							fieldName: "nature",
							orderName: "nature",
							filterName: "criteria.intsValue.nature",
							filterType: "enum",
							fieldType: "custom",
							popFilterEnum: LIB.getDataDicList("icm_project_three_simultaneous_nature"),
							render: function (data) {
								return LIB.getDataDic("icm_project_three_simultaneous_nature", data.nature);
							},
							width:100
						},


					 // LIB.tableMgr.column.disable,
					 // LIB.tableMgr.column.company,
					 // LIB.tableMgr.column.dept,
						{
							//项目建设单位
							title: "项目建设单位",
							fieldName: "buildDept",
							filterType: "text",
							width:250
						},

						{
							//项目设计单位
							title: "项目设计单位",
							fieldName: "designDept",
							filterType: "text",
							width:250
							
						},
						_.extend(_.clone(LIB.tableMgr.column.company),{width:300})
	// 					{
	// 						//项目完成时间
	// 						title: "项目完成时间",
	// 						fieldName: "endDate",
	// 						filterType: "date"
	// //						fieldType: "custom",
	// //						render: function (data) {
	// //							return LIB.formatYMD(data.endDate);
	// //						}
	// 					},

//					{
//						//项目总包单位
//						title: "项目总包单位",
//						fieldName: "headDept",
//						filterType: "text"
//					},
//					{
//						//项目管理单位
//						title: "项目管理单位",
//						fieldName: "manageDept",
//						filterType: "text"
//					},

//					{
//						//项目业主
//						title: "项目业主",
//						fieldName: "owner",
//						filterType: "text"
//					},
//					{
//						//项目阶段 1:可行性研究,2:项目立项,3:初步设计,4:详细设计,5:施工建设,6:试生产
//						title: "项目阶段",
//						fieldName: "phase",
//						orderName: "phase",
//						filterName: "criteria.intsValue.phase",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("icm_project_three_simultaneous_phase"),
//						render: function (data) {
//							return LIB.getDataDic("icm_project_three_simultaneous_phase", data.phase);
//						}
//					},



//					 LIB.tableMgr.column.remark,
////					{
//						//项目启动时间
//						title: "项目启动时间",
//						fieldName: "startDate",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.startDate);
////						}
//					},
//					{
//						//项目监理单位
//						title: "项目监理单位",
//						fieldName: "superviseDept",
//						filterType: "text"
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
                url: "/projthrsimultaneous/importExcel"
            },
            exportModel : {
                url: "/projthrsimultaneous/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				projThrSimultaneousFormModel : {
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
//			"projthrsimultaneousFormModal":projThrSimultaneousFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.projThrSimultaneousFormModel.show = true;
//				this.$refs.projthrsimultaneousFormModal.init("create");
//			},
//			doSaveProjThrSimultaneous : function(data) {
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
