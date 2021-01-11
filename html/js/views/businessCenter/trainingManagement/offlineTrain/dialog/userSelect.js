define(function(require) {
    var LIB = require('lib');
    var template = require("text!./userSelect.html");

    var initDataModel = function() {
        return {
            mainModel: {
                model: {
                    type: [Array, Object],
                    default: ''
                },
                title: '选择人员'
            },
            treeModel: {
                data: [],
                selectedData: [],
                keyword: '',
                filterData: { id: '' },
                showLoading: false
            },
            tableModel: {
                url: "trainplan/users/latesttrainlist{/curPage}{/pageSize}",
                selectedDatas: [],
                keyword: '',
                columns: [
                    {
                        fieldType: "cb"
                    },
                    {
                        title : "姓名",
                        fieldName : "username",
                        width : 100
                    },
                    {
                        title : "所属公司",
                        fieldType : "custom",
                        render: function(data){
                            if(data.compId){
                                return LIB.getDataDic("org", data.compId)["compName"];
                            }
                        },
                        width : 150
                    },
                    {
                        title : "所属部门",
                        fieldType : "custom",
                        render: function(data){
                            if(data.orgId){
                                return LIB.getDataDic("org", data.orgId)["deptName"];
                            }
                        },
                        width : 100
                    },
                    {
                        title:"岗位",
                        fieldType:"custom",
                        render: function(data){
                            if(data.positionList){
                                var posNames = "";
                                data.positionList.forEach(function (e) {
                                    if(e.postType == 0){
                                        posNames += (e.name + "/");
                                    }
                                });
                                posNames = posNames.substr(0, posNames.length - 1);
                                return posNames;

                            }
                        },
                        width : 100
                    },
                    {
                        title:"安全角色",
                        fieldType:"custom",
                        render: function(data){
                            if(data.positionList){
                                var roleNames = "";
                                data.positionList.forEach(function (e) {
                                    if(e.postType === '1'){
                                        roleNames += (e.name + "/");
                                    }
                                });
                                roleNames = roleNames.substr(0, roleNames.length - 1);
                                return roleNames;

                            }
                        },
                        width : 100
                    },
                    {
                        //title : "任务类型",
                        title:"任务类型",
                        fieldType : "custom",
                        render : function(data){
                            return LIB.getDataDic("train_task_type",data.source);
                        },
                        width : 130
                    },
                    {
                        title:"培训状态",
                        fieldType : "custom",
                        render : function(data){
                            return LIB.getDataDic("train_task_status",data.status);
                        },
                        width : 100
                    }
                ],
                filterColumn:["criteria.strValue.selectUserWord"],
                defaultFilterValue : {
                    "criteria.orderValue": {
                        fieldName: "modifyDate",
                        orderType: "1"
                    },
                    "criteria.intValue.hasPassed": 0,
                    "criteria.strValue.selectFlag": "trainplan"
                },
                resetTriggerFlag:false,
                type: [],
                status: []
            },
            statusList: null,
            typesList: null
        }
    };

    var opts = {
        mixins: [LIB.VueMixin.dataDic],
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
            courseId: {
                type: String,
                required: true
            },
            orgId: {
                type: String,
                default: ''
            }
        },
        data: initDataModel,
        methods: {
            doTreeNodeClick: function(obj) {
                if (obj.data.id === this.treeModel.filterData.id) return;
                this.treeModel.filterData.id = obj.data.id;
                this.filterTreeType = obj.data.type;

                this.doFilter();
            },
            onDbClickCell: function(data) {
                if(this.isSingleSelect) {
                    this.$emit('do-save', data.entry.data);
                    this.visible = false;
                }
            },
            doSave: function() {
                if (this.tableModel.selectedDatas.length === 0) {
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
            doFilterRight: function() {
                this.doFilter();
            },
            init: function() {

                var isNeedRefreshData = false;
                if (this.orgListVersion != window.allClassificationOrgListVersion) {
                    this.orgListVersion = window.allClassificationOrgListVersion;
                    isNeedRefreshData = true;
                } else if (_.isEmpty(this.treeModel.data)) {
                    isNeedRefreshData = true;
                }
                if (isNeedRefreshData) {
                    //触发treeModel.data数据变化的事件， 必需先设置为空数据组
                    this.treeModel.data = [];
                    // 增加树加载提示
                    if (LIB.setting.orgList.length > 300) {
                        this.treeModel.showLoading = true;
                        var _this = this;
                        //延迟防止卡顿
                        var intervalId = setTimeout(function() {
                            _this.treeModel.data = LIB.setting.orgList;
                            clearTimeout(intervalId);
                            _this.treeModel.showLoading = false;
                        }, 300);
                    } else {
                        this.treeModel.data = LIB.setting.orgList;
                    }
                } else {
                    // 还原树组件状态
                    this.$nextTick(function() {
                        this.$els.mtree.scrollTop = 0;
                    });
                    this.treeModel.selectedData = [];
                }
            },
            initData: function () {
                this.params = [
                    {
                        type: 'save',
                        value: {
                            columnFilterName: 'course.id',
                            columnFilterValue: this.courseId
                        }
                    }
                ];
                var params = [];
                if(this.orgId) {
                    params = [
                        {
                            type: 'save',
                            value: {
                                columnFilterName: 'orgId',
                                columnFilterValue: this.orgId
                            }
                        }
                    ]
                }
                params = params.concat(this.params);
                this.$refs.table.doCleanRefresh(params);
            },
            doFilter: function () {
                var params = [
                    {
                        type: 'save',
                        value: {
                            columnFilterName: 'orgId',
                            columnFilterValue: this.treeModel.filterData.id
                        }
                    }
                ];

                if(this.tableModel.keyword) {
                    params.push({
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: { selectUserWord: this.tableModel.keyword }
                        }
                    })
                }

                if(this.tableModel.type) {
                    params.push({
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.longsValue',
                            columnFilterValue: {source:this.tableModel.type}
                        }
                    })
                }
                if(this.tableModel.status) {
                    params.push({
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.intsValue',
                            columnFilterValue: {status:this.tableModel.status}
                        }
                    })
                }

                params = params.concat(this.params);
                this.$refs.table.doCleanRefresh(params);
            },
            doSelectFilter: function () {
                if(this.visible) {
                    this.doFilter();
                }
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    // this.queryCompanyData();
                    this.init();
                    this.treeModel.filterData.id = this.orgId;
                    this.initData();
                } else {
                    this.treeModel.keyword = "";
                    this.tableModel.keyword = "";
                    this.tableModel.type = [];
                    this.tableModel.status = [];
                }
            }
        },
        created: function() {
            this.orgListVersion = 1;
            this.statusList = _.filter(this.getDataDicList('train_task_status'), function (item) {
                return item.id !== '0' && item.id !== '5';
            });
            this.typesList = this.getDataDicList('train_task_type');
        }
    };
    var component = LIB.Vue.extend(opts);
    return component;
})
