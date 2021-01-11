define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var checkPrincipleFormModal = require("componentsEx/formModal/checkPrincipleFormModal");

    var initDataModel = function () {
        return {
            moduleCode: "checkPrinciple",
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
					url: "checkprinciple/list{/curPage}{/pageSize}",
					selectedDatas: [],
					columns: [
						// LIB.tableMgr.column.cb,
						// LIB.tableMgr.column.code,
						{
							//事故发生可能性
							title: "事故发生可能性",
							fieldName: "possibility",
							filterType: "text"
						},
						{
							//严重程度
							title: "严重程度",
							fieldName: "severity",
							filterType: "text"
						},
						{
							//风险等级
							title: "风险等级",
							fieldName: "riskLevel",
							filterType: "text"
						},
						{
							title: "巡检频率-类型",
							fieldName: "frequency",
							fieldType: "select",
							list : LIB.getDataDicList("ira_check_principle_frequency_type"),
                            width:220
						},
						// {
						// 	title: "巡检类型",
						// 	fieldName: "type",
						// 	fieldType: "select",
						// 	list : LIB.getDataDicList("ira_check_principle_type"),
						// },
						// {
						// 	//巡检频率 1:日,2:周,3:月
						// 	title: "巡检频率",
						// 	fieldName: "frequency",
						// 	orderName: "frequency",
						// 	filterName: "criteria.intsValue.frequency",
						// 	filterType: "enum",
						// 	fieldType: "custom",
						// 	popFilterEnum: LIB.getDataDicList("ira_check_principle_frequency"),
						// 	render: function (data) {
						// 		return LIB.getDataDic("ira_check_principle_frequency", data.frequency);
						// 	}
						// },
						// {
						// 	//巡检类型 1:常规,2:综合
						// 	title: "巡检类型",
						// 	fieldName: "type",
						// 	orderName: "type",
						// 	filterName: "criteria.intsValue.type",
						// 	filterType: "enum",
						// 	fieldType: "custom",
						// 	popFilterEnum: LIB.getDataDicList("ira_check_principle_type"),
						// 	render: function (data) {
						// 		return LIB.getDataDic("ira_check_principle_type", data.type);
						// 	}
						// },
					]
				}
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/checkprinciple/importExcel"
            },
            exportModel : {
                url: "/checkprinciple/exportExcel",
                withColumnCfgParam: true
            },
            mainList:[],
            frequencyType:null,
            type:"inUse",
			//Legacy模式
//			formModel : {
//				checkPrincipleFormModel : {
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
//			"checkprincipleFormModal":checkPrincipleFormModal,
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.checkPrincipleFormModel.show = true;
//				this.$refs.checkprincipleFormModal.init("create");
//			},
//			doSaveCheckPrinciple : function(data) {
//				this.doSave(data);
//			}
            getStyleColor:function (val) {
                if(val == '轻微' || val =='低风险'){
                    return 'background: #0E5AB2;color:#fff;'
                }else if(val == '较小' || val =='一般风险'){
                    return 'background: #F2F018;color:#fff;'
                }else if(val == '较大' || val =='较大风险'){
                    return 'background: #ED7D31;color:#fff;'
                }else if(val == '重大' || val =='重大风险'){
                    return 'background: #E74119;color:#fff;'
                }else if(val == '特别重大'){
                    return 'background:red; color:#fff;'
                }
            },
            doSaveAll:function () {
                var data = this.mainList;
                data.forEach(function(item){
                    item.frequencyType = item.frequencyTypes.join(",");
                    item.attr1 = item.unUseFrequencyTypes.join(",");
                })
                api.updateBatch(data).then(function (res) {
                    LIB.Msg.info("保存成功");
                });
            },
            getMainList:function () {
                var _this = this;
                _this.mainList = [];
                api.getMainList().then(function (res) {
                     _this.mainList = res.data.list;
                });
            },
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
        ready: function () {
            this.getMainList();
        }
    });

    return vm;
});
