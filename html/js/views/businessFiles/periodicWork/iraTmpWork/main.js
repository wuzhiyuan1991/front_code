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
//	var iraTmpWorkFormModal = require("componentsEx/formModal/iraTmpWorkFormModal");

	LIB.registerDataDic("ira_tmp_work_status", [
		["0","待完成"],
		["1","已完成"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "iraTmpWork",
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
                    url: "iratmpwork/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //工作内容
                            title: "工作内容",
                            fieldName: "content",
                            filterType: "text"
                        },
                        {
                            title: "执行人",
                            orderName: "executeUserId",
                            fieldName: "user.username",
                            filterType: "text",
                            filterName: "criteria.strValue.username",
                            width: 120
                        },
                        LIB.tableMgr.column.remark,
                        {
                            //状态 0:待完成,1:已完成
                            title: "状态",
                            fieldName: "status",
                            orderName: "status",
                            filterName: "criteria.intsValue.status",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("ira_tmp_work_status"),
                            render: function (data) {
                                return LIB.getDataDic("ira_tmp_work_status", data.status);
                            }
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/iratmpwork/importExcel"
            },
            exportModel : {
                url: "/iratmpwork/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				iraTmpWorkFormModel : {
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
//			"iratmpworkFormModal":iraTmpWorkFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.iraTmpWorkFormModel.show = true;
//				this.$refs.iratmpworkFormModal.init("create");
//			},
//			doSaveIraTmpWork : function(data) {
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
