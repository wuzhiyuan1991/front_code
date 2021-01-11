define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = require("text!./modalSafeAttachment.html");
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
                load: false,
                rules: {
                    "name": [LIB.formRuleMgr.require("名称"), LIB.formRuleMgr.length(100)],
                    "quantity": [LIB.formRuleMgr.require("数量")].concat(LIB.formRuleMgr.range(1)),
                },
                typeName:{
                    add:"新增",
                    edit:"修改",
                },
                type:"",
                parentData:null,
            }
        },
        computed: {},
        methods: {
            show: function (title) {
                this.title = title;
                this.visible = true;
            },
            init: function (type,model,parentData) {
                this.model = model;
                this.type=type;
                this.title=this.typeName[type];
                this.visible = true;
                this.parentData=parentData;
            },
            doSave: _.debounce(function () {
                var _this=this;
                this.$refs.form.validate(function (vali) {
                    if(vali){
                        var apiFun=_this.type==="add"?api.saveEquipmentItem: api.updateEquipmentItem;
                        apiFun({id:_this.model.parentId||_this.parentData.id},_this.model).then(function () {
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
        created: function () {

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