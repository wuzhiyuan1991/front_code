define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"


	LIB.registerDataDic("icm_admin_lic_cert", [
		["1","许可证/执照"],
		["2","资格证/资质证"],
		["3","批准文件/证明文件"],
		["10","其它行政许可证件"]
	]);

	LIB.registerDataDic("icm_admin_lic_status", [
		["1","初次申请"],
		["2","变更申请"],
		["3","延续申请"],
		["4","审查"],
		["5","批复"],
		["6","修订"],
		["7","废弃"],
		["10","其他"]
	]);

	LIB.registerDataDic("icm_admin_lic_type", [
		["1","普通"],
		["2","特许"],
		["3","认可"],
		["4","核准"],
		["5","登记"],
		["10","其他"]
	]);
	LIB.registerDataDic("icm_admin_lic_process_operate", [
		['1','企业初次申请'],
		['2','企业变更申请'],
		['3','企业延续申请'],
		['4','政府审查'],
		['5','政府批准'],
		['6','企业修订'],
		['10','其他'],

	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "adminLicense",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "adminlicense/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
						 LIB.tableMgr.column.cb,
						 LIB.tableMgr.column.code,
						{
							//许可名称
							title: "许可名称",
							fieldName: "name",
							filterType: "text"
						},
						{
							//许可文号
							title: "许可文号",
							fieldName: "number",
							filterType: "text"
						},
						{
							//类别 1:普通,2:特许,3:认可,4:核准,5:登记,10:其他
							title: "类别",
							fieldName: "type",
							orderName: "type",
							filterName: "criteria.intsValue.type",
							filterType: "enum",
							fieldType: "custom",
							popFilterEnum: LIB.getDataDicList("icm_admin_lic_type"),
							render: function (data) {
								return LIB.getDataDic("icm_admin_lic_type", data.type);
							}
						},
						{
							//许可证件 1:许可证/执照,2:资格证/资质证,3:批准文件/证明文件,10:其它行政许可证件
							title: "许可证件",
							fieldName: "cert",
							orderName: "cert",
							filterName: "criteria.intsValue.cert",
							filterType: "enum",
							fieldType: "custom",
							popFilterEnum: LIB.getDataDicList("icm_admin_lic_cert"),
							render: function (data) {
								return LIB.getDataDic("icm_admin_lic_cert", data.cert);
							}
						},
						{
							//许可决定日期
							title: "许可决定日期",
							fieldName: "startDate",
							filterType: "date",
//						fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.startDate);
						}
						},
						{
							//许可截止日期
							title: "许可截止日期",
							fieldName: "endDate",
							filterType: "date",
//						fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.endDate);
						}
						},
						_.extend(_.clone(LIB.tableMgr.column.company),{width:300})
					 //LIB.tableMgr.column.disable,
					 //LIB.tableMgr.column.company,
					 //LIB.tableMgr.column.dept,
					// {
					// 	//许可（适用）对象
					// 	title: "许可（适用）对象",
					// 	fieldName: "applicable",
					// 	filterType: "text"
					// },

					// {
					// 	//许可内容
					// 	title: "许可内容",
					// 	fieldName: "content",
					// 	filterType: "text"
					// },

//					{
//						//许可机关
//						title: "许可机关",
//						fieldName: "government",
//						filterType: "text"
//					},
//					{
//						//许可文号
//						title: "许可文号",
//						fieldName: "number",
//						filterType: "text"
//					},

//					{
//						//状态 1:初次申请,2:变更申请,3:延续申请,4:审查,5:批复,6:修订,7:废弃,10:其他
//						title: "状态",
//						fieldName: "status",
//						orderName: "status",
//						filterName: "criteria.intsValue.status",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("icm_admin_lic_status"),
//						render: function (data) {
//							return LIB.getDataDic("icm_admin_lic_status", data.status);
//						}
//					},

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
                url: "/adminlicense/importExcel"
            },
            exportModel : {
                url: "/adminlicense/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				adminLicenseFormModel : {
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
//			"adminlicenseFormModal":adminLicenseFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.adminLicenseFormModel.show = true;
//				this.$refs.adminlicenseFormModal.init("create");
//			},
//			doSaveAdminLicense : function(data) {
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
