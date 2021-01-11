define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));

    var allKindSend = require("./dialog/allKindSend");

    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var emerPlanFormModal = require("componentsEx/formModal/emerPlanFormModal");

    LIB.registerDataDic("iem_emer_plan_result", [
        ["2","通过"],
        ["1","未通过"],
    ]);

    
    var initDataModel = function () {
        return {
            moduleCode: "emerPlanrr",
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
	                url: "emerplan/list{/curPage}{/pageSize}",
	                selectedDatas: [],
                    isSingleCheck:true,  //单选
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//预案名称
						title: "预案名称",
						fieldName: "name",
						filterType: "text"
					},
					{
						//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
						title: "预案类型",
						fieldName: "type",
						orderName: "type",
						filterName: "criteria.intsValue.type",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_emer_plan_type"),
						render: function (data) {
							return LIB.getDataDic("iem_emer_plan_type", data.type);
						}
					},
					{
						//版本号
						title: "版本号",
						fieldName: "verNo",
						filterType: "text"
					},
					{
						//评审状态 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案,6:发布实施,10:已发布
						title: "评审状态",
						fieldName: "status",
						orderName: "status",
						filterName: "criteria.intsValue.status",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_emer_plan_status"),
						render: function (data) {
							return LIB.getDataDic("iem_emer_plan_status", data.status);
						}
					},
					 // LIB.tableMgr.column.disable,
                    LIB.tableMgr.column.company,
                    {
                        title:'发布实施日期',
                        filterType: "date",
                        fieldName: "data.emerPlanHistory.operateTime",
                        render:function (data) {
                            if(data.emerPlanHistory && data.emerPlanHistory.operateTime){
                                return data.emerPlanHistory.operateTime.toString().slice(0,10);
                            }
                        }
                    },
                    {
                        title:'下次修订日期',
                        // filterType: "date",
                        render:function (data) {
                            if(data.reviseFrequence && data.emerPlanHistory && data.emerPlanHistory.operateTime){
                                var date = new Date(data.emerPlanHistory.operateTime);
                                date.setFullYear(date.getFullYear()+parseInt(data.reviseFrequence));
                                return date.Format("yyyy-MM-dd")
                            }
                        }
                    },
					// {
					// 	//修订频率
					// 	title: "修订频率",
					// 	fieldName: "reviseFrequence",
					// 	filterType: "number"
					// },
					//  LIB.tableMgr.column.dept,
//					 LIB.tableMgr.column.remark,
////					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/emerplan/importExcel"
            },
            exportModel : {
                url: "/emerplan/exportExcel",
                withColumnCfgParam: true
            },
			isCheckKind:false,
			dialogModel:{
            	allKind:{
                    visible:false
				}

			}
			//Legacy模式
//			formModel : {
//				emerPlanFormModel : {
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
			"allKindSend":allKindSend
			//Legacy模式
//			"emerplanFormModal":emerPlanFormModal,
        },
        methods: {
            checkSelect:function (val) {

                this.tableModel.isSingleCheck = !this.isCheckKind;
				if(!this.isCheckKind){
                    this.tableModel.selectedDatas = [];
                    this.$refs.mainTable.doClearData();
                    this.$refs.mainTable.doQuery();
				}

                this.$refs.mainTable.isSingleCheck = this.tableModel.isSingleCheck;
            },
            doShowDetail:function () {
                // this.detailModel.show = true;
                // this.$broadcast('ev_dtReload', null, this.tableModel.selectedDatas[0].id);
                this.dialogModel.allKind.visible = true;
            },

            doDeleteAll:function () {
            	var _this = this;
            	var arr = [];
            	_.each(_this.tableModel.selectedDatas, function (item) {
                    arr.push({id:item.id, orgId:LIB.user.orgId});
                });
                LIB.Modal.confirm({
                    title: "是否删除选中的"+_this.tableModel.selectedDatas.length+"项？",
                    onOk: function () {
                        api.deleteBatch(null, arr).then(function (res) {
                            LIB.Msg.info("已经删除"+_this.tableModel.selectedDatas.length+"项");
                            _this.$refs.mainTable.doClearData();
                            _this.$refs.mainTable.doQuery();
                        })
                    }
                });
            },
			
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.emerPlanFormModel.show = true;
//				this.$refs.emerplanFormModal.init("create");
//			},
//			doSaveEmerPlan : function(data) {
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
