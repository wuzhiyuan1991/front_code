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
//	var ptwWorkStuffFormModal = require("componentsEx/formModal/ptwWorkStuffFormModal");

	LIB.registerDataDic("iptw_work_stuff_stuff_type", [
		["1","作业工具/设备"],
		["2","作业资格证书"],
		["3","危害辨识"],
		["4","控制措施"],
		["5","工艺隔离-方法"],
		["6","个人防护设备"],
		["7","作业取消原因"],
		["8","气体检测指标"]
	]);

	LIB.registerDataDic("iptw_work_stuff_check_result", [
		["0","未核对"],
		["1","不勾选"],
		["2","勾选"]
	]);

	LIB.registerDataDic("iptw_work_stuff_is_extra", [
		["0","否"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "ptwWorkStuff",
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
	                url: "ptwworkstuff/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//类型 1:作业工具/设备,2:作业资格证书,3:危害辨识,4:控制措施,5:工艺隔离-方法,6:个人防护设备,7:作业取消原因,8:气体检测指标
						title: "类型",
						fieldName: "stuffType",
						orderName: "stuffType",
						filterName: "criteria.intsValue.stuffType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_stuff_stuff_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_stuff_stuff_type", data.stuffType);
						}
					},
					 LIB.tableMgr.column.disable,
					{
						//现场核对结果 0:未核对,1:不勾选,2:勾选
						title: "现场核对结果",
						fieldName: "checkResult",
						orderName: "checkResult",
						filterName: "criteria.intsValue.checkResult",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_stuff_check_result"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_stuff_check_result", data.checkResult);
						}
					},
					{
						//其他的内容/资格证名称
						title: "其他的内容/资格证名称",
						fieldName: "content",
						filterType: "text"
					},
					{
						//是否为其他 0:否,1是
						title: "是否为其他",
						fieldName: "isExtra",
						orderName: "isExtra",
						filterName: "criteria.intsValue.isExtra",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_stuff_is_extra"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_stuff_is_extra", data.isExtra);
						}
					},
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ptwworkstuff/importExcel"
            },
            exportModel : {
                url: "/ptwworkstuff/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ptwWorkStuffFormModel : {
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
//			"ptwworkstuffFormModal":ptwWorkStuffFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ptwWorkStuffFormModel.show = true;
//				this.$refs.ptwworkstuffFormModal.init("create");
//			},
//			doSavePtwWorkStuff : function(data) {
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
