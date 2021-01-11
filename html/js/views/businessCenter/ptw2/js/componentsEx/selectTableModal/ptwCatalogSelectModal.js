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
	                url: "ptwcatalog/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//(级别/指标）名称/承诺岗位
						title: "(级别/指标）名称/承诺岗位",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					{
						//字典类型 1:作业类型,2:作业分级,3:个人防护设备,4:气体检测指标,5:岗位会签承诺
						title: "字典类型",
						fieldName: "type",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_catalog_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_catalog_type", data.type);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_type"
					},
//					{
//						//承诺类型 1:作业申请人承诺,2:作业负责人承诺,3:作业监护人承诺,4:生产单位现场负责人承诺,5:主管部门负责人承诺,6:安全部门负责人,7:相关方负责人承诺,8:许可批准人承诺,9:作业完成声明,10:作业取消声明,11:开工前气体检测结论
//						title: "承诺类型",
//						fieldName: "commitmentType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_catalog_commitment_type"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_catalog_commitment_type", data.commitmentType);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_commitmentType"
//					},
//					{
//						//分级依据/标准范围/承诺内容
//						title: "分级依据/标准范围/承诺内容",
//						fieldName: "content",
//						keywordFilterName: "criteria.strValue.keyWordValue_content"
//					},
//					{
//						//气体检测指标类型 1:有毒有害气体或蒸汽,2:可燃气体或蒸汽,3:氧气
//						title: "气体检测指标类型",
//						fieldName: "gasType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_catalog_gas_type"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_catalog_gas_type", data.gasType);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_gasType"
//					},
//					{
//						//作业级别
//						title: "作业级别",
//						fieldName: "level",
//						keywordFilterName: "criteria.strValue.keyWordValue_level"
//					},
//					{
//						//单位（气体检测指标）
//						title: "单位（气体检测指标）",
//						fieldName: "unit",
//						keywordFilterName: "criteria.strValue.keyWordValue_unit"
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
		name:"ptwcatalogSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});