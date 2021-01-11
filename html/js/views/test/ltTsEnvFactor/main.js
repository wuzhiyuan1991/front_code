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
//	var ltTsEnvFactorFormModal = require("componentsEx/formModal/ltTsEnvFactorFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "ltTsEnvFactor",
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
	                url: "lttsenvfactor/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,

                    {
                        title: "项目名称",
                        // filterType: "text",
                        fieldType: "custom",
                        // filterName : "project.name",
                        render: function (data) {
                            if (data.project) {
                                return data.project.name;
                            }
                        }
                    },

                    {
                        title: "施工单位",
                        // filterType: "text",
                        fieldType: "custom",
                        // filterName : "project.name",
                        render: function (data) {
                            if (data.project) {
                                return data.project.name;
                            }
                        }
                    },
                    {
                        title: "项目负责人",
                        // filterType: "text",
                        fieldType: "custom",
                        // filterName : "project.name",
                        render: function (data) {
                            if (data.project) {
                                return data.project.ownerName;
                            }
                        }
                    },
                    {
                        title: "建设负责人",
                        // filterType: "text",
                        fieldType: "custom",
                        // filterName : "project.name",
                        render: function (data) {
                            if (data.project) {
                                return data.project.constructionOwnerName;
                            }
                        }
                    },
                    {
                        title: "施工负责人",
                        // filterType: "text",
                        fieldType: "custom",
                        // filterName : "project.name",
                        render: function (data) {
                            if (data.project) {
                                return data.project.builderOwnerName;
                            }
                        }
                    },
                    {
                        title: "监理负责人",
                        // filterType: "text",
                        fieldType: "custom",
                        // filterName : "project.name",
                        render: function (data) {
                            if (data.project) {
                                return data.project.supervisionOwnerName;
                            }
                        }
                    },
					// {
					// 	//可导致的危害描述
					// 	title: "可导致的危害描述",
					// 	fieldName: "hazardDesc",
					// 	filterType: "text"
					// },
					// {
					// 	//危险源及环境因素描述
					// 	title: "危险源及环境因素描述",
					// 	fieldName: "sourceDesc",
					// 	filterType: "text"
					// },
					// {
					// 	//防范措施
					// 	title: "防范措施",
					// 	fieldName: "measureDesc",
					// 	filterType: "text"
					// },
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
                     LIB.tableMgr.column.disable,
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/lttsenvfactor/importExcel"
            },
            exportModel : {
                url: "/lttsenvfactor/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ltTsEnvFactorFormModel : {
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
//			"lttsenvfactorFormModal":ltTsEnvFactorFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ltTsEnvFactorFormModel.show = true;
//				this.$refs.lttsenvfactorFormModal.init("create");
//			},
//			doSaveLtTsEnvFactor : function(data) {
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
