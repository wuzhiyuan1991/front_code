define(function (require) {
    var template = require("text!./delegateRecord.html");
    var LIB = require('lib');
    var api = require("../vuex/api");

    var initDataModel = {
        mainModel: {
            title: "委托记录"
        },
        tableModel: {
            url: "checktaskgroup/delegaterecords/list{/curPage}{/pageSize}",
            columns: [
              {
                  title: "委托人",
                  fieldName:"mandator.name",
                  width: 180
              },
              {
                  title: "被委托人",
                  fieldName:"assignee.name",
                  width: 180
              },
              {
                  title: "委托时间",
                  fieldName: "createDate",
                  width: 180
              },
              {
                  title: "委托原因",
                  fieldName:"reason"
              }
            ],
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
            groupId: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return initDataModel;
        },
        watch : {
			visible : function(val) {
				val && this._doQuery();
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
            _doQuery: function () {
                var params = [];
                params.push({
                    type: "save",
                    value: {
                        columnFilterName: 'id',
                        columnFilterValue: this.groupId
                    }
                })

                this.$refs.table.doCleanRefresh(params);
            },
            init: function () {
                this._doQuery();
            },
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});