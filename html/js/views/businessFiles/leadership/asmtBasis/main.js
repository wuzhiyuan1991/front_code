define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "asmtBasis",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "asmtbasis/list{/curPage}{/pageSize}",
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
                        width: 180
					},
					{
						title: "依据名称",
						fieldName: "name",
						filterType: "text",
                        renderClass: "textarea",
                        width: 500
					},
				 	_.extend(_.clone(LIB.tableMgr.column.company), {width: 300}),
					// {
					// 	//修改日期
					// 	title: "修改日期",
					// 	fieldName: "modifyDate",
					// 	filterType: "date"
					// },
					{
						//创建日期
						title: "创建日期",
						fieldName: "createDate",
						filterType: "date",
                        width: 180
					},
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/asmtbasis/importExcel"
            },
            exportModel : {
                url: "/asmtbasis/exportExcel",
                withColumnCfgParam: true
            }
            
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {
        },
        events: {
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
