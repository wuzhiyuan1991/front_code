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
//	var adminLicenseProcessFormModal = require("componentsEx/formModal/adminLicenseProcessFormModal");

	LIB.registerDataDic("icm_admin_lic_process_operate", [
		["1","企业初次申请"],
		["2","企业变更申请"],
		["3","企业延续申请"],
		["4","政府审查"],
		["5","政府批准"],
		["6","企业修订"],
		["10","其他"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "adminLicenseProcess",
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
	                url: "adminlicenseprocess/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.disable,
					{
						//内容
						title: "内容",
						fieldName: "content",
						filterType: "text"
					},
					{
						//操作 1:企业初次申请,2:企业变更申请,3:企业延续申请,4:政府审查,5:政府批准,6:企业修订,10:其他
						title: "操作",
						fieldName: "operate",
						orderName: "operate",
						filterName: "criteria.intsValue.operate",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("icm_admin_lic_process_operate"),
						render: function (data) {
							return LIB.getDataDic("icm_admin_lic_process_operate", data.operate);
						}
					},
					{
						//操作时间
						title: "操作时间",
						fieldName: "operateDate",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.operateDate);
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
                url: "/adminlicenseprocess/importExcel"
            },
            exportModel : {
                url: "/adminlicenseprocess/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				adminLicenseProcessFormModel : {
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
//			"adminlicenseprocessFormModal":adminLicenseProcessFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.adminLicenseProcessFormModel.show = true;
//				this.$refs.adminlicenseprocessFormModal.init("create");
//			},
//			doSaveAdminLicenseProcess : function(data) {
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
