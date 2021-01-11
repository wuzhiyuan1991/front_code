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
//	var ptwJsaReferenceFormModal = require("componentsEx/formModal/ptwJsaReferenceFormModal");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    
    var initDataModel = function () {
        return {
            moduleCode: "ptwJsaReference",
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
                    url: "ptwjsareference/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        LIB.tableMgr.column.company,
                        {
                            //作业内容
                            title: "作业内容",
                            fieldName: "taskContent",
                            filterType: "text",
                            width:400
                        },
                        // {
                        //     //分析小组组长
                        //     title: "分析小组组长",
                        //     fieldName: "analyseLeader",
                        //     filterType: "text"
                        // },
                        // {
                        //     //分析人员
                        //     title: "分析人员",
                        //     fieldName: "analysePerson",
                        //     filterType: "text"
                        // },
                        {
                            title:"分析组长",
                            fieldType:"custom",
                            filterType: "text",
                            filterName: "criteria.strValue.leaderUserName",
                            fieldName: "leaderUserName",
                            sortable :false,
                            render: function(data){
                                if(data.leaderUsers) {
                                    var names = "";
                                    data.leaderUsers.forEach(function (item) {
                                        names += (item.username + " , ");
                                    });
                                    names = names.substr(0, names.length - 2);
                                    return names;
                                }
                            },
                            width : 280
                        },
                        {
                            title:"分析人员",
                            fieldType:"custom",
                            filterType: "text",
                            filterName: "criteria.strValue.teamUserName",
                            fieldName: "teamUserName",
                            sortable :false,
                            render: function(data){
                                if(data.teamUsers) {
                                    var names = "";
                                    data.teamUsers.forEach(function (item) {
                                        names += (item.username + " , ");
                                    });
                                    names = names.substr(0, names.length - 2);
                                    return names;
                                }
                            },
                            width : 280
                        },
                        LIB.tableMgr.column.disable
                    ]
                }
            ),
            detailModel: {
                show: false
            },
			//Legacy模式
//			formModel : {
//				ptwJsaReferenceFormModel : {
//					show : false,
//				}
//			}
            uploadModel: {
                url: "/ptwjsareference/importExcel"
            },
            exportModel : {
                url: "/ptwjsareference/exportExcel",
                withColumnCfgParam: true
            },
            templete: {
                url: "/ptwjsareference/file/down"
            },
            importProgress: {
                show: false
            }
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
//			"ptwjsareferenceFormModal":ptwJsaReferenceFormModal,
            
        },
        methods: {
            doImport: function () {
                this.importProgress.show = true;
            },
            doExportDetail : function(){
                var id = this.tableModel.selectedDatas[0].id;
                LIB.Modal.confirm({
                    title: '导出数据?',
                    onOk: function () {
                        window.open('/ptwjsareference/' + id + '/ptwjsareferencedetails/export');
                    }
                });
            }
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ptwJsaReferenceFormModel.show = true;
//				this.$refs.ptwjsareferenceFormModal.init("create");
//			},
//			doSavePtwJsaReference : function(data) {
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
