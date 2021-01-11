define(function(require) {

    var Popper = require('popper');
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));

    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    var postFilter = require("./dialog/postfilter");
    var courseFilter = require("./dialog/coursefilter");

    var initDataModel = {
        tableModel: {
            selectedDatas: []
        },
        courseModel: {
            levelOne: [],
            levelTwo: [],
            levelThree: []
        },
        positions: null,
        hseRoles: null,
        courseIds: [],
        matrixs:{},
        courseLength: 0,
        positionLength: 0,
        showCourseInfo: false,
        postFilter: {
            show: false,
            title: "岗位筛选"
        },
        courseFilter: {
            show: false,
            title: "课程筛选"
        },
        detailModel: {
            show: false
        },
        popperModel: {
            show: false,
            action: '',
            course: {},
            position: {},
            frequence: '',
            period: '',
            checked: false,
            defaultPeriod: 0,
            isOnline: false
        },
        starSetting: {
            show: false,
            items: [
                {
                    id: '1',
                    color: '#56b5ff',
                    name: '部门内部任务',
                    show: true
                },
                {
                    id: '2',
                    color: '#f90',
                    name: '其他部门给本部门的任务',
                    show: true
                },
                {
                    id: '3',
                    color: '#aacd03',
                    name: '本部门给其他部门的任务',
                    show: true
                },
                {
                    id: '4',
                    color: '#ccc',
                    name: '其他',
                    show: false
                }
            ]
        },
        isTooMuch: true // 数据是否太多标识
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        components: {
            "detailPanel": detailPanel,
            "postFilter": postFilter,
            "courseFilter": courseFilter
        },
        data: function () {
            return initDataModel;
        },
        computed: {
            tableWidth: function () {
                if(this.courseLength > 13) {
                    return {
                        width: 260 + this.courseLength * 120 + "px"
                    }
                }
                return {
                    width: "100%"
                }
            },
            tableWidth2: function () {
                if(this.courseLength > 13) {
                    return {
                        width: 260 + this.courseLength * 120 + "px"
                    }
                }
                return {
                    'width': "calc(100% - 20px)",
                    'min-width' : "calc(100% - 20px)"
                }
            }
        },
        methods: {
            getMatrix: function (flag) {
                if (flag !== 1) {
                    this.courseCfg = [];
                    this.orgPositionCfg = [];
                    this.hseRoleCfg = [];
                }
                this.starSetting.show = false;
                var _this = this;
                var params = {
                    orgId: this.filterOrgId
                    // "criteria.intsValue" : JSON.stringify({displaySetting: ds })
                };
                api.list(params).then(function(res) {
                    if (!_.isEmpty(res.data)) {
                        _this.afterGetMatrix(res.data);
                    }
                });
            },
            afterGetMatrix: function (data) {
                if(this.orgPositionCfg.length > 0 || this.hseRoleCfg.length > 0){
                    data.orgPositionList = this.orgPositionCfg;
                    data.hseRoleList = this.hseRoleCfg;
                }

                if(this.courseCfg.length > 0){
                    data.categoryCourseList = this.courseCfg
                }

                this.matrixData = data;
                this._build(this.matrixData);
            },
            _build: function (data) {
                var course = this._buildThead(data.categoryCourseList);
                this._buildTbody(data.orgPositionList, data.hseRoleList);

                this.positionLength = this.positions.length + this.hseRoles.length;

                if (this.positionLength > 200 || this.courseLength > 200) {
                    this.isTooMuch = true;
                } else {
                    this.isTooMuch = false;
                    this.courseModel.levelOne = course.one;
                    this.courseModel.levelTwo = course.two;
                    this.courseModel.levelThree = course.three;
                    this._buildMatrixList(data.matrixList);
                }

            },
            _buildThead: function (courses) {
                var lone = [],
                    ltwo = [],
                    lthree = [],
                    courseLength = 0;

                _.forEach(courses, function (course) {
                    course.count = 0;
                    _.forEach(course.subjectList, function (item) {
                        course.count += item.courses.length;
                        item.count = item.courses.length;
                        courseLength += item.courses.length;
                        ltwo = ltwo.concat(item);
                        lthree = lthree.concat(item.courses);
                    });
                    lone = lone.concat(course);
                });
                // this.courseModel.levelOne = lone;
                // this.courseModel.levelTwo = ltwo;
                // this.courseModel.levelThree = lthree;
                this.courseLength = courseLength;
                this.courseIds = _.pluck(lthree, "id");

                return {
                    one: lone,
                    two: ltwo,
                    three: lthree
                }
            },
            _buildTbody: function (positions, roles) {
                var _positionArr = [];

                _.forEach(positions, function (item) {
                    item.positions[0].isFirst = true;
                    item.count = item.positions.length;
                    item.positions[0].parent = item;
                    _positionArr = _positionArr.concat(item.positions);
                });
                this.positions = _positionArr;

                if(_.isArray(roles) && roles.length > 0) {
                    roles[0].isFirst = true;
                    roles[0].parent = {
                        name: '安全角色',
                        count: roles.length
                    };
                }

                this.hseRoles = roles;
            },
            _buildMatrixList: function (matrixList) {
                var res = {};
                for(var k in matrixList) {
                    res[k.substr(2)] = matrixList[k];
                }
                this.matrixs = res;
                res = null;
                if ((this.hseRoles.length + this.positions.length) > 200) {
                    this.isTooMuch = true;
                    return;
                }
                this.isTooMuch = false;
                this._renderTableBody();
            },
            _renderTableBody: function () {
                var data = this.positions.concat(this.hseRoles);
                var _this = this;
                var _fixedRow,
                    _row,
                    _fixResult = '',
                    _result = '';
                
                _.forEach(data, function (item) {
                    _fixedRow = '<tr>';
                    _row = '<tr>';

                    if (item.isFirst) {
                        _fixedRow += '<td style="text-align:left;" rowspan="' + item.parent.count +'">' + (item.postType === '0' ? item.parent.orgName : item.parent.name) + '</td>';
                    }
                    _row += '<td></td><td></td>';
                    _fixedRow += '<td style="text-align:left;"><a href="javascript:void(0);" data-type="position" data-pid="'+ item.id +'">' + item.name + '</a></td>';

                    _.forEach(_this.courseIds, function (id) {
                        var str = _this.matrixs[item.id + "-" + id] ? _this._renderStar(item.id, id) : '';
                        _row += '<td data-type="matrix" data-pid="' + item.id + '" data-cid="' + id + '">' + str +'</td>'
                    });

                    _row += '</tr>';
                    _fixedRow += '</tr>';
                    _result += _row;
                    _fixResult += _fixedRow;
                });
                document.getElementById("matrix-fixed-tbody").innerHTML = _fixResult;
                document.getElementById("matrix-main-tbody").innerHTML = _result;

                this._bindScrollEvent();
            },
            _bindScrollEvent: function () {
                var _this = this;
                var $scrollBody = this.$els.scrollBody,
                    $scrollHeader = this.$els.scrollHeader,
                    $fixedBody = this.$els.fixedBody;
                var mainBodyScroll = function (e) {
                    e.stopPropagation();
                    var $el = e.target,
                        left = $el.scrollLeft,
                        top = $el.scrollTop;
                    if (left > 0) {
                        _this.$els.fixedTable.classList.add("table-fixed-shadow");
                    } else {
                        _this.$els.fixedTable.classList.remove("table-fixed-shadow");
                    }
                    $scrollHeader.style.transform = "translateX(-" + left + "px)";
                    $fixedBody.style.transform = "translateY(-" + top + "px)";


                    //滚动则隐藏 弹窗， 避免超出浏览器边界问题
                    _this.popperModel.show = false;
                };
                $scrollBody.removeEventListener("scroll", mainBodyScroll);
                $scrollBody.addEventListener("scroll", mainBodyScroll);
            },
            _renderStar: function (pid, cid) {
                var attr1 = this.matrixs[pid + '-' + cid].attr1;
                // var setting = _.find(this.starSetting.items, function (item) {
                //     return item.id === attr1;
                // });
                var colors = {
                    '1': '#56b5ff',
                    '2': '#f90',
                    '3': '#aacd03',
                    '4': '#ccc'
                };
                var color = colors[attr1];
                return '<i class="ivu-icon ivu-icon-android-star" style="color:' + color + '"></i>';
                // if(setting.show) {
                //     return '<i class="ivu-icon ivu-icon-android-star" style="color:' + setting.color + '"></i>'
                // } else {
                //     return ''
                // }
            },


            toggleCourseInfo: function () {
                this.closePopper();
                this.showCourseInfo = !this.showCourseInfo;
            },

            /**
             * 岗位筛选
             */
            doPostFilter: function() {
                this.closePopper();
                this.postFilter.show = true;
                this.$broadcast('ev_postReload', this.filterOrgId);
            },
            doPostFinish: function(data) {
                this.postFilter.show = false;
                this.matrixData = data;
                //保存安全角色
                this.hseRoleCfg = data.hseRoleList;
                //保存岗位
                this.orgPositionCfg = data.orgPositionList;
                //判断是否有进行课程筛选
                if(this.courseCfg.length > 0){
                    this.matrixData.categoryCourseList = this.courseCfg
                }
                this._build(data);
            },

            /**
             * 课程筛选
             */
            doCourseFilter: function() {
                this.closePopper();
                this.courseFilter.show = true;
                this.$broadcast('ev_courseReload', this.filterOrgId);
            },
            doCourseFinish: function(data) {
                this.courseFilter.show = false;
                this.matrixData = data;
                //筛选 后端会返回筛选的数据 前端保存这份数据 用来做多次筛选
                //保存课程信息
                this.courseCfg = data.categoryCourseList;
                //判断之前是否有筛选岗位 如果有 就进行数据覆盖
                if(this.orgPositionCfg.length > 0 || this.hseRoleCfg.length > 0){
                    this.matrixData.orgPositionList = this.orgPositionCfg;
                    this.matrixData.hseRoleList = this.hseRoleCfg;
                }
                this._build(data);
            },

            /**
             * 表头课程行点击事件
             * @param ev
             */
            onTHeadClick: function (ev) {

                var target = ev.target,
                    dataset = target.dataset;
                this.closePopper();
                // 过滤不是点击a标签的事件
                if(target.nodeName.toUpperCase() !== 'A') {
                    return;
                }

                if(dataset.type === "course") {
                    this.detailModel.show = true;
                    this.$broadcast('ev_dtReload', dataset.cid, dataset.type, dataset.code);
                }
            },

            /**
             * 表格主体部分点击事件
             * @param ev
             */
            onTBodyClick: function (ev) {
                var target = ev.target,
                    dataset = target.dataset,
                    nodeName = target.nodeName.toUpperCase();

                // 点击a标签的事件
                if(nodeName === 'A') {
                    if(dataset.type === "position") {
                        this.detailModel.show = true;
                        this.$broadcast('ev_dtReload', dataset.pid, dataset.type);
                    }
                    this.closePopper();
                }

                if(nodeName === 'TD') {
                    if(dataset.type !== "matrix") {
                        return;
                    }
                    if(this.matrixs[dataset.pid + "-" + dataset.cid]) {
                        return;
                    }
                    this._showPopper(target, dataset, 'bind');
                }

                if(nodeName === 'I') {
                    target = target.parentNode;
                    dataset = target.dataset;
                    if(dataset.type !== "matrix") {
                        return;
                    }
                    this._showPopper(target, dataset, 'unbind');
                }

            },

            /**
             * 显示关联对话框
             * @param reference 点击事件的target元素
             * @param data target元素的dataset对象
             * @param action 关联bind/取消关联unbind
             * @private
             */
            _showPopper: function (reference, data, action) {
                var matrixData;

                var course = _.find(this.courseModel.levelThree, function (c) {
                    return c.id === data.cid
                });
                var position = _.find(this.positions, function (p) {
                    return p.id === data.pid;
                });

                if(!position) {
                    position = _.find(this.hseRoles, function (p) {
                        return p.id === data.pid;
                    });
                }

                if(!course || !position) {
                    return;
                }

                if(action === 'unbind') {
                    matrixData = this.matrixs[data.pid + "-" + data.cid];
                    if(!matrixData) {
                        return;
                    }
                    this.popperModel.frequence = matrixData.frequence || course.frequence;
                    this.popperModel.period = matrixData.period;
                } else {
                    this.popperModel.frequence = course.frequence;
                }

                this.popperModel.course = {
                    name: course.name,
                    id: data.cid
                };
                this.popperModel.position = {
                    name: position.name,
                    id: data.pid,
                    type: position.postType
                };
                this.popperModel.defaultPeriod = course.defaultPeriod ? parseInt(course.defaultPeriod) : 0;
                this.popperModel.checked = false;
                this.popperModel.show = true;
                this.popperModel.action = action;
                this.popperModel.isOnline = (course.type === '1');

                if(action === 'bind') {
                    if(parseInt(course.frequence) === 0) {
                        this.popperModel.checked = true;
                    }
                }

                // w:230 h:250
                var newPopper = new Popper(reference, this.$pop, {
                    placement: 'top-end'
                });
            },

            closePopper: function () {
                this.popperModel.show = false;
            },
            // 关联岗位和课程
            bind: function () {
                var _this = this;
                var params = _.pick(this.popperModel, ['course', 'position', 'frequence']);
                params.period = this.popperModel.defaultPeriod;

                if(this.popperModel.isOnline ) {
	                if(!params.period || params.period <= 0 || (params.period+'').split(".").length > 1) {
	                	LIB.Msg.warning("请输入正确的培训期限");
	                	return;
	                }
                }
                if(!params.frequence || params.frequence < 0) {
                	LIB.Msg.warning("请输入正确的复培期限");
                	return;
                }
                this.$api.create(params).then(function (res) {
                    _this.getMatrix(1);
                    _this.closePopper();
                    LIB.Msg.success("关联成功");
                })
            },

            // 取消关联岗位和课程
            unbind: function () {
                var _this = this;
                var params = {
                    positionId: this.popperModel.position.id,
                    courseId: this.popperModel.course.id
                };
                this.$api.remove(params).then(function (res) {
                    _this.getMatrix(1);
                    _this.closePopper();
                    LIB.Msg.success("取消关联成功");
                })
            },
            displayFrequence: function (frequence) {
                frequence = parseInt(frequence);
                return frequence === 0 ? '无需复培' : frequence + '个月';
            },
            changeFrequence: function (checked) {
                if(checked) {
                    this.popperModel.frequence = "0";
                }
            },
            doOrgCategoryChange: function (obj) {
                // 组织机构变化后清空岗位和课程筛选条件
                this.courseCfg = [];
                this.orgPositionCfg = [];
                this.hseRoleCfg = [];
                this.filterOrgId = obj.nodeId;
                this.getMatrix();
            },
            doShowStarSetting: function () {
                this.starSetting.show = true;
            }
        },
        events: {
            "ev_unbind": function () {
                this.getMatrix();
            }
        },
        created: function() {},
        ready: function() {
            this.filterOrgId = LIB.user.orgId;
            this.$api = api;
            // 矩阵列表默认筛选当前用户公司或者部门数据
            // this.getMatrix();
            this.$refs.categorySelector.setDisplayTitle({type:"org", value : LIB.user.orgId});
            this.courseCfg = [];
            this.orgPositionCfg = [];
            this.hseRoleCfg = [];
            this.$pop = this.$els.pop;
            if(this.filterOrgId != '9999999999') {
                this.getMatrix();
            }
        },
        detached: function () {
            this.closePopper();
        },
        // route: {
        //     activate: function(transition) {
        //         this.getMatrix();
        //
        //         transition.next();
        //     }
        // }
    });

    return vm;
});
