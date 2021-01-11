define(function(require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    var template = require("text!./addQuestionModal.html");

    var initDataModel = function() {
        return {
            mainModel: {
                model: {
                    type: [Array, Object],
                    default: ''
                },
                title: '选择试题'
            },
            treeModel: {
                data: [],
                selectedDatas: [],
                keyword: '',
                filterData: { id: '' },
                showLoading: false,
            },
            tableModel: (
                {
                    url: "question/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    keyword: '',
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                        {
                            //唯一标识
                            title: "编码",
                            fieldName: "code",
                            width: 160
                        },
                        {
                            //试题内容
                            title: "试题内容",
                            fieldName: "content",
                            width: 320
                        },
                        {
                            //正确选项
                            title: "正确选项",
                            fieldName: "answer",
                            width: 100
                        },
                        _.extend(_.omit(LIB.tableMgr.column.company, "filterType"), {width: 200}),
                    ],

                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
                    resetTriggerFlag:false
                }
            ),
            isCacheSelectedData: true
        }
    };


    var opts = {
        template: template,
        name: "memberSelectModal",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            isSingleSelect: {
                type: Boolean,
                default: false
            },
            filterData: {
                type: Object
            },
            courseId: {
                type: String,
                default: ''
            }
        },
        data: initDataModel,
        methods: {
            doTreeNodeClick: function(obj) {
                this.doFilterPositionAndRole();
            },
            onDbClickCell: function(data) {
                if(this.isSingleSelect) {
                    this.$emit('do-save', data.entry.data);
                    this.visible = false;
                }
            },
            doSave: function() {
                if(this.tableModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.visible = false;
                if(this.isSingleSelect) {
                    this.$emit('do-save', this.tableModel.selectedDatas[0]);
                }else {
                    this.$emit('do-save', this.tableModel.selectedDatas);
                }
            },
            doFilterLeft: function(val) {
                this.treeModel.keyword = val;

            },

            doFilterPositionAndRole: function() {
                var filterId = _.map(this.treeModel.selectedDatas, function (item) { return item.id });
                var filters = {};

                if (filterId.length > 0) {
                    if (filterId[0]  === '-100') { // 知识点ID为0时查询全部试题
                        filters = this.getTableFilterParamValue();
                    } else {
                        filters = this.getTableFilterParamValue(filterId);
                    }
                } else {
                    // this.treeModel.selectedDatas = [{id: '0'}];
                    filters = this.getTableFilterParamValue();
                }


                this.$refs.table.doCleanRefresh(filters);
            },
            getTableFilterParamValue: function (filterId) {
                var tableFilterDatas = [];
                var strsObj;
                var filterData = _.clone(this.filterData);
                var ids = _.pluck(this.treeModel.data, "id");

                var strObj = {keyWordValue: this.tableModel.keyword};

                // 如果选择了知识点，参数为知识点ID
                // 如果未选择知识点：如果选择了课程，参数为该课程所有知识点ID，如果没有选择课程，则不传知识点ID
                if (filterId) {
                    strsObj = {examPointIds: filterId}
                } else {
                    if (this.courseId && !this.noExamPoint) {
                        strsObj = {examPointIds: ids}
                    } else {
                        strsObj = {examPointIds: null}
                    }
                }

                if(filterData) {
                    // 当filterData中strValue和strsValue字段为空时 设置默认值
                    if (strObj && !filterData['criteria.strValue']) {
                        filterData['criteria.strValue'] = {};
                    }
                    if (strsObj && !filterData['criteria.strsValue']) {
                        filterData['criteria.strsValue'] = {};
                    }

                    for(var key in filterData) {
                        var value = filterData[key];

                        if (strObj && key === 'criteria.strValue') value = _.assign(value, strObj);
                        else if (strsObj && key === 'criteria.strsValue') value = _.assign(value, strsObj);

                        if(value != null && value.toString().trim() !== "" ) {
                            var tableFilterData = {
                                type :　"save",
                                value : {
                                    columnFilterName : key,
                                    columnFilterValue : value
                                }
                            };
                            tableFilterDatas.push(tableFilterData);
                        }
                    }
                }
                return tableFilterDatas;
            },
            _getExamPoint: function () {
                var _this = this;
                api.queryExampoint().then(function (resp) {
                    _this.treeModel.showLoading = false;
                    // 增加全部试题筛选
                    var treeList = [{
                        id: '-100',
                        name: '全部试题'
                    }];
                    _this.treeModel.selectedDatas = [{id: '-100'}];
                    treeList = treeList.concat(resp.body);
                    _this.treeModel.data = treeList;
                   _this._afterGetExamPoint();
                })
            },
            _getExamPointByCourseId: function () {
                var _this = this;
                api.queryExamPointByCourseId({id: this.courseId}).then(function (res) {
                    var list = res.data.list;
                    if (_.isEmpty(list)) {
                        _this.noExamPoint = true;
                        _this._getExamPoint();
                        return;
                    }
                    _this.treeModel.showLoading = false;
                    var treeList = [{
                        id: '-100',
                        name: '全部试题'
                    }];
                    _this.treeModel.selectedDatas = [{id: '-100'}];
                    treeList = treeList.concat(list);
                    _this.treeModel.data = treeList;
                    _this._afterGetExamPoint();
                })
            },
            _afterGetExamPoint: function () {
                var filters = this.getTableFilterParamValue();
                this.$refs.table.doCleanRefresh(filters);
            },
            init: function() {
                this.$nextTick(function() {
                    this.$els.mtree.scrollTop = 0;
                });
                this.treeModel.showLoading = true;
                if (this.courseId) {
                    this._getExamPointByCourseId();
                } else {
                    this._getExamPoint();
                }
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    this.init();
                } else {
                    this.treeModel.keyword = "";
                    this.tableModel.keyword = "";
                    this.tableModel.excludeIds = [];
                }
            }
        },
        created: function() {
            this.orgListVersion = 1;
            if(this.isSingleSelect) {
                this.isCacheSelectedData = false;
            } else {
                this.isCacheSelectedData = true;
            }
        }
    };
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('add-question-modal', component);
});
