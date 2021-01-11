/**
 * Created by yyt on 2016/10/25.
 */

/**
 * Created by yyt on 2016/10/25.
 */
define(function(require) {

    var Vue = require("vue");

    var template =     '<div :class="classes">'+
        '<slot></slot>'+
        '</div>';
    var prefixCls = 'ivu-checkbox-group';

    var opt = {
        template : template,
        props: {
            model: {
                type: Array,
                default: []
            },
            'addclasses':{
                type:String
            }
        },
        data : function () {
            return {
                isChildrenSelected:false
            }
        },
        computed: {
            classes: function() {
                return ['' + prefixCls,this.addclasses];
            }
        },
        
        compiled: function() {
            this.updateModel(true);
        },
        
        ready: function ready() {
            if (!this.group) {
                this.updateModel();
            }
        },

        methods: {
            updateModel: function(update) {
                var model = this.model;

                this.$children.forEach(function (child) {
                    child.model = model;

                    if (update) {
                        child.selected = model.indexOf(child.value) >= 0;
                        child.group = true;
                        this.isChildrenSelected = true;
                    }
                });
            },
            change: function change(data) {
                this.model = data;
                this.$emit('on-change', data);
            }
        },
        watch: {
            model: function(val, oldVal) {
                if (val == oldVal && this.isChildrenSelected) {
                    this.updateModel();
                } else {
                    this.updateModel(true);
                }
            }
        }
    };


    var component = Vue.extend(opt);
    Vue.component('iv-checkbox-group', component);
    return component;
});




