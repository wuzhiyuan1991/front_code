define(function(require) {

    var LIB = require('lib');

    var component = {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            queryUrl : {
                type: String
            },
            disabledFields : {
                type : Array,
                "default" : function(){return [];}
            },
            hiddenFields : {
                type : Array,
                "default" : function(){return [];}
            },
            autoHide: {
                type: Boolean,
                default: true
            }
        },
        watch : {
            visible : function(val) {
                //当影藏组件时清空当前数据
                if(!val) {
                    _.deepExtend(this.mainModel.vo, this.newVO());
                    this.mainModel.opType = "create";
                }
            }
        },
        methods : {
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
                    if((beforeEditVo && _.get(beforeEditVo, key) == _.get(vo, key)) || _.get(vo, key)) {
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
            doSave : function() {
                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if(this.beforeDoSave() === false) {
                    return;
                }
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        var data = {};

                        var _vo = _this.buildSaveData() || _this.mainModel.vo;

                        _.deepExtend(data, _vo);

                        //_.deepExtend(_this.mainModel.vo, newVO());
                        if(_this.autoHide) {
                            _this.visible = false;
                        }

                        if (_this.mainModel.opType === "create") {
                            _this.$emit("do-save", data);
                        } else if (_this.mainModel.opType === "update") {
                            data = _this._checkEmptyValue(data);
                            _this.$emit("do-update", data);
                        }
                    }
                });
            },
            beforeDoSave:function(){

            },
            doQuery:function(param) {
                var _this = this;
                var resource = this.$resource(this.queryUrl);
                resource.get(param).then(function(res){
                    var data = res.data;
                    if(data) {
                        _.deepExtend(_this.mainModel.vo, data);
                        _this.mainModel.beforeEditVo = data;
                    } else {
                        LIB.Msg.error("没有权限");
                        _this.visible = false;
                    }
                    if(typeof _this.afterInitData === 'function') {
                        _this.afterInitData(res.data);
                    }
                    //附件处理
                    if(_this.fileModel && _this.$api && _this.$api.listFile) {
                        if(data.id) {
                            _.each(_this.fileModel,function (item) {
                                item.cfg && item.cfg.params && (item.cfg.params.recordId = data.id);
                                item.data && (item.data = []);
                            });
                        }
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
                });
            },
            changeView:function(opType) {
                this.mainModel.opType = opType;
                if(_.contains(["view","update"], opType)) {
                    this.mainModel.title = this.$tc("gb.common.detail");
                    // this.mainModel.isReadOnly = true;
                } else if(opType == "create"){
                    this.mainModel.title = this.$tc("gb.common.add");
                    // this.mainModel.isReadOnly = false;
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
            /*
                 opType :       //操作类型
                         create
                         view
                         update
                 nVal ：     //当opType 为 view/update 时， 请求后端接口 需要的最小参数， 一般是一个或多个主键以及外键Id,
                         {id:xxx, xxxId:xxx}    //id值
                            //当opType 为 create 时， 请求后端接口 需要的其他参数, 不适合传递复杂对象
                 transferVO ：   //当opType 为 view/update 时， 可传递过来完整的业务对象，
                                 //在initData调用之前， 虽然 transferVO 的属性不一定和 接口调用后返回的属性完全一致，
                                 //但依旧可以在 beforeInit、afterInit 方法可获取transferVO的属性，进行页面的优化处理，
                                 //如果需要强一致性，可在查询请求接口之后的回调afterInitData中继续处理页面一致性问题
                         {id:xxx,name:xxx,...}
            */
            init:function(opType, nVal, transferVO) {
                this.beforeInit && this.beforeInit();
                var _data = this.mainModel;
                _data.opType = opType;
                var _vo = _data.vo;
                this.mainModel.beforeEditVo = null;

                //清空数据
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

                if (_data.opType === "create") {
                    //设置newVO的默认值
                    _.deepExtend(_vo, this.newVO());
                    if(_.isObject(nVal)) {
                        _.deepExtend(_vo, nVal);
                    }

                    _vo.compId = LIB.user.compId;
                }

                //重置表单校验
                this.$refs.ruleform.resetFields();

                this.changeView(_data.opType);
                if(_.contains(["view","update"],_data.opType)) {
                    this.initData(nVal);
                }

                //因为initData是异步请求数据，因此 afterInit 只代表 init 同步方法 执行完成之后的回调
                //需要在数据初始化完成之后执行回调，请使用 afterInitData
                if(typeof this.afterInit === 'function') {
                    this.afterInit(transferVO);
                }
                this.initFileFormItemRecordId();

            },
            initFileFormItemRecordId: function(){
                var _this = this;
                if(this.mainModel.opType === 'create' && this.fileModel && this.$api && this.$api.getUUID){
                    this.$api.getUUID().then(function (res) {
                        _this.mainModel.vo.id = res.data;
                        _.each(_this.fileModel,function (item) {
                            item.cfg && item.cfg.params && (item.cfg.params.recordId = res.data);
                            item.data && (item.data = []);
                        });
                        debugger
                    })
                }
            },
            //初始化数据
            initData:function(param){
                var _this = this;
                // this.$api.get(param).then(function(res){
                //     var data = res.data;
                //     _.deepExtend(_this.mainModel.vo, data);
                // });
                this.doQuery(param);
            },
            /**
             * 目的：可能FormModal弹窗中需要引用较大的资源文件，可以通过异步懒加载，避免detail页面加载过多资源
             * 使用方法：
             * 1. 在 vue 生命周期方法 init 方法中定义异步懒加载的依赖
                  init: function () {
                    this.requireLazy = {
                        "uploadify": "views/businessFiles/trainingManagement/course/uploadify/jquery.uploadify.min.v3.2.1",
                        "swfobject": "views/businessFiles/trainingManagement/course/uploadify/swfobject"
                    };
                  }
               2. 在 method 中自定的组件生命周期 init 方法中启用异步懒加载判断
                 methods : {
                    init: function (opType, nVal) {
                        if (this.isRequireLazyLoaded()) {
                            this.requireLazyLoad(opType, nVal);
                            return;
                        }
                        ... ...
                     }
                 }
             * @param opType
             * @param nVal
             */
            requireLazyLoad:function(opType, nVal) {
                var _this = this;
                var paths = _.values(_this.requireLazy);
                var keys = _.keys(_this.requireLazy);
                require(paths, function () {
                    var callBackDatas = arguments;
                    _.each(paths, function (item, index) {
                        _this.requireLazy[keys[index]] = callBackDatas[index];
                    });
                    _this.requireLazyInited = true;
                    _this.init(opType, nVal);
                });
            },
            isRequireLazyLoaded:function() {
                return !this.requireLazyInited && this.requireLazy;
            },
            cancel: function () {
                var _this = this;
                if(this.mainModel.opType === 'create' && _this.fileModel){
                        var fileIds = [];
                        _.each(_this.fileModel,function (item) {
                            _.each(item.data,function (it) {
                                fileIds.push(it.fileId);
                            })
                        });
                        if(fileIds.length){
                            this.$resource("file").delete("file", fileIds);
                        }

                }

            },
        },
        computed: {
            allowEmpty: function () {
                return this.mainModel.opType !== 'create' && this.mainModel.action !== 'copy';
            }
        },
    };

    return component;
});