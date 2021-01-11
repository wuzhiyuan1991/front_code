define(function(require) {

    var LIB = require('lib');
    var selectModal = require("./selectModal")

    var initDataModel = function () {
        return {
            filterKey:null,
            mainModel:{
                title:"选择",
                selectedDatas:[],

            },
            tableModel: (
                {
                    url: "checkplan/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                        {
                            //
                            title: "",
                            fieldName: "code",
                            keywordFilterName: "criteria.strValue.keyWordValue_code"
                        },
                        {
                            //计划名
                            title: "检查计划名称",
                            fieldName: "name",
                            // filterName:"name",
                            keywordFilterName: "criteria.strValue.keyWordValue_name"

                        },
                        {
                            //结束时间
                            title: "结束时间",
                            fieldName: "endDate",
                            keywordFilterName: "criteria.strValue.keyWordValue_endDate"

                        },
//					{
//						//开始时间
//						title: "开始时间",
//						fieldName: "startDate",
//					},
//					 LIB.tableMgr.column.company,
////					 LIB.tableMgr.column.company,
////					{
//						//是否禁用，0未发布，1发布
//						title: "是否禁用，0未发布，1发布",
//						fieldName: "disable",
//					},
//					{
//						//检查频率
//						title: "检查频率",
//						fieldName: "frequency",
//					},
//					{
//						//检查频率类型
//						title: "检查频率类型",
//						fieldName: "frequencyType",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
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
                    filterColumn:["criteria.strValue.code","criteria.strValue.name","criteria.strValue.frequencyType","criteria.strValue.remarks"],
                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},'criteria.strValue.keyWordValue_join_': 'or'},
                    resetTriggerFlag:false
                }
            )
        };
    }

    var opts = {
        mixins : [selectModal],
        data:function(){
            var data = initDataModel();
            return data;
        },
        name:"checkPlanSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});