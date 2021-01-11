define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./selfEvaluationTask.html");
    var api = require("../vuex/api");
    var selfEvaluationDetail = require("./selfEvaluationDetails");


    var detail = LIB.Vue.extend({
        computed:{
            getList:function () {
                var arr = this.getDataDicList('iem_emer_plan_status');
                var list = [];
                var _this = this;
                if(parseInt(this.vo.type) === 3){
                    _.each(arr, function (item, index) {
                        if(index !== 3 && index!==4 && index < parseInt(_this.vo.status)){
                            list.push(item);
                        }
                    })
                }else{
                    _.each(arr, function (item, index) {
                        if(index < parseInt(_this.vo.status)){
                            list.push(item);
                        }
                    })
                }
                return list;
            }
        },
        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        components:{
            "selfEvaluationDetail":selfEvaluationDetail
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            vo:{
                type:Object,
                // default:''
            },
        },
        watch:{
            visible:function(val){
                // val && this._init()
            }
        },

        data:function(){
            return {
                tabs: [],
                taskList:[],
                tableModel: {
                    selfEvaluationTaskTableModel: LIB.Opts.extendDetailTableOpt({
                        url: "exercisescheme/selfevaluationtasks/list/{curPage}/{pageSize}",
                        //状态 0:未提交,1:待签名,2:已提交
                        defaultFilterValue : {"criteria.intsValue.status":["1","0","2"]},  // 过滤的参数
                        columns: [
                            // LIB.tableMgr.ksColumn.code,
                            {
                                title: "姓名",
                                fieldName: "user.name",
                            },{
                                title: "岗位",
                                fieldName: "name",
                                render: function (data) {
                                    if (data.user && data.user.positionList) {
                                        var posNames = "";
                                        data.user.positionList.forEach(function (e) {
                                            if (e.postType == 0 && e.name) {
                                                posNames += (e.name + ",");
                                            }
                                        });
                                        posNames = posNames.substr(0, posNames.length - 1);
                                        return posNames;
                                    }
                                },
                            }, {
                                title: "部门",
                                fieldName: "name",
                                render:function (data) {
                                    return  LIB.getDataDic('org', data.orgId).deptName
                                }
                            }, {
                                title: "公司",
                                fieldName: "name",
                                render:function (data) {
                                    return  LIB.getDataDic('org', data.orgId).compName
                                }
                            }, {
                                title: "提交时间",
                                fieldName: "submitTime",
                                render:function (data) {
                                    if(data.submitTime){
                                        return (data.submitTime + '').substr(0,16);
                                    }
                                    return '';
                                }
                            }, {
                                title: "",
                                fieldName: "",
                                render:function (data) {
                                    if(data.status == '1' || data.status == '2'){
                                        return "<a>查看</a>"
                                    }else{
                                        return '';
                                    }

                                }
                            },
                        ]
                    }),
                },
                selectModel: {
                },
                formModel : {
                },
                // 0:未提交,1:待签名,2:已提交
                status:[{id:["0","1","2"], name:"全部"},{id:["2"], name:"已提交"},{id:["1"], name:"待签名"},{id:["0"], name:"未提交"}],
                statusIndex:0,
                dialogModel:{
                    selfEvaluationDetail:{
                        visible:false
                    }
                },
                mainModel:{
                    vo:null
                }
            };
        },

        methods:{
            doChangeStatus:function (val) {
                this.statusIndex = val;
                var params = [
                    {
                        value : {
                            columnFilterName : "criteria.intsValue.status",
                            columnFilterValue :  this.status[this.statusIndex].id,
                        },
                        type : "save"
                    },

                ];
                this.$refs.selfevaluationtaskTable.doQueryByFilter(params);
            },
            getOperateTime:function (val) {
                var str  = (val + "").substr(0, 16);
                return str;
            },

            onClickRow:function (data) {
                  if(parseInt(data.entry.data.status)>0){
                      this.mainModel.vo = data.entry.data;
                      this.$refs.selfEvaluation._init(this.mainModel.vo.id);
                      this.dialogModel.selfEvaluationDetail.visible = true;
                  }
            },

            // 获取任务
            getSelfTask:function () {
                var _this = this;
                api.getSelfTaskId({id:this.vo.id, selfEvaluatorId:LIB.user.id}).then(function (res) {
                    _this.$refs.selfEvaluation.selfInit(res.data);
                    _this.dialogModel.selfEvaluationDetail.visible = true;
                });
            },

            //    获取文件
            _init:function (val) {
                this.$refs.selfevaluationtaskTable.doClearData();
                this.$refs.selfevaluationtaskTable.doQuery({id : this.vo.id});

                if(val){
                    // 打开详情框
                    this.getSelfTask();
                }
            },

            doClose:function () {
                this.visible = false;
            },
            doShowCargoPoint:function () {
                this.selectModel.cargoPointSelectModel.filterData.id = this.id;
                this.selectModel.cargoPointSelectModel.visible = true;
            },

            getUUId:function () {
                api.getUUID().then(function(res){
                    var group={};
                    group.id = res.data;

                });
            },
        },
        init: function(){
            this.$api = api;
        }

    });

    return detail;
});