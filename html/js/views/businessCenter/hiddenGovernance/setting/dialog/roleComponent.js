define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");

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
            filterGroupId:null,
            code:null

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
            //orgId: null,
            //searchValue: null
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
                var _this=this;
                _.each(_this.targetKeys1, function (r) {
                    _this.List.push(r);
                });
                //通过id获取name targetKeys1 只有一个key值
                _.each(_this.mainModel.roleList,function(item){
                    _.each(_this.List,function(attr){
                        if(attr == item.id){
                            _this.mainModel.vo.attr2 = item.id;
                            _this.mainModel.vo.name = item.name;
                            _this.mainModel.vo.code = item.code
                            api.saveFilterLookup(_.pick(_this.mainModel.vo, "attr2", "name", "conditionSeq",'parentId',"code"))
                                .then(function (res) {
                                    _this.$dispatch("ev_roleSaved", _this.mainModel.vo,_this.mainModel.index);
                                    LIB.Msg.info("添加角色成功");
                                });
                            return
                        }
                    })
                })
            },
            //搜索函数
            doFilterMethod :function(data, query) {
                if(data && data.label) {
                    return data.label.indexOf(query) > -1;
                }
            },

            doHandleChange1 :function(newTargetKeys, direction, moveKeys) {
                //只能选择一个角色
                if(moveKeys.length > 1){
                    LIB.Msg.warning("角色只能选择一个");
                    return;
                }else{
                    this.targetKeys1 = moveKeys;
                }
            },
        },
        events: {
            "ev_roleReloadData": function (parentId,conditionSeq,index) {
                var _this=this;
                var _vo = dataModel.mainModel.vo;
                _.extend(_vo, newVO());
                _vo.parentId=parentId;
                _vo.conditionSeq=conditionSeq;

                api.getUUID().then(function (res) {
                    _vo.id = res.data;
                });
                //清空之前选择的数据
                this.List = [];
                //强制清空 select 组件的值， 避免异常情况的失效
                this.$nextTick(function () {
                    this.treeModel.selectedDatas = [];
                });
                this.mainModel.selectRoleList=[];
                this.mainModel.index =index;
                //清空搜索的默认数据
                this.$refs.transfer.$children[0].$children[0].handleClick();
                var listDeptResource = this.$resource('organization/list');
                listDeptResource.get({type: 2}).then(function (res) {
                    _this.mainModel.orgList = res.data;
                    var userDataLeft=[],userDataRigth=[];
                    var dataLeft,dataRigth;
                    //获取角色未分配的数据源
                        api.listRole().then(function (res) {
                            _this.mainModel.roleList = res.data;
                            //整理数据源
                            _.each( _this.mainModel.roleList,function(item){
                                dataLeft={
                                    key:item.id,
                                    label: item.name
                                }
                                userDataLeft.push(dataLeft)
                            })
                            dataModel.data1 = userDataLeft;
                            //右边数据只接受key值
                            dataModel.targetKeys1=userDataRigth.map(function(item){
                                return item.key
                            })
                        });

                });
            }
        }
    });

    return detail;
});