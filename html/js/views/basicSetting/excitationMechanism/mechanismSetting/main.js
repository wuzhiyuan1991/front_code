define(function (require) {
    var LIB = require('lib');
    var API = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));

    var dangerComponent = require("./dialog/danger");
    var trainComponent = require("./dialog/train");

    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        components: {
            dangerComponent: dangerComponent,
            trainComponent: trainComponent
        },
        computed: {
            type: function () {
                var path = this.$route.path;
                if(_.startsWith(path, '/trainingManagement') || _.includes(path, '/trainingManagement')) {
                    return 'train'
                }
                if(_.startsWith(path, '/hiddenDanger') || _.includes(path, '/hiddenDanger') || _.startsWith(path, '/randomInspection')) {
                    return 'danger'
                }
            }
        },
        data: function () {
            return {
                // type: 'danger',
                compId: ''
            }
        },
        methods: {
            //组织结构切换获取公司id
            doOrgCategoryChange: function (obj) {
                this.compId = obj.nodeId;
                // this.getConfs({compId: obj.nodeId});
            },
            doChangeType: function (type) {
                this.type = type;
            }
        },
        ready: function () {
            // if (this.$refs.categorySelector) {
            //     this.$refs.categorySelector.$on("on-org-change", this.doOrgCategoryChange);
            // }
        },
        attached: function () {
            this.disabled = LIB.authMixin.methods.hasPermission('1060002002');
        }
    });
    return vm;
});