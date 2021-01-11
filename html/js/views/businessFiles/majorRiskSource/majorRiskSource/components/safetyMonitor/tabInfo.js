define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var template = require("text!./tabInfo.html");
    var modalForm = require("../dialog/modalFormMonitor");
    var model = require("../../model");
    var api = require("../../vuex/api");
    return Vue.extend({
        template: template,
        components: {
            modalForm: modalForm,
        },
        props: {
            // data: [Array, Object],
            model: Object,
        },
        data: function () {
            return {
                tableModel: {
                    info: LIB.Opts.extendDetailTableOpt({
                        lazyLoad:true,
                        columns: [
                            {
                                title: "序号",
                                fieldType: "sequence",
                                width: 70,
                            },
                            {
                                title: "名称",
                                fieldName: "name",
                            },
                            {
                                title: "数量",
                                fieldName: "quantity",
                            },
                            {
                                title: "生产厂家",
                                fieldName: "manufacturer",
                            },
                            {
                                title: "出厂日期",
                                fieldName: "productionDate",
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
            this.loadMonitor()
        },
        methods: {
            loadMonitor: function () {
                var _this = this;
                api.queryMrsEquipments(this.model.id, "3").then(function (res) {
                    _this.tableModel.info.values=res.data||[];
                })
            },
            doAdd: function () {
                this.$refs.dialogForm.init("add", model.mrsEquipment({type: "3", mrsId: this.model.id}))
            },
            doEdit: function (item) {
                var data = JSON.parse(JSON.stringify(item.entry.data));
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
                this.loadMonitor();
            }
        }
    })
})