/**
 * Created by yyt on 2017/1/4.
 */


define(function(require) {
    //import { deepCopy } from '../../../utils/assist';
    var Vue = require("vue");
    var deepCopy = require('../../utils/assist').deepCopy;
    var template =  '<div :class="classes" @click.stop="handleClick"> '+
                    '<span :class="getCellCls(cell)" v-for="cell in cells"><em :index="$index">{{ cell.text }}月</em></span>'+
                    '</div>';

    var prefixCls = 'ivu-date-picker-cells';
    var opts = {
        template :  template,
        props: {
            date: {},
            month: {
                type: Number
            },
            disabledDate: {},
            selectionMode: {
                default: 'month'
            }
        },
        computed: {
            classes :function() {
                return [prefixCls, prefixCls+'-month'];
                //return [
                //    `${prefixCls}`,
                //    `${prefixCls}-month`
                //];
            },
            cells :function() {
                var cells = [];
                var cell_tmpl = {
                    text: '',
                    selected: false,
                    disabled: false
                };
                for (var i = 0; i < 12; i++) {
                    var cell = deepCopy(cell_tmpl);
                    cell.text = i + 1;
                    var date = new Date(this.date);
                    date.setMonth(i);
                    cell.disabled = typeof this.disabledDate === 'function' && this.disabledDate(date)  && this.selectionMode === 'month';
                    cell.selected = Number(this.month) === i;
                    cells.push(cell);
                }
                return cells;
            }
        },
        methods: {
            getCellCls :function(cell) {
                var obj = {};
                obj[prefixCls + '-cell-selected'] = cell.selected;
                obj[prefixCls + '-cell-disabled'] = cell.disabled;
                return [prefixCls+'-cell', obj];
                //return [
                //    `${prefixCls}-cell`,
                //    {
                //        [`${prefixCls}-cell-selected`]: cell.selected,
                //        [`${prefixCls}-cell-disabled`]: cell.disabled
                //    }
                //];
            },
            handleClick :function(event) {
                var target = event.target;
                if (target.tagName === 'EM') {
                    var index = parseInt(event.target.getAttribute('index'));
                    var cell = this.cells[index];
                    if (cell.disabled) return;
                    this.$emit('on-pick', index);
                }
                this.$emit('on-pick-click');
            }
        }
    };

    var component = Vue.extend(opts);
    return component;

});
