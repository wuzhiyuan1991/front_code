define(function (require) {

    var LIB = require('lib');
    var tpl = require("text!./expertSupport.html");
    var checkMethodSelectModal = require("componentsEx/selectTableModal/checkMethodSelectModal");
    var accidentCaseSelectModal = require("componentsEx/selectTableModal/accidentCaseSelectModal");
    // var checkBasisSelectModal = require("componentsEx/selectTableModal/checkBasisSelectModal");
    var checkBasisSelectModal = require("componentsEx/checkBasisSelectModal/checkBasisSelectModal");
    var api = require("../vuex/api");
    var initDataModel = function () {
        return {
            mainModel: {
                title: "添加检查依据",
                selectedDatas: []
            },
            tableModel: {
                checkMethodTableModel: {
                    url: "checkitem/checkmethods/list/{curPage}/{pageSize}",
                    columns: [
                        // {
                        // 	title : "编码",
                        // 	fieldName : "code"
                        // },
                        {
                            title: "方法名称",
                            fieldName: "name",
                            width: 200,
                        },
                        {
                            title: "内容",
                            fieldName: "content",
                        },
                        {
                            title: "",
                            fieldType: "tool",
                            toolType: "del"
                        }
                    ]
                },
                checkAccidentTableModel: {
                    url: "checkitem/checkmethods/list/{curPage}/{pageSize}",
                    columns: [
                        // {
                        // title : "编码",
                        // fieldName : "code"
                        // },
                        {
                            title: "事故案例名称",
                            fieldName: "name",
                            width: 200,
                        },
                        {
                            title: "内容说明",
                            fieldName: "content",
                        },
                        {
                            title: "",
                            fieldType: "tool",
                            toolType: "del"
                        }
                    ]
                },
                checkBasisTableModel: {
                    url: "checkitem/legalregulations/list/{curPage}/{pageSize}",
                    columns: [
                        {
                            title: "检查依据分类",
                            fieldType: "custom",
                            width: 300,
                            render: function (data) {
                                if (data.attr4) {
                                    return data.attr4;
                                }

                            }

                        },
                        {
                            title: "章节名称",
                            width: 300,
                            fieldName: "name"

                        },
                        
                        {
                            title: "",
                            fieldType: "tool",
                            toolType: "del"
                        }
                    ],
                },
                checkAccidentcaseTableModel: {
                    url: "checkitem/accidentcases/list/{curPage}/{pageSize}",
                },
            },
            selectModel: {
                checkMethodSelectModel: {
                    visible: false
                },
                accidentCaseSelectModel: {
                    visible: false
                },
                checkBasisSelectModel: {
                    visible: false
                },
            },
            index: 1,

        };
    }

    var opts = {
        template: tpl,
        data: function () {
            var data = initDataModel();
            return data;
        },
        components: {
            "checkmethodSelectModal": checkMethodSelectModal,
            "accidentCaseSelectModal": accidentCaseSelectModal,
            "checkBasisSelectModal": checkBasisSelectModal,
        },
        watch: {
            visible: function (val) {
                if (val) {
                    this.index = 1
                    this.$refs.checkmethodTable.doQuery({ id: this.data.id });
                    this.$refs.checkbasisTable.doQuery({ id: this.data.id });
                    this.$refs.checkaccidentcaseTable.doQuery({ id: this.data.id });
                }
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default: {}
            }
        },
        computed: {
            checkMethod: function () {
                return this.$refs.checkmethodTable.pageModel.totalSize
            },
            checkBasis: function () {
                return this.$refs.checkbasisTable.pageModel.totalSize
            },
            checkAccident: function () {
                return this.$refs.checkaccidentcaseTable.pageModel.totalSize
            },

        },
        methods: {
            doShowCheckMethodSelectModel: function (param) {
                this.selectModel.checkMethodSelectModel.visible = true;
            },
            doShowAccidentCaseSelectModel: function (param) {
                this.selectModel.accidentCaseSelectModel.visible = true;
            },
            doShowCheckBasisSelectModel: function (param) {
                this.selectModel.checkBasisSelectModel.visible = true;
            },
            doLiClick: function (val) {
                this.index = val
            },
            doSave: function () {
                this.$emit('do-save')
            },
            doSaveCheckMethods: function (selectedDatas) {
                if (selectedDatas) {
                    var _this = this;
                    api.saveCheckMethods({ id: this.data.id }, selectedDatas).then(function () {
                        _this.$refs.checkmethodTable.doQuery({ id: _this.data.id });
                    });
                }
            },
            doSaveCheckBasis: function (selectedDatas) {
                if (selectedDatas) {
                    var _this = this;
                    var param = _.map(selectedDatas, function (data) {
                        return {
                          id: data.id
                        }
                      });
                    api.saveLegalregulations({ id: this.data.id }, param).then(function () {
                        _this.$refs.checkbasisTable.doQuery({ id: _this.data.id });
                    });
                }
            },
            doSaveAccident: function (selectedDatas) {
                if (selectedDatas) {
                    var _this = this;
                    api.saveAccident({ id: this.data.id }, selectedDatas).then(function () {
                        _this.$refs.checkaccidentcaseTable.doQuery({ id: _this.data.id });

                    });
                }
            },
            delCheckMethod: function (item) {
                var _this = this;
                var data = item.entry.data;
                api.removeCheckMethods({ id: this.data.id }, [{ id: data.id }]).then(function (res) {
                    _this.$refs.checkmethodTable.doRefresh();
                });
            },
            delCheckBasis: function (item) {
                var _this = this;
                var data = item.entry.data;
                api.removeCheckBasis({ id: this.data.id }, [{ id: data.id }]).then(function (res1) {
                    _this.$refs.checkbasisTable.doRefresh();
                });
            },
            delAccidentCase: function (item) {
                var _this = this;
                var data = item.entry.data;
                api.removeAccidentCase({ id: this.data.id }, [{ id: data.id }]).then(function (res2) {
                    _this.$refs.checkaccidentcaseTable.doRefresh();
                });
            },
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
    //	var component = LIB.Vue.extend(opts);
    //	LIB.Vue.component('checkplan-select-modal', component);
});