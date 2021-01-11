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
//	var ptwWorkPersonnelFormModal = require("componentsEx/formModal/ptwWorkPersonnelFormModal");

	LIB.registerDataDic("iptw_work_personnel_type", [
		["1","作业申请人"],
		["2","作业负责人"],
		["3","作业监护人"],
		["4","生产单位现场负责人"],
		["5","主管部门负责人"],
		["6","安全部门负责人"],
		["7","相关方负责人"],
		["8","许可批准人"],
		["9","安全教育人"],
		["10","作业人员"]
	]);

	LIB.registerDataDic("iptw_work_personnel_sign_result", [
		["1","通过"],
		["2","否决"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "ptwWorkPersonnel",
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
	                url: "ptwworkpersonnel/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.disable,
					{
						//人员类型 1:作业申请人,2:作业负责人,3:作业监护人,4:生产单位现场负责人,5:主管部门负责人,6:安全部门负责人,7:相关方负责人,8:许可批准人,9:安全教育人,10:作业人员
						title: "人员类型",
						fieldName: "type",
						orderName: "type",
						filterName: "criteria.intsValue.type",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_personnel_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_personnel_type", data.type);
						}
					},
					{
						//作业完成意见（限作业申请人）
						title: "作业完成意见（限作业申请人）",
						fieldName: "completionOpinion",
						filterType: "text"
					},
					{
						//会签意见
						title: "会签意见",
						fieldName: "signOpinion",
						filterType: "text"
					},
					{
						//会签结果 1:通过,2:否决
						title: "会签结果",
						fieldName: "signResult",
						orderName: "signResult",
						filterName: "criteria.intsValue.signResult",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_personnel_sign_result"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_personnel_sign_result", data.signResult);
						}
					},
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ptwworkpersonnel/importExcel"
            },
            exportModel : {
                url: "/ptwworkpersonnel/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ptwWorkPersonnelFormModel : {
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
//			"ptwworkpersonnelFormModal":ptwWorkPersonnelFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ptwWorkPersonnelFormModel.show = true;
//				this.$refs.ptwworkpersonnelFormModal.init("create");
//			},
//			doSavePtwWorkPersonnel : function(data) {
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
