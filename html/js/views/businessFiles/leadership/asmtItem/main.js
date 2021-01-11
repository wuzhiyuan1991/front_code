define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    
	//Legacy模式
//	var asmtItemFormModal = require("componentsEx/formModal/asmtItemFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "asmtItem",
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
	                url: "asmtitem/list{/curPage}{/pageSize}",
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
						filterType: "text"
					},
					{
						//自评名称
						title: "自评名称",
						fieldName: "name",
						filterType: "text"
					},
					{
						//类型 0行为类,1状态类,2管理类 暂时不用
						title: "类型",
						fieldName: "type",
						filterType: "text"
					},
					{
						//自评分值
						title: "自评分值",
						fieldName: "score",
						filterType: "text"
					},
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.company,
					{
						//自评项来源标识 2手动生成
						title: "自评项来源标识",
						fieldName: "category",
						filterType: "text"
					},
					{
						//是否禁用 0启用,1禁用
						title: "是否禁用",
						fieldName: "disable",
						filterType: "text"
					},
					{
						//分组名称
						title: "分组名称",
						fieldName: "groupName",
						filterType: "text"
					},
//					{
//						//组排序
//						title: "组排序",
//						fieldName: "groupOrderNo",
//						filterType: "text"
//					},
//					{
//						//是否被使用 0未使用,1已使用 暂时不用
//						title: "是否被使用",
//						fieldName: "isUse",
//						filterType: "text"
//					},
//					{
//						//项排序
//						title: "项排序",
//						fieldName: "itemOrderNo",
//						filterType: "text"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						filterType: "text"
//					},
//					{
//						//修改日期
//						title: "修改日期",
//						fieldName: "modifyDate",
//						filterType: "date"
//					},
//					{
//						//创建日期
//						title: "创建日期",
//						fieldName: "createDate",
//						filterType: "date"
//					},
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/asmtItem/importExcel"
            },
            exportModel : {
            	 url: "/asmtItem/exportExcel"
            },
			//Legacy模式
//			formModel : {
//				asmtItemFormModel : {
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
//			"asmtitemFormModal":asmtItemFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.asmtItemFormModel.show = true;
//				this.$refs.asmtitemFormModal.init("create");
//			},
//			doSaveAsmtItem : function(data) {
//				this.doSave(data);
//			}

        },
        events: {
        },
        ready: function(){
        	this.$api = api;
        }
    });

    return vm;
});
