define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit-pos.html");
    var transfer = require("components/transfer/iviewTransfer");

    var newVO = function () {
        return {
            posList: [],
            userId: null,
            positionList: []
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            pList: [],
            pLength: 0,
            posLength: 0,
            searchValue:null
        },
        data1:[],
        targetKeys1:[],
        titles:["未分配","已分配"],
        filterable:true,
        //bug 2538 新增一个字段
        role:null


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
            return dataModel;
        },
        components:{
            transfer:transfer
        },
        methods: {
            doSave: function () {
                var _this = this;
                var callback = function (res) {
                    var posData = [];
                    _.each(_this.mainModel.vo.positionList,function(posId){
                        _.each(_this.mainModel.pList,function(posList){
                            if(posId == posList.id ){
                                posData.push(posList);
                            }
                        })
                    });
                    //这里分为在main里面 添加岗位跟在详情添加岗位
                    if(dataModel.mainModel.role == "role"){
                        //_this.$dispatch("ev_editPosrole", dataModel.mainModel.vo.userId);
                        _this.$emit("do-edit-posrole", dataModel.mainModel.vo.userId);
                    }
                        //_this.$dispatch("ev_editPosFinshed",posData);
                         _this.$emit("do-edit-pos-finshed",posData);
                         LIB.Msg.info("保存成功");
                };

                _.each(_this.targetKeys1, function (r) {
                    _this.mainModel.vo.positionList.push(r);
                });
                if(_this.mainModel.vo.positionList.length==0){
                    return;
                }
                if(_this.mainModel.role == 1){
                    api.distributionHsePosition(_.omit(this.mainModel.vo, "posList")).then(callback);
                }else{
                    api.distributionPosition(_.omit(this.mainModel.vo, "posList")).then(callback);
                }
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
                this.targetKeys1 = newTargetKeys;
            },

        },
        events: {
            //edit框数据加载
            "ev_editReload_low": function (nVal,role) {
                var _this=this;
                //清空搜索的默认数据 bug2969
                _this.$refs.transfer.$children[0].$children[0].handleClick();
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                _vo.userId = nVal;
                //bug 2538 详情新增岗位赋值
                dataModel.mainModel.role = role;
                //清空之前留下的数据
                dataModel.data1=[];
                dataModel.targetKeys1=[];
                _this.$refs.transfer.splitSelectedKey();
                //存在nVal则是update
                api.listPos().then(function (res) {
                    _data.pList = res.data;
                     if (nVal != null) {
                    api.listPos().then(function (res) {
                        _data.pList = res.data;
                        var userDataLeft=[],userDataRigth=[];
                            api.get({id: nVal}).then(function (res) {
                                    _vo.posList = res.data.positionList;
                                    //整理数据 左边的数据
                                    _.each(_data.pList,function(item){
                                        //过滤安全角色跟岗位 安全角色是1 岗位管理是0
                                       if(role== 1){
                                           if(item.postType == "1") {
                                               var  dataLeft={
                                                   key:item.id,
                                                   label: item.name
                                               }
                                               userDataLeft.push(dataLeft)
                                           }
                                       }else{
                                          if(item.postType == "0"){
                                              var  dataLeft={
                                                  key:item.id,
                                                  label: item.name
                                              }
                                              userDataLeft.push(dataLeft)
                                          }
                                       }
                                    })
                                    dataModel.data1 = userDataLeft;
                                    //整理数据
                                    _.each(_vo.posList,function(item){
                                       var dataRigth={
                                            key:item.id
                                        }
                                        userDataRigth.push(dataRigth)
                                    })
                                    //右边数据只接受key值
                                    dataModel.targetKeys1=userDataRigth.map(function(item){
                                        return item.key
                                })
                            });
                    });
                }
                 });
            }
        },

    });

    return detail;
});