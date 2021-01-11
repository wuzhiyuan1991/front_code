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
//	var gasDetectionRecordFormModal = require("componentsEx/formModal/gasDetectionRecordFormModal");

	LIB.registerDataDic("iptw_gas_detection_record_type", [
		["1","作业前"],
		["2","作业中"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "gasDetectionRecord",
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
	                url: "gasdetectionrecord/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.disable,
					{
						//检测地点
						title: "检测地点",
						fieldName: "detectSite",
						filterType: "text"
					},
					{
						//检测时间
						title: "检测时间",
						fieldName: "detectTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.detectTime);
//						}
					},
					{
						//检测类型 1:作业前,2:作业中
						title: "检测类型",
						fieldName: "type",
						orderName: "type",
						filterName: "criteria.intsValue.type",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_gas_detection_record_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_gas_detection_record_type", data.type);
						}
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
                url: "/gasdetectionrecord/importExcel"
            },
            exportModel : {
                url: "/gasdetectionrecord/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				gasDetectionRecordFormModel : {
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
//			"gasdetectionrecordFormModal":gasDetectionRecordFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.gasDetectionRecordFormModel.show = true;
//				this.$refs.gasdetectionrecordFormModal.init("create");
//			},
//			doSaveGasDetectionRecord : function(data) {
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
