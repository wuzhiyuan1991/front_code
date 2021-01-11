define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit-data.html");
    var dataList = function () {
        return [
            {
                value: "1",
                label: "全集团",
                disabled: false
            },
            {
                value: "3",
                label: "本公司及下属公司",
                disabled: false
            },
            {
                value: "2",
                label: "本公司",
                disabled: false
            },
            {
                value: "5",
                label: "本部门及下属部门",
                disabled: false
            },
            {
                value: "4",
                label: "本部门",
                disabled: false
            },
            // {
            //     value: "6",
            //     label: "负责",
            //     disabled : false
            // }
        ]

    };
    var dataAuthoritySettings = function () {
        return [
            {
                roleOrgRel: {
                    orgLevel: "-1",
                    type: "select"
                }
            }, {
                roleOrgRel: {
                    orgLevel: "-1",
                    type: "update"
                }
            }, {
                roleOrgRel: {
                    orgLevel: "-1",
                    type: "delete"
                }
            }
        ]
    }
    var newVO = function () {
        return {
            roleId: null,
            authList: [],//保存权限列表
            authTreeData: [],//保存数据权限树
            dataSet: { //全部数据 全选 的相关下拉框初始化
                all: {
                    select: -1,
                    edit: -1,
                    del: -1
                },
                delDataList: dataList(),
                selDataList: dataList()
            }
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO()
        }
    };
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
        data: function () {
            return dataModel;
        },
        methods: {
            //显示每个模块全选下拉框
            showCheckAll: function (data) {
                _.each(data, function (item) {
                    item.roleOrgRel.orgLevel = -1;
                })
            },

            /**
             *  读取权限改变 （任何权限不能大于组织机构的权限）
             *  @param index 读取权限选择的权限所对应的数字
             *  @param value 读取权限对应模块的键值
             *  @param settingDate 读取、编辑、删除对应的数组
             *  @param data 小模块数据
             */
            readChange: function (index, key, settingData, data) {
                var _this = this,
                    _authTreeData = _this.mainModel.vo.authTreeData,
                    _authList = _this.mainModel.vo.authList;
                if (key == 'organization') { //组织机构读取改变，其他权限做相应变化
                    _.each(_authList, function (auth) {
                        // if(!(auth.children && auth.children.length > 0 )){
                        if (auth.key != 'organization' && auth.key != 'basicSetting') {
                            var authSel;
                            if (index == 1) {
                                _.each(auth.readDataList, function (item) {
                                    item.disabled = false;
                                });
                                _.each(auth.dataAuthoritySettings, function (item) {
                                    if (item.roleOrgRel.type == 'select') {
                                        authSel = item.roleOrgRel.orgLevel
                                    }
                                });
                                _this.controllOthers(authSel, auth.editAndDelList);
                            } else if (index == 2) {
                                _.each(auth.readDataList, function (item) {
                                    if (item.value == 1 || item.value == 3) {
                                        item.disabled = true;
                                    } else {
                                        item.disabled = false;
                                    }
                                });
                                _.each(auth.dataAuthoritySettings, function (item) {
                                    if (item.roleOrgRel.orgLevel == 1 || item.roleOrgRel.orgLevel == 3) {
                                        item.roleOrgRel.orgLevel = index;
                                    }
                                    ;
                                });
                                _.each(auth.dataAuthoritySettings, function (item) {
                                    if (item.roleOrgRel.type == 'select') {
                                        authSel = item.roleOrgRel.orgLevel
                                    }
                                });
                                _this.controllOthers(authSel, auth.editAndDelList);
                            } else if (index == 3) {
                                _.each(auth.readDataList, function (item) {
                                    if (item.value == 1) {
                                        item.disabled = true;
                                    } else {
                                        item.disabled = false;
                                    }
                                });
                                _.each(auth.dataAuthoritySettings, function (item) {
                                    if (item.roleOrgRel.orgLevel == 1) {
                                        item.roleOrgRel.orgLevel = index;
                                    }
                                })
                                _.each(auth.dataAuthoritySettings, function (item) {
                                    if (item.roleOrgRel.type == 'select') {
                                        authSel = item.roleOrgRel.orgLevel
                                    }
                                });
                                _this.controllOthers(authSel, auth.editAndDelList);
                            } else if (index == 4) {
                                _.each(auth.readDataList, function (item) {
                                    if (item.value != 4) {
                                        item.disabled = true;
                                    } else {
                                        item.disabled = false;
                                    }
                                });
                                _.each(auth.dataAuthoritySettings, function (item) {
                                    if (item.roleOrgRel.orgLevel != 4) {
                                        item.roleOrgRel.orgLevel = index;
                                    }
                                })
                                _.each(auth.dataAuthoritySettings, function (item) {
                                    if (item.roleOrgRel.type == 'select') {
                                        authSel = item.roleOrgRel.orgLevel
                                    }
                                });
                                _this.controllOthers(authSel, auth.editAndDelList);
                            } else if (index == 5) {
                                _.each(auth.readDataList, function (item) {
                                    if (item.value < 4) {
                                        item.disabled = true;
                                    } else {
                                        item.disabled = false;
                                    }
                                });
                                _.each(auth.dataAuthoritySettings, function (item) {
                                    if (item.roleOrgRel.orgLevel < 4) {
                                        item.roleOrgRel.orgLevel = index;
                                    }
                                })
                                _.each(auth.dataAuthoritySettings, function (item) {
                                    if (item.roleOrgRel.type == 'select') {
                                        authSel = item.roleOrgRel.orgLevel
                                    }
                                });
                                _this.controllOthers(authSel, auth.editAndDelList);
                            }
                        }
                        // }
                    })
                }
                //读取权限限制编辑和删除权限
                if (index == 1) {
                    _.each(data.editAndDelList, function (item) {
                        item.disabled = false;
                    });
                }
                else if (index == 2) {
                    _.each(data.editAndDelList, function (item) {
                        if (item.value == 1 || item.value == 3) {
                            item.disabled = true;
                        } else {
                            item.disabled = false;
                        }
                    });
                    _.each(data.dataAuthoritySettings, function (item) {
                        if (item.roleOrgRel.type != 'select' && (item.roleOrgRel.orgLevel == 1 || item.roleOrgRel.orgLevel == 3)) {
                            item.roleOrgRel.orgLevel = index;
                        }
                    })
                }
                else if (index == 3) {
                    _.each(data.editAndDelList, function (item) {
                        if (item.value == 1) {
                            item.disabled = true;
                        } else {
                            item.disabled = false;
                        }
                    });
                    _.each(data.dataAuthoritySettings, function (item) {
                        if (item.roleOrgRel.type != 'select' && item.roleOrgRel.orgLevel == 1) {
                            item.roleOrgRel.orgLevel = index;
                        }
                    })
                }
                else if (index == 4) {
                    _.each(data.editAndDelList, function (item) {
                        if (item.value != 4) {
                            item.disabled = true;
                        } else {
                            item.disabled = false;
                        }
                    });
                    _.each(data.dataAuthoritySettings, function (item) {
                        if (item.roleOrgRel.type != 'select' && item.roleOrgRel.orgLevel != 4) {
                            item.roleOrgRel.orgLevel = index;
                        }
                    })
                }
                else if (index == 5) {
                    _.each(data.editAndDelList, function (item) {
                        if (item.value < 4) {
                            item.disabled = true;
                        } else {
                            item.disabled = false;
                        }
                    });
                    _.each(data.dataAuthoritySettings, function (item) {
                        if (item.roleOrgRel.type != 'select' && item.roleOrgRel.orgLevel < 4) {
                            item.roleOrgRel.orgLevel = index;
                        }
                    })
                }
            },
            /**
             * 组织机构改变权限时，其他模块读取权限最大
             *  @param index 读取权限
             *  @param list 编辑和删除的数组
             */
            controllOthers: function (index, list) {
                if (index == 1) {
                    _.each(list, function (ele) {
                        ele.disabled = false;
                    })
                }
                else if (index == 2) {
                    _.each(list, function (ele) {
                        if (ele.value == 1 || ele.value == 3) {
                            ele.disabled = true;
                        } else {
                            ele.disabled = false;
                        }
                    })
                }
                else if (index == 3) {
                    _.each(list, function (ele) {
                        if (ele.value == 1) {
                            ele.disabled = true;
                        } else {
                            ele.disabled = false;
                        }
                    })
                }
                else if (index == 4) {
                    _.each(list, function (ele) {
                        if (ele.value != 4) {
                            ele.disabled = true;
                        } else {
                            ele.disabled = false;
                        }
                    })
                }
                else if (index == 5) {
                    _.each(list, function (ele) {
                        if (ele.value < 4) {
                            ele.disabled = true;
                        } else {
                            ele.disabled = false;
                        }
                    })
                }

            },
            /**
             * 小模块控制全选
             * @param mode 判断是读取、编辑、删除
             * @param 模块数据
             */
            controllPartAll: function (mode, index, data) {
                if (index!='' && index != -1) {
                    if (mode != 'select') { //现在对应列是编辑或者删除
                        _.each(data, function (item) {
                            var selIndex = null; //保存读取值，限制编辑和删除的权限
                            _.each(item.dataAuthoritySettings, function (part) {
                                if (part.roleOrgRel.type == 'select') {
                                    selIndex = part.roleOrgRel.orgLevel;
                                }
                                if (part.roleOrgRel.type == mode) {
                                    if (selIndex == 1) {
                                        part.roleOrgRel.orgLevel = index;
                                    } else if (selIndex == 2) {
                                        if (index == 1 || index == 3) {
                                            part.roleOrgRel.orgLevel = selIndex;
                                        } else {
                                            part.roleOrgRel.orgLevel = index;
                                        }
                                    } else if (selIndex == 3) {
                                        if (index == 1) {
                                            part.roleOrgRel.orgLevel = selIndex;
                                        } else {
                                            part.roleOrgRel.orgLevel = index;
                                        }
                                    } else if (selIndex == 4) {
                                        if (index != 4) {
                                            part.roleOrgRel.orgLevel = selIndex;
                                        } else {
                                            part.roleOrgRel.orgLevel = index;
                                        }
                                    } else if (selIndex == 5) {
                                        if (index < 4) {
                                            part.roleOrgRel.orgLevel = selIndex;
                                        } else {
                                            part.roleOrgRel.orgLevel = index;
                                        }
                                    }
                                }
                            })
                        })
                    } else { ////现在对应列是读取

                        _.each(data, function (item) {
                            _.each(item.dataAuthoritySettings, function (part) {
                                if (part.roleOrgRel.type == mode) {
                                    part.roleOrgRel.orgLevel = index;
                                }
                            })
                        })
                    }
                }
            },
            /**
             * 大模块控制全选
             * @param mode 判断是读取、编辑、删除
             * @param 模块数据
             */
            controllAll: function (mode, index, data) {
                var _this = this;
                var _delDataList = _this.mainModel.vo.dataSet.delDataList;
                _this.controllPartAll(mode, index, data);
                _.each(data, function (parentItem) {
                    _this.controllPartAll(mode, index, parentItem.children);
                });
                if (mode == 'select' && index != -1) {
                    var _all = _this.mainModel.vo.dataSet.all;
                    var _edit = _this.mainModel.vo.dataSet.all.edit;
                    var _del = _this.mainModel.vo.dataSet.all.del;
                    _this.controllOthers(index, _delDataList);
                    if (index == 2) {
                        if (_del == 1 || _del == 3) {
                            _all.del = index;
                        }
                        if (_edit == 1 || _edit == 3) {
                            _all.edit = index;
                        }
                    } else if (index == 3) {
                        if (_del == 1) {
                            _all.del = index;
                        }
                        if (_edit == 1) {
                            _all.edit = index;
                        }
                    } else if (index == 4) {
                        if (_del != 4) {
                            _all.del = index;
                        }
                        if (_edit != 4) {
                            _all.edit = index;
                        }
                    } else if (index == 5) {
                        if (_del < 4) {
                            _all.del = index;
                        }
                        if (_edit < 4) {
                            _all.edit = index;
                        }
                    }
                }

            },
            //保存
            doSave: function () {
                var _this = this;
                var callback = function (res) {
                    _this.$emit("do-edit-data-finshed");
                    LIB.Msg.info("保存成功");
                };
                var data = [];
                _.each(_this.mainModel.vo.authList, function (item) {
                    if (!(item.children && item.children.length > 0)) {
                        _.each(item.dataAuthoritySettings, function (setting) {
                            data.push(setting.roleOrgRel);
                        })
                    }
                });
                api.distributionData({roleId: _this.mainModel.vo.roleId}, data).then(callback);
            },
            _init: function (id) {
                LIB.globalLoader.show();
                var sortRule = {
                    'select': 1,
                    'update': 2,
                    'delete': 3
                };
                var _this = this;
                var _vo = dataModel.mainModel.vo;
                api.listData({roleId: id}).then(function (res) {
                    var authTreeData = [];//树结构数据
                    var idMap = _.indexBy(res.body, 'id');
                    //生成树结构
                    _.forEach(res.data, function (auth) {
                        // 排序 [select, update, delete]
                        if (_.isArray(auth.dataAuthoritySettings) && auth.dataAuthoritySettings.length === 3) {
                            auth.dataAuthoritySettings = _.sortBy(auth.dataAuthoritySettings, function (item) {
                                return _.get(sortRule, item.roleOrgRel.type);
                            })
                        }

                        var parentMenu = idMap[auth['parentId']];
                        if (auth.parentId) {
                            auth.readDataList = dataList();
                            auth.editAndDelList = dataList();
                            auth.show = true;
                        }

                        if (parentMenu) {
                            parentMenu.children = parentMenu.children || [];
                            parentMenu.children.push(auth);
                        } else if (!auth.parentId) {
                            auth.readDataList = dataList();
                            auth.editAndDelList = dataList();
                            auth.showPart = true;
                            auth.showBtn = false;
                            auth.dataAuthoritySettings = dataAuthoritySettings();
                            // auth= Object.assign({}, auth, { showPart : true,readDataList:dataList(),editAndDelList: dataList()});
                            authTreeData.push(auth);
                        }
                        _this.mainModel.vo.authList.push(auth);
                    });
                    _vo.authTreeData = authTreeData;
                    //手动触发onchange事件
                    _.each(_this.mainModel.vo.authList, function (auth) {
                        if (auth.parentId) {
                            var index = auth.dataAuthoritySettings[0].roleOrgRel.orgLevel;
                            _this.readChange(index, auth.value, auth.dataAuthoritySettings, auth);
                        }
                    });
                    LIB.globalLoader.hide();
                });
            }
        },
        events: {
            //edit框数据加载
            "ev_editDataReload": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                _vo.roleId = nVal;
                //存在nVal则是update
                if (nVal) {
                    this._init(nVal);
                }
            }
        }
    });

    return detail;
});