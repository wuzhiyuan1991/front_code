define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit.html");


    var newVO = function () {
        return {
            id: null,
            name:null,
            processType:null,
            reformerFlag:null,
            order:null
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            //检查项类型
            types: LIB.getDataDicList("process_type")
        },
        //验证规则
        rules: {
            name: [
                {required: true, message: '请输入阶段名称'}
            ],
            order: [
                {required: true, message: '请输入0到9数字'}
            ]
        },
        dataObj:null,
        //控制器
        isFlsg:true,
        index:null
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
        methods: {
            doSave: function () {
                dataModel.isFlsg = true;
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        //if (_this.mainModel.opType == "create") {
                        //    api.create(_.pick(_this.mainModel.vo, "id",  "name", "reformerFlag","order")).then(function (res) {
                        //        _this.$dispatch("ev_editAdd",_this.mainModel.vo);
                        //        LIB.Msg.info("保存成功");
                        //    });
                        //} else {
                        //    api.update(_.pick(_this.mainModel.vo, "id",  "name", "reformerFlag","order")).then(function (res) {
                        //        _this.$dispatch("ev_editUpdate", dataModel.mainModel.vo);
                        //        LIB.Msg.info("修改成功");
                        //    });
                        //}
                        //dataModel.index有值 就说明 属于修改状态 反之就是新增
                        if(dataModel.index == "add"){
                            _.each(dataModel.dataObj,function(item){
                                if(_this.mainModel.vo.order == item.conditionSeq){
                                    LIB.Msg.warning("不能包含相同的排序项");
                                    dataModel.isFlsg = false;
                                    return;
                                }
                            })
                        }else{
                            _.each(dataModel.dataObj,function(item){
                                if(_this.mainModel.vo.order == item.conditionSeq && _this.mainModel.vo.id != item.id){
                                    LIB.Msg.warning("不能包含相同的排序项");
                                    dataModel.isFlsg = false;
                                    return;
                                }
                            })
                        }
                        if(dataModel.isFlsg){
                            if(dataModel.index == "add"){
                                _this.$dispatch("ev_editAdd",_this.mainModel.vo,"add");
                            }else{
                                _this.$dispatch("ev_editAdd",_this.mainModel.vo,"update");
                            }
                        }
                    } else {
                        return false;
                    }
                });
            },
            doCancel: function () {
                this.$dispatch("ev_editCanceled");
            }
        },
        events: {
            //edit框数据加载
            "ev_editReload": function (index,group,data,type) {
                //var _this = this;
                ////注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                //做一个排序判断功能 保存detail传过来的数据 在去判断 order
                dataModel.dataObj = data;
                dataModel.index = type;
                //清空数据
                _.extend(_vo, newVO());
                if(type != "add"){
                    _.deepExtend(_vo, group);
                    _vo.order = group.conditionSeq;
                }
                //存在nVal则是update
                //if (nVal != null) {
                //    _data.opType = "update";
                //    api.get({id: nVal}).then(function (res) {
                //        //初始化数据
                //        _.deepExtend(_vo, res.data);
                //    });
                //} else {
                //    _data.opType = "create";
                //    api.getUUID().then(function (res) {
                //        _vo.id = res.data;
                //    });
                //}
            }
        }
    });

    return detail;
});