define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var template = require("text!./contactPtw.html");
    var modalForm = require("./modalForm");
    // var model = require("../../model");
    var api = require("../../../workCard/vuex/api");
    var workardApi = require("../../../workCard/vuex/api");
    return Vue.extend({
        template: template,
        components: {
            modalForm: modalForm,
        },
        props: {
            ptwWorkCard:Object,//作页票
        },
        data: function () {
            return {
                title:"已关联的作业票",
                load:false,
                visible:false,
                tableModel: {
                    contactPTW: LIB.Opts.extendDetailTableOpt({
                        columns: [
                            {
                                title: "序号",
                                fieldType: "sequence",
                                width: 70,
                            },
                            {
                                title:"作业类型",
                                render:function(data){
                                    if(data){
                                        return data.workCatalog?data.workCatalog.name+(data.workLevel?data.workLevel.name:''):"";
                                    }

                                },
                            },
                            {
                                fieldType: "custom",
                                title: "作业票",
                                render:function (data) {
                                    if(data.relCard){
                                        // return "<a>"+data.code+"（"+ data.workContent +"）</a>"
                                        var routerPart="/html/main.html#!/ptw/businessCenter/ptwRecord?method=detail&id=";
                                        var content=data.relCard&&data.relCard.code?(data.relCard.code+"("+data.relCard.workContent +")"):"";
                                        return "<a target='_blank' href='"+routerPart+data.relCard.id+"'>"+content+"</a>";
                                    }
                                    return "";
                                },
                                tipRender:function (data) {
                                    var content=data.relCard&&data.relCard.code?(data.relCard.code+"("+data.relCard.workContent +")"):"";
                                    return content;
                                }

                            },
                            {
                                title: "",
                                fieldType: "tool",
                                toolType: "edit,del"
                            }],
                        values: [],
                        showEmptyRow: true,
                    }),
                },
            }
        },
        created: function () {
            // var _this = this;
            //this.loadData();
        },
        methods: {
            init:function(model){
                if(model){this.ptwWorkCard=model}
                this.loadData();
                this.visible=true;
            },
            loadData:function () {
                var _this=this;
                api.queryWorkCardRelations({id:this.ptwWorkCard.id}).then(function (res) {
                    _this.tableModel.contactPTW.values = res.data;
                })
            },
            doAdd: function () {
                this.$refs.dialogForm.init("add",this.ptwWorkCard.id);
            },
            doIsEdit:function (row) {
                return;
                if(row.cell && row.cell.colId == 2){
                    this.doEdit(row);
                }
            },
            doEdit: function (item) {
                // var _data=_.extend(model.mrsEquipment(),item.entry.data);
                var data = JSON.parse(JSON.stringify(item.entry.data));
                this.$refs.dialogForm.init("edit",data.workCardId,data);
            },
            doDel: function (item) {
                item = item.entry.data;
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        workardApi.removeWorkCardRelations({id: _this.ptwWorkCard.id}, [{id: item.id}]).then(function () {
                            LIB.Msg.success("删除成功");
                            _this.saveAfter();
                        })
                    }
                });
            },
            saveAfter: function () {
                this.loadData();
                this.$emit("on-success");
                // this.loadPipe();
            }
        },
        watch: {
            visible: function (val) {
                if (val && !this.load) {
                    this.load = true;
                }
                else{
                    this.load=false;
                }
            }
        }
    })
})