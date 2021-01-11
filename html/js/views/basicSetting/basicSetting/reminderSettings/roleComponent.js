define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("./vuex/api");

    var tpl = require("text!./roleComponent.html");
    var transfer = require("components/transfer/iviewTransfer");

    var newVO = function () {
        return {
            id: null,
            name:null,
            //结果值
            attr2:null,
            //部门id
            attr3:null,
            conditionSeq:null,
            parentId:null,
            filterGroupId:null

        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            orgList: [],
            roleList: [],
            selectRoleList: [],
            index:null
        },
        treeModel:{
            selectedDatas: [],
        },
        //储存数据
        List:[],
        data1:[],
        targetKeys1:[],
        titles:["未分配","已分配"],
        filterable:true

    };

    //声明detail组件
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
                var _this=this;
                var checkedList = [];
                _this.List = [];
                _.each(_this.targetKeys1, function (r) {
                    _this.List.push(r);
                });
                _.each(_this.mainModel.roleList,function(item){
                    _.each(_this.List,function(attr){
                        if(attr == item.id){
                           checkedList.push({id:item.id,name:item.name});
                        }
                    })
                });
                //this.$dispatch("ev_roleSaved", checkedList);
                this.$emit("do-role-saved", checkedList);
            },
            //搜索函数
            doFilterMethod :function(data, query) {
                if(data && data.label) {
                    return data.label.indexOf(query) > -1;
                }
            },

            doHandleChange1 :function(newTargetKeys) {
                //只能选择一个角色
                this.targetKeys1 = newTargetKeys;
            },
        },
        events: {
            "ev_roleReloadData": function (checked) {
                var _this=this;
                var _vo = dataModel.mainModel.vo;
                _.extend(_vo, newVO());

                this.mainModel.selectRoleList=[];
                var userDataLeft=[],userDataRight=[];
                var dataLeft,dataRight;

                //获取角色未分配的数据源
                api.listRole().then(function (res) {

                    _this.mainModel.roleList = res.data;
                    //整理数据 左边的数据
                    _.each( _this.mainModel.roleList,function(item){
                        dataLeft={
                            key:item.id,
                            label: item.name
                        };
                        userDataLeft.push(dataLeft)
                    });

                    dataModel.data1 = userDataLeft;
                    //整理数据
                    _.each(checked,function(item){
                        dataRight={
                            key:item.relId
                        };
                        userDataRight.push(dataRight)
                    });
                    //右边数据只接受key值
                    dataModel.targetKeys1=userDataRight.map(function(item){
                        return item.key
                    })
                });


            }
        }
    });

    return detail;
});