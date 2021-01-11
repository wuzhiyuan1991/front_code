define(function(require) {

    var LIB = require('lib');

    var mixin = {
        methods: {
            doClose: function() {
                this.$dispatch("ev_dtClose");

            },
            doEdit: function() {
                if (this.beforeDoEdit() === false) {
                    return;
                }
                this.mainModel.opType = "update";
                this.mainModel.isReadOnly = false;
                this.changeView("update");
                this.storeBeforeEditVo();
                this.afterDoEdit && this.afterDoEdit();
            },
            beforeDoEdit: function() {

            },
            //详情页，点击取消方法
            doCancel: function() {

                //var _this = this;
                //if(_this.mainModel.vo.id) {
                //	this.$api.get({id : _this.mainModel.vo.id}).then(function(res){
                //		var data = res.data;
                //		_.deepExtend(_this.mainModel.vo, data);
                //	});
                //}
                //_this.mainModel.isReadOnly = true;
                ////还原修改前的变量
                //!_.isEmpty(this.mainModel.beforeEditVo) &&  _.deepExtend(this.mainModel.vo, this.mainModel.beforeEditVo);
                this.recoverBeforeEditVo();
                this.mainModel.action = "view";
                this.changeView("view");
                this.afterDoCancel && this.afterDoCancel();
            },
            /**
             * 如果创建时，code可以自动生成，那可能需要发请求来获取code
             * 现在用refs来判断code是否可以自动生成
             * @param id
             * @private
             */
            _getResultCodeByRequest: function (id) {
                var _this = this;
                var isAutoGenerateCode = _.get(this.$refs, "codeInput");
                if(!isAutoGenerateCode || this.mainModel.vo.code) {
                    return;
                }
                this.$api.get({id: id}).then(function (res) {
                    _this.mainModel.vo.code = res.data.code;
                    // 可能有其他属性需要重新赋值
                    if(_.isFunction(_this.setValueAfterGetData)) {
                        _this.setValueAfterGetData(res.data)
                    }
                })
            },

            doAdd4Copy: function() {
                var data = _.cloneDeep(this.mainModel.vo);
                var opts = { opType: "update", action: "copy" };
                this.init("update", data.id, data, opts)
            },
            doSave4Copy: function() {
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

                        if (_data.vo.id != null) {
                            _this.$api.create4copy({id : _data.vo.id}, _vo).then(function(res) {

                                LIB.Msg.info("保存成功");
                                _data.vo.id = res.data.id;

                                //刷新主表数据
                                _this.init("view", _data.vo.id, res.data);

                                //刷新从表数据
                                // _this.afterInitData();

                                // cleanRelMask
                                if (_.isFunction(_this.afterDoCopy)) {
                                    _this.afterDoCopy(res.data);
                                }
                                _this.$dispatch("ev_dtCreate");
                            });
                        } else {
                            LIB.Msg.error("缺少复制对象");
                        }
                    }
                });
            },
            /*
             *
             * */
            buildSaveData: function() {
                return false;
            },

            // 处理某些值前端传空值，后端不能正确删除的问题
            // 需要在rules对应的字段中加入LIB.formRuleMgr.allowIntEmpty或者LIB.formRuleMgr.allowStrEmpty
            _checkEmptyValue: function (_vo) {
                var vo = _vo || this.mainModel.vo;
                var beforeEditVo = this.mainModel.beforeEditVo;

                if(this.mainModel.opType !== 'update') {
                    return vo;
                }

                var rules = this.mainModel.rules;

                function _setValue(key, type) {
                    if(_.get(beforeEditVo, key) == _.get(vo, key) || _.get(vo, key)) {
                        return;
                    }
                    var _val = type === 'int' ? 1 : '1';

                    if (_.includes(key, ".")) {
                        key = key.replace(/\.(\w)/g, function (match, $1) {
                            return $1.toUpperCase()
                        });
                    }

                    var _key = 'criteria.' + type + 'Value.' + key + '_empty';
                    _.set(vo, _key, _val);
                }

                _.forOwn(rules, function (rule, key) {
                    if (_.isArray(rule)) {
                        _.forEach(rule, function (prop) {
                            if (_.has(prop, 'allowEmptyType')) {
                                _setValue(key, _.get(prop, 'allowEmptyType'));
                            }
                        })
                    }
                });

                return vo;
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
                        if (_data.vo.id == null || _this.mainModel.opType==='create') {
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
                            _this.$api.update(_vo).then(function(res) {
                                LIB.Msg.info("保存成功");
                                _this.afterDoSave({ type: "U" }, res.body);
                                _this.changeView("view");
                                _this.$dispatch("ev_dtUpdate");
                                _this.storeBeforeEditVo();
                            });
                        }
                    } else {
                        //console.error('doSave error submit!!');
                    }
                });
            },
            doEnableDisable: function() {
                var _this = this;
                var data = _this.mainModel.vo;
                var params = {
                    id: data.id,
                    orgId: data.orgId,
                    disable: data.disable === "0" ? "1" : "0"
                };
                if(this.$api.updateDisable) {
                    this.$api.updateDisable(null,  params).then(function (res) {
                        data.disable = (data.disable === "0") ? "1" : "0";
                        LIB.Msg.info((data.disable === "0") ? "启用成功" : "停用成功");
                        _this.$dispatch("ev_dtUpdate");
                    });
                } else {
                    this.$api.update(null,  params).then(function (res) {
                        data.disable = (data.disable === "0") ? "1" : "0";
                        LIB.Msg.info((data.disable === "0") ? "启用成功" : "停用成功");
                        _this.$dispatch("ev_dtUpdate");
                    });
                }
            },


            /**
             * 表单校验合法之后调用, 只能被重写
             */
            // afterFormValidate:function(){
            // 	return true;
            // },

            /**
             *
             */
            beforeDoSave: function() {

            },

            /**
             *
             */
            afterDoSave: function() {

            },
            doConfirmCallback: function () {
                var _this = this;
                var params = Array.prototype.slice.call(arguments);
                var fn = params.shift();
                if (!_.isFunction(this[fn])) {
                    return;
                }
                var title = params.shift() || '删除当前数据?';
                LIB.Modal.confirm({
                    title: title,
                    onOk: function() {
                        _this[fn].apply(_this, params);
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
                        _this.$api.remove(null, _vo).then(function() {
                            _this.afterDoDelete(_vo);
                            _this.$dispatch("ev_dtDelete");
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
            /**
             *
             */
            beforeDoDelete: function() {

            },
            /**
             *
             */
            afterDoDelete: function() {

            },
            refreshTableData: function() {
                var _this = this;
                _.each(arguments, function(ref) {
                    ref.doQuery({ id: _this.mainModel.vo.id });
                })
            },
            changeView: function(opType) {
                this.mainModel.opType = opType;
                //if(_.contains(["view","update"], opType)) {
                //	this.mainModel.title = this.$tc("gb.common.detail");
                //	this.mainModel.isReadOnly = true;
                //}
                if (opType === "view") {
                    this.mainModel.title = this.$tc("gb.common.detail");
                    this.mainModel.isReadOnly = true;
                } else if (opType === "update") {
                    this.mainModel.title = this.$tc("gb.common.detail");
                    this.mainModel.isReadOnly = false;
                } else if (opType === "create") {
                    this.mainModel.title = this.$tc("gb.common.add");
                    this.mainModel.isReadOnly = false;
                }
                var isAutoGenerateCode = _.get(this.$refs, "codeInput");
                if(isAutoGenerateCode && _.isPlainObject(this.mainModel.rules)) {
                    if(opType === 'create' || this.mainModel.action === 'copy') {
                        LIB.Vue.set(this.mainModel.rules, "code", LIB.formRuleMgr.length(50))
                    } else if(opType === 'update') {
                        LIB.Vue.set(this.mainModel.rules, "code", LIB.formRuleMgr.codeRule())
                    }
                }
            },
            //查看/更新 记录前先初始化视图
            /*
             opType :       //操作类型
                     create
                     view
                     update
             nVal ：        //当opType 为 view/update 时， 请求后端接口的参数Id值
                     xxx    //id值
             transferVO ：  //当opType 为 view/update 时， 可传递过来完整的业务对象，
                            //在initData调用之前， 虽然 transferVO 的属性不一定和 接口调用后返回的属性完全一致，
                            //但依旧可以在 beforeInit、afterInit 方法可获取transferVO的属性，进行页面的优化处理，
                            //如果需要强一致性，可在查询请求接口之后的回调afterInitData中继续处理页面一致性问题
                            {id:xxx,name:xxx,...}
             opts : //当opType 为 create/copy/view/update 时， 请求后端接口的参数Id值, 非vo的参数

             */
            init: function() {
                var opType = arguments[0] || "view";
                //从其他页面,例如mainPanel传递过来的VO的Id
                var nVal = arguments[1];

                //从其他页面,例如mainPanel传递过来的VO
                var transferVO = arguments[2];

                var opts = arguments[3];


                this.beforeInit && this.beforeInit(transferVO, { opType: opType }, opts);

                var _data = this.mainModel;

                LIB.Vue.set(_data, 'action', '');
                _data.opType = opType;

                _data.action = opType;

                if (_.get(arguments[3], "action") === "copy") {
                    _data.action = "copy";
                }

                var _vo = _data.vo;
                //通过判断属性是否有get方法来判断是否是双向绑定的属性, 如果不是则清空
                for (var key in _vo) {
                    if (!Object.getOwnPropertyDescriptor(_vo, key).get) {
                        _vo[key] = null;
                    }

                    if (_.isPlainObject(_vo[key])) {
                        var objValue = _vo[key];
                        //为了性能考虑暂时只做2层对象属性处理，多级处理请重写afterInit单独处理
                        for (var objValuekey in objValue) {
                            if (!Object.getOwnPropertyDescriptor(objValue, objValuekey).get) {
                                //对象属性为声明的值直接删除
                                delete objValue[objValuekey];
                            }
                        };
                    }
                };

                //清空文件列表数据
                _.each(this.fileModel,function (item) {
                    item.cfg && item.cfg.params && (item.cfg.params.recordId = null);
                    item.data && (item.data = []);
                });

                if (_data.opType === "create") {
                    //设置newVO的默认值
                    //litao bug  14323 修改 这里不应该使用深拷贝，会导致数组不会被覆盖
                    //_.deepExtend(_vo, this.newVO());
                    _.extend(_vo,this.newVO(),transferVO||{});//按理论上说这里应该是重新赋值一个对象，以便和以前的对象分开。
                    _vo.compId = LIB.user.compId;
                }

                //重置表单校验
               if(this.$refs.ruleform){this.$refs.ruleform.resetFields()}
                this.changeView(_data.opType);
                //使用接口
                if(this.mainModel.untilCopy&&_data.action == "copy"){//直接复制，不通过查询接口
                    this.storeBeforeEditVo();
                }
                else if (_.contains(["view", "update"], _data.opType)) {
                    this.initData({ id: nVal },transferVO);
                }
                //因为initData是异步请求数据，因此 afterInit 只代表 init 同步方法 执行完成之后的回调
                //需要在数据初始化完成之后执行回调，请使用 afterInitData
                this.afterInit && this.afterInit(transferVO, { opType: opType, id: nVal });
            },
            //初始化数据
            initData: function(param,transferVO) {
                var _this = this;
                function setDataAfter(data) {
                    _this.storeBeforeEditVo();
                    if(_this.fileModel) {
                        if(data.id) {
                            _.each(_this.fileModel,function (item) {
                                item.cfg && item.cfg.params && (item.cfg.params.recordId = data.id);
                                item.data && (item.data = []);
                            });
                        }
                        //初始化附件 2019-05-15修改成适配多种类型附件
                        _this.$api.listFile({recordId: data.id}).then(function (res) {
                            if (!_this.afterInitFileData && !_.isEmpty(_this.fileModel)) {
                                var fileTypeMap = {};
                                _.each(_this.fileModel,function (item) {
                                    _.propertyOf(item)("cfg.params.dataType") && (fileTypeMap[item.cfg.params.dataType] = item);
                                });

                                _.each(res.data, function (file) {
                                    var fm = fileTypeMap[file.dataType];
                                    if(fm) {
                                        fm.data.push(LIB.convertFileData(file));
                                    }
                                });
                            } else {
                                _this.afterInitFileData(res.data);
                            }
                        });
                    }
                    if (_this.mainModel.action === 'copy') {
                        _this.mainModel.vo.code = '';
                    }
                    _this.afterInitData && _this.afterInitData(transferVO);
                    _this.$broadcast('init-card-filter');
                }
                if(this.mainModel.useMainData){
                    _.extend(_this.mainModel.vo, transferVO);
                    setDataAfter(_this.mainModel.vo);
                    return ;
                }
                this.$api.get(param).then(function(res) {
                    var data = res.data;

                    // 跨模块跳转时 判断数据是否为空
                    if(!data) {
                        LIB.Msg.error("没有权限");
                        return;
                    }
                    //TODO 未来考虑优化
                    var tmpVo = _this.newVO();
                    _.extend(tmpVo, data);
                    _.extend(_this.mainModel.vo, tmpVo);
                    setDataAfter(_this.mainModel.vo);
                });
            },
            //向上抛出ev_dtUpdate事件
            emitVoUpdatedEvent: function() {
                this.$dispatch("ev_dtUpdate");
            },
            storeBeforeEditVo: function() {
                //存储修改编辑前的变量, 如果点击取消后还原
                this.mainModel.beforeEditVo = {};
                // _.deepExtend(this.mainModel.beforeEditVo, this.mainModel.vo);
                this.mainModel.beforeEditVo = _.cloneDeep(this.mainModel.vo);
            },
            recoverBeforeEditVo: function() {
                //还原修改前的变量
                !_.isEmpty(this.mainModel.beforeEditVo) && _.extend(this.mainModel.vo, this.mainModel.beforeEditVo);
            }
        },
        computed: {
            isEditStatus: function() {
                return this.mainModel.opType === "update";
            },
            baseRules: function () {
                return this.mainModel.isReadOnly ? {} : this.mainModel.rules;
            },
            showPanelMask: function () {
                return this.mainModel.opType === 'create' || (this.mainModel.opType === 'update' && this.mainModel.action === 'copy');
            },
            allowEmpty: function () {
                return this.mainModel.opType !== 'create' && this.mainModel.action !== 'copy';
            }
        },
        events: {
            //edit框数据加载
            "ev_dtReload": function() {
                //this.init(opType, nVal);
                this.init.apply(this, arguments);
            }
        },
        created: function () {
            if(this.$api) {
                this.__auth__ = this.$api.__auth__;
            }
            var _this = this;
            //获取tableModel中最后一个columns，这里暂时按默认标准处理（即只有最后一列为tool列）
            _.each(this.$data.tableModel, function(item){
                if(!_.isEmpty(item.columns)) {
                    var col = _.last(item.columns);
                    if(col.fieldType && col.fieldType === "tool" && !_this.hasAuth("edit")) {
                        col.visible = false;
                    }
                }
            });
        },
        ready: function() {
            //以下为备选方案，这样实现需要调用refreshColumns()，性能不佳
            /*
            //循环当前页面下所有vue组件
            _.each(this.$children, function(item){
                //判断是否是simple-card组件
                if("simple-card" == item.$options.name) {
                    _.each(item.$children, function(cardItem) {
                        //判断simple-card组件中内部是否有Table
                        if("VueBootstrapTable" == cardItem.$options.name) {
                            var tableColumns = cardItem.columns;
                            var lastTableCol = _.last(cardItem.columns);
                            //如果Table最后一列是tool类型,则根据权限判断是否显示
                            if(lastTableCol.fieldType == "tool") {
                                lastTableCol.visible = false;
                                cardItem.refreshColumns();
                            }
                            console.log(_.last(cardItem.columns));
                        }
                    });
                }
            })*/
        }
    };

    return mixin;
});
