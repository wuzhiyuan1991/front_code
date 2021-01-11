define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var content = require("text!./condition.html");

    //条件值组件
    var conditionValue = require("./conditionValue");

    //初始化数据模型
    var newVO = function () {
        return {
            filterLookupId: null,
            conditionNodes: null,
            conditionValueDate: null,
            conditionValueEndDate: null,
            conditionValue: null,
            attr1: null,
            attr5: null,
            //用来保存字符串
            attr3: null,
            attr4: null,

        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            express: null,
            //分组id
            attr1: null,
            rcList: [newVO()],
            //下拉框选择值
            selectValue: [],
            valueCondition: [
                {
                    id: '==',
                    value: "等于"
                },
                {
                    id: '!=',
                    value: "不等于"
                }
            ],
            selectCondition: [
                {
                    id: '==',
                    value: "等于"
                },
                {
                    //id: '==',
                    id: '!=',
                    value: "不等于"
                }
            ],
            dateCondition: [
                {
                    id: '<=',
                    value: "早于"
                },
                {
                    id: '>=',
                    value: "晚于"
                }
            ],
            //选择条件值
            conditionItems: [],
            //条件运算符
            conditions: {},
            //下框结果值
            selectConditionValues: {},

            //控制条件选中值引用组件
            conponentType: {},
            conditionShow: [false, false, false],
            //审批值
            poolStatus: LIB.getDataDicList("pool_status")
        },
        show: false,
        //添加条件类型  And  Or
        optType: 'and',
        intervalFlag: 0,
        conditionValueModel: {
            //控制编辑组件显示
            title: "新增",
            //显示编辑弹框
            show: false,
            id: null
        },
        deleteIds:[],
        arry: [],
        flag: true,
        //用来判断是否点击过删除按钮
        isClose: false,
    };
    //Vue组件
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
    var detail = LIB.Vue.extend({
        template: content,
        components: {
            "condition-value": conditionValue
        },
        props: {
            model: {
                type: [Object, Array]
            },
            express: {
                required: true
            }
        },
        data: function () {
            return dataModel;
        },
        //watch:{
        //  "mainModel.rcList":function(val,nVal){
        //      if(nVal){
        //            this.doChangeNodesAndExpress();
        //      }
        //  }
        //},
        methods: {
            doDeleteCondition: function (i) {
                var _model = this.mainModel;
                var express = "";
                var id = [];
                //用来判断是否点击过删除按钮
                this.isClose = true;
                id.push(_model.rcList[i].id);
                if (id[0] != undefined) {
                	this.deleteIds.push(id[0]);
//                    this.doDel(id);
                }
                if (_model.rcList.length === 1) {
                    this.flag = false;
                }
                _model.rcList.splice(i, 1);
                //做一个字符串分割
                var itemExpress = _model.express.split(" ");
                if (i === 0) {
                    //如果删除的是第一个 就去掉数组的第0个根第一个
                    itemExpress.splice(i, 1);
                    itemExpress.splice(i, 1);
                } else if (i === _model.rcList.length) {

                    itemExpress.splice(i * 2, 1);
                    itemExpress.splice(i * 2 - 1, 1);
                } else {
                    itemExpress.splice(i * 2 - 1, 1);
                    itemExpress.splice(i * 2 - 1, 1);
                }
                _.each(_model.rcList, function (c, index) {
                    if (index > 0) {
                        var item = index * 2 - 1;
                        //express = express + " and " + (index + 1);
                        express = express + " " + itemExpress[item] + " " + (index + 1);
                    } else {
                        express = "1";
                    }
                });
                _model.express = express;
            },
            showModel: function () {
                this.show = true;
            },
            doDel: function (val) {
                var _this = this;
                api.delFilterConditions(null, val).then(function () {
//                    _this.$dispatch("ev_conditionDeleted");
                })
            },
            //得到选择条件
            doGetLookUpItem: function () {
                var _this = this;
                // this.mainModel.rcList=[];
                api.listLookupItem({lookupId: 999}).then(function (res) {
                    _this.mainModel.conditionItems = res.data;

                    _.each(res.data, function (item) {
                        //结果值的组件类型与选择条件关系对应
                        var key = item.id;
                        var value = item.attr2;
                        _this.mainModel.conponentType[key] = value;


                        //运算类型与选择条件关系对应
                        var conditionVal = null;
                        if (item.attr2 == 1) {
                            conditionVal = _this.mainModel.dateCondition;
                        } else if (item.attr2 == 2) {
                            conditionVal = _this.mainModel.valueCondition;
                        } else {
                            conditionVal = _this.mainModel.selectCondition;
                        }
                        _this.mainModel.conditions[key] = conditionVal;
                    });
                });


                this.mainModel.selectConditionValues['102'] = LIB.getDataDicList("disable");
                this.mainModel.selectConditionValues['109'] = LIB.getDataDicList("risk_type");
                this.mainModel.selectConditionValues['110'] = [
                    {id: '1', value: '低'},
                    {id: '2', value: '中'},
                    {id: '3', value: '高'}
                ];
                this.mainModel.selectConditionValues['111'] = LIB.getDataDicList("pool_status");

            },
            //判断选择完值之后自动添加下一条条件
            doJudgeCondition: function (index) {
                if (index) {
                    var condition = this.mainModel.rcList[index];
                    if (condition.conditionNodes && condition.filterLookupId && (condition.conditionValueDate || condition.conditionValue)) {
                        this.doAddCondition();
                    }
                }
            },
            doAddCondition: function (optType) {
                this.optType = optType;
                if (!this.flag) {
                    this.flag = true;
                }
                //if(this.mainModel.rcList.length > 10){
                //    LIB.Msg.warning("最多添加10条");
                //    return
                //}
                var firstItemId = _.propertyOf(this.mainModel.conditionItems)(0).id;
                var firstCondition = _.propertyOf(this.mainModel.conditions)(firstItemId)[0].id;
                var data = _.extend(newVO(), {filterLookupId:firstItemId, conditionNodes:firstCondition});
                this.mainModel.rcList.push(data);
                this.doChangeNodesAndExpress(firstItemId);
            },
            doChooiseModel: function (filterLookupId, index) {
                this.conditionValueModel.show = true;
                this.conditionValueModel.title = "选择人员";
                this.conditionValueModel.type = "create";
                this.conditionValueModel.id = null;

                if (_.contains(['117', '118', '119','121'], filterLookupId)) {
                    this.conditionValueModel.title = "选择机构";
                }
                if(_.contains(['120'], filterLookupId)) {
                    this.conditionValueModel.title = "选择属地";
                }
                this.$broadcast('ev_conditionValueReload', filterLookupId, index);
            },
            doSave: function () {
                var _this = this, errorIndex = -1;
                var list = this.mainModel.rcList;
                _.each(list, function (item, i) {
                    if(!item.filterLookupId || !item.conditionNodes) {
                        errorIndex = i;
                        return false;
                    }
                    if(_.compact([item.conditionValue, item.conditionValueDate, item.attr5]).length === 0) {
                        errorIndex = i;
                        return false;
                    }

                    item.attr1 = _this.mainModel.attr1;
                    item.attr2 = i + 1;
                    _this.doConversion(item);
                    //用来保存编辑条件
                    item.attr3 = dataModel.arry.join(",");
                    //用来保存设定规则
                    item.attr4 = _this.mainModel.express;
                    dataModel.arry = [];
                });

                if(errorIndex > -1) {
                    LIB.Msg.warning("流程条件中有未填写项");
                    return;
                }

                if (this.flag) {
                    //保存条件分组
                	var param1 = {express: this.mainModel.express};
                	if(this.deleteIds.length > 0) {
                		param1.deleteIds = this.deleteIds;
                	}
                    api.saveFilterConditions(param1, list).then(function () {
                        _this.$dispatch("ev_conditionSaved", list, _this.mainModel.express);
                        //点击删除的时候 在点击model关闭按钮也会触发保存按钮  所以不出现提示信息
                        if (!_this.isClose) {
                            LIB.Msg.info("添加条件成功");
                        }
                    });
                } else {
                	if(this.deleteIds.length > 0) {
                    	this.doDel(this.deleteIds);
                    }
                    _this.$dispatch("ev_conditionSaved", list, _this.mainModel.express);
                }

            },
            //转换
            doConversion: function (item) {
                var _this = this;
                _.each(_this.mainModel.conditionItems, function (data) {
                    if (item.filterLookupId === data.id) {
                        dataModel.arry.push(data.name)
                    }
                })
                if (item.conditionNodes === "==") {
                    dataModel.arry.push("等于")
                } else if (item.conditionNodes === "!=") {
                    dataModel.arry.push("不等于")
                } else if (item.conditionNodes === "<=") {
                    dataModel.arry.push("早于")
                } else if (item.conditionNodes === ">=") {
                    dataModel.arry.push("晚于")
                }
                if (item.conditionValueDate) {
                    dataModel.arry.push(item.conditionValueDate)
                }
                //排除创建人 负责人
                if (item.conditionValue && item.filterLookupId !== "101" && item.filterLookupId !== "104") {
                    dataModel.arry.push(item.conditionValue)
                }
                if (item.attr5) {
                    dataModel.arry.push(item.attr5)
                }
            },
            doChangeNodesAndExpress: function () {

                var _model = this.mainModel;
                var express = "",
                    now = Date.now();

                if (!_model.express) {
                    express = "1";
                    _model.express = express;
                } else {
                    // 打开Modal时会连续触发多次调用，设置时间间隔阻止继续执行
                    if (this.intervalFlag === 0 || (now - this.intervalFlag) < 100) {
                        this.intervalFlag = now;
                        return;
                    }
                    //做一个字符串分割
                    var itemExpress = _model.express.split(" ");
                    var optType = this.optType;
                    _.each(_model.rcList, function (c, index) {
                        if (c.filterLookupId) {
                            if (index > 0) {
                                //express = express + " and " + (index + 1);
                                if (index * 2 > itemExpress.length) {
                                    express = express + " " + optType + " " + (index + 1);
                                } else {
                                    var item = index * 2 - 1;
                                    express = express + " " + itemExpress[item] + " " + (index + 1);
                                }

                            } else {
                                express = "1";
                            }
                        }
                    });
                    _model.express = express;
                }
                this.intervalFlag = now;
            }
        },
        events: {
            "ev_conditionModel": function (data) {
                var nVal = _.cloneDeep(data);
                //编辑条件的控制器
                this.flag = true;
                this.deleteIds = [];
                //用来判断是否点击过删除按钮
                this.isClose = false;
                this.intervalFlag = 0;
                this.mainModel.rcList = nVal.filterConditions || [];
                this.mainModel.attr1 = nVal.id;
                if (nVal.filterConditions && nVal.filterConditions.length > 0) {
                    this.mainModel.express = nVal.filterConditions[0].attr4;
                    // 确保至少执行一次
                    this.doChangeNodesAndExpress();
                } else {
                    this.mainModel.express = null
                }

            },
            "ev_conditionValueModel": function (nVal, index, filterLookupId) {
                var isExisted = _.find(this.mainModel.rcList, function (item) {
                    return item.conditionValue === nVal.id && item.filterLookupId === filterLookupId;
                });
                if (typeof isExisted !== 'undefined') {
                    LIB.Msg.warning("已经存在相同的条件");
                    return;
                }
                this.mainModel.rcList[index].attr5 = nVal.username || nVal.name;

                this.mainModel.rcList[index].conditionValue = nVal.id;
                this.conditionValueModel.show = false;
            },
//            "ev_closeModel": function () {
//                if (this.isClose) {
//                    this.doSave();
//                }
//
//            }
        },
        ready: function () {
            this.doGetLookUpItem();
        }
    });

    return detail;
});