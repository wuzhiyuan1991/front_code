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
//	var ltTagUserFormModal = require("componentsEx/formModal/ltTagUserFormModal");

    //初始化数据模型
    var newVO = function() {
        return {
            id : null,
            //标签类型
            tagType : null,
            //禁用标识 0:未禁用,1:已禁用
            disable : "0",
            //标签名称
            tagName : null,
            //所属公司
            compId : null,
            //所属部门
            orgId : null,
            //员工
            user : {},
        }
    };

    var initDataModel = function () {
        return {
            moduleCode: "ltTagUser",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside",
                tagType : null
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "lttaguser/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
                    {
                        title: "名称",
                        filterType: "text",
                        fieldType: "custom",
                        filterName : "user.username",
                        render: function (data) {
                            if (data.user) {
                                return data.user.username;
                            }
                        }
                    },
                    {
                        title: "手机",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.user) {
                                return data.user.mobile;
                            }
                        }
                    },
                    {
                        title: "邮箱",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.user) {
                                return data.user.email;
                            }
                        }
                    },
                    {
                        title: "所属公司",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.user && data.user.compId) {
                                return LIB.LIB_BASE.tableMgr.rebuildOrgName(data.user.compId, 'comp');
                            }
                        },
                        // filterType: "text",
                        // filterName: "criteria.strValue.deptName",
                        // fieldName: "orgId",
                        width: 160
                    },
                    {
                        title: "所属部门",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.user && data.user.orgId) {
                                return LIB.LIB_BASE.tableMgr.rebuildOrgName(data.user.orgId, 'dept');
                            }
                        },
                        // filterType: "text",
                        // filterName: "criteria.strValue.deptName",
                        // fieldName: "orgId",
                        width: 160
                    }
					// {
					// 	//标签类型
					// 	title: "标签类型",
					// 	fieldName: "tagType",
					// 	filterType: "text"
					// },
					//  LIB.tableMgr.column.disable,
					// {
					// 	//标签名称
					// 	title: "标签名称",
					// 	fieldName: "tagName",
					// 	filterType: "text"
					// },
					//  LIB.tableMgr.column.company,
					//  LIB.tableMgr.column.dept,
					 // LIB.tableMgr.column.modifyDate,
					 // LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            selectModel : {
                userSelectModel : {
                    visible : false,
                    filterData : {orgId : null}
                },
            },
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/lttaguser/importExcel"
            },
            exportModel : {
                url: "/lttaguser/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ltTagUserFormModel : {
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
//			"lttaguserFormModal":ltTagUserFormModal,
            
        },
        methods: {
			//Legacy模式
			doAdd : function(data) {
                this.selectModel.userSelectModel.visible = true;
				// this.formModel.ltTagUserFormModel.show = true;
				// this.$refs.lttaguserFormModal.init("create");
			},
            doSaveUser : function(selectedDatas) {
                if (selectedDatas) {
                    var user = selectedDatas[0];
                    var vo = newVO();
                    vo.user = user;
                    vo.tagName = vo.tagType = this.mainModel.tagType;
                    var _this = this;
                    this.$api.create(vo).then(function(res) {
                        LIB.Msg.info("保存成功");
                        _this.refreshMainTable();
                    });
                }
            },
//			doSaveLtTagUser : function(data) {
//				this.doSave(data);
//			}
            initData: function () {
                this.mainModel.tagType = this.$route.query.tagType;

                var params = [];
                //大类型
                params.push({
                    value : {
                        columnFilterName : "tagType",
                        columnFilterValue : this.mainModel.tagType
                    },
                    type : "save"
                });
                this.$refs.mainTable.doQueryByFilter(params);
            }

        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
        // attached: function () {
        //
        //     this.mainModel.tagType = this.$route.query.tagType;
        //
        //     var params = [];
        //     //大类型
        //     params.push({
        //         value : {
        //             columnFilterName : "tagType",
        //             columnFilterValue : this.mainModel.tagType
        //         },
        //         type : "save"
        //     });
        //     this.$refs.mainTable.doQueryByFilter(params);
        // },
    });

    return vm;
});
