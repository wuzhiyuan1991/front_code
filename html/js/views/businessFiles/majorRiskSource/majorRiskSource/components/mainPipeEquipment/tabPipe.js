define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var template = require("text!./tabPipe.html");
    var modalForm = require("../dialog/modalFormPipe");
    var model = require("../../model");
    var api = require("../../vuex/api");
    return Vue.extend({
        template: template,
        components: {
            modalForm: modalForm,
        },
        props: {
            data: [Array, Object],
            model: Object,
        },
        data: function () {
            return {
                tableModel: {
                    pipe: LIB.Opts.extendDetailTableOpt({
                        columns: [
                            {
                                title: "序号",
                                fieldType: "sequence",
                                width: 70,
                            },
                            {
                                title: "管道名称",
                                fieldName: "name",
                            },
                            {
                                title: "数量",
                                fieldName: "quantity",
                                width:60,
                            },
                            {
                                title: "工程直径",
                                fieldName: "nominalDiameter",
                                width:100,
                            },
                            {
                                title: "工程壁厚",
                                fieldName: "wallThickness",
                                width:100,
                            },
                            {
                                title: "管道材质",
                                fieldName: "pipingMaterial",
                            },
                            {
                                title: "储存介质",
                                fieldName: "storageMedium",
                            },
                            {
                                title: "所属部门",
                                fieldType: "custom",
                                render:function (data) {
                                    return  LIB.getDataDic('org', data.orgId)['deptName']
                                }
                            },
                            {
                                title: "属地",
                                fieldName: "dominationArea.name",
                            },
                            {
                                title: "",
                                fieldType: "tool",
                                toolType: "move,edit,del"
                            }],
                        values: [],
                    }),
                },
            }
        },
        created: function () {
            // var _this = this;
            // this.loadPipe();
        },
        methods: {
            loadPipe:function () {
                var _this=this;
                api.queryMrsEquipments(this.model.id,"2").then(function (res) {
                    //_this.mainModel.componentData.pipe=res.data||[];
                    _this.tableModel.pipe.values = res.data;
                })
            },
            doAdd: function () {
                this.$refs.dialogForm.init("add", model.mrsEquipment({type: "2", mrsId: this.model.id}))
            },
            doEdit: function (item) {
                var _data=_.extend(model.mrsEquipment(),item.entry.data);
                var data = JSON.parse(JSON.stringify(_data));
                this.$refs.dialogForm.init("edit", data);
            },
            doDel: function (item) {
                item = item.entry.data;
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeMrsEquipments({id: _this.model.id}, [{id: item.id}]).then(function () {
                            LIB.Msg.success("删除成功");
                            _this.saveAfter();
                        })
                    }
                });
            },
            doMove: function (item) {
                var _this = this;
                var data = item.entry.data;
                var param = {
                    id: data.id
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                api.moveMrsEquipments({id: _this.model.id}, param).then(function () {
                    LIB.Msg.success("移动成功");
                    _this.saveAfter();

                });
            },
            saveAfter: function () {
                this.$parent.$parent.$parent.$parent.loadPipe();
               // this.loadPipe();
            }
        },
        watch: {
            'model.id':function (val) {
                console.log(val);
                if(val){
                    this.loadPipe();
                }
            }
        }
    })
})