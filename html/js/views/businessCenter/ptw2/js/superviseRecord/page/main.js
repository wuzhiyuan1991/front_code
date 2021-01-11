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
//	var superviseRecordFormModal = require("componentsEx/formModal/superviseRecordFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "superviseRecord",
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
	                url: "superviserecord/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.disable,
					{
						//检测地点
						title: "检测地点",
						fieldName: "superviseSite",
						filterType: "text"
					},
					{
						//检测时间
						title: "检测时间",
						fieldName: "superviseTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.superviseTime);
//						}
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
                url: "/superviserecord/importExcel"
            },
            exportModel : {
                url: "/superviserecord/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				superviseRecordFormModel : {
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
//			"superviserecordFormModal":superviseRecordFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.superviseRecordFormModel.show = true;
//				this.$refs.superviserecordFormModal.init("create");
//			},
//			doSaveSuperviseRecord : function(data) {
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
