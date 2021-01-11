define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"

    var importProgress = require("componentsEx/importProgress/main");

    var initDataModel = function () {
        return {
            moduleCode: "emerGroup",
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
	                url: "emergroup/list{/curPage}{/pageSize}?type=2",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						title: "单位名称",
						fieldName: "name",
                        filterType: "text",
                        width:300
					},
					{
						//单位地址
						title: "单位地址",
						fieldName: "address",
                        filterType: "text",
                        width:300
					},
					{
						title: "备注",
						fieldName: "remarks",
						filterType: "text"
					},
                    LIB.tableMgr.column.disable,
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/emergroup/importExcel?type=2"
            },
            templete : {
                url: "/emergroup/file/down?type=2"
            },
            exportModel : {
                url: "/emergroup/exportExcel",
                withColumnCfgParam: true
            },
            importProgress:{
                show: false
            },
			//Legacy模式
//			formModel : {
//				emerGroupFormModel : {
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
            "importprogress":importProgress
			//Legacy模式
//			"emergroupFormModal":emerGroupFormModal,
            
        },
        methods: {
            doImport:function(){
                var _this=this;
                _this.importProgress.show = true;
            },
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.emerGroupFormModel.show = true;
//				this.$refs.emergroupFormModal.init("create");
//			},
//			doSaveEmerGroup : function(data) {
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
