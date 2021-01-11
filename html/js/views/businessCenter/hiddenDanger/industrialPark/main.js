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
//	var industrialParkFormModal = require("componentsEx/formModal/industrialParkFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "industrialPark",
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
	                url: "industrialpark/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//园区名称
						title: "园区名称",
						fieldName: "name",
						filterType: "text"
					},
					 LIB.tableMgr.column.disable,
					 LIB.tableMgr.column.company,
					 // LIB.tableMgr.column.dept,
					{
						//坐标
						title: "坐标",
						fieldName: "location",
						filterType: "text",
                        width: 200
					},
					 // LIB.tableMgr.column.remark,
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/industrialpark/importExcel"
            },
            exportModel : {
                url: "/industrialpark/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				industrialParkFormModel : {
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
//			"industrialparkFormModal":industrialParkFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.industrialParkFormModel.show = true;
//				this.$refs.industrialparkFormModal.init("create");
//			},
//			doSaveIndustrialPark : function(data) {
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
