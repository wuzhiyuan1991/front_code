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
//	var asmtPlanSettingFormModal = require("componentsEx/formModal/asmtPlanSettingFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "asmtPlanSetting",
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
	                url: "asmtplansetting/list{/curPage}{/pageSize}",
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
						//是否禁用 0未发布，1发布
						title: "是否禁用",
						fieldName: "disable",
						filterType: "text"
					},
					{
						//结束时间
						title: "结束时间",
						fieldName: "endTime",
						filterType: "date"
					},
					{
						//频率类型 5周 10半月 15月 20自定义
						title: "频率类型",
						fieldName: "frequencyType",
						filterType: "text"
					},
					{
						//是否重复 0执行一次 1执行多次
						title: "是否重复",
						fieldName: "isRepeatable",
						filterType: "text"
					},
					{
						//是否包含周末 0不包含 1包含（frequency_type=1时生效）
						title: "是否包含周末",
						fieldName: "isWeekendInculed",
						filterType: "text"
					},
					{
						//时间间隔
						title: "时间间隔",
						fieldName: "period",
						filterType: "text"
					},
					{
						//开始时间
						title: "开始时间",
						fieldName: "startTime",
						filterType: "date"
					},
					{
						//间隔单位 1分钟 2小时 3天 4周 5月 6季度
						title: "间隔单位",
						fieldName: "unit",
						filterType: "text"
					},
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
                url: "/asmtPlanSetting/importExcel"
            },
            exportModel : {
            	 url: "/asmtPlanSetting/exportExcel"
            },
			//Legacy模式
//			formModel : {
//				asmtPlanSettingFormModel : {
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
//			"asmtplansettingFormModal":asmtPlanSettingFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.asmtPlanSettingFormModel.show = true;
//				this.$refs.asmtplansettingFormModal.init("create");
//			},
//			doSaveAsmtPlanSetting : function(data) {
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
