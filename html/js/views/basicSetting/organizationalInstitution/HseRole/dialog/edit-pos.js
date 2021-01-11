define(function (require) {
    var LIB = require('lib');
    var Vue = require('vue');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit-pos.html");
    var transfer = require("components/transfer/iviewTransfer");
    var newVO = function () {
        return {
            posList: [],
            userId: null,
            positionList: [],
            orgList: [],
            userList: [],
            uList: [],
            List:[],
            posId: null,
            list: [],
            uLength: 0,
            userLength: 0
        }
    };

    //数据模型
    //filterable 为搜索函数 filterMethod 为搜索定义函数
    var dataModel = {
        mainModel: {
            vo: newVO(),
            orgId: null,
            searchValue: null
        },
        data1:[],
        targetKeys1:[],
        titles:["未分配","已分配"],
        filterable:true
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
    var detail = LIB.Vue.extend({
        template: tpl,
        data: function () {
            return dataModel
        },
        components:{
            transfer:transfer
        },
        methods: {
            doSave: function () {
                var _this = this;
                var callback = function (res) {
                    //_this.$dispatch("ev_editPosFinshed", _this.mainModel.vo);
                    _this.$emit("do-edit-pos-finshed", _this.mainModel.vo);
                    LIB.Msg.info("保存成功");

                };
                _.each(_this.targetKeys1, function (r) {
                    _this.mainModel.vo.list.push(r);
                });
                api.distribution(_.pick(this.mainModel.vo, "posId", "list")).then(callback);
            },
            //doCancel: function () {
            //    this.$dispatch("ev_editPosCanceled");
            //},
            //搜索函数
            filterMethod :function(data, query) {
                if(data && data.label) {
                    return data.label.indexOf(query) > -1;
                }
                },

            handleChange1 :function(newTargetKeys, direction, moveKeys) {
                //console.log(newTargetKeys);
                //console.log(direction);
                //console.log(moveKeys);
                this.targetKeys1 = newTargetKeys;
            },
        },
        events: {
            //edit框数据加载
            "ev_editPosReload": function (nVal) {
                var _this=this;
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;
                var model = dataModel.mainModel;
                var _temp = [];
                var n = 0;
                //清空数据
                _.extend(_vo, newVO());
                    //清空之前留下的数据
                    dataModel.data1=[];
                    dataModel.targetKeys1=[];
                _this.$refs.transfer.splitSelectedKey();
                _vo.posId = nVal;
                //存在nVal则是update
                api.get({id: nVal}).then(function (result) {
                    _vo.userList = result.data.userList;
                    //userDataLeft 为左边的数据源  userDataRigth为右变的重组数据源 只要一个key值
                    //dataLeft跟dataRigth 为一个桥接变量
                    var userDataLeft=[],userDataRigth=[];
                    var dataLeft,dataRigth;
                    api.listUser({orgId: result.data.organizationId}).then(function (res) {
                        model.orgId = result.data.organizationId;
                        if (res.data) {
                            _vo.uList = res.data;
                            //整理数据 左边的数据
                            _.each(_vo.uList,function(item){
                                    dataLeft={
                                        key:item.id,
                                        label: item.username
                                    }
                                userDataLeft.push(dataLeft)
                            })
                            dataModel.data1 = userDataLeft;
                            //整理数据
                            _.each(_vo.userList,function(item){
                                 dataRigth={
                                    key:item.id
                                }
                                 userDataRigth.push(dataRigth)
                            })
                            //右边数据只接受key值
                            dataModel.targetKeys1=userDataRigth.map(function(item){
                                return item.key
                            })
                        }
                    });
                });

            }
        }
    });
    return detail;
});