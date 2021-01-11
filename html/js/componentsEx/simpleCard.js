define(function (require) {

    var Vue = require("vue");


    var template = '<div :class="classes">' +
        '<div :class="headClasses" v-if="showHead" v-el:head>' +
            '<slot name="title"></slot>' +
            '<div :class="extraClasses" v-if="showExtra" v-el:extra>' +
                '<div class="simple-card-input-box" v-if="filter && filterWhen">' +
                    '<iv-input v-show="showInput" icon="ios-search" placeholder="请输入" cleanable @on-remove="doFilter" :value.sync="filterKey" @on-click="doFilter" @on-enter="doFilter"></iv-input>' +
                    '<a href="javascript:void(0);" @click="toggleInput"><Icon :type="icon"></Icon>{{text}}</a>' +
                '</div>' +
                '<slot name="extra"></slot>' +
            '</div>' +
        '</div>' +
        '<div :class="bodyClasses" :transition="transitionName" v-show="showContent"><slot></slot></div>' +
    '</div>';


    var prefixCls = 'simple-card';
//	var additionPrefixCls = 'simple-card';

    var opts = {
        template: template,
        props: {
            bordered: {
                type: Boolean,
                'default': false
            },
            disHover: {
                type: Boolean,
                'default': true
            },
            shadow: {
                type: Boolean,
                'default': false
            },
            showContent: {
                type: Boolean,
                'default': true
            },
            filter: {
                type: Boolean,
                default: false
            },
            filterWhen: {
                type: Boolean,
                default: false
            },
            customFilter: {
                type: Boolean,
                default: false
            },
            shouldInitFilter: {
                type: Boolean,
                default: true
            },
            transitionName: {
                type: String,
                default: ''
            }
        },
        data: function data() {
            return {
                showHead: true,
                showExtra: true,
                filterKey: '',
                showInput: false
            }
        },
        computed: {
            classes: function classes() {
                var oot = {};
                oot[prefixCls + '-bordered'] = this.bordered && !this.shadow;
                oot[prefixCls + '-dis-hover'] = this.disHover || this.shadow;
                oot[prefixCls + '-shadow'] = this.shadow;
                return [
                    prefixCls, oot
                ]
            },
            headClasses: function headClasses() {
                return prefixCls + '-head';
            },
            extraClasses: function extraClasses() {
                return prefixCls + '-extra';
            },
            bodyClasses: function bodyClasses() {
                return prefixCls + '-body';
            },
            icon: function () {
                return this.showInput ? 'power' : 'ios-search';
            },
            text: function () {
                return this.showInput ? '折叠' : '搜索';
            }
        },
        methods: {
            doFilter: function () {
                if(this.customFilter) {
                    this.$emit('do-filter', this.filterKey);
                    return;
                }
                // this.$emit('do-filter', this.filterKey);
                this.tableChild.filterKey = this.filterKey;
                this.tableChild.doFilter();
            },
            toggleInput: function () {
                this.showInput = !this.showInput;
                if(this.showInput === false) {
                    this.filterKey = '';
                    this.doFilter();
                }
            },
            initFilter: function () {
                this.filterKey = '';
                this.showInput = false;
                if(this.shouldInitFilter && this.filterWhen) {
                    this.doFilter();
                }
            }
        },
        ready: function () {
            // 获取子组件中的table组件，用于table组件关键字搜索过滤
            if(this.filter) {
                this.tableChild = _.find(this.$children, function (child) {
                    return child.$el.classList.contains('table-panel');
                });
            }
        },
        compiled: function compiled() {
            this.showHead = this.$els.head.innerHTML != '';
            this.showExtra = this.$els.extra.innerHTML != '';
        },
        events: {
            'init-card-filter': function () {
                if(this.filter) {
                    this.initFilter();
                }
            }
        }
    };


    var component = Vue.extend(opts);
    Vue.component('simple-card', component);

});