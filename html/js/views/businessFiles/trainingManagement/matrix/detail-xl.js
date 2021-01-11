define(function (require) {
    var Vue = require("vue");
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");
    var positionSelectModal = require("componentsEx/positionTreeSelectModal/main");

    //Vue数据
    var dataModel = {
        mainModel: {
            type: '',
            vo: {}
        },
        tableModel: {
            countModel: {
                columns: [
                    {
                        title: "总人数",
                        fieldName: "total"
                    }, {
                        title: "已通过",
                        fieldName: "pass"
                    }, {
                        title: "等待复培",
                        fieldName: "repeat"
                    }, {
                        title: "未通过",
                        fieldName: "fail"
                    }, {
                        title: "培训中",
                        fieldName: "training"
                    }, {
                        title: "等待开始",
                        fieldName: "wait"
                    }, {
                        title: "未培训",
                        fieldName: "untrained"
                    }
                ],
                values: []
            },
            courseModel: {
                url: '',
                columns: [
                    {
                        title: '课程名称',
                        fieldName: 'courseName',
                        width: 160
                    },
                    {
                        title: '所属公司',
                        fieldName: 'compId',
                        render: function (data) {
                            if (data.compId) {
                                return LIB.getDataDic("org", data.compId)["compName"];
                            }
                        },
                        width: 140
                    },
                    {
                        title: '课程类型',
                        fieldName: 'courseCategory',
                        width: 160
                    },
                    {
                        title: '培训方式',
                        fieldName: 'courseType',
                        width: 90,
                        render: function (data) {
                            return LIB.getDataDic("course_type", data.courseType)
                        }
                    },
                    {
                        title: '培训期限',
                        fieldName: 'period',
                        render: function (data) {
                            if(data.courseType == 1 && data.period) {
                                return data.period + "天"
                            }
                        },
                        width: 90
                    },
                    {
                        title: '复培周期',
                        fieldName: 'frequence',
                        render: function (data) {
                            if(data.frequence) {
                                var d = parseInt(data.frequence);
                                if(d === 0) {
                                    return '-'
                                }
                                return d + "个月"
                            }
                        },
                        width: 90
                    },
                    {
                        title: '总人数',
                        fieldName: 'total',
                        width: 80
                    },
                    {
                        title: '已通过',
                        fieldName: 'pass',
                        width: 80
                    },
                    {
                        title: '等待复培',
                        fieldName: 'repeat',
                        width: 90
                    },
                    {
                        title: '未通过',
                        fieldName: 'fail',
                        width: 80
                    },
                    {
                        title: '培训中',
                        fieldName: 'training',
                        width: 80
                    },
                    {
                        title: '等待开始',
                        fieldName: 'wait',
                        width: 90
                    }, {
                        title: "未培训",
                        fieldName: "untrained",
                        width: 80
                    },
                    {
                        title: '',
                        showTip: false,
                        render: function (data) {
                            return '<span class="tableCustomIco_Edit" style="margin-left: 0;"><i class="ivu-icon ivu-icon-edit"></i></span><span class="tableCustomIco_Del"><i class="ivu-icon ivu-icon-trash-a"></i></span>'
                        }
                    }
                ],
                values: []
            },
            positionModel: {
                values: [],
                columns: [
                    {
                        title: '岗位',
                        fieldName: 'positionName',
                        width: 160
                    },
                    {
                        title: '部门',
                        fieldName: 'orgId',
                        render: function (data) {
                            if (data.orgId) {
                                return LIB.getDataDic("org", data.orgId)["deptName"];
                            }
                        },
                        width: 180
                    },
                    {
                        title: '所属公司',
                        fieldName: 'compId',
                        render: function (data) {
                            if (data.compId) {
                                return LIB.getDataDic("org", data.compId)["compName"];
                            }
                        },
                        width: 180
                    },
                    {
                        title: '培训期限',
                        fieldName: 'period',
                        render: function (data) {
                            if(data.period) {
                                return data.period + "天"
                            }
                        }
                    },
                    {
                        title: '复培周期',
                        fieldName: 'frequence',
                        render: function (data) {
                            if(data.frequence) {
                                var d = parseInt(data.frequence);
                                if(d === 0) {
                                    return '-'
                                }
                                return d + "个月"
                            }
                        }
                    },
                    {
                        title: '总人数',
                        fieldName: 'total'
                    },
                    {
                        title: '已通过',
                        fieldName: 'pass'
                    },
                    {
                        title: '等待复培',
                        fieldName: 'repeat'
                    },
                    {
                        title: '未通过',
                        fieldName: 'fail'
                    },
                    {
                        title: '培训中',
                        fieldName: 'training'
                    },
                    {
                        title: '等待开始',
                        fieldName: 'wait'
                    }, {
                        title: "未培训",
                        fieldName: "untrained",
                    },
                    {
                        title:'',
                        showTip: false,
                        render: function (data) {
                            return '<span class="tableCustomIco_Edit"><i class="ivu-icon ivu-icon-edit"></i></span><span class="tableCustomIco_Del"><i class="ivu-icon ivu-icon-trash-a"></i></span>'
                        }
                    }
                ]
            },
            roleModel: {
                values: [],
                columns: [
                    {
                        title: '安全角色',
                        fieldName: 'positionName'
                    },
                    {
                        title: '所属公司',
                        fieldName: 'compId',
                        render: function (data) {
                            if (data.compId) {
                                return LIB.getDataDic("org", data.compId)["compName"];
                            }
                        },
                        width: 180
                    },
                    {
                        title: '培训期限',
                        fieldName: 'period',
                        render: function (data) {
                            if(data.period) {
                                return data.period + "天"
                            }
                        }
                    },
                    {
                        title: '复培周期',
                        fieldName: 'frequence',
                        render: function (data) {
                            if(data.frequence) {
                                var d = parseInt(data.frequence);
                                if(d === 0) {
                                    return '-'
                                }
                                return d + "个月"
                            }
                        }
                    },
                    {
                        title: '总人数',
                        fieldName: 'total'
                    },
                    {
                        title: '已通过',
                        fieldName: 'pass'
                    },
                    {
                        title: '等待复培',
                        fieldName: 'repeat'
                    },
                    {
                        title: '未通过',
                        fieldName: 'fail'
                    },
                    {
                        title: '培训中',
                        fieldName: 'training'
                    },
                    {
                        title: '等待开始',
                        fieldName: 'wait'
                    }, {
                        title: "未培训",
                        fieldName: "untrained"
                    },
                    {
                        title:'',
                        showTip: false,
                        render: function (data) {
                            return '<span class="tableCustomIco_Edit hse_edit"><i class="ivu-icon ivu-icon-edit"></i></span><span class="tableCustomIco_Del"><i class="ivu-icon ivu-icon-trash-a"></i></span>'
                        }
                    }
                ]
            }
        },
        editModel: {
            show: false,
            title: "修改培训设置",
            vo: {
                id: '',
                frequence: '',
                period: '',
                course: {id :'', name: '', type: ''},
                position: {id :'', name: ''}
            }
        },
        selectModel: {
            courseSelectModel : {
                visible : false,
                filterData : {orgId : null}
            },
            positionSelectModel : {
                visible : false,
                filterData : {"criteria.strValue.orderType" : null}
            }
        },
        isOnline:true,
        needlessChecked: false,
        postType: '0',
        isHseEdit: false
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        components : {
            "courseSelectModal":courseSelectModal,
            "positionSelectModal":positionSelectModal,
        },
        data: function () {
            return dataModel;
        },

        methods: {
            doClose: function () {
                this.$dispatch("ev_dtClose");
            },

            /**
             * 获取课程的统计
             * @param id
             * @private
             */
            _getCourseCount: function () {
                var _this = this;
                api.countByCourse({id: this.currentId}).then(function (res) {
                    _this.tableModel.countModel.values = [res.data];
                })
            },

            /**
             * 获取点击岗位后表格数据
             * @private
             */
            _getStatisticPosition: function () {
                var _this = this;
                api.statisticsByPosition({id: this.currentId}).then(function (res) {
                    _this.tableModel.courseModel.values = res.data;
                });

            },

            /**
             * 获取点击课程后表格数据
             * @private
             */
            _getStatisticCourse: function () {
                var _this = this;

                // postType: 0 岗位 1 安全角色
                api.statisticsByCourse({id: this.currentId, "criteria.intValue": {postType: 0}}).then(function (res) {
                    _this.tableModel.positionModel.values = res.data;
                });

                api.statisticsByCourse({id: this.currentId, "criteria.intValue": {postType: 1}}).then(function (res) {
                    _this.tableModel.roleModel.values = res.data;
                })
            },
            _initPosition: function () {
                var _this = this;
                //通过id去获取岗位跟角色详情
                api.getHse({id: this.currentId}).then(function (res) {
                    _this.mainModel.vo = res.data;
                    // _this.$refs.courseTable.doQuery({id: _this.mainModel.vo.id});
                });

                this._getStatisticPosition();
            },
            _initCourse: function () {
                var _this = this;
                api.getCourse({id: this.currentId}).then(function (res) {
                    _this.mainModel.vo = res.data;
                    if(res.data.type != 1) {
                    	_this.isOnline = false;
                    }else{
                    	_this.isOnline = true;
                    }
                    //自学课程无需显示等待复培和等待开始字段，线下课程详情页不显示培训期限字段
                    var isToolColShow = (_this.mainModel.vo.type != 1);
                    var isRefreshable = false;
                    var size = _this.tableModel.countModel.columns.length;
                    _.each(_this.tableModel.countModel.columns, function(toolCol, index) {
                    	if(toolCol.fieldName == 'repeat' || toolCol.fieldName == 'wait') {
                    		if(toolCol.visible !== isToolColShow) {
                                toolCol.visible = isToolColShow;
                                isRefreshable = true;
                             }
                    	}
                    	if(index + 1 == size && isRefreshable) {
                    		_this.$refs.courseCountTable.refreshColumns();
                    	}
                    	
                    })
                    
                    isRefreshable = false;
                    size = _this.tableModel.positionModel.columns.length;
                    _.each(_this.tableModel.positionModel.columns, function(toolCol, index) {
                    	if(toolCol.fieldName == 'repeat' || toolCol.fieldName == 'wait') {
                    		if(toolCol.visible !== isToolColShow) {
                                toolCol.visible = isToolColShow;
                                isRefreshable = true;
                             }
                    	}
                    	if(toolCol.fieldName == 'period') {
                    		if(toolCol.visible !== !isToolColShow) {
                                toolCol.visible = !isToolColShow;
                                isRefreshable = true;
                             }
                    	}
                    	if(index + 1 == size && isRefreshable) {
                    		_this.$refs.positionStatisticTable.refreshColumns();
                    	}
                    	
                    })
                    
                    isRefreshable = false;
                    size = _this.tableModel.roleModel.columns.length;
                    _.each(_this.tableModel.roleModel.columns, function(toolCol, index) {
                    	if(toolCol.fieldName == 'repeat' || toolCol.fieldName == 'wait') {
                    		if(toolCol.visible !== isToolColShow) {
                                toolCol.visible = isToolColShow;
                                isRefreshable = true;
                             }
                    	}
                    	if(toolCol.fieldName == 'period') {
                    		if(toolCol.visible !== !isToolColShow) {
                                toolCol.visible = !isToolColShow;
                                isRefreshable = true;
                             }
                    	}
                    	if(index + 1 == size && isRefreshable) {
                    		_this.$refs.roleStatisticTable.refreshColumns();
                    	}
                    	
                    })
                    
                });
                this._getStatisticCourse();
                this._getCourseCount();
            },

            /**
             * 点击表格中的操作图标的监听函数
             * @param data
             */
            doClickCell: function (data) {
                var classList = data.event.target.parentNode.classList,
                    _data = data.entry.data;
                if(classList.contains("tableCustomIco_Edit")) {
                    this.isHseEdit = classList.contains("hse_edit");
                    this._doEditRow(_data);
                } else if(classList.contains("tableCustomIco_Del")) {
                    this._doDeleteRow(_data.positionId, _data.courseId);
                }

            },
            /**
             * 删除课程或者岗位
             * @param positionId
             * @param courseId
             * @private
             */
            _doDeleteRow: function (positionId, courseId) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确认删除此条记录?',
                    onOk: function () {
                        if(_this.mainModel.type === 'position') {
                            _this._unBind(_this.currentId, courseId);
                        } else if (_this.mainModel.type === 'course') {
                            _this._unBind(positionId, _this.currentId);
                        }
                    }
                });

            },

            /**
             * 更新课程或者岗位
             * @param data
             * @private
             */
            _doEditRow: function(data) {
                if(this.mainModel.type === 'position') {
                    this.editModel.vo = {
                        id: data.id,
                        course: {
                            name: data.courseName,
                            id: data.courseId,
                            type: data.courseType
                        },
                        position: {
                            name: this.mainModel.vo.name,
                            id: this.currentId
                        },
                        period: data.period,
                        frequence: data.frequence
                    };
                } else {
                    this.editModel.vo = {
                        id: data.id,
                        position: {
                            name: data.positionName,
                            id: data.positionId
                        },
                        course: {
                            name: this.mainModel.vo.name,
                            id: this.currentId,
                            type: data.courseType
                        },
                        period: data.period,
                        frequence: data.frequence
                    };
                }

                if(parseInt(data.frequence) === 0) {
                    this.needlessChecked = true;
                }
                this.editModel.show = true;
            },
            // 取消关联岗位和课程
            _unBind: function (positionId, courseId) {
                var _this = this;
                var params = {
                    positionId: positionId,
                    courseId: courseId
                };
                this.$api.remove(params).then(function () {
                    _this._afterOperation();
                })
            },

            /**
             * 添加/修改/删除操作后需要刷新
             * @private
             */
            _afterOperation: function(){
                this.$dispatch("ev_unbind");
                if(this.mainModel.type === 'position') {
                    this._getStatisticPosition();
                } else if (this.mainModel.type === 'course') {
                    this._getStatisticCourse();
                }
            },
            doSave: function () {
                var _this = this;
                var params = this.editModel.vo;
                if(this.isOnline ) {
	                if(!params.period || params.period <= 0 || (params.period+'').split(".").length > 1) {
	                	LIB.Msg.warning("请输入正确的培训期限");
	                	return;
	                }
                }
                if(!params.frequence || params.frequence < 0) {
                	LIB.Msg.warning("请输入正确的复培期限");
                	return;
                }
                api.update(this.editModel.vo).then(function (res) {
                    _this.editModel.show = false;
                    LIB.Msg.success("修改成功");
                    _this._afterOperation();
                })
            },
            doShowCourseSelectModal : function() {
                this.selectModel.courseSelectModel.visible = true;
                this.selectModel.courseSelectModel.filterData = {disable : 0,"criteria.strValue":{excludePositionId:this.mainModel.vo.id}};
            },
            doSaveCourse : function(data) {
                var _this = this;

                var param = _.map(data, function(item){return {id : item.id}});

                api.saveCourses({positionId:_this.mainModel.vo.id},param).then(function(){
                    LIB.Msg.success("添加成功");
                    _this._afterOperation();
                })

            },
            doShowPositionSelectModal : function(t) {
                this.selectModel.positionSelectModel.visible = true;
                this.selectModel.positionSelectModel.filterData = {postType : t};
                this.postType = t;
            },
            doSavePosition: function (data) {
                var _this = this;
                var param = _.map(data, function(item){return {id : item.id}});
                api.saveMatrix({courseId: this.currentId},param).then(function(){
                    LIB.Msg.success("添加成功");
                    _this._afterOperation();
                    _this._getCourseCount();
                })
            },
            doEditCourse: function () {
                window.open('/html/main.html#!/trainingManagement/businessFiles/course?method=detail&id=' + this.currentId + "&code=" + this.courseCode)
            },
            changeFrequence: function (checked) {
                if(checked) {
                    this.editModel.vo.frequence = '0';
                }
            }
        },
        events: {
            "ev_dtReload": function (id, type, code) {

                this.currentId = id;
                this.courseCode = code;
                this.mainModel.type = type;

                if(type === "course") {
                    this._initCourse();
                } else if(type === "position") {
                    this._initPosition();
                }

            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});