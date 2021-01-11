define(function(require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

    var initDataModel = function() {
        return {
            //控制全部分类组件显示
            mainModel: {
                keyword: ''
            },
            compId:null,
            tableModel: {
                url: "rpt/rptkeypost/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [
                    // {
                    //     title: this.$t("gb.common.code"),
                    //     fieldName: "user.code",
                    //     // fieldType: "link",
                    //     width: 220
                    // },
                    {
                        //计划名
                        title: '用户名称',
                        fieldName: "user.username",
                        width: 100
                    },
                    {
                        title: '岗位',
                        render: function(data) {
                            var str=''
                                  _.each(data.positions,function(item,index){
                                      if (index==data.positions.length-1) {
                                        str+=item.name
                                        return
                                      }
                                    str+=item.name+','
                                  })
                                return "<div title="+str+">"+str+"</div>"
                            
                        },
                        width: 200
                    },
                    {
                        title: "所属部门",
                        fieldType: "custom",
                        render: function(data) {
                            if (_.propertyOf(data.user)("orgId")) {
                                return LIB.LIB_BASE.tableMgr.rebuildOrgName(data.user.orgId, 'dept');
                            }
                        },
                        fieldName: "user.orgId",
                        width: 300
                    },
                    {
                        title: "所属公司",
                        fieldName: "organization.name",
                        width: 300
                    },
                    {
                        title: "",
                        showTip:false,
                        width: 60,
                        render: function () {
                            return '<span class="tableCustomIco_Del"><i class="ivu-icon ivu-icon-trash-a"></i></span>'
                        }
                    }
                ],
                defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" } }
            },
            isShowKeyPost: true,
            isShowModelParam: true,
            selectModel: {
                visible: false,
                filterData: {}
            },
            taskStatusItem: {
                id: null,
                lookupId: null,
                content:null,
            },
            taskStatusParam:{
                'checkManagement': 0,//检查管理
                'randomObservation': 0,//随机观察
                'iegn': 0,//隐患管理
                'itm': 0//培训管理
            },
            compName:null
        };
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        components: {
            userSelectModal:userSelectModal,
        },
        data: initDataModel,
        methods: {
            doSaveKeyPost: function () {
                
            },
            doClickCell: function (data) {
                if (data.event.target.parentNode.className === "tableCustomIco_Del") {
                    this.delItemRelRowHandler(data.entry.data.id);
                }
            },
            delItemRelRowHandler: function (id) {
                var _this = this;
                this.$api.remove(null, {id: id}).then(function (res) {
                    _this.doQuery();
                })
            },
            doAddUser: function () {
                this.selectModel.visible = true;
            },
            doSaveUsers: function (users) {
                var _this = this;
                var param = _.map(users, function (user) {
                    return {
                        "organization":{
                            "id": _this.compId
                        },
                        "user":{
                            "id": user.id
                        }
                    }
                });
                this.$api.createBatch(param).then(function (res) {
                    _this.doQuery();
                })
            },
            changeOrgComp: function (data) {
                this.compId = data.nodeId;
                this.selectModel.filterData = {
                    compId: this.compId,
                };
                this.compName=data.nodeVal
                if(this.$refs.keyPostTable) {
                    this.doQuery();
                }
            },
            changeComp: function (data) {
                this.compId = data.id;
                this.selectModel.filterData = {
                    compId: this.compId,
                };
                this.compName=data.name
                if(this.$refs.keyPostTable) {
                    this.doQuery();
                }
            },
            doQuery: function (val) {
                this.mainModel.keyword=val
                this.$refs.keyPostTable.doQuery({
                    "organization.id":  this.compName!=="所有公司"?this.compId:'',
                    "criteria.strValue.keyWordValue": this.mainModel.keyword
                });
            },
            queryTaskStatusParam: function () {
                var _this = this;
                api.queryTaskStatusParam().then(function(res){
                    if(res.data){
                        _this.taskStatusItem.id = res.data.id;
                        _this.taskStatusItem.lookupId = res.data.lookupId;
                        _.deepExtend(_this.taskStatusParam, JSON.parse(res.data.content));
                    }
                })
            },
            toggleTaskStatusParam: function(key, b) {
                var val = this.taskStatusParam[key] == 1 ? 0 : 1;
                this.taskStatusParam[key] = val;
                this.taskStatusItem.content = JSON.stringify(this.taskStatusParam);
                api.updateLookupItem({id: this.taskStatusItem.lookupId}, this.taskStatusItem).then(function (res) {
                    LIB.Msg.success("修改成功");
                })
            }
        },
        events: {},
        init: function(){
            this.$api = api;
        },
        ready: function() {
           
            this.doQuery();
            this.queryTaskStatusParam();
        }
    });

    return vm;
});
