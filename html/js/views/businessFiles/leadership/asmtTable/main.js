define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    // var detailPanel = require("./detail-xl");
    
    var initDataModel = function () {
        return {
            moduleCode: "asmtTable",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
                // detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "asmttable/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//编码
						title: "编码",
						fieldName: "code",
						fieldType: "link",
						filterType: "text",
                        width: 160
					},
					{
						//自评表名称
						title: "自评表名称",
						fieldName: "name",
						filterType: "text",
                        width: 260
					},
					// {
					// 	//自评表类型 暂时不用
					// 	title: "自评表类型",
					// 	fieldName: "type",
					// 	filterType: "text"
					// },
                    LIB.tableMgr.column.company,
					// LIB.tableMgr.column.dept,
					// {
					// 	//是否禁用 0启用,1禁用
                     //    title: this.$t("gb.common.state"),
                     //    orderName: "disable",
                     //    fieldName: "disable",
                     //    filterType: "enum",
                     //    filterName: "criteria.intsValue.disable"
					// },
					// {
					// 	//备注
					// 	title: "备注",
					// 	fieldName: "remarks",
					// 	filterType: "text"
					// },
					{
						//创建日期
						title: "创建日期",
						fieldName: "createDate",
						filterType: "date",
                        width: 180
					}
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/asmtTable/importExcel"
            },
            exportModel : {
            	 url: "/asmtTable/exportExcel"
            }
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,

        },
        methods: {

        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
