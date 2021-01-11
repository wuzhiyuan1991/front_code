define(function(require) {

	var LIB = require('lib');
	
	var initDataModel = function () {
        return {
        	mainModel:{
				title:"选择",
				selectedDatas:[]
			},
            tableModel: (
	            {
	                url: "contractor/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 // LIB.tableMgr.ksColumn.code,
					{
						//健康安全环保协议有效期
						title: "承包商名称",
						fieldName: "deptName",
						width:'auto',
					},
					(function () {
						var obj = LIB.tableMgr.column.company;
						obj = _.clone(obj);
						obj.width=350
						delete obj.filterType;
						return obj;
					})(),
//					{
//						//资质证书
//						title: "资质证书",
//						fieldName: "certificate",
//						keywordFilterName: "criteria.strValue.keyWordValue_certificate"
//					},
//					{
//						//证书期限
//						title: "证书期限",
//						fieldName: "cetDeadline",
//						keywordFilterName: "criteria.strValue.keyWordValue_cetDeadline"
//					},
//					{
//						//企业类别
//						title: "企业类别",
//						fieldName: "compType",
//						keywordFilterName: "criteria.strValue.keyWordValue_compType"
//					},
//					{
//						//法人代表
//						title: "法人代表",
//						fieldName: "corporation",
//						keywordFilterName: "criteria.strValue.keyWordValue_corporation"
//					},
//					{
//						//单位地址
//						title: "单位地址",
//						fieldName: "deptAddr",
//						keywordFilterName: "criteria.strValue.keyWordValue_deptAddr"
//					},
//					{
//						//单位名称
//						title: "单位名称",
//						fieldName: "deptName",
//						keywordFilterName: "criteria.strValue.keyWordValue_deptName"
//					},
//					{
//						//雇员人数
//						title: "雇员人数",
//						fieldName: "empNum",
//						keywordFilterName: "criteria.strValue.keyWordValue_empNum"
//					},
//					{
//						//营业执照编号
//						title: "营业执照编号",
//						fieldName: "licenceNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_licenceNo"
//					},
//					{
//						//联系人
//						title: "联系人",
//						fieldName: "linkman",
//						keywordFilterName: "criteria.strValue.keyWordValue_linkman"
//					},
//					{
//						//手机
//						title: "手机",
//						fieldName: "mobilePhone",
//						keywordFilterName: "criteria.strValue.keyWordValue_mobilePhone"
//					},
//					{
//						//服务资质
//						title: "服务资质",
//						fieldName: "qualification",
//						keywordFilterName: "criteria.strValue.keyWordValue_qualification"
//					},
//					{
//						//资质等级
//						title: "资质等级",
//						fieldName: "qualificationLevel",
//						keywordFilterName: "criteria.strValue.keyWordValue_qualificationLevel"
//					},
//					{
//						//注册资金
//						title: "注册资金",
//						fieldName: "registerCapital",
//						keywordFilterName: "criteria.strValue.keyWordValue_registerCapital"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark"
//					},
//					{
//						//健康安全环保协议
//						title: "健康安全环保协议",
//						fieldName: "securityAgreement",
//						keywordFilterName: "criteria.strValue.keyWordValue_securityAgreement"
//					},
//					{
//						//服务类别
//						title: "服务类别",
//						fieldName: "serviceType",
//						keywordFilterName: "criteria.strValue.keyWordValue_serviceType"
//					},
//					{
//						//座机
//						title: "座机",
//						fieldName: "telephone",
//						keywordFilterName: "criteria.strValue.keyWordValue_telephone"
//					},
//					 LIB.tableMgr.ksColumn.modifyDate,
////					 LIB.tableMgr.ksColumn.createDate,
//
	                ],

	                defaultFilterValue : {
	                	"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},
						"disable" : 0
	                },
	                resetTriggerFlag:false
	            }
            )
        };
    }
	
	var opts = {
		mixins : [LIB.VueMixin.selectorTableModal],
		data:function(){
			var data = initDataModel();
			return data;
		},
		name:"contractorSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});