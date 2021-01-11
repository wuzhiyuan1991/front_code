define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var detailPanel = require("./detail");

	// LIB.registerDataDic("icm_admin_punish_status", [
	// 	["1","正常"],
	// 	["2","异议"],
	// 	["3","撤销"],
	// 	["10","其他"]
	// ]);
	//
	// LIB.registerDataDic("icm_admin_punish_type", [
	// 	["1","警告"],
	// 	["2","罚款"],
	// 	["3","没收违法所得或者没收非法财物"],
	// 	["4","责令停产停业"],
	// 	["5","暂扣或者吊销许可"],
	// 	["6","暂扣或者吊销执照"]
	// ]);

    
    var initDataModel = function () {
        return {
            moduleCode: "adminPunish",
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
	                url: "adminpunish/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 // LIB.tableMgr.column.disable,
					 // LIB.tableMgr.column.company,
					 // LIB.tableMgr.column.dept,
						{
							//处罚文号
							title: "处罚文号",
							fieldName: "number",
							filterType: "text"
						},
						{
							//处罚对象
							title: "处罚对象",
							fieldName: "applicable",
							filterType: "text"
						},
						{
							//处罚类别 1:警告,2:罚款,3:没收违法所得或者没收非法财物,4:责令停产停业,5:暂扣或者吊销许可,6:暂扣或者吊销执照
							title: "处罚类别",
							fieldName: "type",
							orderName: "type",
							filterName: "criteria.intsValue.type",
							filterType: "enum",
							fieldType: "custom",
							popFilterEnum: LIB.getDataDicList("icm_admin_punish_type"),
							render: function (data) {
								return LIB.getDataDic("icm_admin_punish_type", data.type);
							}
						},
						{
							//处罚事由
							title: "处罚事由",
							fieldName: "reason",
							filterType: "text",
							width:250
						},
						{
							//处罚依据
							title: "处罚依据",
							fieldName: "basis",
							filterType: "text",
							width:250
						},
						{
							//处罚结果
							title: "处罚结果",
							fieldName: "result",
							filterType: "text",
							width:250
						},
						_.extend(_.clone(LIB.tableMgr.column.company),{width:300})
// 					{
// 						//公示期限
// 						title: "公示期限",
// 						fieldName: "endDate",
// 						filterType: "date"
// //						fieldType: "custom",
// //						render: function (data) {
// //							return LIB.formatYMD(data.endDate);
// //						}
// 					},
// 					{
// 						//处罚机关
// 						title: "处罚机关",
// 						fieldName: "government",
// 						filterType: "text"
// 					},

//					 LIB.tableMgr.column.remark,

//					{
//						//处罚决定日期
//						title: "处罚决定日期",
//						fieldName: "startDate",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.startDate);
////						}
//					},
//					{
//						//当前状态 1:正常,2:异议,3:撤销,10:其他
//						title: "当前状态",
//						fieldName: "status",
//						orderName: "status",
//						filterName: "criteria.intsValue.status",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("icm_admin_punish_status"),
//						render: function (data) {
//							return LIB.getDataDic("icm_admin_punish_status", data.status);
//						}
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
                url: "/adminpunish/importExcel"
            },
            exportModel : {
                url: "/adminpunish/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				adminPunishFormModel : {
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
//			"adminpunishFormModal":adminPunishFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.adminPunishFormModel.show = true;
//				this.$refs.adminpunishFormModal.init("create");
//			},
//			doSaveAdminPunish : function(data) {
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
