define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var auditFormModal = require("../../auditProcess/auditFormModal");
    var processColumns = [
        {
            title: "审批节点名称",
            fieldName: "auditProcessName"
        },
        {
            title: "审批人",
            fieldName: "auditorName",
            width: "70px"
        },
        {
            title: "审批结果",
            render: function (data) {
                var m = {
                    "1": "通过",
                    "2": "退回",
                    "0": "待审批"
                };

                return m[data.result] || "";
            },
            width: "80px"
        },
        {
            title: "审批意见",
            fieldName: "remark"
        },
        {
            title: "审批时间",
            fieldName: "auditDate",
            width: "130px"
        }
    ];
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //编码
            code: null,
            //巡检表名称
            name: null,
            //禁用标识 0:未禁用,1:已禁用
            disable: '1',
            //所属公司id
            compId: null,
            //所属部门id
            orgId: null,
            //备注
            remarks: null,
            //巡检区域
            riCheckAreas: null,
            //审核状态 0:待提交,1:待审核,2:已审核
            status: '0'
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            //验证规则
            rules: {
                "code": [LIB.formRuleMgr.length(100)],
                "name": [
                    LIB.formRuleMgr.require("巡检表名称"),
                    LIB.formRuleMgr.length(200)
                ],
                "compId": [
                    LIB.formRuleMgr.require("所属公司")
                ],
                "orgId": [
                    LIB.formRuleMgr.require("所属部门")
                ],
                // "disable" : [
                //    LIB.formRuleMgr.require("状态"),
                // 	LIB.formRuleMgr.range(1, 100)
                // ],
                "remarks": [
                    LIB.formRuleMgr.length(500)
                ]
            }
        },
        tableModel: {
            riCheckAreaTableModel: LIB.Opts.extendDetailTableOpt({
                url: "richecktable/richeckareas/list/{curPage}/{pageSize}",
                columns: [
                    LIB.tableMgr.ksColumn.code,
                    {
                        title: "名称",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    }, {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del"
                    }]
            }),
        },
        selectModel: {},
        riCheckAreas: null,
        auditObj: {
            visible: false
        },
        auditProcessModel: {
            visible: false,
            columns: processColumns,
            values: null
        },
        enableProcess: false,
        hasProcessRecord: false,
        activeTabName: '1',
        checkedProcessEnable: false
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *     el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     _XXX                //内部方法
     doXXX                //事件响应方法
     beforeInit        //初始化之前回调
     afterInit            //初始化之后回调
     afterInitData        //请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave        //请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate    //表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData        //请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave        //请求 新增/更新 接口后回调
     beforeDoDelete        //请求 删除 接口前回调
     afterDoDelete        //请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "auditFormModal": auditFormModal
        },
        data: function () {
            return dataModel;
        },
        computed: {
            showAuditButton: function () {
                var baseAuth = this.mainModel.isReadOnly && this.mainModel.vo.status === '1' && this.hasAuth('audit');
                if (!this.enableProcess) {
                    return baseAuth
                } else {
                    return baseAuth && this.hasProcessRecord;
                }
            }
        },
        methods: {
            newVO: newVO,

            _submit: function () {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定修改完毕，提交审核?',
                    onOk: function() {
                        api.submitCheckTable({id: _this.mainModel.vo.id}).then(function () {
                            _this.mainModel.vo.status = '1';
                            _this.$dispatch("ev_dtUpdate");
                            LIB.Msg.success("提交成功");
                            if (_this.enableProcess) {
                                _this._checkAuditProcess();
                            }
                        })
                    }
                });
            },
            beforeDoEdit: function() {
                if(this.mainModel.vo.status == 1) {
                    LIB.Msg.warning("待审核状态不可进行此操作");
                    return false;
                }
                if(this.mainModel.vo.status == 2) {
                    LIB.Msg.warning("需要弃审之后才可操作");
                    return false;
                }
            },
            doImportToUpdate: function () {
                if (this.beforeDoEdit() === false) {
                    return;
                }
                this.$emit("do-import-to-update", this.mainModel.vo);
            },
            doSubmit: function () {
                var _this = this;

                api.checkRouteExist({id: this.mainModel.vo.id}).then(function () {
                    _this._submit();
                });
            },
            doAudit: function () {
                if (!!this.auditProcessParam) {
                    this.auditProcessModel.visible = true;
                    return;
                }
                this.auditObj.visible = true;
            },
            doSaveAuditProcessRecord: function (data) {
                var _this = this;
                var param = this.auditProcessParam;
                param.result = data.result;
                param.remark = data.remark;
                api.saveAuditProcessRecord({id: this.mainModel.vo.id}, param).then(function (res) {
                    LIB.Msg.success("审核操作成功");
                    _this._getVOData();
                    _this._getProcessRecordList();
                    _this.$dispatch("ev_dtUpdate");
                    _this.auditProcessModel.visible = false;
                    if (_this.enableProcess) {
                        _this._checkAuditProcess();
                    }
                })
            },
            doPass: function (val) {
                var _this = this;
                api.auditCheckTable({id: this.mainModel.vo.id, status: val}).then(function (res) {
                    _this.mainModel.vo.status = val === 200 ? '2' : '0';
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.success("审核操作成功");
                    _this.auditObj.visible = false;
                })
            },
            doQuit: function () {
                var _this = this;
                api.quitCheckTable({id: this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.status = '0';
                    _this.mainModel.vo.disable = '1';
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.success("弃审成功");
                })
            },
            _getVOData: function () {
                var _this = this;
                _this.$api.get({id: _this.mainModel.vo.id}).then(function(res) {
                    _.deepExtend(_this.mainModel.vo, res.data);
                    _this.storeBeforeEditVo();
                });
            },
            // 处理巡检区域数据
            _convertCheckAreaArray: function (items) {
                if(!_.isArray(items)) {
                    return;
                }
                var splitLength = 4,
                    total = items.length;

                var arr = _.map(items, function (item, index) {
                    return {
                        index: index + 1,
                        total: total,
                        name: item.riCheckAreaTpl.name,
                        isBond: item.riCheckAreaTpl.riCheckAreaTplRfid && item.riCheckAreaTpl.riCheckAreaTplRfid.isBind == 1
                    }
                });

                arr = _.chunk(arr, splitLength);

                arr = _.forEach(arr, function (item, index) {
                    if(index % 2 !== 0) {
                        item.reverse();
                    }
                });

                this.riCheckAreas = arr;

                this.mainModel.vo.riCheckAreas = null;
            },
            /**
             *
             * @param gi groupIndex 4个为一组，组的序号，从0开始
             * @param item 每一个检查点
             * @return {Array}
             */
            calcClass: function (gi, item) {
                var splitLength = 4;
                var res = [];
                var _cls;

                // 1.长度为1时去掉线
                if(item.total === 1) {
                    res.push('line-zero');
                    return res;
                }
                // 2.第一个去掉左半边的线
                if (item.index === 1) {
                    res.push('half-right');
                    return res;
                }
                // 3.最后一项 根据行数判断去掉左半边还是右半边的线
                if (item.index === item.total) {
                    _cls = gi % 2 === 0 ? 'half-left' : 'half-right';
                    res.push(_cls);
                    return res;
                }
                // 4. 其他不是行首或者行尾的
                if(item.index % splitLength !== 0) {
                    return res;
                }
                // 5. 其他事行首或者行尾的需要加转折线
                var results = {
                    "0": 'odd-end', // 奇数行最后一个
                    "1": "even-end" // 偶数行最后一个
                };
                var key = '' + (gi % 2);
                if(item.index < item.total) {
                    res.push(results[key]);
                }
                return res;
            },
            calcItemClass: function (item) {
                if(item.isBond) {
                    return ['sq'];
                }else{
                    return ['unbound','sq'];
                }
            },
            getTitle : function (item) {
                if(!item.isBond) {
                    return "该巡检区域未绑定电子标签";
                }
            },
            doRefreshRoute: function () {
                var _this = this;
                api.get({id: this.mainModel.vo.id}).then(function(res) {
                    // _this.mainModel.vo.riCheckAreas = _.get(res.data, "riCheckAreas")
                    var areas = _.get(res.data, "riCheckAreas");
                    _this._convertCheckAreaArray(areas);
                })
            },

            // 判断启用审核流之后，当前登陆人是否是当前审批节点审核人，如果是，则后端返回一条审核记录数据，审核提交时返回给后端
            _checkAuditProcess: function () {
                var _this = this;
                api.queryProcessStatus({auditObjectId: this.mainModel.vo.id, auditObjectType: 'RiCheckTable'}).then(function (res) {
                    _this.auditProcessParam = res.data;
                    _this.hasProcessRecord = !!res.data;
                })
            },
            _getProcessRecordList: function () {
                var _this = this;
                api.getProcessRecordList({id: this.mainModel.vo.id}).then(function (res) {
                    _this.auditProcessModel.values = res.data;
                })
            },
            beforeInit: function () {
                this.mainModel.vo.riCheckAreas = null;
                this.riCheckAreas = null;
                this.hasProcessRecord = false;
                this.activeTabName = '1';
                this.auditProcessModel.values = null;
            },
            afterInit: function(_pass, obj) {
                if(obj.opType === 'create') {
                    this.mainModel.vo.orgId = LIB.user.orgId;
                }
            },
            afterInitData: function () {
                // this.$refs.richeckareaTable.doQuery({id : this.mainModel.vo.id});
                this._convertCheckAreaArray(this.mainModel.vo.riCheckAreas);
                this._checkAuditProcess();
                this._getProcessRecordList();
            },
            doSave: function() {

                if(this.mainModel.action === "copy") {
                    this.doSave4Copy();
                    return;
                }

                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if (this.beforeDoSave() === false) {
                    return;
                }

                var _this = this;
                var _data = this.mainModel;

                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        if (_this.afterFormValidate && !_this.afterFormValidate()) {
                            return;
                        }
                        var _vo = _this.buildSaveData() || _data.vo;
                        if (_data.vo.id == null) {
                            _this.$api.create(_vo).then(function(res) {
                                //清空数据
                                //_.deepExtend(_vo, _this.newVO());
                                //_this.opType = "view";
                                LIB.Msg.info("保存成功");
                                _data.vo.id = res.data.id;
                                _this._getResultCodeByRequest(res.data.id);
                                _this.afterDoSave({ type: "C" }, res.body);
                                if(_this.fileModel) {
                                    _.each(_this.fileModel,function (item) {
                                        item.cfg && item.cfg.params && (item.cfg.params.recordId = _data.vo.id);
                                    });
                                }
                                _this.changeView("view");
                                _this.$dispatch("ev_dtCreate");
                                _this.storeBeforeEditVo();
                            });
                        } else {
                            _vo = _this._checkEmptyValue(_vo);
                            api.checkOrgChanged(_vo).then(function(res){
                                if(res.data && res.data.code) {
                                    if(res.data.code == 'E140002') {
                                        LIB.Modal.confirm({
                                            title: res.data.msg,
                                            onOk: function () {
                                                _this.$api.update(_vo).then(function(res) {
                                                    LIB.Msg.info("保存成功");
                                                    _this.doRefreshRoute();
                                                    _this.afterDoSave({ type: "U" }, res.body);
                                                    _this.changeView("view");
                                                    _this.$dispatch("ev_dtUpdate");
                                                    _this.storeBeforeEditVo();
                                                });
                                            }
                                        });
                                    }else{
                                        LIB.Msg.warning(res.data.msg);
                                    }
                                }else{
                                    _this.$api.update(_vo).then(function(res) {
                                        LIB.Msg.info("保存成功");
                                        _this.afterDoSave({ type: "U" }, res.body);
                                        _this.changeView("view");
                                        _this.$dispatch("ev_dtUpdate");
                                        _this.storeBeforeEditVo();
                                    });
                                }
                            })
                        }
                    } else {
                        //console.error('doSave error submit!!');
                    }
                });
            },
            doDelete: function() {

                //当beforeDoDelete方法明确返回false时,不继续执行doDelete方法, 返回undefine和true都会执行后续方法
                if (this.beforeDoDelete() === false) {
                    return;
                }

                var _vo = this.mainModel.vo;
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        _this.$api.remove(null, {id:_vo.id, orgId: _vo.orgId}).then(function() {
                            _this.afterDoDelete(_vo);
                            _this.$dispatch("ev_dtDelete");
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
            doOpenTabPage: function () {
                // 监听storage变化；改动巡检表后，会在localStorage中设置riCheckTableChangeTime的值
                window.addEventListener("storage", this._storageFn);
                window.open("/html/main.html#!/riCheckTableTabPage?id=" + this.mainModel.vo.id)
            },
            _storageFn: function (e) {
                if(e.key === 'riCheckTableChangeTime') {
                    this.doRefreshRoute();
                }
            },
            doExport: function() {
                var id = this.mainModel.vo.id;
                LIB.Modal.confirm({
                    title: '导出选中数据?',
                    onOk: function () {
                        window.open("/richecktable/export/" + id);
                    }
                });
            },
            changeTab: function (tabEle) {
                this.activeTabName = tabEle.key;
            },
            _checkProcessEnable: function () {
                var _this = this;
                api.queryLookupItem().then(function (res) {
                    var lookup = _.find(_.get(res.data, "[0].lookupItems"), "name", 'RiCheckTable');
                    _this.enableProcess = (_.get(lookup, "value") === '1');
                    _this.checkedProcessEnable = true;
                })
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        detached: function () {
            window.removeEventListener("storage",  this._storageFn);
        },
        created: function () {
            this._checkProcessEnable();
        }
    });

    return detail;
});