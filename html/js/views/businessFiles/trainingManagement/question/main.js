define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
    
    var initDataModel = function () {
        return {
            moduleCode: "question",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside",
				showDeleteResult:false,
				successMsg:null,
				faildMsg:null,
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "question/list{/curPage}{/pageSize}",
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
                        width: 150
					},

					// LIB.tableMgr.column.company,
					//{
					//	//正确率
					//	title: "正确率",
					//	fieldName: "accuracy",
					//	filterType: "text"
					//},
					//{
					//	//试题解析
					//	title: "试题解析",
					//	fieldName: "analysis",
					//	filterType: "text"
					//},
					//{
					//	//正确选项
					//	title: "正确选项",
					//	fieldName: "answer",
					//	filterType: "text"
					//},
					{
						//试题内容
						title: "试题内容",
						fieldName: "content",
						filterType: "text",
                        width: 800
					},
						LIB.tableMgr.column.company,
					{
						// title : "题型",
						title:this.$t('bd.trm.questInfo'),
						fieldType : "custom",
						render : function(data){
							return LIB.getDataDic("question_type",data.type);
						},
						filterType : "enum",
						filterName : "criteria.intsValue.type",
						popFilterEnum : LIB.getDataDicList("question_type"),
						orderName: "type",
						width:100
					},
					{
						//试题类型 1:考题,2:练习题
						title: "试题类型",
						fieldName: "useType",
						orderName: "useType",
						filterName: "criteria.intsValue.useType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("question_use_type"),
						render: function (data) {
							return LIB.getDataDic("question_use_type", data.useType);
						}
					},
					{
						//知识点
						title: "知识点",
						fieldName: "examPoints",
						sortable :false,
						filterName : "criteria.strValue.examPointName",
						filterType: "text",
						render: function(data) {
							if(data.examPoints){
                                var pointNames = "";
                                data.examPoints.forEach(function (e) {
                                    if(e.name){
                                    	pointNames += (e.name + " , ");
                                    }
                                });
                                pointNames = pointNames.substr(0, pointNames.length - 2);
                                return pointNames;

                            }
						}
					},
//					{
//						//课程
//						title: "课程",
//						fieldName: "attr2",
//						filterType: "text"
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
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/question/importExcel2"
            },
            exportModel : {
            	 url: "/question/exportExcel"
            },
            templete : {
                url: "/question/file/down2"
            },
            importProgress:{
                show: false
            },
			isCheckKind: false,
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "importprogress":importProgress
        },
        methods: {
			checkSelect: function (val) {

				this.tableModel.isSingleCheck = !this.isCheckKind;
				if (!this.isCheckKind) {
					this.tableModel.selectedDatas = [];
					this.$refs.mainTable.doClearData();
					this.$refs.mainTable.doQuery();
				}

				this.$refs.mainTable.isSingleCheck = this.tableModel.isSingleCheck;
			},
			doDeleteOp: function() {
				var _this = this;
				var selectedDatas = this.tableModel.selectedDatas;
				if(selectedDatas.length  == 1){
					this.doDelete();
				}else{
					LIB.Modal.confirm({
						title: '确定删除数据?',
						onOk: function() {
							var arr = [];
							_.each(_this.tableModel.selectedDatas, function (item) {
								arr.push({id:item.id});
							});
							api.deleteBatch(null, arr).then(function(res) {
								_this.$refs.mainTable.doClearData();
								_this.$refs.mainTable.doQuery();
								if ((selectedDatas.length - res.data) > 0) {
									_this.mainModel.showDeleteResult = true;
									_this.mainModel.successMsg = '成功删除' + res.data + '条';
									_this.mainModel.faildMsg = '删除失败' + (selectedDatas.length - res.data) + '条';
								} else {
									LIB.Msg.info("已删除" + res.data + "条数据！");
								}

							});
						}
					});

				}

			},
            doImport:function(){
                var _this=this;
                this.importProgress.show = true;
            },
        },
        events: {
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
