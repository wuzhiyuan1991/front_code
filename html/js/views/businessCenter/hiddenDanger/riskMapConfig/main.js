define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    
    var initDataModel = function () {
        return {
            moduleCode: "riskMapConfig",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "dominationarea/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
						{
							//名称
							title: "属地名称",
							fieldName: "name",
							// keywordFilterName: "criteria.strValue.keyWordValue_name",
							filterType: "text"
						},
                        {
                            title: "属地简称",
                            fieldName: "abbreviate",
                            filterType: "text"
                        },
						LIB.tableMgr.column.company,
						LIB.tableMgr.column.dept,
                        LIB.tableMgr.column.disable,
                        LIB.tableMgr.column.remark
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/dominationarea/importExcel"
            },
            exportModel : {
            	 url: "/dominationarea/exportExcel"
            },
            templete : {
                url: "/dominationarea/file/down"
            },
            importProgress:{
                show: false
            }
            
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "importprogress":importProgress

        },
        methods: {
            doImport:function(){
                var _this=this;
                _this.importProgress.show = true;
            },
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
