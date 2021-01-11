/**
 * 统计查询--方案相关常量
 */
define(function(require) {
	var scheme = {
			//统计项目-对象范围
			items:[
			    {
			    	id:'0',
			    	name:'整改率',
			    },
                {
                    id:'1',
                    name:'超期未整改',
                }
			],
			typeOfRanges:[
					{id:"frw",name:'公司'},
					{id:"dep",name:'部门'},
					{id:"equip",name:'船舶设备名称'}
			],
	};
	return scheme;
});