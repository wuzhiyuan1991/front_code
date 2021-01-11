define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./postfilter.html");

    //声明detail组件
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
        template: tpl,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '请选择'
            }
        },
        data: function () {
            return {
                activeTab: 1,
                authList: [],
                positionValue: '',
                roleValue: '',
                positions: null, // 岗位
                hseRoles: null, // 安全角色
                hseSelectAll: false, // 安全角色是否全选
                positionSelectAll: false // 岗位是否全选
            };
        },

        methods: {

            changeTab: function (tab) {
                this.activeTab = tab;
            },
            doSave: function () {
                var _this = this;
                this.authList = [];

                _.forEach(this.positions, function (position) {
                    _.forEach(position.positions, function (item) {
                        if (item.isChecked) {
                            _this.authList.push(item.id);
                        }
                    })
                });

                _.forEach(this.hseRoles, function (item) {
                    if (item.isChecked) {
                        _this.authList.push(item.id)
                    }
                });
                var length = this.authList.length;

                if (length > 200) {
                    LIB.Msg.warning("选择的岗位和安全角色数量过多");
                    return;
                }


                var callback = function (res) {
                    _this.$emit("do-post-finshed", res.data);
                    LIB.Msg.info("保存成功");
                };

                if (this.orgId) {
                    if (length > 0) {
                        api.list({"criteria.strsValue": JSON.stringify({positionIds: _this.authList}), orgId: _this.orgId}).then(callback);
                    } else {
                        api.list({orgId: _this.orgId}).then(callback);
                    }
                } else {
                    if (length > 0) {
                        api.list({"criteria.strsValue": JSON.stringify({positionIds: _this.authList})}).then(callback);
                    } else {
                        api.list().then(callback);
                    }
                }
            },

            // 岗位过滤
            doFilterPosition: function () {
                this.positionSelectAll = false;
                var kw = this.positionValue;
                var isInclude;
                this.positions = _.filter(_.cloneDeep(this.positionBak), function (position) {
                    position.allChecked = false;
                    isInclude = !kw || _.includes(position.orgName, kw);
                    if (!isInclude) {
                        position.positions = _.filter(position.positions, function (item) {
                            item.isChecked = false;
                            return !kw || _.includes(item.name, kw);
                        });
                    }

                    return isInclude || (position.positions.length > 0);
                })
            },

            // 安全角色过滤
            doFilterRole: function () {
                this.hseSelectAll = false;
                var kw = this.roleValue;
                this.hseRoles = _.filter(this.hseRoleBak, function (item) {
                    item.isChecked = false;
                    return !kw || _.includes(item.name, kw);
                })
            },

            togglePosition: function (type, positionGroup, position) {
                var _this = this;
                if (type === 0) {
                    positionGroup.allChecked = !positionGroup.allChecked;
                    _.forEach(positionGroup.positions, function (item) {
                        item.isChecked = positionGroup.allChecked;
                    });
                    this.positionSelectAll = _.every(this.positions, function (item) {
                        return item.allChecked;
                    });
                } else if (type === 1) {
                    position.isChecked = !position.isChecked;
                    positionGroup.allChecked = _.every(positionGroup.positions, function (item) {
                        return item.isChecked;
                    });
                    this.positionSelectAll = _.every(this.positions, function (item) {
                        return item.allChecked;
                    });
                } else if (type === 2) {
                    this.positionSelectAll = !this.positionSelectAll;
                    _.forEach(this.positions, function (position) {
                        position.allChecked = _this.positionSelectAll;
                        _.forEach(position.positions, function (item) {
                            item.isChecked = _this.positionSelectAll;
                        })
                    });
                }
            },

            toggleHseRole: function (type, role) {
                var _this = this;
                if (type === 0) {
                    this.hseSelectAll = !this.hseSelectAll;
                    _.forEach(this.hseRoles, function (item) {
                        item.isChecked = _this.hseSelectAll;
                    })
                } else if (type === 1) {
                    role.isChecked = !role.isChecked;
                    this.hseSelectAll = _.every(this.hseRoles, function (role) {
                        return role.isChecked;
                    })
                }
            },

            // 清空
            doClean: function () {

                this.positionSelectAll = false;
                this.hseSelectAll = false;
                //清空安全角色 已选中状态
                _.each(this.hseRoles, function (hse) {
                    hse.isChecked = false;
                });
                //清空岗位
                _.each(this.positions, function (item) {
                    item.allChecked = false;
                    _.each(item.positions, function (org) {
                        org.isChecked = false;
                    })
                })
            },
            doClose: function () {
                this.visible = false;
                // this._initState(this.cacheList);
                // this.cacheList = null;
            },
            _initState: function (res) {

                var _authList = this.authList || [];

                // 岗位
                var orgList = _.get(res, "data.orgPositionList", this.positions);
                var count;
                _.forEach(orgList, function (item) {
                    count = 0;
                    _.forEach(item.positions, function (post) {
                        if (_.includes(_authList, post.id)) {
                            post.isChecked = true;
                            count++;
                        } else {
                            post.isChecked = false;
                        }
                    });
                    //判断是否全选
                    if (count === item.positions.length) {
                        item.allChecked = true;
                    } else {
                        item.allChecked = false;
                    }
                });
                this.positionBak = _.cloneDeep(orgList);
                this.positions = orgList;

                // 安全角色
                var roleList = _.get(res, "data.hseRoleList", this.hseRoles, []);
                count = 0;
                _.forEach(roleList, function (role) {
                    if (_.includes(_authList, role.id)) {
                        role.isChecked = true;
                        count++;
                    } else {
                        role.isChecked = false;
                    }
                });

                if (count === roleList.length) {
                    this.hseSelectAll = true;
                } else {
                    this.hseSelectAll = false;
                }
                this.hseRoles = roleList;
                this.hseRoleBak = _.cloneDeep(roleList);

            },
            _init: function (newOrgId) {

                this.activeTab = 1;
                // 两次组织机构id相同 则返回；不同清空authList
                if (this.orgId === newOrgId) {
                    return;
                } else {
                    this.authList = [];
                    this.orgId = newOrgId;
                }

                //清空数据
                this.positions = null;
                this.hseRoles = null;
                this.hseSelectAll = false;
                this.positionValue = '';
                this.roleValue = '';

                if (newOrgId) {
                    api.list({orgId: newOrgId}).then(this._initState);
                } else {
                    api.list().then(this._initState);
                }
            }
        },
        ready: function () {
            this.orgId = '';
        },
        events: {
            //edit框数据加载
            "ev_postReload": function (nVal) {
                this._init(nVal);
            }
        }
    });

    return detail;
});