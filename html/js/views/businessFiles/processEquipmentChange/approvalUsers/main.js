define(function (require) {
    //基础js
    var LIB = require('lib');
    var BASE = require('base');
    var tpl = LIB.renderHTML(require("text!./main.html"))
    var api = require("./vuex/api");
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面
  
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");

    LIB.registerDataDic("ipec_position_level", [
        ["1","站队级"],
        ["2","管理处级"],
        ["3","公司级"]
    ]);

    LIB.registerDataDic("ipec_position_type", [
        ["1","基层站队长"],
        ["2","管理处机关业务人员"],
        ["3","管理处机关科室长"],
        ["4","管理处机关主管领导"],
        ["5","公司业务处室业务人员"],
        ["6","公司业务处室科室长"],
        ["7","公司业务处室主管领导"]
    ]);

    LIB.registerDataDic("ipec_profession", [
        ["1","电气"],
        ["2","设备"],
        ["3","水利"],
        ["4","车辆"],
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "approvalUser",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside",
//				detailPanelClass : "large-info-aside"

            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "pecposition/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    isSingleCheck:false,
                    columns: [
                       
                        // LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                       
                        {
                            //岗位 1:基层站队长,2:管理处机关业务人员,3:管理处机关科室长,4:管理处机关主管领导,5:公司业务处室业务人员,6:公司业务处室科室长,7:公司业务处室主管领导
                            title: "岗位",
                            fieldName: "type",
                            orderName: "type",
                            
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("ipec_position_type"),
                            render: function (data) {
                                return LIB.getDataDic("ipec_position_type", data.type);
                            },
                            width:800
                        },
                    
                        {
                            title: '备注',
                            fieldName: "remarks",
                            filterType: "text",
                            
                        }
                    ],
                    defaultFilterValue: {level:1}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/role/importExcel"
            },
            exportModel: {
                url: "/role/exportExcel"
            },
            editModel: {
                //控制编辑组件显示
                title: "新增",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
            },
            chooiseRoleModel: {
                //控制组件显示
                title: "角色分配",
                //显示编辑弹框
                show: false
            },
            chooiseFuncModel: {
                //控制组件显示
                title: "角色分配",
                //显示编辑弹框
                show: false
            },
            chooiseMenuModel: {
                //控制组件显示
                title: "菜单分配",
                //显示编辑弹框
                show: false
            },
            chooiseDataModel: {
                //控制组件显示
                title: "角色分配",
                //显示编辑弹框
                show: false
            },
            chooiseFuncAndMenuModel: {
                //控制组件显示
                title: "菜单功能权限",
                //显示编辑弹框
                show: false
            },
            copyModel: {
                visible: false,
                title: "复制",
                isNeedCopyUser: false
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
           
            //Legacy模式
//			"roleFormModal":roleFormModal,

        },
        methods: {
           
        },
        init: function () {
            this.$api = api;
        },
        attached: function(){
            this.tableModel.isSingleCheck =  !LIB.authMixin.methods.hasPermission('1020006009');
        }
    });

    return vm;
});
