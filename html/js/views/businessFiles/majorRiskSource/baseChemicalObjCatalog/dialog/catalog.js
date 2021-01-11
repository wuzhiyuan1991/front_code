define(function (require) {

    var LIB = require('lib');
    var api = require("../vuex/api");
    var template = require('text!./catalog.html');

    var opts = {
        template: template,
        props: {
            id: {
                type: String,
                default: ''
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
            },
            _getCatalogs: _.debounce(function () {
                var _this = this;
                api.listCheckObjectCatalogClassify().then(function (res) {
                    _this.catalogs = res.data;
                });
            }, 100)
        },
        created: function () {
            this.orgListVersion = 1;
        },
        attached: function () {
            this._getCatalogs();
        },
        ready: function () {
            if (this.id) {
                this.selectedDatas = [];
                this.selectedDatas.push({id: this.id});
            }
        }
    };
    var component = LIB.Vue.extend(opts);
    return component
});