define(function (require) {

    var LIB = require('lib');
    LIB.registerDataDic("smoc_smoc_template_type", [
		["0","未设计类型"],
		["1","安全相关"],
		["2","职业健康相关"],
		["3","环境相关"],
		["4","设备相关"],
		["5","其他"]
	]);

 
	var initDataModel = function () {
		return {
			mainModel: {
				title: "添加模板",
				selectedDatas: []
			},
			tableModel: (
                {
	                url: "smoctemplate/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    filterColumn:['name'],
	                columns: [
	                 LIB.tableMgr.column.cb,
					//  LIB.tableMgr.column.code,
					{
						//分组名称
						title: "模板名称",
						fieldName: "name",
						// render:function(data){
						// 	if(data.content){
						// 		var obj =	JSON.parse(data.content)
						// 		return  obj.name
						// 	}
							
						// }
						
					},
					
					],
					// defaultFilterValue:{orgId:orgId},
                    resetTriggerFlag: false
	            }
			)
		};
	}
    

    var opts = {
       
        data: function () {
            var data = initDataModel();
			return data;
        },
        mixins : [ LIB.VueMixin.selectorTableModal],
        name:'changeManagementTemplate'
      
     
    };

    var component = LIB.Vue.extend(opts);
    return component;

});