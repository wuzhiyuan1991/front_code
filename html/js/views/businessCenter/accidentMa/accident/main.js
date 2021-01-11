define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    //var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var accidentFormModal = require("componentsEx/formModal/accidentFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "accident",
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
	                url: "accident/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						title: "事故名称",
						fieldName: "name",
						filterType: "text"
					},
                        _.extend(_.extend({}, LIB.tableMgr.column.company), {title: "事故单位"}),
					{
						//发生时间
						title: "发生时间",
						fieldName: "accidentTime",
						filterType: "date"
					},
                    {
                        //发生地点
                        title: "发生地点",
                        fieldName: "attr1",
                        filterType: "text"
                    },
                    {
                        title: "事故单位责任人",
                        fieldName: "unitPrincipal.username",
                        filterType: "text"
                    },
                    {
                        title: "事故现场责任人",
                        fieldName: "scenePrincipal.username",
                        filterType: "text"
                    },
					{
						//事故简要经过
						title: "事故简要经过",
						fieldName: "description",
						filterType: "text",
                        renderClass: "textarea",
					},
                    {
                        //调查报告 1:已生成,2:未生成
                        title: "调查报告",
                        fieldName: "investigation.id",
                        filterName: "criteria.intsValue.isInvestigated",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("iam_is_investigated"),
                        render: function (data) {
                            var isInvestigated = '0';
                            if(!!data.investigation) {
                                isInvestigated = '1';
                            }
                            return LIB.getDataDic("iam_is_investigated", isInvestigated);
                        }
                    }
					 //LIB.tableMgr.column.modifyDate,
					 //LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/accident/importExcel"
            },
            exportModel : {
                url: "/accident/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				accidentFormModel : {
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
//			"accidentFormModal":accidentFormModal,
            
        },
        methods: {
            doGenerateReport: function() {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length == 0) {
                    LIB.Msg.warning("请选择数据!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量生成调查报告");
                    return;
                }
                window.isClickGenerateReportBtn = true;
                var _this = this;
                setTimeout(function(){
                    var routerPart="/accidentManagement/businessCenter/investigation?method=create&accidentId=" + rows[0].id;
                    _this.$router.go(routerPart);
                }, 400);
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
