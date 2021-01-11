define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    var detailXlPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
	//导入
	var importProgress = require("componentsEx/importProgress/main");

    var initDataModel = function () {
        return {
            moduleCode: "examPaper",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside",
				detailXlPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "exampaper/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                },
						{
							//唯一标识
							title: this.$t("gb.common.code"),
							fieldName: "code",
							fieldType: "link",
							filterType: "text",
                            width: 160
						},
						{
							//title : "试卷名称",
							title:this.$t("bd.trm.testName"),
							fieldName : "name",
							filterType : "text",
                            width: 240
						},
						{
							//title : "课程名称",
							title:"课程",
							fieldName : "course.name",
							filterType : "text"
						},
						_.extend(_.extend({}, LIB.tableMgr.column.company), {fieldName: "orgId"}),
						{
							title:"组卷方式",
							fieldType : "custom",
							render : function(data){
								return LIB.getDataDic("paper_create_type",data.attr2);
							},
							orderName:"createType",
							filterType : "enum",
							filterName : "criteria.strsValue.attr2",
							popFilterEnum : LIB.getDataDicList("paper_create_type"),
							width: 120
						},
						{
							title:"试卷类型",
							fieldType : "custom",
							render : function(data){
								return LIB.getDataDic("paper_type",data.type);
							},
							orderName:"type",
							filterType : "enum",
							filterName : "criteria.intsValue.type",
							popFilterEnum : LIB.getDataDicList("paper_type"),
                            width: 120
						},
						{
							// title : "测试时间",
							title: "考试时长",
							fieldName: "replyTime",
							fieldType: "custom",
							filterType : "number",
							render: function (data) {
								return data.replyTime + "分钟";
							},
                            width: 120
						},
						//{
						//	//禁用标识， 1:已禁用，0：未禁用，null:未禁用
						//	title: "禁用标识，",
						//	fieldName: "disable",
						//	filterType: "text"
						//},
						//{
						//	//试卷描述
						//	title: "试卷描述",
						//	fieldName: "info",
						//	filterType: "text"
						//},
						//{
						//	//试题总数
						//	title: "试题总数",
						//	fieldName: "qstCount",
						//	filterType: "text"
						//},
						//{
						//	//限制答题的时间 单位分钟
						//	title: "限制答题的时间",
						//	fieldName: "replyTime",
						//	filterType: "text"
						//},
						{
							//试卷总分
							title: "试卷总分",
							fieldName: "score",
							fieldType: "custom",
							filterType : "number",
							render: function (data) {
								return data.score + "分";
							},
                            width: 120
						},

//					{
//						//修改日期
//						title: "修改日期",
//						fieldName: "modifyDate",
//						filterType: "date"
//					},
						{
							//创建日期
							title: "创建时间",
							fieldName: "createDate",
							filterType: "date",
                            width: 180
						},
					]
				}
            ),
			// 自动组卷
            detailModel: {
                show: false
            },
			// 手动组卷
            detailXlModel: {
                show: false
            },
			uploadModel: {
				url: "/question/importExcel"
			},
			templete : {
				url: "/question/file/down"
			},
			importProgress:{
				show: false
			},
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,     // 随机组卷
            "detailXlPanel": detailXlPanel,  // 手动组卷
			"importprogress":importProgress
        },
        methods: {
			doImport:function(){
				var _this=this;
				this.importProgress.show = true;
			},
			customPaper: function () {
				window.open("/html/main.html#!/createCustomPaper");
			},
        	doShowDetailManual: function (row, opts) {
				var opType = (opts && opts.opType) ? opts.opType : "view";
                //this.$broadcast('ev_dtReload', "view", row.id);
				this.$broadcast('ev_dtManualReload', opType, row.id, row);
                this.detailXlModel.show = true;
            },
        	doTableCellClick: function (data) {
                if (!!this.showDetail && data.cell.fieldName == "code") {
                	if(data.entry.data.createType == 1) {
                		this.showDetail(data.entry.data);
                	}else{
                		this.doShowDetailManual(data.entry.data);
                	}
                		
                } else {
					(!!this.detailModel) && (this.detailModel.show = false);
				}
            },
            //修改方法,滑出编辑页面
			doUpdate: function () {
				var rows = this.tableModel.selectedDatas;
				if(!_.isEmpty(rows)) {
					if(rows[0].createType == 1) {
						this.showDetail(rows[0], {opType:"update"});
					}else{
						this.doShowDetailManual(rows[0], {opType:"update"});
					}
				}
			},
        	doManualAdd : function(data) {
        		this.$broadcast('ev_dtManualReload', "create");
                this.detailXlModel.show = true;
			},
			_storageChanged: function (ev) {
				if (ev.key === 'custom_paper_mark') {
					this.refreshMainTable();
				}
			}
        },
        events: {
        	"ev_dtManualCreate": function (data) {
                //更新数据
            	this.refreshMainTable();
            },
            "ev_dtManualUpdate": function (data) {
                //更新数据
            	this.refreshMainTable();
            },
        	"ev_dtManualDelete": function () {
                //更新数据
            	this.refreshMainTable();
            	this.detailXlModel.show = false;
            },
            "ev_dtManualClose": function () {
				this.detailXlModel.show = false;
            }
        },
        init: function () {
            this.$api = api;
        },
		ready: function () {
			window.addEventListener("storage", this._storageChanged);
		},
		beforeDestroy: function () {
			window.removeEventListener("storage", this._storageChanged);
		}
    });

    return vm;
});
