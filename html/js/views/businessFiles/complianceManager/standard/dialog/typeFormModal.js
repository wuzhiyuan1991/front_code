define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("../vuex/api");
    //vue数据
    var newVO = function () {
        return {
            id: null,
            name: null,
            parentId: '',
            code: null,
            insertPointObjId: null,
            orderNo: null,
            type: null
        };
    };

    var rules = {
        name: [
            {required: true, message: '请输入名称'},
            LIB.formRuleMgr.length(200)
        ],
        parentId: [LIB.formRuleMgr.allowStrEmpty]
    };

    //vue数据 配置url地址 拉取数据
    var dataModel = 
        {   
            charpterSelectedDatas:[],
            charpterParentList:[],
            detailId:null,
            mainModel: {
                vo: newVO(),
                isTopLevel: false,
                opType: 'create'
            },
            parentList: null, // 父级分类列表
            selectedDatas: [],
            chapterOrderList:[],
            positionKey: "last",
            orderList: [], // 排序位置列表
            positionList: [{ key: "first", name: "当前层级最前" }, { key: "last", name: "当前层级最后" }, { key: "middle", name: "某个节点之后" }],//位置方式列表
        };
     
    var vm = LIB.VueEx.extend({
        template: require("text!./typeFormModal.html"),
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            list: {
                type: Array,
                default: function () {
                    return []
                }
            },
            lists: {
                type: Array,
                default: function () {
                    return []
                }
            },
            spareId:{
                type:String,
                default:''
            }
        },
        computed: {
            rules: function () {
                if(this.mainModel.opType === 'create') {
                    return rules;
                }
                return _.assign(_.cloneDeep(rules), {code: LIB.formRuleMgr.codeRule()})
            },
            allowEmpty: function () {
                return this.mainModel.opType !== 'create';
            }
        },
        data: function () {
            return dataModel;
        },
        watch: {
            visible: function (val) {
                var _this = this;
                if(val) {
                    setTimeout(function() {
                        _this._setParentList();
                        _this._setOrderList();
                        _this._setChapterOrderList()
                    }, 200);
                }
                else {
                    this._reset();
                }
            }
        },
        methods: {
            _reset: function () {
                this.mainModel.isTopLevel = false;
                this.mainModel.vo = newVO();
                this.parentList = null;
                this.detailId=null,
                this.positionKey = "last";
                this.selectedDatas=[]
                this.orderList=null
                this.charpterSelectedDatas=[]
                this.chapterOrderList=null
                this.charpterParentList = null;
            },
            /**
             * 设置父级列表数据 更新某个节点时需要移除将该节点以及该节点的子节点
             * @private
             */
            _setParentList: function () {
                var list =[]
                var parentList=[]
                if (this.spareId=='main') {
                    list=this.list
                }else{
                    list=this.lists
                }
                if (this.mainModel.opType === 'update') {
                    var id = this.mainModel.vo.id;
                    parentList = _.filter(list, function (item) {
                        return item.id !== id && item.parentId !== id;
                    })
                } else {
                    parentList = list
                }
                if (this.spareId=='main') {
                    this.parentList=parentList
                }else{
                    this.charpterParentList=parentList
                }
                this.selectedDatas = [{id: this.mainModel.vo.parentId}];
                this.charpterSelectedDatas=[{id: this.mainModel.vo.parentId}];
            },
            /**
             * 设置排序位置列表数据
             * @param pid 父级节点id
             * @private
             */
            _setChapterOrderList: function (pid) {
               
                var chapterOrderList = null;
                var parentId = pid ||this.mainModel.vo.parentId;
                var id = this.mainModel.vo.id;
                // var orderNo = this.mainModel.vo.orderNo;
                if(parentId) {
                    chapterOrderList = _.filter(this.lists, function (item) {
                        return item.parentId === parentId;
                    });
                } else {
                    chapterOrderList = _.filter(this.lists, function (item) {
                        return !item.parentId;
                    });
                }
                chapterOrderList = _.sortBy(chapterOrderList, function (item) {
                    return item.orderNo ? parseInt(item.orderNo) : 0;
                });
                if(id) {
                    var index = _.findIndex(chapterOrderList, "id", id);
                    chapterOrderList.splice(index, 1);
                    var prevItem = index > 0 ? chapterOrderList[index - 1] : null;
                    if(prevItem) {
                        this.mainModel.vo.insertPointObjId = prevItem.id;
                    }
                }
                
                this.chapterOrderList = chapterOrderList;

                if(!_.isArray(chapterOrderList) || chapterOrderList.length === 0) {
                    this.mainModel.vo.insertPointObjId = '';
                }
            },
            _setOrderList: function (pid) {
               
                var orderList = null;
                var parentId = pid ||this.mainModel.vo.parentId;
                var id = this.mainModel.vo.id;
                // var orderNo = this.mainModel.vo.orderNo;
                if(parentId) {
                    orderList = _.filter(this.list, function (item) {
                        return item.parentId === parentId;
                    });
                } else {
                    orderList = _.filter(this.list, function (item) {
                        return !item.parentId;
                    });
                }
                orderList = _.sortBy(orderList, function (item) {
                    return item.orderNo ? parseInt(item.orderNo) : 0;
                });
                if(id) {
                    var index = _.findIndex(orderList, "id", id);
                    orderList.splice(index, 1);
                    var prevItem = index > 0 ? orderList[index - 1] : null;
                    if(prevItem) {
                        this.mainModel.vo.insertPointObjId = prevItem.id;
                    }
                }
                
                this.orderList = orderList;

                if(!_.isArray(orderList) || orderList.length === 0) {
                    this.mainModel.vo.insertPointObjId = '';
                }
            },
            _getURL: function () {
                if (this.detailId) {
                    if (this.mainModel.opType === 'create') {
                        return api.savestandardChapter
                    }else{
                        return api.updatestandardChapter
                    }
                    
                }

                // 添加子级节点
                if(this.mainModel.opType === 'create') {
                    return api.createLegalType;
                }

                // 更新子级节点
                return api.updateLegalType;
            },

            _buildParams: function () {
                var _this = this;
                switch (this.positionKey) {
                    case "first":
                        this.mainModel.vo.orderPosition = 2
                        break;
                    case "middle":
                        this.mainModel.vo.orderPosition = 3
                        if (!_this.mainModel.vo.insertPointObjId) {
                            _this.mainModel.vo.insertPointObjId = _this.spareId=='main'? _this.orderList.slice(-1)[0].id:_this.chapterOrderList.slice(-1)[0].id;
                        }
                        _this.mainModel.vo["criteria"] = {
                            strValue: {insertPointObjId: _this.mainModel.vo.insertPointObjId}
                        };
                        break;
                    case "last":
                        this.mainModel.vo.orderPosition = 1;
                        if (!_this.mainModel.vo.insertPointObjId) {
                            if (_this.spareId=='main'&&_this.orderList.length>0) {
                                _this.mainModel.vo.insertPointObjId =_this.orderList.slice(-1)[0].id
                            }else if (_this.spareId=='detail'&&_this.chapterOrderList.length>0) {
                                _this.mainModel.vo.insertPointObjId =_this.chapterOrderList.slice(-1)[0].id
                            }else{
                                _this.mainModel.vo.insertPointObjId = null
                            }
                             
                        }
                        _this.mainModel.vo["criteria"] = {
                            strValue: {insertPointObjId: _this.mainModel.vo.insertPointObjId}
                        };
                        break;
                    default:
                        this.mainModel.vo.orderPosition = 1
                        break;
                } // 添加子级节点
                if (this.mainModel.opType === 'create') {
                    return _.omit(this.mainModel.vo, ["id", "children", "open"]);
                }

                // 更新子级节点
                return _.omit(this.mainModel.vo, ["children", "open"]);
            },
            _getCallback: function () {
                var _this = this;

                // 添加子节点的回调函数
                var createCallback = function (res) {
                    // _this.mainModel.vo.id = res.data.id;
                    LIB.Msg.info("添加成功");
                    _this.$emit("do-tree-save", "create");
                };

                // 更新一级节点的回调函数
                var updateCallback = function () {
                    LIB.Msg.info("修改成功");
                    _this.$emit("do-tree-save", "update");
                };

                if(this.mainModel.opType === 'create') {
                    return createCallback;
                }
                return updateCallback;
            },
            doSave: function () {
                var that =this
                var apiURL = this._getURL();
                var params = this._buildParams();
                var callback = this._getCallback();
                // if(this.mainModel.opType === 'update' && this.lastParentId !== params.parentId) {
                //     params.orderNo = 1e8;
                // }

                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var same = false
                        _.each(that.orderList, function (item) {
                            if (item.name == that.mainModel.vo.name) {

                                same = true
                                return false
                            }
                        })
                        _.each(that.chapterOrderList, function (item) {
                            if (item.name == that.mainModel.vo.name) {

                                same = true
                                return false
                            }
                        })
                        if (same) {
                            LIB.Msg.info("名称不能与同级相同,请修改名称！");
                            return
                        }
                        if (that.detailId) {
                            apiURL({id:that.detailId}, params).then(callback);
                            that.detailId=null
                        }else{
                            apiURL(null, params).then(callback);
                        }
                        
                    }
                });
            },
            // 父级节点改变后调用
            doChangeParent: function (id) {
                this.mainModel.vo.orderNo = '';
                this._setOrderList(id);
            },
            doChangechapterParent:function(id){
                this.mainModel.vo.orderNo = '';
                this._setChapterOrderList(id);
            },
            afterInit:function(){
                this.positionKey = "last";
            }
        },
        events: {
            "ev_le_regulation": function (action, data,id) {
                if(id){
                    this.detailId=id
                }
                this.orderList = [];
                this.lastParentId = '';
                var _vo = dataModel.mainModel.vo;
                _.extend(_vo, newVO());
                if (action === 'create') {
                    this.mainModel.vo.parentId = data.id;
                    this.mainModel.opType = 'create';
                } else if (action === 'update') {
                    _.deepExtend(_vo, data);
                    this.mainModel.opType = 'update';
                    this.lastParentId = _vo.parentId;
                }
              
            }
        }
    });
    return vm;
});