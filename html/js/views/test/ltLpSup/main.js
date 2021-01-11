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
//	var ltLpSupFormModal = require("componentsEx/formModal/ltLpSupFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "ltLpSup",
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
	                url: "ltlpsup/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//用品名称
						title: "用品名称",
						fieldName: "name",
						filterType: "text"
					},
                    {
                        //用品型号
                        title: "用品型号",
                        fieldName: "model",
                        filterType: "text"
                    },
                    {
                        //计量单位
                        title: "计量单位",
                        fieldName: "unit",
                        filterType: "text"
                    },
                    {
                        //库存数量
                        title: "库存数量",
                        fieldName: "quantity",
                        filterType: "number"
                    },
					 LIB.tableMgr.column.disable,
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ltlpsup/importExcel"
            },
            exportModel : {
                url: "/ltlpsup/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ltLpSupFormModel : {
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
//			"ltlpsupFormModal":ltLpSupFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ltLpSupFormModel.show = true;
//				this.$refs.ltlpsupFormModal.init("create");
//			},
//			doSaveLtLpSup : function(data) {
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
