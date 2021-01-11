define(function (require) {

    var LIB = require('lib');
    var api = require("../vuex/api");
    var template = require('text!./catalogSelect.html');

    var opts = {
        template: template,
        props: {
            id: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: '260'
            },
            list: {
                type: Array,
                default: function () {
                    return []
                }
            },
            displayFunc: {
                type: Function,
                default: function () {

                }
            }
        },
        computed: {
            styleObj: function () {
                return {
                    width: this.width + 'px'
                }
            }
        },
        data: function () {
            return {
                catalogs: [],
                selectedDatas: []
            }
        },
        watch: {
            id: function (val) {
                //2928 重复新增的时候 清楚掉选中的数据
                this.selectedDatas = [];
                //清空选中的树
                if (val) {
                    this.selectedDatas.push({id: val});
                }
            }
        },
        methods: {
            onSingleChange: function (data) {
                this.$emit('on-change', data);
            }
        },
        created: function () {
            this.orgListVersion = 1;
        },
        attached: function () {

        },
        ready: function () {
            var _this = this;
            if (this.id) {
                this.selectedDatas = [];
                this.selectedDatas.push({id: this.id});
            }
        }
    };
    var component = LIB.Vue.extend(opts);
    return component
});