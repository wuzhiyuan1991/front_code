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
//	var workRecordFormModal = require("componentsEx/formModal/workRecordFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "workRecord",
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
	                url: "workrecord/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//记录名
						title: "记录名",
						fieldName: "name",
						filterType: "text"
					},
                    {
                        title: "上传人",
                        fieldName: "user.name",
                        orderName: "uploadUserId",
                        filterType: "text"
                    },
                    {
                        //上传时间
                        title: "上传时间",
                        fieldName: "uploadDate",
                        filterType: "date"
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
                url: "/workrecord/importExcel"
            },
            exportModel : {
                url: "/workrecord/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				workRecordFormModel : {
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
//			"workrecordFormModal":workRecordFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.workRecordFormModel.show = true;
//				this.$refs.workrecordFormModal.init("create");
//			},
//			doSaveWorkRecord : function(data) {
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
