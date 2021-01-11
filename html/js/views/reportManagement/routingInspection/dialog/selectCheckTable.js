define(function (require) {
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./selectCheckTable.html");

    var newVO = function () {
        return {}
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO()
        },
        resetTriggerFlag: false,
        columns: [{
            title: "",
            fieldName: "id",
            fieldType: "cb"
        },
            {
                title: "巡检表名称",
                fieldName: "name",
                keywordFilterName: "criteria.strValue.keyWordValue_name",
                width: 200,
            },
            LIB.tableMgr.ksColumn.company,
            LIB.tableMgr.ksColumn.dept,
//			{
//				//备注
//				title: "备注",
//				fieldName: "remarks",
//				keywordFilterName: "criteria.strValue.keyWordValue_remarks",
//			},
            LIB.tableMgr.ksColumn.createDate,
        ],
        url: "richecktable/list{/curPage}{/pageSize}",
        defaultFilterValue: {
            "criteria.orderValue": {fieldName: "modifyDate", orderType: "1"},
            "disable": 0
        },
        resetTriggerFlag: false
    };

    //声明detail组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var selectDialog = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                this.$dispatch("ev_selectTableFinshed", this.selectedDatas);
            }
        },
        events: {
            //select框数据加载
            "ev_selectTableReload": function (params) {


                var filterParams = [
                    {
                        type: "save",
                        value: {
                            columnFilterName: "disable",
                            columnFilterValue: 0
                        }
                    },
                    {
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strsValue",
                            columnFilterValue: {excludeIds: params.excludeIds}
                        }
                    }
                ];
                if(params.type === "frw") {
                    filterParams.push({
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strsValue.compId",
                            columnFilterValue: params.orgIds
                        }
                    })
                } else if(params.type === "dep") {
                    filterParams.push({
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strsValue.orgId",
                            columnFilterValue: params.orgIds
                        }
                    })
                }
                this.$refs.table.doCleanRefresh(filterParams);
            }
        }
    });

    return selectDialog;
});