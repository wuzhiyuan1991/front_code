define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");

	// LIB.registerDataDic("system_rfid_is_written", [
	// 	["0","未写入"],
	// 	["1","已写入"]
	// ]);

    
    var initDataModel = function () {
        return {
            moduleCode: "rfid",
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
	                url: "rfid/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					{
	                	title: "RFID编码",
						fieldName: "code",
						filterType: "text",
					},
					{
						//是否绑定 0:未写入,1:已写入
						title: "是否写入",
						fieldName: "isWritten",
						orderName: "isWritten",
						filterName: "criteria.intsValue.isWritten",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("is_written"),
						render: function (data) {
							return LIB.getDataDic("is_written", data.isWritten);
						}
					},
					 LIB.tableMgr.column.remark,
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/rfid/importExcel"
            },
            exportModel : {
                url: "/rfid/exportExcel",
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
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
