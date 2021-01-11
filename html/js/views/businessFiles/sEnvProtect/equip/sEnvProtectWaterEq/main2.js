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
//	var ltLpSupFormModal = require("componentsEx/formModal/ltLpSupFormModal");

    
    var initDataModel = function () {
        return {
            // moduleCode: "sM",
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
	                // url: "ltlpsup/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
                    {
                        title: '编码',
                        width: 100,
                        fieldName: "code",
                        fieldType: "link"
                    },
					// {
					// 	title: "设备名称",
                     //    width: 150,
					// 	fieldName: "eqName",
					// 	filterType: "text"
					// },
                    {
                        title: "点位",
                        width: 150,
                        fieldName: "pubPos",
                        filterType: "text"
                    },
                    {
                        title: "取样时间",
                        fieldName: "regDate",
                        filterType: "text"
                    },
                    // {
                    //     title: "开启时间",
                    //     fieldName: "startDate",
                    //     filterType: "text"
                    // },
                    // {
                    //     title: "关闭时间",
                    //     fieldName: "endDate",
                    //     filterType: "text"
                    // },
                    // {
                    //     title: "是否运行",
                    //     width: 100,
                    //     fieldName: "isWork",
                    //     filterType: "text"
                    // },
                    // {
                    //     title: "情况描述",
                    //     width: 100,
                    //     fieldName: "desc",
                    //     filterType: "text"
                    // },
                    // {
                    //     title: "处理水量/t",
                    //     width: 120,
                    //     fieldName: "waterAmount",
                    //     renderClass: "textarea text-center",
                    //     filterType: "text"
                    // },
                    // {
                    //     title: "加药量/kg",
                    //     filterType: "text",
                    //     "children": [
                    //         {
                    //             title: "高分子",
                    //             width: 100,
                    //             fieldName: "addMed1",
                    //             renderClass: "textarea text-center",
                    //             filterType: "text"
                    //         },
                    //         {
                    //             title: "氯化铝",
                    //             width: 100,
                    //             fieldName: "addMed2",
                    //             renderClass: "textarea text-center",
                    //             filterType: "text"
                    //         },
                    //         {
                    //             title: "氢氧化钠",
                    //             width: 100,
                    //             fieldName: "addMed3",
                    //             renderClass: "textarea text-center",
                    //             filterType: "text"
                    //         },
                    //     ]
                    // },
                    // {
                    //     title: "污泥排放量/kg",
                    //     width: 100,
                    //     fieldName: "mudAmount",
                    //     renderClass: "textarea text-center",
                    //     filterType: "text"
                    // },
                    {
                        title: "出水监测数据（mg/L，pH值无量纲）",
                        fieldName: "startDate",
                        filterType: "text",
                        "children": [
                            {
                                title: "COD",
                                width: 100,
                                fieldName: "std1",
                                renderClass: "textarea text-center",
                                filterType: "text"
                            },
                            {
                                title: "TP",
                                width: 100,
                                fieldName: "std2",
                                renderClass: "textarea text-center",
                                filterType: "text"
                            },
                            {
                                title: "TN",
                                width: 100,
                                fieldName: "std3",
                                renderClass: "textarea text-center",
                                filterType: "text"
                            },
                            {
                                title: "pH",
                                width: 100,
                                fieldName: "std4",
                                renderClass: "textarea text-center",
                                filterType: "text"
                            },
                            {
                                title: "石油类",
                                width: 100,
                                fieldName: "std5",
                                renderClass: "textarea text-center",
                                filterType: "text"
                            },
                            {
                                title: "氨氮",
                                width: 100,
                                fieldName: "std6",
                                renderClass: "textarea text-center",
                                filterType: "text"
                            },
                            {
                                title: "SS",
                                width: 100,
                                fieldName: "std7",
                                renderClass: "textarea text-center",
                                filterType: "text"
                            },
                        ]
                    },
                    // {
                    //     title: "操作人",
                    //     width: 100,
                    //     fieldName: "opUser",
                    //     filterType: "text"
                    // },

                    {
                        title: "填报人",
                        width: 100,
                        fieldName: "subUser",
                        filterType: "text"
                    },
                    {
                        title: "备注",
                        width: 100,
                        fieldName: "remark",
                        filterType: "remark"
                    },
                    {
                        title: "所属公司",
                        width: 200,
                        fieldName: "company",
                        filterType: "text"
                    },
                    {
                        title: "所属部门",
                        fieldName: "dept",
                        filterType: "text"
                    },
					 // LIB.tableMgr.column.disable,
					 // LIB.tableMgr.column.company,
					 // LIB.tableMgr.column.dept,
					 // LIB.tableMgr.column.modifyDate,
					 // LIB.tableMgr.column.createDate,
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            importModel: {
                url: "/ltlpsup/importExcel",
                templeteUrl : "/ltlpsup/file4Import",
                importProgressShow: false
            },
            exportModel : {
                url: "/ltlpsup/exportExcel",
                withColumnCfgParam: true
            },

            initData : function (data, opType) {

                // 初始化表格数据 - 测试数据 start
                var tableData = [
                    {
                        code:'10001',
                        eqName:'废水处理设备',
                        pubPos:'某点位',
                        regDate:"2020-10-10 09:00:00",
                        // startDate:"",
                        // endDate:"11:00:00",
                        // isWork:"是",
                        // desc:"正常",
                        // waterAmount:"80",
                        // addMed1:"0",
                        // addMed2:"50",
                        // addMed3:"0",
                        // mudAmount:"-",
                        std1:"66.6",
                        std2:"0.098",
                        std3:"0.402",
                        std4:"7.41",
                        std5:"3.9",
                        std6:"0.345",
                        std7:"3",
                        opUser:"陈亚明",
                        subUser:"徐一波",
                        remark:"",
                        company:'杭州制氧机集团股份有限公司',
                        dept:"空分厂",
                    }
                ];
                _.each(tableData, function (item) {
                    item.id = item.code;
                })
                this.$refs.mainTable.values = tableData;

                // 初始化表格数据 - 测试数据 end

            }

			//Legacy模式
//			formModel : {
//				ltLpSupFormModel : {
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
//			"ltlpsupFormModal":ltLpSupFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ltLpSupFormModel.show = true;
//				this.$refs.ltlpsupFormModal.init("create");
//			},
//			doSaveLtLpSup : function(data) {
//				this.doSave(data);
//			}

            doImport: function () {
                this.importModel.importProgressShow = true;
            },
            doDownFile: function () {
                window.open(this.importModel.templeteUrl);
            },
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
