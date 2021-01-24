define(function (require) {

    var LIB = require('lib');
    var template = '<div class="ivu-input-customize"><iv-input show-title :icon="icon" :show-tip="showTip" display-type="popselect" :value="displayValue" :placeholder="placeholder"  @click.stop="doClick" :textonly="textonly" readonly :disabled="disabled"></iv-input>' +
        ' <Icon type="ios-close" class="ivu-input-customize-ico"  v-show="showCloseIcon" @click.stop="doClearInput"></Icon></div>'
    var opts = {
        template: template,
        data: function () {
            return {};
        },
        props: {
            value: {
                type: Object,
                required: true
            },
            displayFunc:{
                type:Function,
                default:null
            },
            displayField: {
                type: String,
                default: "name"
            },
            idField: {
                type: String,
                default: "name"
            },
            disabled: {
                type: Boolean,
                default: false
            },
            textonly: {
                type: Boolean,
                default: false
            },
            //外抛出去用来控制删除按钮是否显示
            clearable: {
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
                default: LIB.lang('gb.common.pleaseSelect')
            }
        },
        computed: {
            displayValue: function () {
                if(this.displayFunc){
                    return this.displayFunc(this.value);
                }
                return _.property(this.displayField)(this.value);
            },
            showCloseIcon: function () {
                //判断input 是否有值 是否在编辑状态  clearable 是否需要删除按钮显示
                return this.displayValue && !this.textonly && this.clearable;
            },
        },
        methods: {
            doClick: function () {
                if (!this.disabled) {
                    this.$emit("click");
                }
            },
            doClearInput: function () {
                this.value[this.displayField] = null;
                this.value[this.idField] = null;
                this.$emit("do-clear-input");
            }
        },
        ready: function () {
        }
    }

    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('input-select', component);
});