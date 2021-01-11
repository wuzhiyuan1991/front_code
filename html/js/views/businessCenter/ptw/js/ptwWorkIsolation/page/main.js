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
//	var ptwWorkIsolationFormModal = require("componentsEx/formModal/ptwWorkIsolationFormModal");

	LIB.registerDataDic("iptw_work_isolation_type", [
		["1","工艺隔离"],
		["2","机械隔离"],
		["3","电气隔离"],
		["4","系统屏蔽"]
	]);

	LIB.registerDataDic("iptw_work_isolation_enable_loto", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_work_isolation_status", [
		["0","未隔离"],
		["1","已隔离"],
		["2","已解除"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "ptwWorkIsolation",
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
	                url: "ptwworkisolation/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.disable,
					{
						//隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
						title: "隔离类型",
						fieldName: "type",
						orderName: "type",
						filterName: "criteria.intsValue.type",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_isolation_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_isolation_type", data.type);
						}
					},
					{
						//解除隔离时间
						title: "解除隔离时间",
						fieldName: "disisolateTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.disisolateTime);
//						}
					},
					{
						//是否挂牌上锁 0:否,1:是
						title: "是否挂牌上锁",
						fieldName: "enableLoto",
						orderName: "enableLoto",
						filterName: "criteria.intsValue.enableLoto",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_isolation_enable_loto"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_isolation_enable_loto", data.enableLoto);
						}
					},
					{
						//隔离的设备/保护的系统
						title: "隔离的设备/保护的系统",
						fieldName: "facility",
						filterType: "text"
					},
					{
						//隔离时间
						title: "隔离时间",
						fieldName: "isolateTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.isolateTime);
//						}
					},
					{
						//隔离点/保护的系统子件
						title: "隔离点/保护的系统子件",
						fieldName: "position",
						filterType: "text"
					},
					{
						//状态 0:未隔离,1:已隔离,2:已解除
						title: "状态",
						fieldName: "status",
						orderName: "status",
						filterName: "criteria.intsValue.status",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_isolation_status"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_isolation_status", data.status);
						}
					},
					{
						title: "授权操作人员",
						fieldName: "authoriser.name",
						orderName: "user.username",
						filterType: "text",
					},
					{
						title: "作业许可",
						fieldName: "workPermit.name",
						orderName: "ptwWorkPermit.name",
						filterType: "text",
					},
//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ptwworkisolation/importExcel"
            },
            exportModel : {
                url: "/ptwworkisolation/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ptwWorkIsolationFormModel : {
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
//			"ptwworkisolationFormModal":ptwWorkIsolationFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ptwWorkIsolationFormModel.show = true;
//				this.$refs.ptwworkisolationFormModal.init("create");
//			},
//			doSavePtwWorkIsolation : function(data) {
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
