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
//	var contractorEmpFormModal = require("componentsEx/formModal/contractorEmpFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "contractorEmp",
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
	                url: "contractoremp/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//姓名
						title: "姓名",
						fieldName: "name",
						filterType: "text"
					},
					 LIB.tableMgr.column.disable,
					{
						//年龄
						title: "年龄",
						fieldName: "age",
						filterType: "number"
					},
					{
						//证书
						title: "证书",
						fieldName: "certificate",
						filterType: "text"
					},
					{
						//证书编号
						title: "证书编号",
						fieldName: "certificateNo",
						filterType: "text"
					},
					{
						//身份证号
						title: "身份证号",
						fieldName: "idNumber",
						filterType: "text"
					},
					 LIB.tableMgr.column.remark,
					{
						//性别
						title: "性别",
						fieldName: "sex",
						filterType: "number"
					},
					{
						title: "承包商",
						fieldName: "contractor.name",
						orderName: "contractor.name",
						filterType: "text",
					},
//					{
//						//联系电话
//						title: "联系电话",
//						fieldName: "telephone",
//						filterType: "text"
//					},
//					{
//						//工种
//						title: "工种",
//						fieldName: "workType",
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
                url: "/contractoremp/importExcel"
            },
            exportModel : {
                url: "/contractoremp/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				contractorEmpFormModel : {
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
//			"contractorempFormModal":contractorEmpFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.contractorEmpFormModel.show = true;
//				this.$refs.contractorempFormModal.init("create");
//			},
//			doSaveContractorEmp : function(data) {
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
