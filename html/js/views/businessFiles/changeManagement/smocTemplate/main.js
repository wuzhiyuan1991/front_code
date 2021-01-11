define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var smocTemplateFormModal = require("componentsEx/formModal/smocTemplateFormModal");

	LIB.registerDataDic("smoc_smoc_template_type", [
		["0","未设计类型"],
		["1","安全相关"],
		["2","职业健康相关"],
		["3","环境相关"],
		["4","设备相关"],
		["5","其他"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "smocTemplate",
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
	                url: "smoctemplate/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//分组名称
						title: "模板名称",
						fieldName: "name",
						// render:function(data){
						// 	if(data.content){
						// 		var obj =	JSON.parse(data.content)
						// 		return  obj.name
						// 	}
							
						// }
						filterType: "text"
					},
					// {
					// 	//模板内容
					// 	title: "模板内容",
					// 	fieldName: "content",
					// 	width:300
					// 	// filterType: "text"
					// },
					//  LIB.tableMgr.column.disable,
					//  LIB.tableMgr.column.company,
					//  LIB.tableMgr.column.dept,
					// {
					// 	//分组类型 0:未设计类型,1:安全相关,2:职业健康相关,3:环境相关,4:设备相关,5:其他
					// 	title: "分组类型",
					// 	fieldName: "type",
					// 	orderName: "type",
					// 	filterName: "criteria.intsValue.type",
					// 	filterType: "enum",
					// 	fieldType: "custom",
					// 	popFilterEnum: LIB.getDataDicList("smoc_smoc_template_type"),
					// 	render: function (data) {
					// 		return LIB.getDataDic("smoc_smoc_template_type", data.type);
					// 	}
					// },
					// LIB.tableMgr.column.company,
					//  LIB.tableMgr.column.modifyDate,
					//  LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/smoctemplate/importExcel"
            },
            exportModel : {
                url: "/smoctemplate/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				smocTemplateFormModel : {
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
//			"smoctemplateFormModal":smocTemplateFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.smocTemplateFormModel.show = true;
//				this.$refs.smoctemplateFormModal.init("create");
//			},
//			doSaveSmocTemplate : function(data) {
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
