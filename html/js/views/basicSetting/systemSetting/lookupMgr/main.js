define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
	var detailPanel = require("./detail-xl");

	//Legacy模式
	var lookupFormModal = require("componentsEx/formModal/lookupFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "lookup",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "lookup/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//编码
						title: "编码",
						fieldName: "code",
						fieldType: "link",
						filterType: "text",
						width: 220
					},
					{
						//字典名称
						title: "名称",
						fieldName: "name",
						filterType: "text",
                        width: 240
					},
					{
						//类型
						title: "类型",
						fieldName: "type",
						fieldType: "custom",
						filterName: "criteria.strsValue.type",
						filterType: "enum",
						popFilterEnum : LIB.getDataDicList("look_up"),
						render:function (data) {
							if(data.type){
								if(data.type == "0"){
									return "数据字典";
								}else if(data.type == "1"){
									return "系统参数";
								}else if(data.type == "2"){
									return "资源配置";
								}
							}
						},
                        width: 100
					},
					{
						//字典值
						title: "字典值",
						fieldName: "value",
						filterType: "text",
                        width: 160
					},
					{
						//备注
						title: "备注",
						fieldName: "remarks",
						filterType: "text",
                        width: 240
					},
					{
						//修改日期
						title: "修改日期",
						fieldName: "modifyDate",
						filterType: "date",
                        width: 180
					},
					{
						//创建日期
						title: "创建日期",
						fieldName: "createDate",
						filterType: "date",
                        width: 180
					}
	                ],
	                defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},"criteria.strsValue.type":['1','2']}
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/lookup/importExcel"
            },
            exportModel : {
            	 url: "/lookup/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
			formModel : {
				lookupFormModel : {
					show : false,
				}
			}
            
        };
    }
    

 	var tpl = LIB.renderHTML(require("text!./main.html"));

    var vm = LIB.VueEx.extend({
		//Legacy模式
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
			//Legacy模式
			"lookupFormModal":lookupFormModal,
            
        },
        methods: {
			//Legacy模式
			doAdd : function(data) {
				this.formModel.lookupFormModel.show = true;
				this.$refs.lookupFormModal.init("create");
			},
			doSaveLookup : function(data) {
				this.doSave(data);
			},
			doCleanCache : function(data) {
				api.removeAllCache({}, null).then(function() {
                    LIB.Msg.info("清除缓存成功");
				});
			}

        },
        events: {
        },
        ready: function(){
        	this.$api = api;
        }
    });

    return vm;
});
