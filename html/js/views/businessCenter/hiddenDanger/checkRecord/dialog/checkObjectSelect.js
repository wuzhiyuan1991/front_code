define(function (require) {
    var template = require("text!./checkObjectSelect.html");
    var LIB = require('lib');
    var api = require("../vuex/api");
    var columns = {
        radio:  {
            title: "",
            fieldName: "id",
            fieldType: "radio",
            keywordFilterName: "criteria.strValue.keyWordValue"
        },
        code: {
            title: "编码",
            fieldName: "code",
            keywordFilterName: "criteria.strValue.keyWordValue_code",
            width: 150
        },
        comp: {
            title: "所属公司",
            fieldType: "custom",
            render: function (data) {
                if (data.compId) {
                    return LIB.getDataDic("org", data.compId)["compName"];
                }
            },
            keywordFilterName: "criteria.strValue.keyWordValue_comp"
        },
        org: {
            title: "所属部门",
            fieldType: "custom",
            render: function (data) {
                if (data.orgId) {
                    return LIB.getDataDic("org", data.orgId)["deptName"];
                }
            },
            keywordFilterName: "criteria.strValue.keyWordValue_org"
        },
        area: {
            title: "属地",
            fieldName: "dominationArea.name",
            keywordFilterName: "criteria.strValue.keyWordValue_dominationArea_name"
        },
        equipment: {
            title: "设备名称",
            fieldName: "name",
            keywordFilterName: "criteria.strValue.keyWordValue_name"
        },
        process: {
            title: "重大化学工艺名称",
            fieldName: "name",
            keywordFilterName: "criteria.strValue.keyWordValue_name"
        },
        chemical: {
            title: "化学品名称",
            fieldName: "name",
            keywordFilterName: "criteria.strValue.keyWordValue_name"
        }
    };

    var initDataModel = {
        mainModel: {
            title: "选择",
            selectedDatas: []
        },
        tableModel: {
            url: "",
            selectedDatas: [],
            columns: [columns.radio],
            defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}, disable: 0},
            resetTriggerFlag: false
        }

    };

    var opts = {
        template: template,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            coType: {
                type: String,
                default: ''
            },
            coId: {
                type: String,
                default: ''
            },
            compId: {
                type: String,
                default: ''
            },
            areaId: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return initDataModel;
        },
        watch: {
            visible: function (val) {
                if(val) {
                    this.init();
                } else {
                    this.reset();
                }
            }
        },
        methods: {
            doCleanRefresh: function () {
                var tableFilterDatas = [];
                var filterData = this.filterData;
                if (filterData) {
                    for (key in filterData) {
                        var value = filterData[key];
                        if (value != undefined && value != null && value.toString().trim() != "") {
                            var tableFilterData = {
                                type: "save",
                                value: {
                                    columnFilterName: key,
                                    columnFilterValue: value
                                }
                            };
                            tableFilterDatas.push(tableFilterData);
                        }
                    }
                }
                this.$refs.table.doCleanRefresh(tableFilterDatas);
            },
            _setColumns: function (type) {
                var cols = [columns.radio, columns.code, columns.comp, columns.org, columns.area];
                switch (type) {
                    case '3':
                        cols.splice(2, 0, columns.equipment);
                        break;
                    case '9':
                        cols.splice(2, 0, columns.chemical);
                        break;
                    case '10':
                        cols.splice(2, 0, columns.process);
                        break;
                }

                this.tableModel.columns = cols;
            },
            _setURL: function (type) {
                var urls = {
                    '3': 'equipment/list{/curPage}{/pageSize}',
                    '9': 'checkobject/list/{curPage}/{pageSize}',
                    '10': 'majorchemicalprocess/list{/curPage}{/pageSize}'
                };
                this.tableModel.url = urls[type];
            },
            _doQuery: function (type) {
                var params = [];
                params.push({
                    type: "save",
                    value: {
                        columnFilterName: 'compId',
                        columnFilterValue: this.compId
                    }
                })

                if(this.areaId) {
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: 'dominationArea.id',
                            columnFilterValue: this.areaId
                        }
                    })
                }
                if(type === '3') {

                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: 'equipmentType.id',
                            columnFilterValue: this.coId
                        }
                    })
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: 'state',
                            columnFilterValue: '0'
                        }
                    })
                }
                else if (type === '9') {
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: 'criteria.intsValue',
                            columnFilterValue: {"dataType":[2,3]}
                        }
                    });
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: {"catalogId": this.coId}
                        }
                    })
                }
                else if(type === '10') {
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: {"catalogId": this.coId}
                        }
                    })
                }

                this.$refs.table.doCleanRefresh(params);
            },
            init: function () {
                this._setURL(this.coType);
                this._setColumns(this.coType);
                this._doQuery(this.coType);
            },
            reset: function () {
                this.tableModel.columns = [columns.radio];
            },
            //双击关闭modal
            onDbClickCell: function () {
                this.doSave();
            },
            doSave: function () {
                if (this.mainModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return
                }
                this.$emit('do-save', this.mainModel.selectedDatas, this.areaId);
            }
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});