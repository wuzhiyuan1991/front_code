define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    // 编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var contractorFormModal = require("componentsEx/formModal/contractorFormModal");

    var initDataModel = function () {
        return {
            moduleCode: "contractor2",
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
	                url: "contractor/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.disable,


					{
						//单位名称
						title: "单位名称",
						fieldName: "deptName",
						filterType: "text"
					},
					{
						//单位地址
						title: "单位地址",
						fieldName: "deptAddr",
						filterType: "text"
					},
                        LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.dept,
						{
							//单位地址
							title: "所属部门",
							fieldName: "attr1",
							filterType: "text",
							render:function (data) {
								return LIB.tableMgr.rebuildOrgName(data.attr1, 'dept');

							}
						},
					{
						//营业执照编号
						title: "营业执照编号",
						fieldName: "licenceNo",
						filterType: "text"
					},
					{
						//法人代表
						title: "法人代表",
						fieldName: "corporation",
						filterType: "text"
					},
					{
						//企业类别
						title: "企业类型",
						fieldName: "compType",
						// filterType: "select",
						// list:LIB.getDataDicList('compType'),
                        filterType: "enum",
                        filterName: "criteria.strsValue.compType",
						render:function (data) {
							return  LIB.getDataDic('comp_type', data.compType)
						},
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("comp_type"),
					},
					{
						//服务类别
						title: "服务类别",
						fieldName: "serviceType",
                        filterType: "enum",
                        filterName: "criteria.strsValue.serviceType",
						render:function (data) {
							return  LIB.getDataDic('service_type', data.serviceType)
						},
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("service_type"),
					},
					{
						//服务资质
						title: "服务资质",
						fieldName: "qualification",
						// filterType: "number"
                        filterType: "enum",
                        filterName: "criteria.strsValue.qualification",
						render:function (data) {
							var qua = '';
							if(data.qualificationRel){
								data.qualificationRel.forEach(function(item){
									qua+=(LIB.getDataDic('service_qualification', item.lookUpValue))+' ';
								})
							}
							return  qua;
						},
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("service_qualification"),

					},
					{
						//资质等级
						title: "资质等级",
						fieldName: "qualificationLevel",
                        filterType: "enum",
                        filterName: "criteria.strsValue.qualificationLevel",
						render:function (data) {
							return  LIB.getDataDic('qualification_level', data.qualificationLevel)
						},
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("qualification_level"),
					},
					// {
					// 	//资质证书
					// 	title: "资质证书",
					// 	fieldName: "certificate",
					// 	filterType: "text"
					// },
					{
						//证书期限
						title: "证书有效截止日期",
						fieldName: "cetDeadline",
						filterType: "date",
						fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.cetDeadline);
						}
					},
					{
						//注册资金
						title: "注册资金",
						fieldName: "registerCapital",
						filterType: "text"
					},
					{
						//雇员人数
						title: "雇员人数",
						fieldName: "empNum",
						filterType: "number"
					},

					{
						//联系人
						title: "联系人",
						fieldName: "linkman",
						filterType: "text"
					},

					{
						//座机
						title: "联系电话（座机）",
						fieldName: "telephone",
						filterType: "text"
					},
                    {
                        //手机
                        title: "联系电话（手机）",
                        fieldName: "mobilePhone",
                        filterType: "text"
                    },
					{
						//经营范围
						title: "经营范围",
						fieldName: "businessScope",
						filterType: "text"
					},

                    // {
						// //健康安全环保协议
						// title: "健康安全环保协议",
						// fieldName: "securityAgreement",
						// filterType: "text"
                    // },
                    {
                        //健康安全环保协议有效期
                        title: "协议有效截止日期",
                        fieldName: "agreementDeadline",
                        filterType: "date",
						fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.agreementDeadline);
						}
                    },
                    LIB.tableMgr.column.remark,

					 // LIB.tableMgr.column.modifyDate,
//					 LIB.tableMgr.column.createDate,

	                ],
					defaultFilterValue: { "criteria.orderValue": { fieldName: "default", orderType: "0" } }

				}
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/contractor/importExcel"
            },
			templete: {
				url: "/contractor/file/down"
			},
            exportModel : {
                url: "/contractor/exportExcel",
                withColumnCfgParam: true
            },
			importProgress: {
				show: false
			},
			//Legacy模式
//			formModel : {
//				contractorFormModel : {
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
//			"contractorFormModal":contractorFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.contractorFormModel.show = true;
//				this.$refs.contractorFormModal.init("create");
//			},
//			doSaveContractor : function(data) {
//				this.doSave(data);
//			}
			doImport: function () {
				this.importProgress.show = true;
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
