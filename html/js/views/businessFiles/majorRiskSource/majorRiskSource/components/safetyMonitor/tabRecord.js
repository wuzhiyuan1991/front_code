define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var template = require("text!./tabRecord.html");
    var model = require("../../model");
    var api = require("../../vuex/api");
    var dialogForm=require("../dialog/modelFormRecord");
    var baseInfo=require("./tabInfo");
    return Vue.extend({
        template: template,
        props: {
            mrsEquipmentType:{
                type:Array,
                default:function () {
                    // return ["1","2"]
                    return ["1"];
                }
            },
            isSafetyMonitor:{
                type:Boolean,
                default:false,
            },
            data: [Array, Object],
            model: Object,//父组件传过来的model
        },
        components:{
            dialogForm: dialogForm,
            baseInfo:baseInfo,
        },
        computed: {
            currentTab: function () {
                return this.tab.data[this.tab.currentIndex];
            }
        },
        data: function () {
            var _this=this;
            return {
                tab: {
                    data: [{name:"基本信息",phase:"info"},{name: '维护保养', phase: "2",}, {name: '检修抢修', phase: "1"}, {name: '检验检测', phase: "3"}],
                    currentIndex: 0
                },
                tableModel: {
                    maintain: LIB.Opts.extendDetailTableOpt({
                        url: "majorrisksource/mrsequipmaintrecords/list/{curPage}/{pageSize}",
                        lazyLoad:false,
                        defaultFilterValue: {
                            "id":_this.model.id,
                            "criteria.intsValue.phase": ["2"],
                            "criteria.intsValue.mrsEquipmentType": _this.mrsEquipmentType
                        },  //
                        columns: [
                            {
                                title: "序号",
                                fieldType: "sequence",
                                width: 70,
                            },
                            // {
                            //     title: "设备/管道",
                            //     fieldName: "mrsEquipmentType",
                            //     visible:!this.isSafetyMonitor,
                            //     fieldType: "custom",
                            //     render:function (data) {
                            //         return  model.enum.mrsEquipmentType[data.mrsEquipmentType];
                            //     }
                            // },
                            {
                                title: "名称",
                                fieldName: "mrsEquipment.name",
                            },
                            {
                                title: "保养时间",
                                fieldName: "operateTime",
                                fieldType: "custom",
                                render:function (data) {
                                    return  data.operateTime?data.operateTime.substr(0,10):'';
                                }
                            },
                            {
                                title: "作业类别",
                                fieldName: "operationType",
                                fieldType: "custom",
                                render:function (data) {
                                    return  model.enum.operationType[data.operationType];
                                }
                            },
                            {
                                title: "作业数量",
                                fieldName: "quantity",
                            },
                            {
                                title: "操作人员",
                                fieldName: "operators",
                            },
                            {
                                title: "作业内容",
                                fieldName: "operationContent",
                            },
                            {
                                title: "",
                                fieldType: "tool",
                                toolType: "edit,del"
                            }],
                    }),
                    rushRepair: LIB.Opts.extendDetailTableOpt({
                        url: "majorrisksource/mrsequipmaintrecords/list/{curPage}/{pageSize}",
                        lazyLoad:false,
                        defaultFilterValue: {
                            "id":_this.model.id,
                            "criteria.intsValue.phase": ["1"],
                            "criteria.intsValue.mrsEquipmentType": _this.mrsEquipmentType
                        },  //
                        columns: [
                            {
                                title: "序号",
                                fieldType: "sequence",
                                width: 70,
                            },
                            // {
                            //     title: "设备/管道",
                            //     fieldName: "mrsEquipmentType",
                            //     fieldType: "custom",
                            //     visible:!this.isSafetyMonitor,
                            //     render:function (data) {
                            //         return  model.enum.mrsEquipmentType[data.mrsEquipmentType];
                            //     }
                            // },

                            {
                                title: "名称",
                                fieldName: "mrsEquipment.name",
                            },
                            {
                                title: "维修时间",
                                fieldName: "operateTime",
                                fieldType: "custom",
                                render:function (data) {
                                    return  data.operateTime?data.operateTime.substr(0,10):'';
                                }
                            },
                            {
                                title: "作业类别",
                                fieldName: "operationType",
                                fieldType: "custom",
                                render:function (data) {
                                    return  model.enum.operationType[data.operationType];
                                }
                            },
                            {
                                title: "作业数量",
                                fieldName: "quantity",
                            },
                            {
                                title: "操作人员",
                                fieldName: "operators",
                            },
                            {
                                title: "作业内容",
                                fieldName: "operationContent",
                            },
                            {
                                title: "",
                                fieldType: "tool",
                                toolType: "edit,del"
                            }],
                        values: [],
                    }),
                    check: LIB.Opts.extendDetailTableOpt({
                        url: "majorrisksource/mrsequipmaintrecords/list/{curPage}/{pageSize}",
                        lazyLoad:false,
                        defaultFilterValue: {
                            "id":_this.model.id,
                            "criteria.intsValue.phase": ["3"],
                            "criteria.intsValue.mrsEquipmentType": _this.mrsEquipmentType,
                        },  //
                        columns: [
                            {
                                title: "序号",
                                fieldType: "sequence",
                                width: 70,
                            },
                            // {
                            //     title: "设备/管道",
                            //     fieldName: "mrsEquipmentType",
                            //     fieldType: "custom",
                            //     visible:!this.isSafetyMonitor,
                            //     render:function (data) {
                            //         return  model.enum.mrsEquipmentType[data.mrsEquipmentType];
                            //     }
                            // },
                            {
                                title: "名称",
                                fieldName: "mrsEquipment.name",
                            },
                            {
                                title: "时间",
                                fieldName: "operateTime",
                                fieldType: "custom",
                                render:function (data) {
                                    return  data.operateTime?data.operateTime.substr(0,10):'';
                                }
                            },
                            {
                                title: "数量",
                                fieldName: "quantity",
                            },
                            {
                                title: "检验检测机构",
                                fieldName: "inspectOrgan",
                            },
                            {
                                title: "检验检测人员",
                                fieldName: "operators",
                            },
                            {
                                title: "检验检测内容",
                                fieldName: "operationContent",
                            },
                            {
                                title: "检测结果",
                                fieldType: "custom",
                                render:function (data) {
                                    return  model.enum.checkResult[data.attr1];
                                }

                            },
                            {
                                title: "",
                                fieldType: "tool",
                                toolType: "edit,del"
                            }],
                        values: [],
                    })
                }

            }
        },
        methods: {
            loadMaintain: function () {
                // if
                // _this.$refs.mainTableMaintain.doQuery({id: this.model.id});
                //                 //作业阶段 1:检修抢修,2:维护保养,3:检验检测
                this.$refs.mainTableMaintain.doRefresh();
            },
            loadRushRepair: function () {
                this.$refs.mainTableRushRepair.doRefresh();
            },
            loadCheck: function () {
                this.$refs.mainTableCheck.doRefresh();
            },
            doAdd: function () {
                var phase = this.currentTab.phase;
                //var mrsEquipmentType=this.isSafetyMonitor?"3":"1";
                this.$refs.dialogForm.init("add", model.mrsEquipMaintRecord({
                    phase: phase,
                    mrsId:this.model.id,
                    majorRiskSource:{id:this.model.id,name:this.model.name},
                    mrsEquipmentType:this.mrsEquipmentType[0]||"1",
                }),this.model)

            },
            doEdit: function (item) {
                var  data=item.entry.data;
                var _this=this;
                api.queryMrsEquipMaintRecord({id:this.model.id,mrsequipmaintrecordId:data.id}).then(function (res) {
                    _this.$refs.dialogForm.init("edit",res.data,_this.model);
                })

            },
            doDel: function (item) {
                item=item.entry.data;
                var _this=this;
                LIB.Modal.confirm({
                    title: '是否确认删除此条数据?',
                    onOk: function() {
                        api.removeMrsEquipMaintRecords({id:_this.model.id},[{id:item.id}]).then(function () {
                            LIB.Msg.success("删除成功");
                            _this.saveAfter();
                        })
                    }
                });
            },
            saveAfter: function () {
                var loadFuns ={
                    '2':'loadMaintain',
                    '1':'loadRushRepair',
                    '3':'loadCheck'
                };
                var loadFun = loadFuns[this.currentTab.phase];
                this[loadFun]();
            }
        },
        created: function () {
            var _this = this;
            this.$nextTick(function () {

            });
        }


    })
});