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
//	var techArticleFormModal = require("componentsEx/formModal/techArticleFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "techArticle",
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
	                url: "techarticle/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.disable,
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
					{
						//
						title: "",
						fieldName: "content",
						filterType: "text"
					},
					{
						//关键词
						title: "关键词",
						fieldName: "keyword",
						filterType: "text"
					},
					{
						//发布时间
						title: "发布时间",
						fieldName: "lastReplyDate",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.lastReplyDate);
//						}
					},
					{
						//发布时间
						title: "发布时间",
						fieldName: "publishDate",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.publishDate);
//						}
					},
					{
						//回复次数
						title: "回复次数",
						fieldName: "replyTime",
						filterType: "number"
					},
					{
						title: "作者",
						fieldName: "user.name",
						orderName: "user.username",
						filterType: "text",
					},
//					{
//						//发布状态 0：未发布，1：已发布
//						title: "发布状态",
//						fieldName: "state",
//						filterType: "text"
//					},
//					{
//						//帖子标题
//						title: "帖子标题",
//						fieldName: "title",
//						filterType: "text"
//					},
//					{
//						//查看次数
//						title: "查看次数",
//						fieldName: "viewTime",
//						filterType: "number"
//					},
//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/techarticle/importExcel"
            },
            exportModel : {
                url: "/techarticle/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				techArticleFormModel : {
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
//			"techarticleFormModal":techArticleFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.techArticleFormModel.show = true;
//				this.$refs.techarticleFormModal.init("create");
//			},
//			doSaveTechArticle : function(data) {
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
