define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./documentSelectModal.html"));



    var initDataModel = function () {
        return {
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
            },
            paths: null,
            documents: null,
            fileId: '',
            docTypes: [
                {
                    id: null,
                    name: '文件库'
                }
            ]
        };
    };

    var vm = LIB.VueEx.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        data: initDataModel,
        components: {
        },
        watch: {
            visible: function (val) {
                if (val) {
                    this._init();
                }
            }
        },
        methods: {
            close: function () {
                this.visible = false;
            },
            doSave: function () {
                var ret = _.filter(this._cacheDocuments, function (item) {
                    return item.isChecked && item.type === '2';
                });
                this.$emit("do-save", ret);
            },
            checkboxVisible: function (doc) {
                if (doc.type === '1') {
                    return {
                        visibility: 'hidden'
                    }
                }
            },
            doClickCheckbox: function (doc) {
                doc.isChecked = !doc.isChecked;
            },
            // 获取卡包数据，并缓存
            _getDocuments: function (params) {
                var _this = this;
                this._cacheDocuments = null;
                api.list(params).then(function (res) {
                    _this._cacheDocuments = _.map(res.data.list, function (item) {
                        return {
                            id: item.id,
                            name: item.name,
                            parentId: item.parentId,
                            isChecked: false,
                            type: item.type,
                            fileId: item.fileId,
                            orderNo: item.orderNo,
                            ext: item.type === '1' ? 'folder' : item.attr1
                        }
                    });
                    _this._filterByParentId();
                })
            },

            // 点击文件夹或者票卡
            doClickFolder: function (folder) {
                if (folder.type === '1') {
                    this.paths.push({id: folder.id, name: folder.name});
                    this._filterByParentId();
                } else if (folder.type === '2') {
                    folder.isChecked = !folder.isChecked;
                    this._selected.push(folder.id);
                }
            },
            // 点击面包屑导航项
            doClickBreadItem: function (index, path) {
                this.paths = this.paths.slice(0, index + 1);
                this._filterByParentId();
            },
            // 初始化
            _init: function () {
                this._selected = [];
                this.paths = [];
                this.paths.push(this.docTypes[0]);
                this._getDocuments();
            },
            // 根据parentId过滤需要显示的列表
            _filterByParentId: function () {
                // 缓存当前活动路径， 方便保存文件夹或者票卡是获取parentId
                this.checkPath = _.last(this.paths);
                var parentId = _.get(this.checkPath, "id");

                var documents = _.filter(this._cacheDocuments, function (item) {
                    return parentId ? item.parentId === parentId : !item.parentId;
                });
                documents = _.sortBy(documents, function (item) {
                    return parseInt(item.orderNo);
                });

                this.documents = documents;
            }
        },
        events: {
        },
        init: function(){
            this.$api = api;
        }
    });

    return vm;
});
