define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
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
					 LIB.tableMgr.column.code,
					{
						//标签名称
						title: "标签名称",
						fieldName: "name",
						filterType: "text"
					},
					 // LIB.tableMgr.column.disable,
					{
						//标签标识
						title: "标签标识",
						fieldName: "flag",
						filterType: "text"
					},
					 // LIB.tableMgr.column.modifyDate,
					 // LIB.tableMgr.column.createDate,

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
            },
			//Legacy模式
//			formModel : {
//				rfidFormModel : {
//					show : false,
//				}
//			}

        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
		//Legacy模式
//		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
			//Legacy模式
//			"rfidFormModal":rfidFormModal,
            
        },
        methods: {
            initData: function () {
                this.mainModel.bizType = this.$route.query.bizType;
                var params = [];
                //大类型
                params.push({
                    value : {
                        columnFilterName : "bizType",
                        columnFilterValue : this.mainModel.bizType
                    },
                    type : "save"
                });
                this.$refs.mainTable.doQueryByFilter(params);
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
