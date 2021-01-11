/**
 * Created by yyt on 2017/1/4.
 */

define(function(require) {

    var Vue = require("vue");
    var prefixCls = 'ivu-picker-panel';
    var datePrefixCls = 'ivu-date-picker';
    var opts = {
        methods: {
            iconBtnCls :function(direction) {
                var  type = '';
                return [prefixCls+'-icon-btn',
                        datePrefixCls+'-'+direction+'-btn',
                        datePrefixCls+'-'+direction+'-btn-arrow'+type];
                //return [
                //    `${prefixCls}-icon-btn`,
                //    `${datePrefixCls}-${direction}-btn`,
                //    `${datePrefixCls}-${direction}-btn-arrow${type}`,
                //];
            },
            handleShortcutClick :function(shortcut) {
                if (shortcut.value) this.$emit('on-pick', shortcut.value());
                if (shortcut.onClick) shortcut.onClick(this);
            },
            handlePickClear :function() {
                this.$emit('on-pick-clear');
            },
            handlePickSuccess :function() {
                this.$emit('on-pick-success');
            },
            handlePickClick :function() {
                this.$emit('on-pick-click');
            }
        }
    };

    return opts;

});
