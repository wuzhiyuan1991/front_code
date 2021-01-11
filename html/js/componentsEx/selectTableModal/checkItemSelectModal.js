define(function (require) {

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            mainModel: {
                title: "选择",
                selectedDatas: []
            },
            tableModel: (
                {
                    url: "checkitem/list{/curPage}{/pageSize}?_bizModule=selectModal",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb"
                        },
                        {
                            title: "检查项内容",
                            fieldName: "name",
                            width: 480
                        },
                        {
                            title: "分类",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.riskType) {
                                    return data.riskType.name;
                                }
                            },
                            width: 160
                        },
                        {
                            title: "类型",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.type == 2) {
                                    return "管理类";
                                } else if (data.type == 1) {
                                    return "状态类";
                                } else if (data.type == 0) {
                                    return "行为类";
                                }
                            },
                            width: 80
                        },
                        {
                            title: "风险点",
                            fieldType: "custom",
                            render: function (data) {
                                if(data.riskAssessments){
                                    var riskPoints = "";
                                    data.riskAssessments.forEach(function (e) {
                                        if(e.riskPoint){
                                            riskPoints += (e.riskPoint + " , ");
                                        }
                                    });
                                    riskPoints = riskPoints.substr(0, riskPoints.length - 2);
                                    return riskPoints;

                                }


                            }
                        },
                        {
                            title: "风险点类型",
                            fieldType: "custom",
                            render: function (data) {
                                if(data.riskAssessments){
                                    var checkObjTypeNames = "";
                                    data.riskAssessments.forEach(function (e) {
                                        if(e.checkObjType){
                                            var checkObjTypeName = LIB.getDataDic("check_obj_risk_type", e.checkObjType);
                                            if(checkObjTypeNames.indexOf(checkObjTypeName) == -1 )
                                                checkObjTypeNames += (LIB.getDataDic("check_obj_risk_type", e.checkObjType) + " , ");
                                        }
                                    });
                                    checkObjTypeNames = checkObjTypeNames.substr(0, checkObjTypeNames.length - 2);
                                    return checkObjTypeNames;

                                }
                            }
                        },
                        {
                            title: "重点关注类型",
                            fieldType: "custom",
                            render: function (data) {
                                if(data.riskAssessments){
                                    var focusTypeNames = "";
                                    data.riskAssessments.forEach(function (e) {
                                        if(e.focusType){
                                            var focusTypeName = LIB.getDataDic("special_type", e.focusType);
                                            if(focusTypeNames.indexOf(focusTypeName) == -1 )
                                                focusTypeNames += (focusTypeName + " , ");
                                        }
                                    });
                                    focusTypeNames = focusTypeNames.substr(0, focusTypeNames.length - 2);
                                    return focusTypeNames;

                                }
                            }
                        },
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}, disable: 0},
                    resetTriggerFlag: false
                }
            )
        };
    }

    var opts = {
        mixins: [LIB.VueMixin.selectorTableModal],
        data: function () {
            var data = initDataModel();
            return data;
        },
        // ready:function(){
        //     this.hiddenFields = this.data.tableModel[0];debugger
        // },
        name: "checkItemSelectTableModal"

    };

    var component = LIB.Vue.extend(opts);
    return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});