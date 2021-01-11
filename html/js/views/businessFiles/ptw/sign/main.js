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
        	selectOrgId:null,
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
						// popFilterEnum: LIB.getDataDicList("iptw_catalog_signer_type"),
                        popFilterEnum: [{id:1,value:'是'},{id:2,value:'否'}],
						render: function (data) {
							if(data.signerType == '1') return '是';
							else return '否';
							// return LIB.getDataDic("iptw_catalog_signer_type", data.signerType);
						},
						width: 140
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
            selectOrgId: null
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

			initData: function () {
				var _this = this;
				setTimeout(function () {
                    _this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.compId})
             
                    _this.selectOrgId = LIB.user.compId;
                    // _this.doOrgCategoryChange({nodeId:_this.selectOrgId });
                },200)
            },

            doOrgCategoryChange: function(obj) {
                //obj.categoryType
                var data = {};
                //条件 标题
                data.displayTitle = "";
                //条件 内容
                data.displayValue = "";
                //条件 后台搜索的 属性
                data.columnFilterName = "compId";
                //条件 后台搜索的 值
                if (obj.categoryType == "org" && obj.topNodeId == obj.nodeId) {
                    //如果是根据当前最大组织机构过滤时,则不传参数,后台默认处理
					data.columnFilterValue = null;
					var node = _this.$refs.categorySelector.model[0].data;
                    this.selectOrgId = node[0].id;
                } else {
                    data.columnFilterValue = obj.nodeId;
                    this.selectOrgId = obj.nodeId;
                }

                this.emitMainTableEvent("do_query_by_filter", { type: "save", value: data });
            },

        },
		ready:function () {
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.compId})
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });
    return vm;
});
