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
	                url: "dept/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//部门编码
						title: this.$t("bs.orl.departCode"),
						fieldName: "code",
                        width: 160
					},
					{
						//部门名称
						title: this.$t("bs.orl.departName"),
						fieldName: "name",
                        width: 160
					},
					_.omit(LIB.tableMgr.column.company, "filterType"),
					 //LIB.tableMgr.column.company,
//					{
//						//公司地址
//						title: "公司地址",
//						fieldName: "address",
//					},
//					{
//						//经纬度
//						title: "经纬度",
//						fieldName: "coordinate",
//					},
//					{
//						//是否禁用 0启用,1禁用
//						title: "是否禁用",
//						fieldName: "disable",
//					},
//					{
//						//机构等级
//						title: "机构等级",
//						fieldName: "level",
//					},
//					{
//						//机构电话
//						title: "机构电话",
//						fieldName: "phone",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//					},
//					{
//						//机构类型 1:机构,2:部门
//						title: "机构类型",
//						fieldName: "type",
//					},
//					{
//						//修改日期
//						title: "修改日期",
//						fieldName: "modifyDate",
//					},
//					{
//						//创建日期
//						title: "创建日期",
//						fieldName: "createDate",
//					},
	                ],

	                defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},"type" : 2},
	                resetTriggerFlag:false
	            }
            )
        };
    }
	
	var opts = {
		mixins : [LIB.VueMixin.selectorTableModal],
		data: initDataModel,
		name: "deptSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});