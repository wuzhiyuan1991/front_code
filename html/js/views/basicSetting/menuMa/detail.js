define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    //vue数据
    var newVO = function () {
        return {
            id: null,
            code: null,
            name: null,
            attr2: null,
            attr1: null,
            remarks: null,
            parentId: null,
            parent:{id:null, name:null},
            disable: "0",
            attr5: "2",
            menuLevel: null,
            icon: '',
            quote: {id: '', name: ''},
            tpaUrl: '',
            callBackContent: '',
            insertPointObjId: null
        }
    };

    var icons = [
        {
            value: 'icon-coins'
        },
        {
            value: 'icon-folder_bookmark'
        },
        {
            value: 'icon-hammer'
        },
        {
            value: 'icon-home'
        },
        {
            value: 'icon-inspect'
        },
        {
            value: 'icon-basic'
        },
        {
            value: 'icon-menu'
        },
        {
            value: 'icon-org'
        },
        {
            value: 'icon-data'
        },
        {
            value: 'icon-message'
        },
        {
            value: 'icon-message2'
        },
        {
            value: 'icon-hiddenF'
        },
        {
            value: 'icon-riskD'
        },
        {
            value: 'icon-postD'
        },
        {
            value: 'icon-test'
        },
        {
            value: 'icon-rectification'
        },
        {
            value: 'icon-statistics'
        },
        {
            value: 'icon-trainingData'
        },
        {
            value: 'icon-expertSupport'
        },
        {
            value: 'icon-messageM'
        },
        {
            value: 'icon-homepage'
        },
        {
            value: 'icon-thirdpartyM'
        },
        {
            value: 'icon-thirdpartyH'
        },
        {
            value: 'icon-thirdpartyF'
        },
        {
            value: 'icon-settime'
        },
        {
            value: 'icon-stimulate'
        },
        {
            value: 'icon-safe-audit'
        },
        {
            value: 'icon-safe-leadship'
        },
        {
            value: 'icon-dominationArea'
        },
        {
            value: 'icon-risk-resource'
        },
        {
            value: 'icon-dev-manager'
        }
    ];

    //vue数据 配置url地址 拉取数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            flag: null,
            disableList: [{value: "0", name: "启用"}, {value: "1", name: "停用"}],
            menuTypeList: [{value: "1", name: "超级管理员菜单"}, {value: "2", name: "普通用户菜单"}]
        },

        rules: {
            "name": [LIB.formRuleMgr.require("名称"),
                LIB.formRuleMgr.length(50, 0)
            ],
            // "name": [LIB.formRuleMgr.require("路由地址"),
            //     LIB.formRuleMgr.length()
            // ],
            "type": [LIB.formRuleMgr.require("类型"),
                LIB.formRuleMgr.length()
            ],
        },
        icons: icons,
        selectedDatas: [],
        selectedParents: [],
        menuModel: {
            show: false,
            title: '选择菜单'
        },
        parentModel: {
            show: false,
            title: '选择菜单'
        },
        menuType: '1',
        orderList: null,
    };
    var vm = LIB.VueEx.extend({
        template: require("text!./detail.html"),
        props: {
            menus: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            parents: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data: function () {
            return dataModel;
        },
        //引入html页面
        methods: {
            onMenuTypeChange: function () {
                var t = this.menuType;
                if (t === '2') {
                    this.mainModel.vo.attr1 = '/home/tpaIframe';
                    this.mainModel.vo.attr2 = 'views/home/iframe/iframe';
                } else {
                    this.mainModel.vo.attr1 = '';
                    this.mainModel.vo.attr2 = '';
                    this.mainModel.vo.tpaUrl = '';
                    this.mainModel.vo.callBackContent = '';
                }
            },
            //保存
            doSave: function () {
                var _this = this;
                if (this.mainModel.flag === "add") {
                    var callback1 = function (res) {
                        _this.mainModel.vo.id = res.body.id;
                        LIB.Msg.info("添加成功");
                        _this.$emit("doupdata", dataModel.mainModel, "add")
                    };
                    api.add(null, {
                        name: _this.mainModel.vo.name,
                        parentId: _this.mainModel.vo.parentId,
                        attr1: _this.mainModel.vo.attr1,
                        attr2: _this.mainModel.vo.attr2,
                        disable: _this.mainModel.vo.disable,
                        remarks: _this.mainModel.vo.remarks,
                        attr5: _this.mainModel.vo.attr5,
                        icon: _this.mainModel.vo.icon,
                        menuLevel: _this.mainModel.vo.menuLevel,
                        tpaUrl: _this.mainModel.vo.tpaUrl,
                        callBackContent: _this.mainModel.vo.callBackContent,
                        code: _this.mainModel.vo.code,
                        "criteria": {strValue: {insertPointObjId: this.mainModel.vo.insertPointObjId}}
                    }).then(callback1)

                } else {
                    var callback = function (res) {
                        LIB.Msg.info("修改成功");
                        _this.$emit("doupdata", dataModel.mainModel)
                    };
                    var param = _.pick(dataModel.mainModel.vo,
                        "id",
                        "code",
                        "icon",
                        "parentId",
                        "name",
                        "attr2",
                        "attr1",
                        "remarks",
                        "disable",
                        "attr5",
                        "menuLevel",
                        "tpaUrl",
                        "callBackContent"
                    );
                    param["criteria"] = {strValue:{insertPointObjId: this.mainModel.vo.insertPointObjId}};
                    api.update(param).then(callback)
                }
            },
            doShowMenuModal: function () {
                this.menuModel.show = true;
            },
            doChooseMenu: function (data) {
                this.mainModel.vo.quote = data.data;
                this.mainModel.vo.attr1 = data.data.attr1;
                this.mainModel.vo.attr2 = data.data.attr2;
                this.menuModel.show = false;
            },
            doShowParentModal: function () {
                this.parentModel.show = true;
            },
            doChooseParent: function (data) {
                this.mainModel.vo.parentId = data.data.id;
                this.mainModel.vo.parent.id = data.data.id;
                this.mainModel.vo.parent.name = data.data.name;
                var _vo = dataModel.mainModel.vo;
                this.orderList = _.filter(this.menus, 'parentId', data.data.id);
                if(_vo.id) {
                    var index = _.findIndex(this.orderList, "id", _vo.id);
                    var prevItem = this.orderList[index - 1];
                    if(index > -1) {
                        this.orderList.splice(index, 1);
                    }
                    if (prevItem) {
                        this.$nextTick(function () {
                            _vo.insertPointObjId = prevItem.id;
                        })
                    }else{
                        _vo.insertPointObjId = null;
                    }
                }

                this.parentModel.show = false;
            }
        },
        events: {
            //点击取得id跟name值 双向绑定
            "ev_detailReload": function (data, nVal, orderList) {
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                this.mainModel.flag = nVal;

                if (!data) {
                    _vo.parentId = "";
                    _vo.menuLevel = "1";
                    return;
                }

                var _data = _.cloneDeep(data.data);
                if (nVal !== "add") {
                    var index = _.findIndex(orderList, "id", _data.id);
                    var prevItem = orderList[index - 1];
                    orderList.splice(index, 1);
                    _.deepExtend(_vo, _data);
                    if (prevItem) {
                        this.$nextTick(function () {
                            _vo.insertPointObjId = prevItem.id;
                        })
                    }
                } else {
                    dataModel.mainModel.vo.parentId = _data.id;
                    var level = parseInt(_data.menuLevel) + 1;
                    _vo.menuLevel = level.toString();
                    var lastItemId = _.get(_.last(orderList), "id", "");
                    _vo.insertPointObjId = lastItemId;
                }
                var parent = _.find(this.menus, "id", dataModel.mainModel.vo.parentId);
                if(!!parent) {
                    dataModel.selectedParents.push(parent);
                    _.deepExtend(dataModel.mainModel.vo.parent, parent);
                    this.parents = _.filter(this.menus, function(item){
                        return item.menuLevel <= parent.menuLevel;
                    });
                }

                this.orderList = orderList;
            }
        }
    });
    return vm;
});