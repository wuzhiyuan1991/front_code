/**
 * Created by yyt on 2016/11/8.
 */

define(function(require) {

    var Vue = require("vue");

    var template =  '<div :class="classes">'+
                    '<slot></slot>'+
                    '</div>';
    var prefixCls = 'ivu-radio-group';

    var opt = {
        template : template,
        props: {
            model: {
                type: [String, Number],
                default: ''
            },
            size: {
                validator: function validator(value) {
                    return (0, _assist.oneOf)(value, ['small', 'large']);
                }
            },
            type: {
                validator: function validator(value) {
                    return (0, _assist.oneOf)(value, ['button']);
                }
            }
        },
        data: function data() {
            return {
                selected: false,
                group: false
            };
        },
        components: function components(){ Radio, RadioGroup, Icon },
        computed: {
            classes: function classes() {
                var obj ={};
                obj[prefixCls+this.size]=!!this.size,
                obj[prefixCls+this.type]=!!this.type
                return [prefixCls,obj]
            //        `${prefixCls}`,
            //{
            //    [`${prefixCls}-${this.size}`]: !!this.size,
            //    [`${prefixCls}-${this.type}`]: !!this.type
            //}

            }
        },
        compiled: function compiled() {
            this.updateModel();
        },
        methods: {
            updateModel: function updateModel() {
                var model = this.model;
                this.$children.forEach(function (child) {
                    child.selected = model == child.value;
                    child.group = true;
                });
            },
            change: function change(data) {
                this.model = data.value;
                this.updateModel();
                this.$emit('on-change', data.value);
            }
        },
        watch: {
            model: function model() {
                this.updateModel();
            }
        }
    };


    var component = Vue.extend(opt);
    Vue.component('iv-radio-group', component);
    Vue.component('Radio-group', component);
});






