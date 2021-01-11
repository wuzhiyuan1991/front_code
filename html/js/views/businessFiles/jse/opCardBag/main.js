define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var opCardSelectModal = require("componentsEx/selectTableModal/opCardSelectModal");
    var opMcardSelectModal = require("componentsEx/selectTableModal/opMaintCardSelectModal");
    var opEcardSelectModal = require("componentsEx/selectTableModal/opEmerCardSelectModal");

    var stdPreviewModal = require("../opStdCard/dialog/preview");
    var maintPreviewModal = require("../opMaintCard/dialog/preview");
    var emerPreviewModal = require("../opEmerCard/dialog/preview");
    var sumMixin = require("../mixin/sumMixin");

    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	//	var detailPanel = require("./detail-xl");
	LIB.registerDataDic("jse_op_card_bag_type", [
		["1","文件夹"],
		["2","卡票"]
	]);

	var newVO = function () {
        return {
            name: null,
            type: '1',
            parentId: null,
            disable: '0',
            cardId: null
        }
    };
    
    var initDataModel = function () {
        return {
            moduleCode: "opCardBag",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside",
//				detailPanelClass : "large-info-aside"
                vo: newVO(),
                rules: {
                    name: [
                        LIB.formRuleMgr.require("文件夹名称"),
                        LIB.formRuleMgr.length(20)
                    ]
                }
            },
            tableModel: {
				selectedDatas: []
			},
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/opCardBag/importExcel"
            },
            exportModel : {
            	 url: "/opCardBag/exportExcel"
            },
			bagTypes: [
                // {
					// id: '1',
					// name: '我的票卡包'
                // },
                // {
                //     id: '2',
                //     name: '部门的票卡包'
                // },
                {
                    id: null,
                    name: '票卡包'
                }
			],
            bagIndex: 0,
            paths: null,
            bags: null,
            opCardSelectModel : {
                visible : false,
                filterData : {orgId : null}
            },
            opMCardSelectModel : {
                visible : false,
                filterData : {orgId : null}
            },
            opECardSelectModel : {
                visible : false,
                filterData : {orgId : null}
            },
            formModel: {
                visible: false
            },
            stdPreviewModel: {
                visible: false
            },
            maintPreviewModel: {
                visible: false
            },
            emerPreviewModel: {
                visible: false
            },
            cardId: ''
        };
    };

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, sumMixin],
    	template: tpl,
        data: initDataModel,
        components: {
            opcardSelectModal: opCardSelectModal,
            opMcardSelectModal: opMcardSelectModal,
            opEcardSelectModal: opEcardSelectModal,
            stdPreviewModal: stdPreviewModal,
            maintPreviewModal: maintPreviewModal,
            emerPreviewModal: emerPreviewModal
        },
        methods: {
            // 获取卡包数据，并缓存
            _getBags: function (params) {
                var _this = this;
                this._cacheBags = null;
                api.list(params).then(function (res) {
                    _this._cacheBags = res.data.list;
                    _this._filterByParentId();
                })
            },

            // 新增票卡
            doShowOpCardSelectModal : function() {
                this.opCardSelectModel.filterData = {orgId : LIB.user.orgId};
                this.opCardSelectModel.visible = true;
            },
            doShowOpMCardSelectModal : function() {
                this.opMCardSelectModel.filterData = {orgId : LIB.user.orgId};
                this.opMCardSelectModel.visible = true;
            },
            doShowOpECardSelectModal : function() {
                this.opECardSelectModel.filterData = {orgId : LIB.user.orgId};
                this.opECardSelectModel.visible = true;
            },
            // 保存票卡
            doSaveOpCard : function(selectedDatas) {
                var _this = this;
                var parentId = _.get(this.checkPath, "id");
                var params = _.map(selectedDatas, function (item) {
                    return {
                        type: '2',
                        cardId: item.id,
                        parentId: parentId,
                        disable: '0',
                        name: null
                    };
                });
                api.create(params).then(function () {
                    _this._getBags();
                    LIB.Msg.success("添加成功");
                });
            },
            // 新增文件夹
            doAddBag: function () {
                this.mainModel.vo = newVO();
                this.mainModel.vo.parentId = _.get(this.checkPath, "id");
                this.formModel.visible = true;
            },
            // 保存文件夹
            doSaveBag: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        var vo = _this.mainModel.vo;
                        if(vo.id) {
                            api.update(vo).then(function () {
                                _this._getBags();
                                _this.formModel.visible = false;
                                LIB.Msg.success("保存成功");
                            })
                        } else {
                            var folders = _.filter(_this.bags, function (item) {
                                return item.type === '1'
                            });
                            var folder = _.last(folders);
                            var first;
                            if (folder) {
                                _.set(vo, "criteria.strValue.insertPointObjId", folder.id);
                            } else {
                                first = _.first(_this.bags);
                                if (first) {
                                    _.set(vo, "criteria.strValue.insertPointObjId", first.id);
                                }
                            }
                            api.create([vo]).then(function (res) {
                                var id = _.get(res, "data[0]");
                                if (first && id) {
                                    setTimeout(function () {
                                        _this.doMove(-1, {id: id, parentId: vo.parentId}, true);
                                    }, 300)
                                } else {
                                    _this._getBags();
                                }
                                _this.formModel.visible = false;
                                LIB.Msg.success("保存成功");
                            })
                        }

                    }
                });
            },

            renderIcon: function (bag) {
                if (bag.type === '1') {
                    return 'folder';
                }
                var icons = {
                    '1': 'ios-film',
                    '2': 'android-list',
                    '3': 'ios-list'
                };
                return icons[bag.opCard.type];
            },
            // 移动
            doMove: function (offset, data, silent) {
                var _this = this;
                var param = {
                    id: data.id,
                    parentId: data.parentId
                };
                _.set(param, "criteria.intValue.offset", offset);
                api.order(param).then(function () {
                    _this._getBags();
                    if (!silent) {
                        LIB.Msg.success("移动成功");
                    }
                });
            },

            // 修改
            doUpdate: function (bag) {
                this.mainModel.vo = newVO();
                _.extend(this.mainModel.vo, bag);
                this.formModel.visible = true;
            },

            // 删除
            doDelete: function (bag) {

                var _this = this;

                api.remove(null, {id: bag.id}).then(function () {
                    _this._getBags();
                    LIB.Msg.success("删除成功");
                })

            },

            // 点击文件夹或者票卡
            doClickBag: function (bag) {
                if (bag.type === '1') {
                   this.paths.push({id: bag.id, name: bag.name});
                    this._filterByParentId();
                } else if (bag.type === '2'){
                    this.cardId = bag.opCard.id;
                    this._openPreview(bag.opCard.type);
                }
            },
            _openPreview: function (type) {
                if (type === '1') {
                    this.stdPreviewModel.visible = true;
                }
                else if (type === '2') {
                    this.maintPreviewModel.visible = true;
                }
                else if (type === '3') {
                    this.emerPreviewModel.visible = true;
                }
            },
            // 点击面包屑导航项
            doClickBreadItem: function (index, path) {
                this.paths = this.paths.slice(0, index + 1);
                this._filterByParentId();
            },
            doOrgCategoryChange: function (obj) {
                this._getBags({orgId: obj.nodeId});
            },
            // 初始化
            _init: function () {
                this.paths = [];
                this.paths.push(this.bagTypes[0]);
                this.onTableDataLoaded();
            },
            // 根据parentId过滤需要显示的列表
            _filterByParentId: function () {
                // 缓存当前活动路径， 方便保存文件夹或者票卡是获取parentId
                this.checkPath = _.last(this.paths);
                var parentId = _.get(this.checkPath, "id");

                var bags = _.filter(this._cacheBags, function (item) {
                    return parentId ? item.parentId === parentId : !item.parentId;
                });
                bags = _.sortBy(bags, function (item) {
                    return parseInt(item.orderNo);
                });

                this.bags = bags;
            }
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
        attached: function () {
            this._init();
            this._getBags();
        }
    });

    return vm;
});
