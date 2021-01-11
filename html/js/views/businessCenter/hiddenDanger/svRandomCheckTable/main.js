define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    
	//Legacy模式
//	var svRandomCheckTableFormModal = require("componentsEx/formModal/svRandomCheckTableFormModal");

	LIB.registerDataDic("icpe_sv_random_check_table_check_source", [
		["0","手机检查"],
		["1","web录入"]
	]);

	LIB.registerDataDic("icpe_sv_random_check_table_status", [
		["1","待审核"],
		["2","已转隐患"],
		["3","被否决"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "svRandomCheckTable",
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
	                url: "svrandomchecktable/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//记录表名
						title: "名称",
						fieldName: "name",
						filterType: "text"
					},
					{
						//来源 0:手机检查,1:web录入,2 其他
						title: "来源",
						fieldName: "checkSource",
						orderName: "checkSource",
						filterName: "criteria.intsValue.checkSource",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("icpe_sv_random_check_table_check_source"),
						render: function (data) {
							return LIB.getDataDic("icpe_sv_random_check_table_check_source", data.checkSource);
						}
					},
					// {
					// 	//状态 1:待审核,2:已转隐患,3:被否决
					// 	title: "状态",
					// 	fieldName: "status",
					// 	orderName: "status",
					// 	filterName: "criteria.intsValue.status",
					// 	filterType: "enum",
					// 	fieldType: "custom",
					// 	popFilterEnum: LIB.getDataDicList("icpe_sv_random_check_table_status"),
					// 	render: function (data) {
					// 		return LIB.getDataDic("icpe_sv_random_check_table_status", data.status);
					// 	}
					// },
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
					// {
					// 	//备注
					// 	title: "备注",
					// 	fieldName: "remarks",
					// 	filterType: "text"
					// },
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
                url: "/svrandomchecktable/importExcel"
            },
            exportModel : {
                url: "/svrandomchecktable/exportExcel",
                withColumnCfgParam: true,
                singleUrl:"/svrandomchecktable/exportWord/{id}"
            },
			//Legacy模式
//			formModel : {
//				svRandomCheckTableFormModel : {
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
//			"svrandomchecktableFormModal":svRandomCheckTableFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.svRandomCheckTableFormModel.show = true;
//				this.$refs.svrandomchecktableFormModal.init("create");
//			},
//			doSaveSvRandomCheckTable : function(data) {
//				this.doSave(data);
//			}
            doExportDetail: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量操作数据");
                    return;
                }
                var _this = this;
                LIB.Modal.confirm({
                    title: '导出数据?',
                    onOk: function () {
                        window.open(_this.exportModel.singleUrl.replace("\{id\}", rows[0].id));
                    }
                });
            },
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
