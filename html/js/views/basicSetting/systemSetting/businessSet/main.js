define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    
	//Legacy模式
//	var systemBusinessSetFormModal = require("componentsEx/formModal/systemBusinessSetFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "systemBusinessSet",
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
	                url: "systembusinessset/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//配置名称
						title: "配置名称",
						fieldName: "name",
						filterType: "text"
					},
                    {
                        title: "完整名称",
                        fieldName: "attr1",
                        filterType: "text"
                    },
                    {
                        title: "类别",
                        fieldName: "attr5",
                        filterType: "text"
                    },
					// {
					// 	//是否为默认配置
					// 	title: "是否为默认配置",
					// 	fieldName: "isDefault",
					// 	filterType: "number"
					// },
					//  LIB.tableMgr.column.company,
					//  LIB.tableMgr.column.dept,
					{
						//配置值
						title: "配置值",
						fieldName: "result",
						filterType: "number"
					},
                    {
                        //描述
                        title: "描述",
                        fieldName: "description",
                        filterType: "text",
                        width:300
                    },
					// {
					// 	//是否可以修改
					// 	title: "是否可以修改",
					// 	fieldName: "unmodified",
					// 	filterType: "number"
					// },
					 LIB.tableMgr.column.modifyDate,
//					 LIB.tableMgr.column.createDate,
//
	                ],
                    defaultFilterValue: { "compId": "9999999999" }
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/systemBusinessSet/importExcel"
            },
            exportModel : {
            	 url: "/systemBusinessSet/exportExcel"
            },
			//Legacy模式
//			formModel : {
//				systemBusinessSetFormModel : {
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
//			"systembusinesssetFormModal":systemBusinessSetFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.systemBusinessSetFormModel.show = true;
//				this.$refs.systembusinesssetFormModal.init("create");
//			},
//			doSaveSystemBusinessSet : function(data) {
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
