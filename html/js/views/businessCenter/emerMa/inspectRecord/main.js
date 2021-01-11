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
//	var emerInspectRecordFormModal = require("componentsEx/formModal/emerInspectRecordFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "emerInspectRecord",
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
	                url: "emerinspectrecord/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
                    {
                        title: "应急资源名称",
                        fieldName: "emerResource.name",
                        orderName: "emerResource.name",
                        filterType: "text",
                    },
					{
						//检验检测量
						title: "数量",
						fieldName: "inspectQuantity",
						filterType: "number",
                        render: function(data) {
                            if(data.inspectQuantity) {
                                var result = parseFloat(data.inspectQuantity);
                                if(data.emerResource) {
                                    result += data.emerResource.unit || ""
                                }
                                return result;
                            }
                        }
					},
                    {
                        //检验检测时间
                        title: "检验检测日期",
                        fieldName: "inspectTime",
                        filterType: "date"
                    },
                    {
                        //检验/检测机构
                        title: "检验检测机构",
                        fieldName: "inspectOrgan",
                        filterType: "text"
                    },
                    {
                        //检验/检测人员
                        title: "检验检测人员",
                        fieldName: "inspectors",
                        filterType: "text"
                    },
                    {
                        //检验/检测内容
                        title: "检验检测内容",
                        fieldName: "inspectionContent",
                        filterType: "text"
                    },
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/emerinspectrecord/importExcel"
            },
            exportModel : {
                url: "/emerinspectrecord/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				emerInspectRecordFormModel : {
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
//			"emerinspectrecordFormModal":emerInspectRecordFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.emerInspectRecordFormModel.show = true;
//				this.$refs.emerinspectrecordFormModal.init("create");
//			},
//			doSaveEmerInspectRecord : function(data) {
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
