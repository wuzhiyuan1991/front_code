/**
 * Created by yyt on 2017/1/4.
 */

define(function(require) {

    var Vue = require("vue");
    var iButton = require("../../iviewButton");
    //import iButton from '../../button/button.vue';
    var template = '<div :class="[prefixCls + /'-confirm/']"> '+
                    '<span :class="timeClasses" v-if="showTime" @click="handleToggleTime"> '+
                    '<template v-if="isTime">选择日期</template> '+
                    '<template v-else>选择时间</template> '+
                    '</span> '+
                    '<i-button size="small" type="text" @click="handleClear">清空</i-button> '+
                    '<i-button size="small" type="primary" @click="handleSuccess">确定</i-button> '+
                    '</div>';

    var prefixCls = 'ivu-picker';

    var opts = {
        template :  template,
        components: { iButton:iButton },
        props: {
            showTime: false,
            isTime: false,
            timeDisabled: false
        },
        data :function() {
            return {
                prefixCls: prefixCls
            };
        },

        computed: {
            timeClasses :function() {
                var obj = {};
                obj[prefixCls + '-confirm-time-disabled'] = this.timeDisabled;
                return [prefixCls, obj];
                //return {
                //    [`${prefixCls}-confirm-time-disabled`]: this.timeDisabled
                //};
            }
        },
        methods: {
            handleClear :function() {
                this.$emit('on-pick-clear');
            },
            handleSuccess :function() {
                this.$emit('on-pick-success');
            },
            handleToggleTime :function() {
                if (this.timeDisabled) return;
                this.$emit('on-pick-toggle-time');
            }
        }
    };

    var component = Vue.extend(opts);
    return component;

});
