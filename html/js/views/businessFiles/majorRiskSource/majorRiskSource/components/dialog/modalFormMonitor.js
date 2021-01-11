define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = require("text!./modalFormMonitor.html");
    var api = require("../../vuex/api");
    return Vue.extend({
        template: template,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        components: {},
        props: {
            visible: Boolean,
            model: Object,
            title: String,
        },
        data: function () {
            return {
                type:"",
                typeName:{
                    add:"新增",
                    edit:"修改",
                },
                load: false,
                rules: {
                    "name": [LIB.formRuleMgr.require("名称"), LIB.formRuleMgr.length(30)],
                    "quantity": [LIB.formRuleMgr.require("数量")].concat(LIB.formRuleMgr.range(1)),

                },
            }
        },
        computed: {},
        methods: {
            show: function (title) {
                this.title = title;
                this.visible = true;
            },
            init: function (type,model) {
                this.model = model;
                this.type=type;
                this.title=this.typeName[type];
                this.visible = true;
            },
            doSave: _.debounce(function () {
                var _this=this;
                this.$refs.form.validate(function (vali) {
                    if(vali){
                        var apiFun=_this.type==="add"?api.saveMrsEquipment: api.updateMrsEquipment;
                        apiFun({id:_this.$parent.model.id},_this.model).then(function () {
                            LIB.Msg.success("保存成功",1);
                            _this.$emit("on-success",_this.model);
                            _this.visible=false;
                        })
                    }
                })
            }, 300),
            doCancel: function () {
                this.visible = false;
            }
        },
        watch: {
            visible: function (val) {
                if (val && !this.load) {
                    this.load = true;
                }
            }
        }
    })
})