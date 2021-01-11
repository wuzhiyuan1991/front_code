define(function (require) {

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            mainModel: {
                title: "选择",
                selectedDatas: []
            },
            tableModel: (
                {
                    url: "checkobjectcatalog/baseChemicalObj/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //编码
                            title: "编码",
                            fieldName: "code",
                            keywordFilterName: "criteria.strValue.keyWordValue_code",
                        },
                        {
                            //名称
                            title: "名称",
                            fieldName: "name",
                            keywordFilterName: "criteria.strValue.keyWordValue_name",
                        },
                        {
                            //别名
                            title: "别名",
                            fieldName: "alias",
                            keywordFilterName: "criteria.strValue.keyWordValue_alias"
                        },
                        {
                            //UN编号
                            title: "UN编号",
                            fieldName: "unNumber",
                            keywordFilterName: "criteria.strValue.keyWordValue_unNumber"
                        },
                        {
                            //最大储量
                            title: "最大储量",
                            // fieldName: "mcotMaxReserves",
                            keywordFilterName: "criteria.strValue.keyWordValue_mcotMaxReserves",
                            render: function (data) {
                                var res = '';
                                if(data.maxReserves) {
                                    res += data.maxReserves;
                                }
                                if(data.unit) {
                                    res += data.unit;
                                }
                                return res;
                            }
                        }

//					{
//						//CAS编码
//						title: "CAS编码",
//						fieldName: "mcotCasNumber",
//						keywordFilterName: "criteria.strValue.keyWordValue_mcotCasNumber",
//					},
//					{
//						//类别
//						title: "类别",
//						fieldName: "mcotClassify",
//						keywordFilterName: "criteria.strValue.keyWordValue_mcotClassify",
//					}
                    ],

                    defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}},
                    resetTriggerFlag: false
                }
            )
        };
    }

    var opts = {
        mixins: [LIB.VueMixin.selectorTableModal],
        data: function () {
            var data = initDataModel();
            return data;
        },
        name: "checkObjectCatalogSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
});