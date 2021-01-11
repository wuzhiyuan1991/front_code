define(function(require) {

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            filterKey:null,
            mainModel:{
                title:"选择",
                selectedDatas:[]
            },
            tableModel: (
                {
                    url: "exercisescheme/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.ksColumn.cb,
                        {
                            //状态 0:未发布,1:已发布
                            title: "状态",
                            fieldName: "status",
                            orderName: "status",
                            // filterName: "criteria.intsValue.status",
                            // filterType: "enum",
                            // fieldType: "custom",
                            // popFilterEnum: (function(){
                            //     var arr = LIB.getDataDicList("iem_exercise_scheme_status");
                            //     arr.splice(0,1);
                            //     return arr;
                            // })(),
                            keywordFilterName: "criteria.strValue.keyWordValue_status",

                            render: function (data) {
                                return LIB.getDataDic("iem_exercise_scheme_status", data.status);
                            },
                            width:80
                        },
                        {
                            //演练时间
                            title: "演练时间",
                            fieldName: "exerciseDate",
                            keywordFilterName: "criteria.strValue.keyWordValue_exerciseDate",

                            render:function (data) {
                                var str = '';
                                if(data.exerciseDate){
                                    str = (data.exerciseDate+'').substr(0,16);
                                }
                                return str;
                            },
                            width:140
                        },
                        {
                            //演练时长（时）
                            title: "演练时长",
                            fieldName: "hour",
                            keywordFilterName: "criteria.strValue.keyWordValue_time",
                            render:function (data) {
                                var str = '';
                                if(data.hour){
                                    str += data.hour + "小时"
                                }
                                if(data.minute){
                                    str += data.minute + "分钟"
                                }
                                return str;
                            },
                            width:110
                        },
                        {
                            //演练地点
                            title: "演练地点",
                            fieldName: "exerciseAddress",
                            keywordFilterName: "criteria.strValue.keyWordValue_exerciseAddress",
                        },
                        {
                            //演练科目类型
                            title: "演练科目类型",
                            fieldName: "subjectType",
                            keywordFilterName: "criteria.strValue.keyWordValue_subjectType",

                            // render:function (data) {
                            //     if(data.subjectType){
                            //         var str = data.subjectType.split(",");
                            //         var arr = [];
                            //         _.each(str,function (item) {
                            //             arr.push(LIB.getDataDic("emer_exercise_subjects_type",item))
                            //         });
                            //         return arr.join("，");
                            //     }
                            //
                            // }
                        },
                        {
                            //预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
                            title: "演练类型",
                            fieldName: "exercisePlan.emerPlanType",
                            keywordFilterName: "criteria.strValue.keyWordValue_emerPlanType",

                            render: function (data) {
                                if(data.exercisePlan){
                                    return LIB.getDataDic("iem_emer_plan_type", data.exercisePlan.emerPlanType);
                                }
                                return '';
                            }
                        },
                        {
                            //演练科目
                            title: "演练科目",
                            fieldName: "subjects",
                            keywordFilterName: "criteria.strValue.keyWordValue_subjects",

                        },
                        {
                            //演练形式 1:桌面推演,2:现场演习
                            title: "演练形式",
                            fieldName: "form",
                            orderName: "form",
                            keywordFilterName: "criteria.strValue.keyWordValue_form",

                            render: function (data) {
                                return LIB.getDataDic("iem_exercise_scheme_form", data.form);
                            }
                        },
                    ],

                    defaultFilterValue : {
                        "criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},
                        "disable" : 0,
                        "criteria.intsValue": {"status":["1","2"]}
                    },
                    resetTriggerFlag:false
                }
            )
        };
    }

    var opts = {
        mixins : [LIB.VueMixin.selectorTableModal],
        watch : {
            visible : function(val) {
                this.$refs.table.filterKey = null;
                if(this.$refs.table.dynamicQueryCriterias) {
                    this.$refs.table.dynamicQueryCriterias['criteria.strValue.keyWordValue'] = null;
                    this.$refs.table.dynamicQueryCriterias['criteria.strValue.keyWordValue_status'] = null;
                    this.$refs.table.dynamicQueryCriterias['criteria.strValue.keyWordValue_exerciseDate'] = null;
                    this.$refs.table.dynamicQueryCriterias['criteria.strValue.keyWordValue_subjectType'] = null;
                    this.$refs.table.dynamicQueryCriterias['criteria.strValue.keyWordValue_emerPlanType'] = null;
                    this.$refs.table.dynamicQueryCriterias['criteria.strValue.keyWordValue_subjects'] = null;
                    this.$refs.table.dynamicQueryCriterias['criteria.strValue.keyWordValue_form'] = null;
                    this.$refs.table.dynamicQueryCriterias['criteria.strValue.keyWordValue_join_'] = null;
                    this.$refs.table.dynamicQueryCriterias['criteria.strValue.keyWordValue_time'] = null;
                    this.$refs.table.dynamicQueryCriterias['criteria.strValue.keyWordValue_exerciseAddress'] = null;

                }
                val && this.doCleanRefresh();
            }
        },
        data:function(){
            var data = initDataModel();
            return data;
        },
        name:"exerciseSchemeSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
});