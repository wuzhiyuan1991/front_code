define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    require("componentsEx/treeModal/treeModal");

    var initAuthority = function () {
        return {id: '', code: '', name: '', parentId: '', disable: ''}
    };

    //vue数据 配置url地址 拉取数据
    var dataModel = {
        mainModel: {
            disableList: [{value: "0", name: "启用"}, {value: "1", name: "停用"}]
        },
        actionType: '',
        rules: {
            "name": [LIB.formRuleMgr.require("名称"),
                LIB.formRuleMgr.length(50, 0)
            ],
            "code": [LIB.formRuleMgr.length(10, 0)]
        },
        codeItems: null,
        prefixCode: '',
        defaultRight: {
            'create': false,
            'update': false,
            'delete': false,
            'import': false,
            'export': false
        },
        authority: initAuthority(),
        disablePrefix: false
    };

    var codeMap = {
        'create': '001',
        'update': '002',
        'delete': '003',
        'import': '004',
        'export': '005'
    };
    var nameMap = {
        'create': '新增',
        'update': '编辑',
        'delete': '删除',
        'import': '导入',
        'export': '导出'
    };

    var vm = LIB.VueEx.extend({
        template: require("text!./detail.html"),
        data: function () {
            return dataModel;
        },
        //引入html页面
        methods: {
            //保存
            doSave: function () {
                var params;

                if (this.actionType === "add") {
                    if (!this.prefixCode || this.prefixCode.length !== 7) {
                        return LIB.Msg.error("权限码前缀必须是7位", 2);
                    }
                    params = this._normalizeCreateParameters();
                    this._checkCodeExist(params);
                } else {
                    params = {
                        id: this.authority.id,
                        authority: this.authority
                    };
                    this._doUpdate(params);
                }
            },
            _normalizeCreateParameters: function () {
                var _this = this;
                var ret = [];
                var defaultRight = this.defaultRight;
                var codeItems = this.codeItems;

                var keys = _.map(codeMap, function (v, k) {
                    return k
                });

                _.forEach(keys, function (k) {
                    if (defaultRight[k]) {
                        ret.push(_this._normalizeRight(codeMap[k], nameMap[k]))
                    }
                });
                
                _.forEach(codeItems, function (item) {
                    ret.push(_this._normalizeRight(item.code, item.name))
                });

                return ret;
            },
            _normalizeRight: function (code, name) {
                return {
                    code: this.prefixCode + code,
                    id: this.prefixCode + code,
                    name: name,
                    disable: '0',
                    parentId: this.parentId
                }
            },
            _checkCodeExist: function (params) {
                var _this = this;
                var message;
                var ret = [];
                _.forEach(params, function (param) {
                    if (_.includes(_this.existCodes, param.code)) {
                        ret.push(param)
                    }
                });
                if (ret.length > 0) {
                    message = _.map(ret, "name").join("、");
                    return LIB.Msg.error(message + "的编码重复");
                }

                this._doCreate({funcAuthList: params});
            },
            _doCreate: function (params) {
                var _this = this;
                api.add(null, params).then(function (res) {
                    LIB.Msg.info("添加成功");
                    _this.$emit("do-update", params.funcAuthList, "add")
                })
            },
            _doUpdate: function (params) {
                var _this = this;
                api.update(params).then(function () {
                    LIB.Msg.info("修改成功");
                    _this.$emit("do-update", params.authority)
                })
            },
            _initCreate: function (data) {
                this.disablePrefix = false;
                this.codeItems = [];
                this.prefixCode = '';
                this.parentId =  data.id;

                this.existCodes = _.map(data.funcAuthList, "code");
                if (this.existCodes.length > 0) {
                    this.prefixCode = this.existCodes[0].substr(0, 7);
                    this.disablePrefix = true;
                }
            },
            _initUpdate: function (data) {
                this.authority = initAuthority();
                _.deepExtend(this.authority, _.pick(data, ["id", "code", "name", "parentId", "disable"]));
            },
            appendCode: function () {
                this.codeItems.push({
                    code: '',
                    name: ''
                });
            }
        },
        events: {
            //点击取得id跟name值 双向绑定
            "ev_detailReload": function (data, type) {
                this.actionType = type;
                if (type === "add") {
                    this._initCreate(data);
                } else {
                    this._initUpdate(data);
                }
            }
        }
    });
    return vm;
});