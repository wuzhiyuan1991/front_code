define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    //var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
	//Legacy模式
//	var tpaCheckItemFormModal = require("componentsEx/formModal/tpaCheckItemFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "tpaCheckItem",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                //detailPanelClass : "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "tpacheckitem/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//角色编码
						title: "证书编码",
						fieldName: "code",
						fieldType: "link",
						filterType: "text"
					},
					{
						//检查项名称
						title: "证书名称",
						fieldName: "name",
						filterType: "text"
					},
                        {
                            //证书类别 10船舶证书类 20人员证书类 30资料类
                            title: "证书类别",
                            fieldName: "itemType",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.itemType",
                            popFilterEnum : LIB.getDataDicList("itemType"),
                            render: function (data) {
                                return LIB.getDataDic("itemType",data.itemType);
                            }
                        },
					{
						//发证日期
						title: "发证日期",
						fieldName: "awardDate",
						filterType: "date"
					},
                        LIB.tableMgr.column.company,
                    {
                        //有效日期
                        title: "有效日期",
                        fieldName: "validDate",
                        filterType: "date"
                    }
	                ],
                    defaultFilterValue : {"criteria.intsValue.itemTypes" : [10,20]}
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/tpacheckitem/importExcel?type=2"
            },
            exportModel : {
                url: "/tpacheckitem/exportExcel?type=2"
            },
            templete : {
                url: "/tpacheckitem/file/down?type=2"
            },
            importProgress:{
                show: false
            }
			//Legacy模式
//			formModel : {
//				tpaCheckItemFormModel : {
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
//			"tpacheckitemFormModal":tpaCheckItemFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.tpaCheckItemFormModel.show = true;
//				this.$refs.tpacheckitemFormModal.init("create");
//			},
//			doSaveTpaCheckItem : function(data) {
//				this.doSave(data);
//			}
            doImport:function(){
                var _this=this;
                this.importProgress.show = true;
            },
        },
        events: {
        },
        ready: function(){
        	this.$api = api;
        }
    });

    return vm;
});
