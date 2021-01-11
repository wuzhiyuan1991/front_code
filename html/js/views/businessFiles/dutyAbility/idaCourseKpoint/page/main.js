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
//	var idaCourseKpointFormModal = require("componentsEx/formModal/idaCourseKpointFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "idaCourseKpoint",
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
	                url: "idacoursekpoint/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//节点名称
						title: "节点名称",
						fieldName: "name",
						filterType: "text"
					},
					 LIB.tableMgr.column.disable,
					{
						//文本
						title: "文本",
						fieldName: "content",
						filterType: "text"
					},
					{
						//课件类型 1视频 2图片 3word 4excel 5ppt 6pdf
						title: "课件类型",
						fieldName: "fileType",
						filterType: "text"
					},
					{
						//是否可以试听 1免费,2收费
						title: "是否可以试听",
						fieldName: "isFree",
						filterType: "number"
					},
					{
						//节点类型 0章,1节
						title: "节点类型",
						fieldName: "kpointType",
						filterType: "number"
					},
					{
						//直播开始时间
						title: "直播开始时间",
						fieldName: "liveBeginTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.liveBeginTime);
//						}
					},
					{
						//直播结束时间
						title: "直播结束时间",
						fieldName: "liveEndTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.liveEndTime);
//						}
					},
//					{
//						//直播地址
//						title: "直播地址",
//						fieldName: "liveUrl",
//						filterType: "text"
//					},
//					{
//						//页数
//						title: "页数",
//						fieldName: "pageCount",
//						filterType: "number"
//					},
//					{
//						//课后作业版本号 更新次数
//						title: "课后作业版本号",
//						fieldName: "paperVersion",
//						filterType: "number"
//					},
//					{
//						//播放次数
//						title: "播放次数",
//						fieldName: "playCount",
//						filterType: "number"
//					},
//					{
//						//播放时间
//						title: "播放时间",
//						fieldName: "playTime",
//						filterType: "text"
//					},
//					{
//						//视频类型
//						title: "视频类型",
//						fieldName: "videoType",
//						filterType: "text"
//					},
//					{
//						//视频地址
//						title: "视频地址",
//						fieldName: "videoUrl",
//						filterType: "text"
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
                url: "/idacoursekpoint/importExcel"
            },
            exportModel : {
                url: "/idacoursekpoint/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				idaCourseKpointFormModel : {
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
//			"idacoursekpointFormModal":idaCourseKpointFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.idaCourseKpointFormModel.show = true;
//				this.$refs.idacoursekpointFormModal.init("create");
//			},
//			doSaveIdaCourseKpoint : function(data) {
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
