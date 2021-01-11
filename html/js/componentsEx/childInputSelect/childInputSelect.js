define(function (require) {

    var LIB = require('lib');
    var template =
        '<div class="ivu-input-customize">' +
        '<iv-input :icon="icon" :show-tip="showTip" display-type="popselect" :value="displayValue" :placeholder="placeholder" @click.stop="doClick" :textonly="textonly" readonly :disabled="isDisabled"></iv-input>' +
        '<Icon type="ios-close" class="ivu-input-customize-ico" v-show="showCloseIcon" @click.stop="doClearInput"></Icon>' +
        '</div>';
    var opts = {
        template: template,
        data: function () {
            return {};
        },
        props: {
            value: {
                type: [Object, Array],
                required: true
            },
            displayField: {
                type: String,
                default: "name"
            },
            idField: {
                type: String,
                default: "id"
            },
            disabled: {
                type: Boolean,
                default: false
            },
            textonly: {
                type: Boolean,
                default: false
            },
            //是否显示title
            showTip: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            cascadeId: { // 所属上级的id，当该值变化后，需要执行清空操作
                type: String,
                default: ''
            },
            // 是否显示清除图标
            cleanable: {
                type: Boolean,
                default: false
            },
            // 是否禁用的最高级别判断
            noDisabled: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'dominationArea'
            }
        },
        computed: {
            displayValue: function () {
                if(_.isArray(this.value)){
                    return _.pluck(this.value, this.displayField).join(",")
                }
                return _.get(this.value, this.displayField);
            },
            isDisabled: function () {
                return !this.noDisabled && (this.disabled || !this.cascadeId);
            },
            showCloseIcon: function () {
                return this.displayValue && this.cleanable && !this.textonly && !this.isDisabled;
            }
        },
        watch: {
            "cascadeId": function (nVal, oVal) {
                //属地模式下，如果cascadeId是公司，则
                if(nVal && this.type === 'dominationArea') {
                    var org = LIB.getDataDic("org", nVal);
                    if(org.t == "1") {
                        this.cascadeId = null;
                    }
                }
                // 所属部门变化，需要清空属地
                // 当旧值为真的时候，需要清空
                if(oVal && window.changeMarkObj.hasDeptChanged && this.type === 'dominationArea') {
                    this._clean();
                    window.changeMarkObj.hasDeptChanged = false;
                    window.changeMarkObj.hasDominationAreaChanged = true;
                    setTimeout(function () {
                        window.changeMarkObj.hasDominationAreaChanged = false;
                    }, 500)
                }
                else if (oVal && window.changeMarkObj.hasDominationAreaChanged && this.type === 'checkObject') {
                    this._clean();
                    window.changeMarkObj.hasDominationAreaChanged = false;
                }
            }
        },
        methods: {
            doClick: function () {
                if(!this.isDisabled) {
                    this.$emit("click");
                }
            },
            doClearInput: function () {
                if (this.type === 'dominationArea') {
                    window.changeMarkObj.hasDominationAreaChanged = true;
                    setTimeout(function () {
                        window.changeMarkObj.hasDominationAreaChanged = false;
                    }, 500)
                }
                this._clean();
                this.$emit("do-clear-input");
            },
            _clean: function () {
                this.value[this.displayField] = null;
                this.value[this.idField] = null;
            }
        }
    };

    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('cascade-input-select', component);
});