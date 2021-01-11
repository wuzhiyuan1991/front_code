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
//	var ptwCatalogFormModal = require("componentsEx/formModal/ptwCatalogFormModal");


	LIB.registerDataDic("iptw_catalog_enable_commitment", [
		["0","否"],
		["1","是"]
	]);


	LIB.registerDataDic("iptw_catalog_is_inherent", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_catalog_is_multiple", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_catalog_signer_type", [
		["1","作业申请"],
		["2","作业批准"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "ptwSignCatalog9",
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
	                url: "ptwcatalog/list{/curPage}{/pageSize}?type=5",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//作业签发人
						title: "作业签发人",
						fieldName: "name",
						filterType: "text"
					},
					{
						//承诺内容
						title: "承诺内容",
						fieldName: "content",
						filterType: "text",
						width:500
					},
					{
						//应用承诺 0:否,1:是
						title: "应用承诺",
						fieldName: "enableCommitment",
						orderName: "enableCommitment",
						filterName: "criteria.intsValue.enableCommitment",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_catalog_enable_commitment"),
						render: function (data) {
							return LIB.getDataDic("iptw_catalog_enable_commitment", data.enableCommitment);
						}
					},
					{
						//是否可复选签发人 0:否,1:是
						title: "可复选",
						fieldName: "isMultiple",
						orderName: "isMultiple",
						filterName: "criteria.intsValue.isMultiple",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_catalog_is_multiple"),
						render: function (data) {
							return LIB.getDataDic("iptw_catalog_is_multiple", data.isMultiple);
						}
					},
					{
						//签发人类型 1:作业申请,2:作业批准
						title: "作业固有角色",
						fieldName: "signerType",
						orderName: "signerType",
						filterName: "criteria.intsValue.signerType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_catalog_signer_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_catalog_signer_type", data.signerType);
						},
						width:140
					},
					LIB.tableMgr.column.disable
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ptwcatalog/importExcel"
            },
            exportModel : {
                url: "/ptwcatalog/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ptwCatalogFormModel : {
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
//			"ptwcatalogFormModal":ptwCatalogFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ptwCatalogFormModel.show = true;
//				this.$refs.ptwcatalogFormModal.init("create");
//			},
//			doSavePtwCatalog : function(data) {
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
