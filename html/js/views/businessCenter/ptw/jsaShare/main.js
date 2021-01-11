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
//	var ptwJsaMasterFormModal = require("componentsEx/formModal/ptwJsaMasterFormModal");

	//导入
	var importProgress = require("componentsEx/importProgress/main");

	LIB.registerDataDic("iptw_jsa_master_has_qualification", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_jsa_master_has_specification", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_jsa_master_is_contractor", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_jsa_master_is_cross_operat", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_jsa_master_is_new_task", [
		["0","已做过的任务"],
		["1","新任务"]
	]);

	LIB.registerDataDic("iptw_jsa_master_is_permit_required", [
		["0","否"],
		["1","是"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "ptwJsaMasterShare",
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
	                url: "ptwjsamaster/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
						{
							title: 'JSA编号',
							fieldName: "code",
							width: 180,
							orderName: "code",
							fieldType: "link",
							filterType: "text"
						},
						{
							title: '名称',
							fieldName: "name",
							width: 200,
							orderName: "name",
							fieldType: "link",
							filterType: "text"
						},
						LIB.tableMgr.column.company,
						LIB.tableMgr.column.dept,
						{
							title: "作业单位",
							fieldName: "constructionOrgName",
							orderName: "constructionOrgId",
							filterType: "text"
						},
						{
							//作业内容
							title: "作业内容",
							fieldName: "taskContent",
							filterType: "text",
							width: 300
						},
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
						{
							//作业日期
							title: "作业日期",
							fieldName: "workDate",
							filterType: "date",
							render: function (data) {
								var d = _.get(data, "workDate", "");
								return d.substr(0, 10)
							}
						},
						//LIB.tableMgr.column.disable,
	                ],
					defaultFilterValue : {"isShare" : 1}
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ptwjsamaster/importExcel"
            },
            exportModel : {
                url: "/ptwjsamaster/exportExcel",
                withColumnCfgParam: true
            },
			templete: {
				url: "/ptwjsamaster/file/down"
			},
			importProgress: {
				show: false
			}
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
			//Legacy模式
//			"ptwjsamasterFormModal":ptwJsaMasterFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ptwJsaMasterFormModel.show = true;
//				this.$refs.ptwjsamasterFormModal.init("create");
//			},
//			doSavePtwJsaMaster : function(data) {
//				this.doSave(data);
//			}
			doImport: function () {
				this.importProgress.show = true;
			},
			doExportDetail : function(){
				var id = this.tableModel.selectedDatas[0].id;
				LIB.Modal.confirm({
					title: '导出数据?',
					onOk: function () {
						window.open('/ptwjsamaster/' + id + '/ptwjsadetails/export');
					}
				});
			}

        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
