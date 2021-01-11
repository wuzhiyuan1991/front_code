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
//	var emerCardFormModal = require("componentsEx/formModal/emerCardFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "emerCard111",
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
	                url: "emercard/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//处置卡名称
						title: "处置方案名称",
						fieldName: "name",
						filterType: "text"
					},
                    {
                        //处置卡名称
                        title: "属地",
                        fieldName: "dominationArea.name",
                        filterType: "text"
                    },
					// {
					// 	//注意事项
					// 	title: "注意事项",
					// 	fieldName: "announcements",
					// 	filterType: "text"
					// },
                        LIB.tableMgr.column.dept,
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.disable,
                        // LIB.tableMgr.column.modifyDate,
					 // LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/emercard/importExcel"
            },
            exportModel : {
                url: "/emercard/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				emerCardFormModel : {
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
//			"emercardFormModal":emerCardFormModal,
            
        },
        methods: {
            setDefaultCheck:function (values) {
                return ;
                this.$refs.mainTable.setDefaultSelect(values[0].id);
            }
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.emerCardFormModel.show = true;
//				this.$refs.emercardFormModal.init("create");
//			},
//			doSaveEmerCard : function(data) {
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
