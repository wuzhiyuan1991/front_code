define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "riDutyConfig",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
				detailPanelClass : "large-info-aside",
                showTempSetting: true
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "dutyprocesstemplate/list{/curPage}{/pageSize}?source=1",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
                        // {
                        //     title: '序号',
                        //     fieldType: 'sequence'
                        // },
					{
						//计划名
						title: "模板名称",
						fieldName: "name",
						filterType: "text",
                        width:350
					},
                    {
                        title: "模板类型",
                        fieldName: "type",
                        filterType: "text"
                    },
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
	                ],
                    defaultFilterValue : {"orgId" : LIB.user.orgId}
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riCheckPlan/importExcel"
            },
            exportModel : {
            	 url: "/riCheckPlan/exportExcel"
            },
            auditObj: {
                visible: false
            },
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        computed: {
            showSubmit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '0';
            },
            showAudit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '1';
            },
            showQuit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '2';
            }
        },
        methods: {


            doUpdate: function() {
                var rows = this.tableModel.selectedDatas;
              this.showDetail(rows[0], { opType: "update" });
            },
            doSubmit: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if(rows[0].disable !== '0') {
                    LIB.Msg.warning("只能提交未发布的数据");
                    return;
                }
                var id = _.get(this.tableModel.selectedDatas, '[0].id');

                api.submitRiCheckPlan({id: id}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("提交成功");
                })

            },
            doAudit: function () {
                var rows = this.tableModel.selectedDatas;
                if(rows[0].disable !== '0') {
                    LIB.Msg.warning("只能审核未发布的数据");
                    return;
                }
                this.auditObj.visible = true;
            },
            doQuit: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if(rows[0].disable !== '0') {
                    LIB.Msg.warning("只能弃审未发布的数据");
                    return;
                }
                var id = _.get(rows, '[0].id');
                api.quitRiCheckPlan({id: id}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("弃审成功");
                })
            },
            doPass: function (val) {
                var _this = this;
                var id = _.get(this.tableModel.selectedDatas, '[0].id');
                api.auditRiCheckPlan({id: id, status: val}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("审核操作成功");
                    _this.auditObj.visible = false;
                })
            },
            initData: function () {
                this.mainModel.bizType = this.$route.query.bizType;
                if(this.mainModel.bizType){
                    var params = [];
                    //大类型
                    params.push({
                        value : {
                            columnFilterName : "bizType",
                            columnFilterValue : this.mainModel.bizType
                        },
                        type : "save"
                    });
                    this.$refs.mainTable.doQueryByFilter(params);
                }


            },
        },
        events: {
            "ev_dtPublish": function () {
                this.refreshMainTable();
                this.detailModel.show = false;
            }
        },
        ready: function () {

        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
