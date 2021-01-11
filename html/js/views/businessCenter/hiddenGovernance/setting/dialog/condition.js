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
            attr3:null,
            attr4:null,

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
        conditionValueModel: {
            //控制编辑组件显示
            title: "新增",
            //显示编辑弹框
            show: false,
            id: null
        },
        arry:[],
        flag:true,
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
        methods: {
            doDeleteCondition:function(i){
                var _model = this.mainModel;
                var express = "";
                var index = 0;
                var id = [];
                id.push(_model.rcList[i].id);
                if(id[0] != undefined){
                        this.doDel(id);
                    }
                if( _model.rcList.length == 1){
                    this.flag = false;
                }
                _model.rcList.splice(i,1);
                _.each(_model.rcList, function (c) {
                    if (c.id) {
                        if (index > 0) {
                            express = express + " and " + (index + 1);
                        } else {
                            express = "1";
                        }
                        index++;
                    }
                });
                _model.express = express;
            },
            showModel: function () {
                this.show = true;
            },
            doDel:function(val){
                api.delFilterConditions(null,val).then(function(){})
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
                this.mainModel.selectConditionValues['110'] = [{id: '1', value: '低'}, {id: '2', value: '中'}, {
                    id: '3',
                    value: '高'
                },];
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
            doAddCondition: function () {
                if(!this.flag ){
                    this.flag = true;
                }
                if(this.mainModel.rcList.length > 10){
                    LIB.Msg.warning("最多添加10条");
                    return
                }
                this.mainModel.rcList.push(newVO());
            },
            doChooiseModel: function (filterLookupId, index) {
                this.conditionValueModel.show = true;
                this.conditionValueModel.title = "选择人员";
                this.conditionValueModel.type = "create";
                this.conditionValueModel.id = null;
                //修改bug3527
                if (_.contains(['117', '118'], filterLookupId)) {
                    this.conditionValueModel.title = "选择机构";
                }
                this.$broadcast('ev_conditionValueReload', filterLookupId, index);
            },
            doSave: function () {
                var _this = this;
                var list = this.mainModel.rcList;
                _.each(list, function (item, i) {
                    item.attr1 = _this.mainModel.attr1;
                    item.attr2 = i + 1;
                    _this.doConversion(item);
                    //用来保存编辑条件
                    item.attr3 = dataModel.arry.join(",");
                    //用来保存设定规则
                    item.attr4 = _this.mainModel.express;
                    dataModel.arry = [];
                });

              if(this.flag){
                  //保存条件分组
                  api.saveFilterConditions({express: this.mainModel.express},list).then(function () {
                      _this.$dispatch("ev_conditionSaved", list, _this.mainModel.express);
                      LIB.Msg.info("添加条件成功");
                  });
              }else{
                  _this.$dispatch("ev_conditionSaved", list, _this.mainModel.express);
              }

            },
            //转换
            doConversion:function(item){
                var _this = this;
                _.each( _this.mainModel.conditionItems,function(data){
                    if(item.filterLookupId == data.id){
                        dataModel.arry.push(data.name)
                    }
                })
                if(item.conditionNodes =="=="){
                    dataModel.arry.push("等于")
                }else if(item.conditionNodes =="!="){
                    dataModel.arry.push("不等于")
                }else if(item.conditionNodes =="<="){
                    dataModel.arry.push("早于")
                }else if(item.conditionNodes ==">="){
                    dataModel.arry.push("晚于")
                }
                if(item.conditionValueDate){
                    dataModel.arry.push(item.conditionValueDate)
                }
                //排除创建人 负责人
                if(item.conditionValue && item.filterLookupId !== "101" && item.filterLookupId !== "104"){
                    dataModel.arry.push(item.conditionValue)
                }
                if(item.attr5){
                    dataModel.arry.push(item.attr5)
                }
             },
            doChangeNodesAndExpress: function () {
                var _model = this.mainModel;
                var express = "";
                var index = 0;
                _.each(_model.rcList, function (c) {
                    if (c.filterLookupId) {
                        if (index > 0) {
                            express = express + " and " + (index + 1);
                        } else {
                            express = "1";
                        }
                        index++;
                    }
                });
                _model.express = express;
            },
        },
        events: {
            "ev_conditionModel": function (nVal) {
                //编辑条件的控制器
                this.flag = true;
                this.mainModel.rcList = nVal.filterConditions || [];
                this.mainModel.attr1 = nVal.id;
                if(nVal.filterConditions && nVal.filterConditions.length>0){
                    this.mainModel.express =  nVal.filterConditions[0].attr4;
                }else{
                    this.mainModel.express = null
                }

            },
            "ev_conditionValueModel": function (nVal, index) {
                this.mainModel.rcList[index].attr5 = nVal.username || nVal.name;

                this.mainModel.rcList[index].conditionValue = nVal.id;
                this.conditionValueModel.show = false;
            }
        },
        ready: function () {
            this.doGetLookUpItem();
        }
    });

    return detail;
});