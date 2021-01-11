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
//	var ltTagAgentFormModal = require("componentsEx/formModal/ltTagAgentFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "ltTagAgent",
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
	                url: "lttagagent/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
                    {
                        fieldName:'code',
                        fieldType: "link",
                        filterType: "text",
                        title: "所属部门",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.org && data.org.id) {

                                return '<span class="text-link">' + LIB.LIB_BASE.tableMgr.rebuildOrgName(data.org.id, 'dept') + '</span>';
                            }
                        },
                        // filterType: "text",
                        // filterName: "criteria.strValue.deptName",
                        // fieldName: "orgId",
                        width: 160
                    },
                    {
                        title: "所属公司",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.org && data.org.compId) {
                                return LIB.LIB_BASE.tableMgr.rebuildOrgName(data.org.compId, 'comp');
                            }
                        },
                        width: 160
                    },
					{
						//标签类型
						title: "安全职责",
						fieldName: "attr1",
						filterType: "text"
					}
					//  LIB.tableMgr.column.disable,
					// {
					// 	//标签名称
					// 	title: "标签名称",
					// 	fieldName: "tagName",
					// 	filterType: "text"
					// },
					//  LIB.tableMgr.column.company,
					//  LIB.tableMgr.column.dept,
					//  LIB.tableMgr.column.modifyDate,
					//  LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/lttagagent/importExcel"
            },
            exportModel : {
                url: "/lttagagent/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ltTagAgentFormModel : {
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
//			"lttagagentFormModal":ltTagAgentFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ltTagAgentFormModel.show = true;
//				this.$refs.lttagagentFormModal.init("create");
//			},
//			doSaveLtTagAgent : function(data) {
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
