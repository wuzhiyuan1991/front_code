define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"

    var importProgress = require("componentsEx/importProgress/main");

    var initDataModel = function () {
        return {
            moduleCode: "emerGroup",
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
	                url: "emerlinkman/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					//  LIB.tableMgr.column.code,
					{
						title: "单位名称",
						fieldName: "emerGroup.name",
                        filterType: "text",
                        fieldType:'link',
                        width:200
					},
					{
						//单位地址
						title: "单位地址",
						fieldName: "emerGroup.address",
                        filterType: "text",
                        width:250
					},
                    {
                        title : "联系人",
                        fieldName : "name",
                        filterType: "text",
                        width:120
                    },{
                        title : "手机号码",
                        fieldName : "mobile",
                        filterType: "text",
                        width:120
                    },{
                        title : "办公电话",
                        fieldName : "officePhone",
                        filterType: "text",
                        width:120
                    },{
                        title : "职务",
                        fieldName : "duty",
                        filterType: "text"
                    },{
                        title : "备注",
                        fieldName : "remarks",
                        filterType: "text"
                    },
	                ],
                    defaultFilterValue: { "criteria.intValue.emerGroupType": 2 ,
                        "criteria.intValue.emerGroupDisable":0,
                        "criteria.orderValue": { fieldName: "ifnull(emergroup.modify_date, emergroup.create_date) desc, ifnull(e.modify_date, e.create_date) desc,e.id", orderType: "0" }}
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/emerlinkman/importExcel?type=2"
            },
            templete : {
                url: "/emerlinkman/file/down?type=2"
            },
            exportModel : {
                url: "/emerlinkman/exportExcel",
                withColumnCfgParam: true
            },
            importProgress:{
                show: false
            },
			//Legacy模式
//			formModel : {
//				emerGroupFormModel : {
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
            "importprogress":importProgress
			//Legacy模式
//			"emergroupFormModal":emerGroupFormModal,
            
        },
        methods: {
            doTableCellClick:function(data){
                if (data.cell.colId == 1){
                   
                    var _data = _.clone(data.entry.data);

                    window.open('/html/main.html#!/emer/businessFiles/externalOrganization?method=detail&&code='+_data.emerGroup.code+'&&id='+_data.emerGroup.id)
                }
               
            },
            doImport:function(){
                var _this=this;
                _this.importProgress.show = true;
            },
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.emerGroupFormModel.show = true;
//				this.$refs.emergroupFormModal.init("create");
//			},
//			doSaveEmerGroup : function(data) {
//				this.doSave(data);
//			}

        },
        events: {
        },
        init: function(){
            this.$api = api;
        }
    });

    return vm;
});
