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
//	var pecAuditRoleFormModal = require("componentsEx/formModal/pecAuditRoleFormModal");

	LIB.registerDataDic("ipec_audit_role_position_level", [
		["1","站队级"],
		["2","管理处级"],
		["3","公司级"]
	]);

	LIB.registerDataDic("ipec_audit_role_position_type", [
		["1","基层站队长"],
		["2","管理处机关业务人员"],
		["3","管理处机关科室长"],
		["4","管理处机关主管领导"],
		["5","公司业务处室业务人员"],
		["6","公司业务处室科室长"],
		["7","公司业务处室主管领导"]
	]);

	LIB.registerDataDic("ipec_audit_role_rel_type", [
		["1","按站队"],
		["2","按公司"],
		["3","按专业"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "pecAuditRole",
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
	                url: "pecauditrole/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
					{
						//级别 1:站队级,2:管理处级,3:公司级
						title: "级别",
						fieldName: "positionLevel",
						orderName: "positionLevel",
						filterName: "criteria.intsValue.positionLevel",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("ipec_audit_role_position_level"),
						render: function (data) {
							return LIB.getDataDic("ipec_audit_role_position_level", data.positionLevel);
						}
					},
					{
						//岗位 1:基层站队长,2:管理处机关业务人员,3:管理处机关科室长,4:管理处机关主管领导,5:公司业务处室业务人员,6:公司业务处室科室长,7:公司业务处室主管领导
						title: "岗位",
						fieldName: "positionType",
						orderName: "positionType",
						filterName: "criteria.intsValue.positionType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("ipec_audit_role_position_type"),
						render: function (data) {
							return LIB.getDataDic("ipec_audit_role_position_type", data.positionType);
						}
					},
					{
						//审批形式 1:按站队,2:按公司,3:按专业
						title: "审批形式",
						fieldName: "relType",
						orderName: "relType",
						filterName: "criteria.intsValue.relType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("ipec_audit_role_rel_type"),
						render: function (data) {
							return LIB.getDataDic("ipec_audit_role_rel_type", data.relType);
						}
					},
					 LIB.tableMgr.column.disable,
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/pecauditrole/importExcel"
            },
            exportModel : {
                url: "/pecauditrole/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				pecAuditRoleFormModel : {
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
//			"pecauditroleFormModal":pecAuditRoleFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.pecAuditRoleFormModel.show = true;
//				this.$refs.pecauditroleFormModal.init("create");
//			},
//			doSavePecAuditRole : function(data) {
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
