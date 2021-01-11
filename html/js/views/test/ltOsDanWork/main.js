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
//	var ltOsDanWorkFormModal = require("componentsEx/formModal/ltOsDanWorkFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "ltOsDanWork",
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
	                url: "ltosdanwork/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//危险作业名称
						title: "危险作业名称",
						fieldName: "name",
						filterType: "text"
					},
					{
						//作业前的准备
						title: "作业前的准备",
						fieldName: "preContent",
						filterType: "text"
					},
					 LIB.tableMgr.column.disable,
					{
						//作业注意事项
						title: "作业注意事项",
						fieldName: "noticeContent",
						filterType: "text"
					},
					{
						//危险因素
						title: "危险因素",
						fieldName: "factors",
						filterType: "text"
					},
					{
						//防护措施
						title: "防护措施",
						fieldName: "protectMeasure",
						filterType: "text"
					},
					{
						//设备/工艺/工序
						title: "设备/工艺/工序",
						fieldName: "craft",
						filterType: "text"
					},
					{
						//常见危险处理措施
						title: "常见危险处理措施",
						fieldName: "measureContent",
						filterType: "text"
					},
//					{
//						//可能导致的伤害
//						title: "可能导致的伤害",
//						fieldName: "harm",
//						filterType: "text"
//					},
//					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
////					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ltosdanwork/importExcel"
            },
            exportModel : {
                url: "/ltosdanwork/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ltOsDanWorkFormModel : {
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
//			"ltosdanworkFormModal":ltOsDanWorkFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ltOsDanWorkFormModel.show = true;
//				this.$refs.ltosdanworkFormModal.init("create");
//			},
//			doSaveLtOsDanWork : function(data) {
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
