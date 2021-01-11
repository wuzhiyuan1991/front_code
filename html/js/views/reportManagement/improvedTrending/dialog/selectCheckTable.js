define(function (require) {
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./selectCheckTable.html");

    var newVO = function () {
        return {
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO()
        },
        resetTriggerFlag: false,
        columns: [{
			title:"",
			fieldName:"id",
			fieldType:"cb"
		},
			{
				title:"检查表名称",
				fieldName:"name",
				width: 200,
			},
			_.omit(LIB.tableMgr.column.company, "filterType"),
			{
				title:"分类",
				fieldType:"custom",
				render: function(data){
					if(data.checkTableType){
						return data.checkTableType.name;
					}
				},
                width: 180
			},
			{
				title:"类型",
				fieldType:"custom",
				render: function(data){
                    return LIB.getDataDic("checkTable_type",data.type);
				},
                filterName : "criteria.intsValue.type",
                width: 140
			},
			{
				title:"创建时间",
				fieldName:"createDate",
                width: 180
			},
			{
				title:"状态",
				fieldType:"custom",
				width: 100,
				render: function(data){
                    return LIB.getDataDic("disable",data.disable);
				},
                filterName : "criteria.intsValue.disable"
			},
			{
				title:"通用",
				fieldType:"custom",
				width: 100,
				render: function(data){
                    return LIB.getDataDic("reformer_flag",data.isUniversal);
				}
			}
        ],
        defaultFilterValue:{"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},disable : 0},
        url: "checktable/listbyorg{/curPage}{/pageSize}",
        defaultFilterValue: {"disable": 0},
        selectedDatas: [],
        filterColumn: ["criteria.strValue.keyWordValue","criteria.strValue.isUniversal"]
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
            var toolCol = this.columns[7];
            var isToolColShow = (params.type == "dep");
            if(toolCol.visible !== isToolColShow) {
                toolCol.visible = isToolColShow;
            }
            this.$refs.table.refreshColumns();
            
            var filterParams = [
                {
                    type: "save",
                    value: {
                        columnFilterName : "orgType",
                        columnFilterValue :  params.type == "frw" ? 1 : 2
                    }
                },
                {
                    type: "save",
                    value: {
                        columnFilterName : "disable",
                        columnFilterValue :  0
                    }
                },
                {
                    type: "save",
                    value: {
                        columnFilterName : "deptIds",
                        columnFilterValue :  params.type == "dep" ? params.orgIds : null
                    }
                },
                {
                    type: "save",
                    value: {
                        columnFilterName : "compIds",
                        columnFilterValue :  params.type == "frw" ? params.orgIds : null
                    }
                },
                {
                      type: "save",
                      value: {
                          columnFilterName : "criteria.strsValue",
                          columnFilterValue :  {excludeIds: params.excludeIds}
                      }
                  }
               ];
               this.$refs.table.doCleanRefresh(filterParams);
            }
        }
    });

    return selectDialog;
});