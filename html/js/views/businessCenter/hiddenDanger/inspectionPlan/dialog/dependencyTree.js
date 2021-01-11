define(function (require) {

    var LIB = require('lib');

    var template = require('text!./dependencyTree.html');
    var api = require("../vuex/api");
    var opts = {
        template: template,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                type: [String, Number, Array],
                default: ''
            },
            data: {
                type: [Array],
            },
            selectedDatas: {
                type: [Array],
            },
            selectAllComp: { //所有公司都可选
                type: Boolean,
                default: false
            },
            compId: {
                type: String,
            },
            orgId: {
                type: String
            },
            disabled: {
                type: Boolean,
                default: false
            },
            //初始化 第一次禁止disabled为ture
            ready: {
                type: Boolean,
                default: false
            },
            flag: {
                type: Boolean,
                default: true
            },
            clearable: {
                type: Boolean,
                default: false
            },
            defaultCompId: Boolean,
            popperFixed: {
                type: Boolean,
                default: false,
            },
            singleSelect: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            id: function (val) {
                //清空选中的树

                // if(this.compId){
                //    this.selectedDatas4Tree = [{"id":val}];
                // }else{
                //    this.selectedDatas4Tree=[{"id":val}];
                // }
                // if(_.isEmpty(val)) {
                //     this.id = this.compId;
                // }
                // 复制的时候 afterInitData 自动修改部门为 本用户部门
                var _this = this;
                setTimeout(function () {
                    if (_this.id) {
                        if (_this.compId) {
                            _this.selectedDatas4Tree = [{
                                "id": _this.id
                            }];
                        } else {
                            _this.selectedDatas4Tree = [{
                                "id": _this.id
                            }];
                        }
                        if (_.isEmpty(val)) {
                            _this.id = _this.compId;
                        }
                    }
                }, 50)
            },
            orgId: function (val) {
                // 获取所有的属地， 并写入上级部门Id为parentId
                if ( !!this.compId) {
                    this.getDominationAreas();
                }
            },
            //oldVal 为compId变化的之前的id
            compId: function (val, oldVal) {
                // 获取所有的属地， 并写入上级部门Id为parentId
                if (!!val && !!this.orgId) {
                    this.getDominationAreas();
                }
                if (oldVal) {
                    this.selectedDatas4Tree = [];
                }
                // 下面会导致切换公司后部门信息丢失
                if (this.compId && this.flag) {
                    this.ready = true;
                    this.flag = false;
                    //在每次修改公司的时候 都清空部门id
                    //规则为旧的oldVal 没有值 新的val有值 部门id有值
                    if (oldVal && val && this.id && window.changeMarkObj.hasCompChanged) {
                        this.id = this.compId;
                        window.changeMarkObj.hasCompChanged = false;
                    }
                    this.init();
                }
            },
            "selectedDatas4Tree": function (nVal, oVal) {
                var nId = _.get(nVal, '[0].id');
                var oId = _.get(oVal, '[0].id');
                this.treeSelectChange(nVal)
                if (oId && oId !== nId) {
                    this.id = nId;
                    window.changeMarkObj.hasDeptChanged = true;
                    // 防止没有属地组件，标志位不会重置
                    setTimeout(function () {
                        window.changeMarkObj.hasDeptChanged = false;
                    }, 500)
                }
            }
        },
        data: function () {
            return {
                selectedDatas4Tree: [],
                treeData: null,
                defaultOpenLayer: 2,
                $api: api,
                _dominationArea: [],
                departments: [],
                newdepartments:[],
                _selectedDatas: []
            }
        },
        methods: {
            doClearSingleSelect: function () {
                this.selectedDatas4Tree = [];
            },
            //查询出公司下面的所有部门
            buildAllDeptByParentId: function (parentId, result) {
                var _this = this;
                var resultTmp = _.filter(LIB.setting.orgList, function (data) {
                    return data.parentId === parentId && data.type === "2";
                });
                if (!_.isEmpty(resultTmp)) {
                    _.each(resultTmp, function (_item) {
                        _this.buildAllDeptByParentId(_item.id, resultTmp);
                    });
                    _.each(resultTmp, function (_tmpItem) {
                        result.push(_tmpItem);
                    })
                }
            },
            //获取数据
            init: function (parentId) {
                if (this.defaultCompId) {
                    this.compId = LIB.user.compId;
                }
                var _this = this;
                //查询出公司下面的所有部门
                var result = _.filter(LIB.setting.orgList, function (data) {
                    return data.parentId === _this.compId && data.type == "2";
                });
                // 获取所有的属地， 并写入上级部门Id为parentId
                if (!!this.compId) {
                    this.getDominationAreas();
                }

                if (this.selectAllComp) { //所有公司都可选
                    result = LIB.setting.orgList
                    this.defaultOpenLayer = 0
                }
                if (!_.isEmpty(result) && !this.selectAllComp) {
                    _.each(result, function (_item) {
                        //查询出公司下面的所有部门
                        _this.buildAllDeptByParentId(_item.id, result);
                    });
                }
                this.departments = result;
                this.data = result;
                this.treeData = [];
                this.treeData = _.filter(result, function (item) {
                    return item.disable != '1'
                });
                if (this.ready && this.data.length < 1) {
                    //如果禁止输入 要去掉之前的默认id 防止 数据不进行更新 bug2508
                    _this.id = "";
                }
                //防止watch 多次请求
                setTimeout(function () {
                    _this.flag = true;
                }, 2000);

                // 设置空
                setTimeout(function () {
                    if (_this.id) {
                        var val = _.find(_this.treeData, function (item) {
                            return item.id == _this.id;
                        });

                        if (val) {
                            _this.selectedDatas4Tree = [{
                                "id": _this.id
                            }];
                        } else {

                            _this.selectedDatas4Tree = [];
                            _this.id = null;
                        }

                        // if(_.isEmpty(_this.id)) {
                        //     _this.id = _this.compId;
                        // }
                    }
                }, 150)

            },
            getDominationAreas: function () {
                var _this = this
                api.getDominationArea({
                    disable: 0,
                    "criteria.orderValue.fieldName": 'modifyDate',
                    'criteria.orderValue.orderType': 1,
                    orgId: this.orgId,
                    compId: this.compId
                }).then(function (res) {
                    this._dominationArea = res.body;
                  
                    _this._addTreeDominationArea(this._dominationArea)
                })
            },
            // 将请求的属地数据添加到树中
            _addTreeDominationArea: function (dominationAreas) {
                var _this = this;
                _.each(dominationAreas, function (item) {
                    item.type = 'dependency'
                    if (!item.hasOwnProperty('parentDominationArea')) {
                        var arr =   _.filter(_this.departments,function (data) {
                            return data.id ==  item.id
                        })
                        if (item.id.indexOf("_")<0) {
                            item.id = "_" + item.id
                        }
                        if (arr.length>0) {
                            item.parentId = item.orgId
                        }else{
                            item.parentId = "_" +item.orgId
                        }
                       
                        // item.name = LIB.getDataDic("org", item.orgId)["deptName"] + ' ' + item.name
                    } else {
                        // item.name = item.parentDominationArea.name + ' ' + item.name

                    }
                })
                
                _.each(this.departments, function (item) {
                    item.showCheckbox = false
                })
                this.departments = _.filter(this.departments, function (item) {
                    return item.disable != '1'
                });
                var result = null;
                if(this.orgId){
                    result = [];
                    this.buildAllDeptByParentId(this.orgId, result)
                    result.push(LIB.setting.orgList.find(function (item) {
                        return item.id == _this.orgId;
                    }))
                }
                  var arr=[]
                    _.each( dominationAreas,function(item){
                        var data = _.filter(_this.departments,function(k){
                            return k.id == item.parentId
                        })
                        if (data.length>0) {
                            arr.push(data[0])
                        }
                    })
                    _this.newdepartments = _.uniq(arr,'id')
                    if (dominationAreas.length==0) {
                        this.$set('data', [])
                        this.$set('treeData', [])
                        return
                    }
                this.$set('data', [].concat(dominationAreas, result || this.newdepartments))
                this.$set('treeData', [].concat(dominationAreas, result || this.newdepartments))
            },
            treeSelectChange: function (value) {
                // 不是属地禁止选中
                if (value.type !== 'dependency') {
                    if(this.$refs && this.$refs.treeModel){
                        this.$refs.treeModel.clearSingleSelect()
                    }

                    // LIB.Msg.warning("请选择部门下的属地！");
                    return false
                }
                this._selectedDatas = [value]
                // this.$emit('update-select', value)
                this.$emit('update-select', [value])
            },
            doCancel: function () {
                this.$emit('do-cancel')
            },
            doConfrim: function () {
                var _this = this;
                var arr = [];
                arr = _.filter(this.treeData, function (item) {
                    return _.find(_this.selectedDatas4Tree, function (tree) {
                        return tree.id == item.id;
                    })
                })||[];
                return this.$emit('do-save', arr)
                if (!!!this.id) {
                    return LIB.Msg.warning("请选择属地！");
                } else {
                    return this.$emit('do-save', this._selectedDatas)
                }
            },
            beforeHandle: function (event) {
            }
        },
        attached: function () {
            var isNeedRefreshData = false;
            if (this.orgListVersion != window.allClassificationOrgListVersion) {
                this.orgListVersion = window.allClassificationOrgListVersion;
                isNeedRefreshData = true;
            } else if (!this.data) {
                isNeedRefreshData = true;
            }
            if (isNeedRefreshData) {
                var _this = this;
                var result = _.filter(LIB.setting.orgList, function (data) {
                    return data.parentId == _this.compId && data.type == "2";
                });
                if (!_.isEmpty(result)) {
                    _.each(result, function (_item) {
                        //查询出公司下面的所有部门
                        _this.buildAllDeptByParentId(_item.id, result);
                    });
                }
                this.departments = result
                this.data = result;
                this.treeData = _.filter(result, function (item) {
                    return item.disable != '1'
                });
            }
        },
        created: function () {
            this.orgListVersion = 1;
        },
        ready: function ready() {
            this.init();
            if (this.id) {
                this.selectedDatas = [];
                this.selectedDatas4Tree.push({
                    "id": this.id
                });
            }
        },
        events:{

        }
    };
    // var component = LIB.Vue.extend(opts);
    return opts
    // LIB.Vue.component('department-tree-select', component);

});