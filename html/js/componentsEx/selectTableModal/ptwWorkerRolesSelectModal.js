define(function(require) {

    var LIB = require('lib');
    function getRootBusinessSet  (name) {
        var result = {};
        $.ajax({
            url: "/systembusinessset/root?compId=9999999999&name="+name,
            async: false,
            success: function (res) {
                if(res.content){
                    result = res.content;
                }
            }
        });
        return result;
    }
    var initDataModel = function () {
        return {
            mainModel:{
                title:"选择",
                selectedDatas:[]
            },
            tableModel: {
                // url: "user/posHseList{/curPage}{/pageSize}?disable=0",
                url: "ptwworkrole/list{/curPage}{/pageSize}?disable=0",
                selectedDatas: [],
                keyword: '',
                columns: [{
                    title: "",
                    fieldName: "id",
                    fieldType: "cb"
                }, {
                    title: "员工姓名",
                    fieldName: "user.name",
                    width: 120,
                    keywordFilterName: "criteria.strValue.keyWordValue_user_name"

                },
                (function () {
                    var org = _.omit(LIB.tableMgr.column.company, "filterType");
                    org = _.clone(org);
                    org.width = 160;
                    // org.keywordFilterName = "criteria.strValue.keyWordValue_comp_name";

                    return org;
                })(),
                (function () {
                    var org = _.omit(LIB.tableMgr.column.dept, "filterType");
                    org = _.clone(org);
                    // org.keywordFilterName = "criteria.strValue.keyWordValue_dept_name";
                    org.width = 160;
                    return org;
                })(),
                    // _.omit(LIB.tableMgr.column.dept, "filterType"),
                    // {
                    //     title: "岗位",
                    //     fieldType: "custom",
                    //     render: function (data) {
                    //         if (data.positionList) {
                    //             var posNames = "";
                    //             data.positionList.forEach(function (e) {
                    //                 if (e.postType == 0 && e.name) {
                    //                     posNames += (e.name + "/");
                    //                 }
                    //             });
                    //             posNames = posNames.substr(0, posNames.length - 1);
                    //             return posNames;
                    //
                    //         }
                    //     },
                    //     width: 160
                    // },
                    //
                    // {
                    //     title: "安全角色",
                    //     fieldType: "custom",
                    //     render: function (data) {
                    //         if (data.positionList) {
                    //             var roleNames = "";
                    //             data.positionList.forEach(function (e) {
                    //                 if (e.postType == 1 && e.name) {
                    //                     roleNames += (e.name + ",");
                    //                 }
                    //             });
                    //             roleNames = roleNames.substr(0, roleNames.length - 1);
                    //             return roleNames;
                    //
                    //         }
                    //     },
                    //     width: 160
                    // }
                ],
                defaultFilterValue: {
                    "criteria.orderValue": {fieldName: "modifyDate", orderType: "1"},
                    "criteria.intValue":{userWorkState: 1}

                }
            },
        };
    }

    var opts = {
        mixins : [LIB.VueMixin.selectorTableModal],
        data:function(){
            var data = initDataModel();
            return data;
        },
        methods:  {
            getSystembusinessset: function (name) {
                var setting = getRootBusinessSet('common').children || [];
                var obj = _.find(setting, function (item) {
                    return item.name == name;
                });

                if(obj) return obj.result === '2';
                else return false;
            },

            doCleanRefresh:function() {
                var tableFilterDatas = [];
                var filterData = this.filterData;
                //

                var isWorkState = this.getSystembusinessset("enableUserWorkState");
                if(isWorkState) this.tableModel.defaultFilterValue['criteria.intValue'].userWorkState = 1;
                else this.tableModel.defaultFilterValue['criteria.intValue'].userWorkState = '';

                this.$refs.table.doClearData()
                if(filterData) {
                    for(key in filterData) {
                        var value = filterData[key];
                        if(value != undefined && value != null && value.toString().trim() != "" ) {
                            var tableFilterData = {
                                type :　"save",
                                value : {
                                    columnFilterName : key,
                                    columnFilterValue : value
                                }
                            };
                            tableFilterDatas.push(tableFilterData);
                        }
                    }
                }
                // this.$refs.table.doCleanRefresh(tableFilterDatas);
                this.$refs.table.doQuery(filterData);
            },
        },
        name:"ptwworkcardSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
});