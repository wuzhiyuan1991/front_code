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
//	var ltOhPhysicalsFormModal = require("componentsEx/formModal/ltOhPhysicalsFormModal");

	LIB.registerDataDic("iloh_physicals_type", [
		["0","岗前"],
		["1","在岗"],
		["2","离岗"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "ltOhPhysicals",
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
	                url: "ltohphysicals/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						title: "体检人",
						filterType: "text",
						fieldType: "custom",
						filterName : "user.username",
						render: function (data) {
							if (data.user) {
								return data.user.name;
							}
						}
					},

					{
						//体检类型 0:岗前,1:在岗,2:离岗
						title: "体检类型",
						fieldName: "type",
						orderName: "type",
						filterName: "criteria.intsValue.type",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iloh_physicals_type"),
						render: function (data) {
							return LIB.getDataDic("iloh_physicals_type", data.type);
						}
					},
					{
						//体检结果
						title: "体检结果",
						fieldName: "result",
						filterType: "text"
					},
					{
						//体检日期
						title: "体检日期",
						fieldName: "startDate",
						filterType: "date",
						fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.startDate);
						}
					},
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ltohphysicals/importExcel"
            },
            exportModel : {
                url: "/ltohphysicals/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ltOhPhysicalsFormModel : {
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
//			"ltohphysicalsFormModal":ltOhPhysicalsFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ltOhPhysicalsFormModel.show = true;
//				this.$refs.ltohphysicalsFormModal.init("create");
//			},
//			doSaveLtOhPhysicals : function(data) {
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
