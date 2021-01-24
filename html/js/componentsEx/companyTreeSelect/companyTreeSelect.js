define(function (require) {

    var LIB = require('lib');

    var template = '<iv-tree-select ' +
        ':model.sync="id"' +
        ':list="data"' +
        ':placement="placement"'+
        'id-attr="id"' +
        ':placeholder="placeholder"' +
        'display-attr="name"' +
        ':disabled="disabled">' +
        '<iv-tree  :model="treeData"' +
        ':selected-datas.sync="selectedDatas4Tree"' +
        ':serch-filterable="serchFilterable"' +
        'id-attr="id"' +
        'pid-attr="parentId"' +
        'display-attr="name"' +
        '@on-tree-node-click="doTreeNodeClick"'+
        ':single-select="true"' +
        ':show-checkbox="showCheckbox"' +
        ':allow-parent-checked="true">' +
        '</iv-tree>' +
        '</iv-tree-select> ';

    var opts = {
        template: template,
        props: {
            placement: {
                type: String,
                default: 'bottom-start'
            },
            id: {
                type: [String, Number, Array],
                default: ''
            },
            data: {
                type: [Array],
                default: null
            },
            selectedDatas: {
                type: [Array],
            },
            disabled: {
                type: Boolean,
                default: false
            },
            //是否显示checkbox
            showCheckbox: {
                type: Boolean,
                default: true
            },
            //是否显示搜索
            serchFilterable: {
                type: Boolean,
                default: true
            },
            //这个是用来做监听的时候防止无效请求
            perId: {
                type: String,
                default: ""
            },
            placeholder: {
                type: String,
                default: LIB.lang('bs.bac.sp.psc')
            }
        },
        watch: {
            id: function (val) {
                this.selectedDatas4Tree = [];
                //清空选中的树
                if (val) {
                    this.selectedDatas4Tree.push({"id": this.id});
                }
            },
            "selectedDatas4Tree": function (nVal, oVal) {
                var nId = _.get(nVal, '[0].id');
                var oId = _.get(oVal, '[0].id');
                if (oId !== nId) {
                    window.changeMarkObj.hasCompChanged = true;
                    // 防止没有部门组件，标志位不会重置
                    setTimeout(function () {
                        window.changeMarkObj.hasCompChanged = false;
                    }, 500)
                }
            }
        },
        data: function () {
            return {
                selectedDatas4Tree: [],
                treeData: null
            }
        },
        methods: {
            doTreeNodeClick:function(data){
                this.$emit('on-tree-click',data.data)
            }
        },
        created: function () {
            this.orgListVersion = 1;
        },
        attached: function () {
            //attached会被调用多次,使用lazyFunc
            // this.queryOnServerLazyFunc(this);
            //待后台传递了数据权限到前台后开启此优化
            var isNeedRefreshData = false;
            if (this.orgListVersion != window.allClassificationOrgListVersion) {
                this.orgListVersion = window.allClassificationOrgListVersion;
                isNeedRefreshData = true;
            } else if (!this.data) {
                isNeedRefreshData = true;
            }
            if (isNeedRefreshData) {

                this.data = _.filter(LIB.setting.orgList, function (item) {
                    return item.type == "1";
                });
                this.treeData = _.filter(this.data, function (item) {
                    return item.disable !='1'
                });
            }

            this.selectedDatas4Tree = [];
            this.selectedDatas4Tree.push({"id": this.id});
        },
        ready: function () {
            if (this.id) {
               
                this.selectedDatas = [];
                this.selectedDatas.push({"id": this.id});
            }
        }
    };
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('company-tree-select', component);

});