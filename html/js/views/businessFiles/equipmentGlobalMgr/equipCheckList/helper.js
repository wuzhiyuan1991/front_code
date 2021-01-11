define(function () {
    var LIB = require('lib');

    var getCheckObjectColumns = function (id, checkObjType, isTemporary) {
        // checkObjectColumns
        var columnMap = {
            comp: {
                title: '所属公司',
                render: function (data) {
                    if (data.compId) {
                        return LIB.getDataDic("org", data.compId)["compName"];
                    }
                }
            },
            org: {
                title: '所属部门',
                render: function (data) {
                    if (data.orgId) {
                        return LIB.getDataDic("org", data.orgId)["deptName"];
                    }
                }
            },
            dominationArea: {
                title: '属地',
                fieldName: 'checkObjName'
            },
            equipmentType: {
                title: '设备类型',
                fieldName: 'checkObjName'
            },
            equipment: {
                title: '设备名称',
                fieldName: 'checkObjName'
            },
            majorRiskSource: {
                title: '重大危险源',
                fieldName: 'checkObjName'
            },
            majorChemicalProcess: {
                title: '化学工艺',
                fieldName: 'checkObjName'
            },
            majorChemicalObj: {
                title: '重点化学品',
                fieldName: 'checkObjName'
            },
            normalChemicalObj: {
                title: '基础化学品',
                fieldName: 'checkObjName'
            },
            affiliatedDominationArea: {
                title: '属地',
                fieldName: 'dominationAreaName'
            },
            tool: {
                title: "",
                fieldType: "tool",
                toolType: "del"
            },
            isSpecial: {
                title: '是否专项检查',
                width: 120,
                fieldName: 'special',
                renderClass: 'text-center',
                render: function (data) {
                    if (data.isSpecial === '1') {
                        return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                    }else {
                        return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                    }
                }
            },
            isInherent:{
                title:'固有',
                width:120,
                fieldName:'isInherent',
                renderClass: 'text-center',
                render: function (data) {
                    if (data.isTemporary === '10') {
                        return '<label class="ivu-checkbox-wrapper ivu-checkbox-wrapper-disabled"><span class="ivu-checkbox ivu-checkbox-disabled"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                    } else {
                        if (data.isInherent === '10') {
                            return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                        } else {
                            return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                        }
                    }
                }
            },
            isTemporary: {
                title:'临时',
                width:120,
                fieldName:'isTemporary',
                renderClass: 'text-center',
                render: function (data) {
                    if (data.isInherent === '10') {
                        return '<label class="ivu-checkbox-wrapper ivu-checkbox-wrapper-disabled"><span class="ivu-checkbox ivu-checkbox-disabled"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                    } else {
                        if (data.isTemporary === '10') {
                            return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                        } else {
                            return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                        }
                    }
                }
            },
            isTemporaryEnable: {
                title:'临时启用',
                width:120,
                fieldName:'isTemporaryEnable',
                renderClass: 'text-center',
                render: function (data) {
                    if (data.isInherent === '10') {
                        return '<label class="ivu-checkbox-wrapper ivu-checkbox-wrapper-disabled"><span class="ivu-checkbox ivu-checkbox-disabled"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                    } else {
                        if (data.isTemporary === '10') {
                            if (data.isTemporaryEnable === '10') {
                                return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                            } else {
                                return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                            }
                        } else {
                            return '<label class="ivu-checkbox-wrapper ivu-checkbox-wrapper-disabled"><span class="ivu-checkbox ivu-checkbox-disabled"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                        }
                    }
                }
            }
        };


        var columns;
        if(checkObjType === '1' && id === '1') {
            columns = [columnMap.dominationArea, columnMap.comp, columnMap.org, columnMap.isSpecial, columnMap.tool];
            if (isTemporary) {
                columns.splice(3, 0, columnMap.isInherent, columnMap.isTemporary,columnMap.isTemporaryEnable)
            }
            return columns;
        }

        switch (id) {
            case '1': columns = [columnMap.dominationArea, columnMap.comp, columnMap.org, columnMap.tool];
                break;
            case '2': columns = [columnMap.equipmentType, columnMap.tool];
                break;
            case '1001': columns = [columnMap.majorRiskSource, columnMap.comp, columnMap.org, columnMap.affiliatedDominationArea, columnMap.tool];
                break;
            case '1002': columns = [columnMap.majorChemicalObj, columnMap.tool];
                break;
            case '1003': columns = [columnMap.majorChemicalProcess, columnMap.tool];
                break;
            default:
        }
        if (isTemporary) {
            if (id === '1') {
                columns.splice(3, 0, columnMap.isInherent, columnMap.isTemporary, columnMap.isTemporaryEnable)
            }
        }
        return columns;
    };
    return {
        getCheckObjectColumns: getCheckObjectColumns
    }
});