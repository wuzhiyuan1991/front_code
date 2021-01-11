define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var typeFormModal = require("./dialog/typeFormModal");
    //编辑弹框页面fip (few-info-panel)
    //var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
    //	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
    //  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

    //Legacy模式
    //	var idaDutyAbilityFormModal = require("componentsEx/formModal/idaDutyAbilityFormModal");


    var initDataModel = function () {
        return {
            typeForm: {
                visible: false
            },
            moduleCode: "idaDutyAbility",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
                //				detailPanelClass : "large-info-aside"
            },
            tableModel:
            {
                values: [],
                // url: "idadutyability/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [
                    {
                        title: "",
                        width: 50
                    },

                    {
                        title: "职责描述",
                        fieldName: "duty",
                        width: 200
                    },
                    {
                        //分组
                        title: "分组",
                        fieldName: "group",
                        width: 200

                    },
                    {
                        //履职能力要求
                        title: "履职能力要求",
                        fieldName: "ability",
                    },
                    {
                        title: "章节",
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del",
                        width: 80
                    }

                ]
            }
            ,
            userModel:
            {
                url: "idadutyability/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [
                    {
                        title: "姓名",
                        fieldName: "name",
                        width: 120
                    },
                    {
                        //分组
                        title: "所属部门",
                        fieldName: "dept",
                        width: 200

                    },
                    {
                        //履职能力要求
                        title: "所属岗位",
                        fieldName: "ability",
                    },
                    {
                        title: "履职能力类别",
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del",
                        width: 80
                    }

                ]
            },
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/idadutyability/importExcel"
            },
            exportModel: {
                url: "/idadutyability/exportExcel",
                withColumnCfgParam: true
            },
            selectModel: {
                filterData: {}
            },
            removeChangeOrg: true
            //Legacy模式
            //			formModel : {
            //				idaDutyAbilityFormModel : {
            //					show : false,
            //				}
            //			}

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
        //		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
        template: tpl,
        data: initDataModel,
        components: {
            typeFormModal: typeFormModal
            //"detailPanel": detailPanel,
            //Legacy模式
            //			"idadutyabilityFormModal":idaDutyAbilityFormModal,

        },
        methods: {
            initData: function () {
                //解决keepalive强制刷新
                return
            },
            changeOrgComp: function (data) {
                this.compId = data.nodeId;
                this.selectModel.filterData = {
                    compId: this.compId
                };
            },
            doQuery: function () {

            },
            doUpdateType: function () {
                if (!this.typeId) {
                    LIB.Msg.error("请选择分类");
                    return;
                }
                var data = _.find(this.legalTypes, "id", _.get(this.treeSelectData, "[0].id"));

                if (!data) {
                    return;
                }
                this.typeForm.visible = true;
                this.$broadcast("ev_le_regulation", "update", data);
            },
            doCreateType: function () {
                var parentId = _.get(this.treeSelectData, "[0].id");
                this.typeForm.visible = true;
                this.$broadcast("ev_le_regulation", "create", { id: parentId });
            },
            doDeleteType: function () {
                if (!this.typeId) {
                    LIB.Msg.error("请选择分类");
                    return;
                }
                var _this = this;
                var id = _.get(this.treeSelectData, "[0].id");

                LIB.Modal.confirm({
                    title: '删除当前数据将会删除所有下级数据，是否确认?',
                    onOk: function () {
                        api.deleteLegalType(null, { id: id }).then(function () {
                            LIB.Msg.success("删除成功");
                            _this._getTreeList();
                            _this.$refs.mainTable.doCleanRefresh();
                        });
                    }
                });
            },
            rowSpanRiskPointType: function () {
                var row = 1
                var rowName = ''
                var rowItem = null
                var same = []
                var rows = []
                $('tbody .riskPointType').each(function (index, item) {

                    if (rowName == $(item).text()) {
                        row++
                        same.push($(item))
                    } else {

                        _.each(same, function ($item) {
                            $item.parent().hide()
                        })
                        if (rowItem) {
                            rowItem.parent().attr('rowspan', row)
                            rows.push(index)
                        }

                        rowName = $(item).text()
                        rowItem = $(item)
                        row = 1
                        same = []
                    }

                    if (index + 1 == $('tbody .riskPointType').length) {
                        _.each(same, function ($item) {
                            $item.parent().hide()
                        })
                        if (rowItem) {
                            rowItem.parent().attr('rowspan', row)
                        }
                        rows.push(index)

                        return false
                    }



                })

                return rows
            },
            rowSpanRiskPoint: function (rows) {
                var row = 1//初始索引
                var rowName = ''//名字
                var rowItem = null
                var same = []
                var rowlength = rows[0]//依赖风险点的rowspan 
                var rowIndex = 0
                $('tbody .riskPoint').each(function (index, item) {

                    if (rowName == $(item).text() && (index < rowlength || index + 1 == $('tbody .riskPoint').length)) {
                        row++
                        same.push($(item))
                    } else {
                        _.each(same, function ($item) {
                            $item.parent().hide()
                        })
                        if (rowItem) {
                            rowItem.parent().attr('rowspan', row)

                        }
                        if (index >= rowlength) {
                            rowIndex++
                            rowlength = rows[rowIndex]
                        }
                        rowName = $(item).text()
                        rowItem = $(item)
                        row = 1
                        same = []
                    }

                    if (index + 1 == $('tbody .riskPoint').length) {
                        _.each(same, function ($item) {
                            $item.parent().hide()
                        })
                        if (rowItem) {
                            rowItem.parent().attr('rowspan', row)
                        }
                        return false
                    }



                })
            },
            //Legacy模式
            //			doAdd : function(data) {
            //				this.formModel.idaDutyAbilityFormModel.show = true;
            //				this.$refs.idadutyabilityFormModal.init("create");
            //			},
            //			doSaveIdaDutyAbility : function(data) {
            //				this.doSave(data);
            //			}

        },
        events: {
        },
        init: function () {
            this.$api = api;
        },

        ready: function () { }
    });

    return vm;
});
