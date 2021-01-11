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
	                url: "richecktable/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
						(function () {
							var code =  LIB.tableMgr.ksColumn.code;
							code.width='138';
							return code;
                        })(),
					 // LIB.tableMgr.ksColumn.code,
					{
						//巡检表名称
						title: "巡检表名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name",
						width:305
					},

						(function () {
							var company =  LIB.tableMgr.ksColumn.company;
							company.width = '190'
							return company;
                        })(),
					 // LIB.tableMgr.ksColumn.dept,
                        (function () {
                            var dept =  LIB.tableMgr.ksColumn.dept;
                            dept.width = '160'
                            return dept;
                        })(),
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						keywordFilterName: "criteria.strValue.keyWordValue_remarks",
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
		name:"riCheckTableSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});