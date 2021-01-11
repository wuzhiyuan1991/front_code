define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = require("text!./equipmentModal.html");
    var api = require("../../vuex/api");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
    return Vue.extend({
        template: template,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        components: {
            dominationAreaSelectModal:dominationAreaSelectModal,
        },
        props: {
            visible: Boolean,
            model: Object,
            title: String,
        },
        data: function () {
            return {
                load: false,
                type:"",//edit,add模式
                typeName:{
                    add:"新增",
                    edit:"修改",
                },
                rules: {
                    "name": [LIB.formRuleMgr.require("名称"), LIB.formRuleMgr.length(100)],
                    "quantity": [LIB.formRuleMgr.require("数量")].concat(LIB.formRuleMgr.range(1)),
                    "specification": [LIB.formRuleMgr.length(100)],
                    "storageMedium": [LIB.formRuleMgr.length(100)],
                    "manufacturer": [LIB.formRuleMgr.length(100)],
                    "orgId": [{required:true,message:"请选择所属部门"}],
                    "dominationAreaId":[{required:true,message:"请选择属地"}],
                },
                selectModel:{
                    dominationAreaSelectModel: {
                        visible: false,
                        filterData: {'dominationArea.id': null}
                    }
                }
            }
        },
        computed: {},
        methods: {
            doShowDominationAreaSelectModal:function(){
                if(!this.model.orgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.selectModel.dominationAreaSelectModel.visible = true;
                this.selectModel.dominationAreaSelectModel.filterData = {orgId :this.model.orgId};
            },
            doSaveDominationArea:function(selectedDatas){
                if (selectedDatas) {
                    this.model.dominationArea = selectedDatas[0];
                    this.model.dominationAreaId=selectedDatas[0].id;
                }
            },
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
            _resoveModel:function() {
                    if(this.model.majorRiskSource&&this.model.majorRiskSource.dominationArea){
                        delete this.model.majorRiskSource.dominationArea;
                       // this.model.majorRiskSource.dominationArea={id: this.model.majorRiskSource.dominationArea.id}
                    }
                    return this.model;
            },
            doSave: _.debounce(function () {
                var _this=this;
                this.$refs.form.validate(function (vali) {
                    if(vali){
                        var apiFun=_this.type==="add"?api.saveMrsEquipment: api.updateMrsEquipment;
                        apiFun({id:_this.$parent.model.id},_this._resoveModel()).then(function () {
                            LIB.Msg.success("保存成功",1);
                            _this.$emit("on-success",_this.model,_this.type);
                            _this.visible=false;
                        })
                    }
                })
            }, 100),
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
                else{
                    this.load=false;
                }
            }
        }
    })
})