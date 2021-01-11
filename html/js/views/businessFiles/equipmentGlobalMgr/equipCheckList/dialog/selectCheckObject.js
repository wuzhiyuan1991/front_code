define(function (require) {
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./selectCheckObject.html");

    //数据模型
    var dataModel = {
        mainModel: {
            title: '选择',
            selectedDatas: []
        },
        resetTriggerFlag: false,

        defaultFilterValue: {"disable": 0},
        selectedDatas: [],
        filterColumn: ["criteria.strValue.name"],
        tableModel: {
            url: '',
            columns: []
        }
    };

    //声明detail组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var component = LIB.Vue.extend({
        template: tpl,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: ''
            },
            singleSelect: {
                type: Boolean,
                default: false
            },
            orgId: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return dataModel
        },
        watch: {
            'visible': function (val) {
                if (val) {
                    this._init();
                }
            }
        },
        methods: {
            doSave: function () {
                if (this.mainModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return
                }
                this.visible = false;
                this.$emit('do-save', this.mainModel.selectedDatas);
            },
            _init: function () {
                var columns = this._buildTableColumns(this.type),
                    url = this._buildTableURL(this.type);

                this.tableModel = {
                    url: url,
                    columns: columns
                };

                var params = [
                    {
                        type: "save",
                        value: {
                            columnFilterName : "orgId",
                            columnFilterValue : this.orgId
                        }
                    },
                    {
                        type: "save",
                        value: {
                            columnFilterName : "state",
                            columnFilterValue : 0
                        }
                    },
                    {
                        type: "save",
                        value: {
                            columnFilterName : "disable",
                            columnFilterValue : 0
                        }
                    }
                ];

                this.$refs.table.doCleanRefresh(params);
                // this.$refs.table.doQuery({orgId: this.orgId, state:'0', disable:'0'});
            },
            /**
             * 根据检查对象类型创建表格列
             * @param cbt 检查对象类型
             * @private
             * @return {Array}
             */
            _buildTableColumns: function (cbt) {

                // checkObjectColumns
                var cocs = {
                    comp: {
                        title: '所属公司',
                        fieldType: "custom",
                        render: function (data) {
                            if (data.compId) {
                                return LIB.getDataDic("org", data.compId)["compName"];
                            }
                        }
                    },
                    org: {
                        title: '所属部门',
                        fieldType: "custom",
                        render: function (data) {
                            if (data.orgId) {
                                return LIB.getDataDic("org", data.orgId)["deptName"];
                            }
                        }
                    },
                    dominationArea: {
                        title: '属地',
                        fieldName: 'name'
                    },
                    equipmentType: {
                        title: '设备类型',
                        fieldName: 'name'
                    },
                    equipment: {
                        title: '设备个体',
                        fieldName: 'name'
                    },
                    majorRiskSource: {
                        title: '重大危险源',
                        fieldName: 'name'
                    },
                    majorChemicalProcess: {
                        title: '化学工艺类型',
                        fieldName: 'name'
                    },
                    majorChemicalObj: {
                        title: '重点化学品',
                        fieldName: 'name'
                    },
                    normalChemicalObj: {
                        title: '一般化学品',
                        fieldName: 'name'
                    },
                    tool: {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    },
                    checkbox: {
                        title: "",
                        fieldName: "id",
                        fieldType: "cb"
                    },
                    radio: {
                        title: "",
                        fieldName: "id",
                        fieldType: "radio"
                    },
                    affiliatedDominationArea: {
                        title: '属地',
                        fieldName: 'dominationArea.name'
                    },
                };

                if (cbt === '1') {
                    return [cocs.checkbox, cocs.dominationArea, cocs.comp, cocs.org];
                }
                if (cbt === '2') {
                    return [cocs.checkbox, cocs.equipmentType];
                }
                // if (cbt === '2') {
                //     return [cocs.radio, cocs.equipment, cocs.comp, cocs.org, cocs.affiliatedDominationArea];
                // }
                if (cbt === '1001') {
                    return [cocs.checkbox, cocs.majorRiskSource, cocs.comp, cocs.org, cocs.affiliatedDominationArea];
                }
                if (cbt === '1003') {
                    return [cocs.checkbox, cocs.majorChemicalProcess, cocs.comp];
                }
                if (cbt === '1002') {
                    return [cocs.checkbox, cocs.majorChemicalObj];
                }
            },

            /**
             * 根据检查对象类型返回URL
             * @param cbt
             * @private
             */
            _buildTableURL: function (cbt) {
                var URLs = {
                    '1': 'dominationarea/list/{curPage}/{pageSize}',  // 工作场所
                    '2': 'equipmenttype/list/{curPage}/{pageSize}',  // 设备类型
                    // '2': 'equipment/list/{curPage}/{pageSize}',      // 设备个体
                    '1001': 'majorrisksource/list/{curPage}/{pageSize}', // 重大危险源
                    '1003': 'checkobjectcatalog/majorChemicalProcess/list/{curPage}/{pageSize}', // 重点危险工艺
                    '1002': 'checkobjectcatalog/baseChemicalObj/list/{curPage}/{pageSize}?dataType=2' // 重点化学品
                };

                return URLs[cbt];
            }
        },
        events: {}
    });

    return component;
});