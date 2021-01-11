define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    
	//Legacy模式
//	var taskCallbackFormModal = require("componentsEx/formModal/taskCallbackFormModal");

    LIB.registerDataDic("system_callback_result", [
        ["1","成功"],
        ["2","失败"]
    ]);
    
    var initDataModel = function () {
        return {
            moduleCode: "taskCallback",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside",
                type:null
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "taskcallback/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
                     _.extend({}, LIB.tableMgr.column.code, {width: 120}),
					{
						//任务名称
						title: "任务名称",
						fieldName: "name",
						filterType: "text",
                        'renderClass': "textarea"
					},
					{
						//任务内容
						title: "任务内容",
						fieldName: "content",
						filterType: "text",
                        width:500,
                        'renderClass': "textarea"
					},
                    {
                        title: "是否成功",
                        fieldType: "custom",
                        render: function (data) {
                            return LIB.getDataDic("system_callback_result", data.result);
                        },
                        width:150,
                    },
                    {
                        title: "回调内容",
                        fieldName: "attr1",
                        filterType: "text",
                        'renderClass': "textarea",
                        width:200,
                    },
                    {
                        title: "任务类型",
                        fieldName: "type",
                        filterType: "text",
                        width:150,
                        visible:false
                    },
					 LIB.tableMgr.column.createDate
	                ]
                    // ,
                    // defaultFilterValue: { "type": 2 }
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/taskcallback/importExcel"
            },
            exportModel : {
                url: "/taskcallback/exportExcel",
                withColumnCfgParam: true
            },
            dropDownModel : {
                data : []
            }
			//Legacy模式
//			formModel : {
//				taskCallbackFormModel : {
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
//			"taskcallbackFormModal":taskCallbackFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.taskCallbackFormModel.show = true;
//				this.$refs.taskcallbackFormModal.init("create");
//			},
//			doSaveTaskCallback : function(data) {
//				this.doSave(data);
//			}

            doClickDrowDownItem : function (data) {
                if(data && data.reqUrl) {
                    window.open(data.reqUrl);
                }
            },
            initData: function () {

                this.mainModel.type = this.$route.query.type;

                var params = [];

                //大类型
                params.push({
                    value : {
                        columnFilterName : "type",
                        columnFilterValue : this.mainModel.type
                    },
                    type : "save"
                });
                this.$refs.mainTable.doQueryByFilter(params);

                this.dropDownModel.data = [];
                if(this.mainModel.type) {
                    var _this = this;
                    this.$api.getCustomLookupData({}, null).then(function(res) {
                        var btns;
                        var items= _.propertyOf(res)("body[0].lookupItems");
                        if(items) {
                            btns = _.map(items, function(item){return JSON.parse(item.value); });
                        }
                        if(btns) {
                            _this.dropDownModel.data = btns;
                        }
                    });
                }
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
