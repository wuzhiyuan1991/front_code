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
//	var emerMaintRecordFormModal = require("componentsEx/formModal/emerMaintRecordFormModal");

    var initDataModel = function () {
        return {
            moduleCode: "emerMaintRecord1",
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
	                url: "emermaintrecord/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//类别 1:检修抢修,2:维护保养
						title: "类别",
						fieldName: "type",
						orderName: "type",
						filterName: "criteria.intsValue.type",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_maint_record_type"),
						render: function (data) {
							return LIB.getDataDic("iem_maint_record_type", data.type);
						}
					},
					{
						title: "应急资源名称",
						fieldName: "emerResource.name",
						orderName: "emerResource.name",
						filterType: "text",
					},
					{
						//维护/保养时间
						title: "维护保养日期",
						fieldName: "maintTime",
						filterType: "date"
					},
					{
						//作业类别 1:内部,2:外部
						title: "作业类别",
						fieldName: "operationType",
						orderName: "operationType",
						filterName: "criteria.intsValue.operationType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("is_inside"),
						render: function (data) {
							return LIB.getDataDic("is_inside", data.operationType);
						}
					},
					{
						title: "操作人员",
						fieldName: "operators",
						filterType: "text"
					},
					{
						//作业内容
						title: "作业内容",
						fieldName: "operationContent",
						filterType: "text"
					},
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/emermaintrecord/importExcel"
            },
            exportModel : {
                url: "/emermaintrecord/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				emerMaintRecordFormModel : {
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
//			"emermaintrecordFormModal":emerMaintRecordFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.emerMaintRecordFormModel.show = true;
//				this.$refs.emermaintrecordFormModal.init("create");
//			},
//			doSaveEmerMaintRecord : function(data) {
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
