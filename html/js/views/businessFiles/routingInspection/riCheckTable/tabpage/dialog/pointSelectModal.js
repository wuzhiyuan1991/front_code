define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require('../../vuex/api');
    var tpl = require("text!./pointSelectModal.html");

    var newVO = function () {
        return {
            compId: '',
            orgId: '',
            dominationArea: {id: '', name: ''}
        }
    };
    var initDataModel = function () {
        return {
            //控制全部分类组件显示
            mainModel: {
                title: "选择巡检点",
                selectedDatas: [],
                isEquipment: false,
                refType: 2
            },
            vo: newVO(),
            dominationAreaSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            tableModel: {
                url: 'richeckpointtpl/list/{curPage}/{pageSize}?disable=0',
                columns: [
                    {
                        title: "",
                        fieldName: "id",
                        fieldType: "radio"
                    },
                    {
                        title: "巡检点",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "属地",
                        fieldName: "dominationArea.name",
                        keywordFilterName: "criteria.strValue.keyWordValue_dominationArea_name"
                    },
                    LIB.tableMgr.ksColumn.dept,
                    LIB.tableMgr.ksColumn.company
                ]
            },
            eqTableModel: {
                url: "equipment/list{/curPage}{/pageSize}",
                columns: [
                    {
                        title: "",
                        fieldName: "id",
                        fieldType: "radio"
                    },
                    {
                        //设备设施名称
                        title: "设备设施名称",
                        fieldName: "name",
                        fieldType: "link",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                        width: 180
                    },
                    {
                        title: "属地",
                        fieldName: "dominationArea.name",
                        keywordFilterName: "criteria.strValue.keyWordValue_dominationArea_name"
                    },
                    LIB.tableMgr.ksColumn.dept,
                    LIB.tableMgr.ksColumn.company

                ],
                defaultFilterValue: {"state": "0", "criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}},
                resetTriggerFlag: false
            },
            eqiTableModel: {
                url: "equipment/equipmentitems/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [
                    {
                        title: "",
                        fieldName: "id",
                        fieldType: "radio"
                    },
                    {
                        //设备设施子件名称
                        title: "设备设施子件名称",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                    }

                ],
                defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}},
                resetTriggerFlag: false
            }
        }
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        components: {},
        data: initDataModel,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            parentId: {
                type: String,
                default: ''
            }
        },
        methods: {
            init: function () {
                this.mainModel.refType = 2;
                this.mainModel.isEquipment = false;
                this.mainModel.selectedDatas = [];
                this.vo = newVO();
                this.$nextTick(function () {
                    this.$refs.table.doCleanRefresh(this.pointFilterData)
                })
            },
            doChangeType: function (isEquipment) {
                this.mainModel.refType = 2;
                // this.init()
                this.mainModel.selectedDatas = [];

                if (isEquipment) {
                    this.$refs.table.doCleanRefresh(this.equipmentFilterData)
                } else {
                    this.$refs.table.doCleanRefresh(this.pointFilterData)
                }
            },
            _doCreate: function (id) {
                var _this = this;
                var params;
                // if (!this.mainModel.isEquipment) {
                //     params = [{id: id}];
                //     api.saveRiCheckPointTpls({id: this.parentId}, params).then(function () {
                //         LIB.Msg.success("保存成功");
                //         _this.visible = false;
                //         _this.$emit("do-save")
                //     })
                //     return;
                // }

                if (!this.mainModel.isEquipment) {
                    params = {
                        refId: id,
                        refType: 1
                    };
                }
                else if (this.mainModel.refType === 2) {
                    params = {
                        refId: id,
                        refType: 2
                    };
                } else if (this.mainModel.refType === 3) {
                    params = {
                        refId: this.equipmentId,
                        refType: 3,
                        refItemId: id
                    };
                }
                api.saveRiCheckPoint({id: this.parentId}, params).then(function () {
                    LIB.Msg.success("保存成功");
                    _this.visible = false;
                    _this.$emit("do-save")
                })
            },
            _doUpdate: function (id) {
                var _this = this;
                var params;
                if (!this.mainModel.isEquipment) {
                    params = [{id: id}];
                    api.updateRiCheckPoint({id: this.parentId}, params).then(function () {
                        LIB.Msg.success("保存成功");
                        _this.visible = false;
                        _this.$emit("do-save")
                    })
                    return;
                }

                if (this.mainModel.refType === 2) {
                    params = {
                        refId: id,
                        refType: 2
                    };
                } else if (this.mainModel.refType === 3) {
                    params = {
                        refId: this.equipmentId,
                        refType: 3,
                        refItemId: id
                    };
                }
                api.updateRiCheckPointTpls({id: this.parentId}, params).then(function () {
                    LIB.Msg.success("保存成功");
                    _this.visible = false;
                    _this.$emit("do-save")
                })
            },
            onDbClickCell: function () {
                this.doSave();
            },
            doSave: function () {
                if (this.mainModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return
                }
                var id = this.mainModel.selectedDatas[0].id;

                if(_.includes(this.checkedIds, id)) {
                    return LIB.Msg.warning("该区域已选择此巡检点或者设备");
                }

                if (this.opType === 'create') {
                    this._doCreate(id)
                } else if (this.opType === 'update') {
                    this._doUpdate(id)
                }
            },
            doEquipmentClick: function (obj) {
                var params = [];
                if (obj.cell.fieldName === "name") {
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strsValue.excludeAreaId",
                            columnFilterValue: [this.areaId]
                        }
                    });
                    this.mainModel.refType = 3;
                    this.equipmentId = obj.entry.data.id;
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: "id",
                            columnFilterValue: this.equipmentId
                        }
                    });
                    this.$nextTick(function () {
                        this.$refs.table.doCleanRefresh(params);
                    })
                }
            },
            doBack: function () {
                this.mainModel.refType = 2;
                this.$nextTick(function () {
                    this.$refs.table.doCleanRefresh(this.equipmentFilterData);
                })
            },
            doShowSelectModal: function () {
                this.selectModel.dominationAreaSelectModel.filterData = {orgId: this.vo.orgId};
                this.dominationAreaSelectModel.visible = true;
            },
            doSaveDominationArea: function (selectDatas) {
                var area = selectDatas[0];
                this.vo.dominationArea = {
                    id: area.id,
                    name: area.name
                };
            },
            doAddArea: function () {
                this.$emit("do-create")
            }
        },
        events: {
            /**
             *
             * @param {String} type 'create'|'update'
             * @param {Object} obj {pointId: xxx, areaTplId: xxx, dominationAreaId: xxx, areaId: xxx}
             * @param {Array} checkedIds
             */
            "do-select-point": function (type, obj, checkedIds) {
                this.opType = type;
                this.pointId = obj.id;
                this.pointFilterData = [];
                this.equipmentFilterData = [];

                this.areaId = obj.areaId;
                this.checkedIds = checkedIds;

                this.pointFilterData.push({
                    type: "save",
                    value: {
                        columnFilterName: "riCheckAreaTpl.id",
                        columnFilterValue: obj.areaTplId
                    }
                });
                this.pointFilterData.push({
                    type: "save",
                    value: {
                        columnFilterName: "criteria.strsValue.excludeAreaId",
                        columnFilterValue: [obj.areaId]
                    }
                });

                this.equipmentFilterData.push({
                    type: "save",
                    value: {
                        columnFilterName: "dominationAreaId",
                        columnFilterValue: obj.dominationAreaId
                    }
                });

                this.init()
            }
        }
    });

    return vm;
});
