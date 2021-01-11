/**
 * Created by yyt on 2017/1/4.
 */

define(function(require) {

    var Vue = require("vue");
    var deepCopy = require('../../utils/assist').deepCopy;
    //import { deepCopy } from '../../../utils/assist';

    var template =  '<div :class="classes" @click.stop="handleClick"> '+
                    '<span :class="getCellCls(cell)" v-for="cell in cells"><em :index="$index">{{ cell.text }}</em></span>'+
                    '</div>';
    var prefixCls = 'ivu-date-picker-cells';
    var opts = {
        template:template,
        props: {
            date: {},
            year: {},
            disabledDate: {},
            selectionMode: {
                default: 'year'
            }
        },
        computed: {
            classes :function() {
                return [prefixCls, prefixCls+'-year'];
                //return [
                //    `${prefixCls}`,
                //    `${prefixCls}-year`
                //];
            },
            startYear:function() {
                return Math.floor(this.year / 10) * 10;
            },
            cells :function() {
                var cells = [];
                var cell_tmpl = {
                    text: '',
                    selected: false,
                    disabled: false
                };
                for (var i = 0; i < 10; i++) {
                    var cell = deepCopy(cell_tmpl);
                    cell.text = this.startYear + i;
                    var date = new Date(this.date);
                    date.setFullYear(cell.text);
                    cell.disabled = typeof this.disabledDate === 'function' && this.disabledDate(date) && this.selectionMode === 'year';
                    cell.selected = Number(this.year) === cell.text;
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
            nextTenYear :function() {
                this.$emit('on-pick', Number(this.year) + 10, false);
            },
            prevTenYear :function() {
                this.$emit('on-pick', Number(this.year) - 10, false);
            },
            handleClick :function(event) {
                var target = event.target;
                if (target.tagName === 'EM') {
                    var cell = this.cells[parseInt(event.target.getAttribute('index'))];
                    if (cell.disabled) return;
                    this.$emit('on-pick', cell.text);
                }
                this.$emit('on-pick-click');
            }
        }
    };

    var component = Vue.extend(opts);
    return component;

});
