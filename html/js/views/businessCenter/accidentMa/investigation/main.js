define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
    //var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var investigationFormModal = require("componentsEx/formModal/investigationFormModal");


    
    var initDataModel = function () {
        return {
            moduleCode: "investigation",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
				//detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "investigation/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						title: "事故名称",
						fieldName: "accident.name",
						filterType: "text"
					},
					_.extend(_.extend({}, LIB.tableMgr.column.company), {title: "事故单位"}),
					{
						//发生时间
						title: "发生时间",
						fieldName: "accident.accidentTime",
						filterName: "accidentTime",
						filterType: "date"
					},
					{
						title: "发生地点",
						fieldName: "accident.attr1",
						filterType: "text"
					},
					//{
					//	//作业类别 1:勘探,2:钻井,3:工程,4:其他
					//	title: "作业类别",
					//	fieldName: "jobClass",
					//	orderName: "jobClass",
					//	filterName: "criteria.intsValue.jobClass",
					//	filterType: "enum",
					//	fieldType: "custom",
					//	popFilterEnum: LIB.getDataDicList("iam_investigation_job_class"),
					//	render: function (data) {
					//		return LIB.getDataDic("iam_investigation_job_class", data.jobClass);
					//	}
					//},
					{
						//事故类型 1:死亡,2:误工伤害,3:工作受限或转移,4:可记录事故,5:简单医疗处理,6:火灾,7:财产损失,8:溢油,9:气体泄漏,10:未遂事故,11:其他
						title: "事故类型",
						fieldName: "accidentType",
						orderName: "accidentType",
						filterName: "criteria.intsValue.accidentType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iam_investigation_accident_type"),
						render: function (data) {
							return LIB.getDataDic("iam_investigation_accident_type", data.accidentType);
						}
					}
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/investigation/importExcel"
            },
            exportModel : {
                url: "/investigation/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				investigationFormModel : {
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
//			"investigationFormModal":investigationFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.investigationFormModel.show = true;
//				this.$refs.investigationFormModal.init("create");
//			},
//			doSaveInvestigation : function(data) {
//				this.doSave(data);
//			}

        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
		route: {
			activate: function (transition) {

				var queryObj = transition.to.query;
				if (queryObj.method) {
					if (queryObj.accidentId && queryObj.method === "create") {
						//TODO 以后改成用vuex做,暂时的解决方案
						if (!!window.isClickGenerateReportBtn) {
							this.$broadcast('ev_dtReload', "create", queryObj.accidentId);
							window.isClickGenerateReportBtn = false;
							this.detailModel.show = true;
						}
					}
				}
				transition.next();
			}
		}
    });

    return vm;
});
