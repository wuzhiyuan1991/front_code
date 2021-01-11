define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
	var detailPanel = require("./detail");
     var modalSelWorkCatalog=require("../comonents/modal-sel-workcatalog");
	LIB.registerDataDic("iptw_card_tpl_enable_dept_prin", [
		["0","不需要"],
		["1","需要"]
	]);

	LIB.registerDataDic("iptw_card_tpl_enable_electric_isolation", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_card_tpl_enable_gas_detection", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_card_tpl_enable_mechanical_isolation", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_card_tpl_enable_process_isolation", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_card_tpl_enable_prod_prin", [
		["0","不需要"],
		["1","需要"]
	]);

	LIB.registerDataDic("iptw_card_tpl_enable_rel_pin", [
		["0","不需要"],
		["1","需要"]
	]);

	LIB.registerDataDic("iptw_card_tpl_enable_safety_educator", [
		["0","不需要"],
		["1","需要"]
	]);

	LIB.registerDataDic("iptw_card_tpl_enable_security_prin", [
		["0","不需要"],
		["1","需要"]
	]);

	LIB.registerDataDic("iptw_card_tpl_enable_supervisor", [
		["0","不需要"],
		["1","需要"]
	]);

	LIB.registerDataDic("iptw_card_tpl_enable_system_mask", [
		["0","否"],
		["1","是"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "ptwCardTpl",
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
	                url: "ptwcardtpl/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.company,
					{
						//作业票模板名称
						title: "作业票模板名称",
						fieldName: "name",
						filterType: "text",
						width: 300,
					},
					{
						title: "作业类型",
						fieldName: "workCatalog.name",
						filterType: "text",
					},
					{
						title: "作业级别",
						fieldName: "workLevel.name",
						orderName: "workLevelId",
						filterType: "text",
					},
					{
						title: "创建人",
						fieldName: "creator.name",
						orderName: "createBy",
						filterType: "text",
					},
					 LIB.tableMgr.column.disable,
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
			workCatalogModal:{
            	visible:false,
			},
            uploadModel: {
                url: "/ptwcardtpl/importExcel"
            },
            exportModel : {
                url: "/ptwcardtpl/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ptwCardTplFormModel : {
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
			"modalSelWorkCatalog":modalSelWorkCatalog,
        },
        methods: {
			doAdd : function(data) {
				this.$refs.selTpl.show();
			},
			doSelWorkCatalog:function (data) {
				data.workCatalogId=data.workCatalog.id;
				data.workLevelId=data.workLevel?data.workLevel.id:undefined;
				this.$broadcast('ev_dtReload', "create",null,data);
				this.detailModel.show = true;
			},
			doSavePtwCardTpl : function(data) {
				this.doSave(data);
			}
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
