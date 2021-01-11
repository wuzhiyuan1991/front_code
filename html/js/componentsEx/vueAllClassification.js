define(function (require) {
    var Vue = require("vue");
    var LIB = require('lib');
    var Poptip = require("components/iviewPoptip");
    var temp = '<Poptip class="custom-category-poptip" placement="bottom-start" :hide-trigger=hideTrigger>' +
        '<a class="category-name showLinkColorA">' +
        '<div style="float:left;" class="showLinkColor" >{{topCategory.title}}<span v-if="!Nodeval.name">&nbsp;</span></div>' +
        '<div v-if="Nodeval.name" style="float:left;">,</div>' +
        '<div v-if="Nodeval.name" style="white-space:nowrap;max-width:110px;overflow:hidden;text-overflow:ellipsis;float:left">{{Nodeval.name}}</div>' +
        '<Icon type="chevron-down" class="showLinkColor" style="font-size:16px;"></Icon>' +
        '</a>' +
        '<div slot="content"><div class="classification" @click.stop="" style="background:#fff">' +
        '<div class="classificationLeft">' +
        '<ul >' +
        '<li v-for="item in model" :class="{active: tempActiveName == item.title}" @click.stop="showCategoryNode(item,$index)">{{item.title}}</li>' +
        '</ul>' +
        '</div>' +
        '<div class="classificationRight" id="menuRight" style="width:497px;">' +
        '<div class="Btitle">' +
        '<breadcrumb>' +
        '<breadcrumb-item @click.stop="showCategoryNode(tempTopCategory)">{{tempTopCategory.title}}</breadcrumb-item>' +
        '<breadcrumb-item v-for="category in tempNodeCategory" ' +
        '@click.stop="showCrumbs(category,2)">{{category.name}}</breadcrumb-item>' +
        '</breadcrumb>' +
        '</div>' +
        '<div class="navBarlist">' +
        '<ul style="height: 230px;overflow-x: hidden;">' +
        '<li v-for="node in nodeChilditem"  style="position: relative;" v-if="getDataDic(node.id)" class="showLinkColor" :class="{navBarli:!((showSet && (!showInput)) && showSpan) || (node.children && (!showInput)),navBarliHover:((showSet && (!showInput)) && showSpan) || (node.children && (!showInput))}">' +
        '<span class="leftbtn" @click.stop="showCrumbs(node,3)" :class="{allwidth :editSpanWidth}"' +
        '><span v-if="showSet && node.code">{{node.code}}&nbsp;,&nbsp;</span>{{node.name}}</span>' +
        '<span v-if="showicon" class="seticon" style="width:50px">' +
        '<Icon type="edit" @click.stop="showEditNode(node)" style="margin-left:10px;"></Icon>' +
        '<Icon type="trash-a" @click.stop="doDelNode($event,node)"></Icon>' +
        '</span>' +
        '<span style="width: 9%;height:40px;" class="pull-right rightbtn" @click.stop="showCrumbs(node,0)" >' +
        '<span style="display:block;height:24px;margin-top: 8px;border-left: 1px solid #ececec;"' +
        'v-if="((showSet && (!showInput)) && showSpan) || (node.children && (!showInput))" >' +
        '<Icon type="ios-arrow-right" style="font-size:18px;vertical-align: top;margin-top: 3px;"></Icon>' +
        '</span>' +
        '</span>' +
        '</li>' +
        '</ul>' +
        '<div class="setdiv" @click.stop="do_showInput" v-if="showSet">' +
        '<icon type="gear-b" v-if="!showInput"></icon><icon type="ios-undo" v-if="showInput"></icon>' +
        '</div>' +
        '<div class="inputdiv" v-show="showSet && showInput">' +
        '编码<input type="text" @click.stop="" v-model="tempInputCode" v-if="showSet" :readonly="editAdd" style="margin-left:10px;">' +
        '<span style="margin-left:10px;">名称</span><input type="text" @click.stop="" v-model="tempInputValue" v-if="showSet" style="margin-left:10px;">' +
        '<button class="btn btn-default btn-sm" @click.stop="doAddNode($event)" v-if="showSet" style="margin-left:10px;">添加</button>' +
        '<button class="btn btn-primary btn-sm" @click.stop="doEditNode($event)" v-if="showSet" style="margin-left:10px;">保存</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div></div>' +
        '</Poptip>' + '<style>'+
        '.showLinkColorA:hover>.showLinkColor{color:#33a6ff !important;}.showLinkColor:hover{color:#33a6ff !important;}'
        +'</style>';
    var opts = {
        template: temp,
        components: {Poptip: Poptip},
        props: {
            //数据配置参数
            dataConfig: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            useDefaultCfg: {
                type: Boolean,
                default: true
            },
            //配置ID属性
            idAttr: {
                type: String,
                default: "id"
            },
            //配置PID属性
            pidAttr: {
                type: String,
                default: "pid"
            },
            //配置显示属性
            displayAttr: {
                type: String,
                default: "name"
            },
            //安全角色 判断是否显示部门
            showdept: {
                type: Boolean,
                default: false
            },
            //编辑操作返回状态
            editResult: false,
            isCanSelectAll: {
                type: Boolean,
                default: true
            }
        },
        data: function () {
            return {
                // shuzu
                orgIdList:[],

                //分类自定义数据源
                model: {
                    type: [Object, Array],
                    default: ""
                },
                //初始节点选中值***
                Nodeval: {
                    id: "",
                    name: ""
                },
                //初始顶级分类值***
                topCategory: {
                    index: "",
                    title: "赛为集团"
                },
                //显示设置按钮配置***
                showSet: false,
                //是否显示INPUT DIV***
                showInput: false,
                //是否显示NODE右侧>***
                showSpan: true,
                //显示节点编辑、删除图标
                showIcon: false,
                //编辑状态改变SPAN宽度
                editSpanWidth: false,
                //编辑状态改变SPAN宽度
                editTempTopCategory: null,
                //编辑类型
                editAdd: false,
                //格式化数据父级
                parentIds: [],
                //现点击节点信息
                tempActiveName: "",
                //现编辑菜单索引
                tempActiveTopIndex: null,
                //顶级分类面包宵*****
                tempTopCategory: {
                    type: Array,
                    default: []
                },
                //input文本框MODEL
                tempInputValue: "",
                //input编码
                tempInputCode: "",
                //当前右侧子类
                nodeChilditem: {
                    type: Array,
                    default: []
                },
                //子类面包宵
                tempNodeCategory: {
                    type: Array,
                    default: []
                },
                //显示全部分类DIV***
                showCategory: false,
                hideTrigger: 0,
                tempCheckValue: {
                    type: Array,
                    default: null
                },
                queryOnServerLazyFunc:
                    _.debounce(function (_this, baseParam, callBack) {
                        var resource = this.$resource(this.model[1].url);
                        resource.get().then(function (res) {
                            var temp = {};
                            temp.name = "全部分类";
                            temp.children = this.refreshModel(res.data);
                            this.model[1].data = [];
                            this.model[1].data.push(temp);
                            this.nodeChilditem = this.model[1].data;
                        })

                        callBack && callBack();
                    }, 50)
            };
        },
        computed: {
            //显示设置按钮
            showSet: function () {
                if (this.tempTopCategory.NodeEdit) {
                    if (((this.nodeChilditem.length > 0) && (this.nodeChilditem[0].name != "全部分类")) || (this.nodeChilditem.length == 0)) {
                        return false;
                    } else {
                        return false;
                    }
                }
            },
            //显示右侧> SPAN状态
            showSpan: function () {
                if (!this.showInput && this.showSet) {
                    return true;
                } else {
                    return false;
                }
            },
            //显示修改、删除图标状态
            showicon: function () {
                if (this.showInput && this.showSet) {
                    return true;
                } else {
                    return false;
                }
            },
        },
        watch: {
            //添加、删除、修改操作后的数据更新
            editResult: function () {
                var _this = this;
                this.$nextTick(function () {
                    if (this.editResult) {
                        if (this.tempActiveTopIndex) {
                            var editIndex = this.tempActiveTopIndex;
                            var resource = this.$resource(_this.model[editIndex].url);
                            resource.get().then(function (res) {
                                _this.nodeChilditem = [];
                                _this.model[editIndex].data = [];
                                _.deepExtend(_this.model[editIndex].data, this.refreshModel(res.data));
                                //二级面包宵数据初始化
                                if (_this.tempNodeCategory.length == 1) {
                                    _this.nodeChilditem = _this.model[editIndex].data;
                                } else {

                                    var l = _this.tempNodeCategory.length;
                                    var tempNodeCategory = _this.tempNodeCategory;

                                    _this.showParent(_this.model[editIndex].data, this.tempNodeCategory[l - 1].id);

                                    if (this.parentIds.child != undefined) {
                                        this.nodeChilditem = this.parentIds.child;
                                    }
                                }

                                _this.editResult = false;
                                this.tmepEditId = "";
                            });
                        }
                    }
                });
            }
        },
        methods: {
            getDataDic: function (id) {
                if (this.showdept) {
                    //如果渲染的组织结构是部门, 通过DataDic获取的值为undefine，则表示父级是公司了，则当前是顶级部门, 直接返回即可
                    return LIB.getDataDic('org', id)['deptName'] === undefined ? true : false;
                } else {
                    return true;
                }
            },

            init: function () {
                var _this = this;
                //取所有数据
                //var num=0;
                var index = 0;
                //_.each(_this.model, function(item){
                //	if(item.url !="" && index>0){
                //		var resource = _this.$resource(item.url);
                //	resource.get().then(function(res){
                //		num++;
                //		var temp={};
                //    			temp.name="全部分类";
                //    			temp.children=this.refreshModel(res.data);
                //    			this.model[num].data=[];
                //    			this.model[num].data.push(temp);
                //	});
                //	}
                //	index++;
                //});


                // parentId 为空表示父级不存在 如果不为空 则上级被禁用
                // var itemObj = _.find(_this.model[0].data, function (item) {
                //     console.log(item)
                //     if(item.parentId){
                //         return false;
                //     }else{
                //         return true;
                //     }
                // }) ;
                // _this.model[0].data = [itemObj];

                //初始化第一个数据
                _this.showCategory = false;
                _this.tempTopCategory = [];
                _this.tempTopCategory.title = _this.model[index].title;
                _this.topCategory.title = _this.dataConfig.title;
                _this.tempTopCategory.NodeEdit = _this.model[index].NodeEdit;
                _this.tempTopCategory.index = index;
                _this.tempTopCategory.type = _this.model[index].type;
                _this.tempTopCategory.data = _this.model[index].data;
                _this.tempActiveName = _this.model[index].title;

                _this.nodeChilditem = _this.model[index].data;
                _this.tempNodeCategory = [];

                var d = _.find(this.model[index].data, function (item) {
                    return item.name === _this.topCategory.title;
                });
                var param = {
                    "nodeVal": d.name,
                    "nodeId": d.id,
                    "categoryType": d.type,
                    "topNodeId": '',
                    parentId: d.parentId
                };

                _this.$emit("on-org-change", param);

                // setTimeout(function () {
                //     _this.$emit("on-org-change", param);
                // })

            },
            //取得左侧菜单索引
            showCategoryIndex: function () {
                _.each(this.model, function (i, item) {
                    if (item.title === this.topCategory.title) {
                        return i;
                    }
                });
            },
            //显示顶级分类下的子类（包括左侧菜单点击和右侧首个面包宵点击）
            showCategoryNode: function (node, index) {
                this.tempTopCategory = [];
                this.nodeChilditem = [];
                this.tempTopCategory.title = node.title;
                this.tempTopCategory.NodeEdit = node.NodeEdit;
                this.tempTopCategory.index = index;
                this.tempTopCategory.type = node.type;
                this.tempTopCategory.data = node.data;
                this.tempActiveName = node.title;
                this.tempNodeCategory = [];
                this.showInput = false;
                if (node.type == "business") {
                    index = 1;
                    //本地缓存
                    //window.businessCache
                    //if(window.businessCache){
                    //	var resource = this.$resource(this.model[index].url);
                    //	resource.get().then(function(res){
                    //		var temp={};
                    //		temp.name="全部分类";
                    //		temp.children=this.refreshModel(res.data);
                    //		this.model[index].data=[];
                    //		this.model[index].data.push(temp);
                    //		this.nodeChilditem=this.model[index].data;
                    //	})
                    //}
                    var config = this.model[index];
                    if (!config.data) {
                        var _this = this;
                        var resource = this.$resource(config.url);
                        resource.get().then(function (res) {
                            config.data = [{name: "全部分类", children: _this.refreshModel(res.data)}];
                            _this.nodeChilditem = config.data;
                        });
                    } else {
                        if (config.data.length > 1 && !window.businessCache) {
                            var temp = {};
                            temp.name = "全部分类";
                            temp.children = config.data;
                            config.data = [];
                            config.data.push(temp);
                        }
                        this.nodeChilditem = config.data;
                    }

                } else if (node.data != undefined && node.data.length != 0) {
                    this.nodeChilditem = node.data;
                } else {
                    this.nodeChilditem = [];
                }
            },
            //显示下级分类
            showChildren: function (arr, rank, index) {
                this.editResult = false;
                //处理面包宵点击
                if (rank == 3) {
                    this.tempNodeCategory = [];
                }
                //处理正常点击
                if (arr.children != undefined) {
                    this.nodeChilditem = arr.children;
                }
            },
            //处理面包宵
            dealCrumbs: function (obj) {
                this.editResult = false;
                var crumblength = this.tempNodeCategory.length;
                var crumbindex = null;
                for (var i = 0; i < this.tempNodeCategory.length; i++) {
                    if (this.tempNodeCategory[i].name == obj.name) {
                        crumbindex = i;
                    }
                }
                var lengnum = crumblength - crumbindex - 1;
                this.tempNodeCategory.splice(crumbindex + 1, lengnum);
            },
            //显示面包屑导航
            /*
             左SPAN点击NUM状态为3（直接处理为选中值状态）
             右SPAN点击NUM状态为0
             右侧面包宵点击NUM状态为2
             */
            showCrumbs: function (arr, num, event) {
                this.editResult = false;
                if (this.tempTopCategory.NodeEdit && num != 3) {
                    if (arr.children == undefined || arr.children.length == 0) {
                        arr.children = [];
                    }
                    if (num == 2) {
                        this.dealCrumbs(arr);
                        this.showChildren(arr, 1);
                    } else {
                        this.showChildren(arr, 1);
                        var obj = {};
                        obj.id = arr.id;
                        obj.name = arr.name;
                        obj.children = arr.children;
                        this.tempNodeCategory.push(obj);
                    }
                } else if ((arr.children != undefined) && (arr.children.length > 0) && (num != 3)) {
                    if (num == 2) {
                        this.dealCrumbs(arr);
                    } else {
                        var obj = {};
                        obj.id = arr.id;
                        obj.name = arr.name;
                        obj.children = arr.children;
                        this.tempNodeCategory.push(obj);
                    }
                    this.showChildren(arr, 1);
                } else {
                    //处理选中子节点
                    if(!this.isCanSelectAll && arr.name=='所有公司'){
                        LIB.Msg.warning('不允许选择“所有公司”')
                        return ;
                    }
                    this.Nodeval = [];
                    var topNodeId = null;
                    if (this.tempTopCategory.type == "org") {
                        this.topCategory = {};
                        this.topCategory.id = arr.id;
                        this.topCategory.title = arr.name;
                        this.tempCheckValue["id"] = arr.id;
                        this.tempCheckValue["name"] = arr.name;
                        //model[0]为组织机构分类，model[1]为业务分类
                        //组织机构分类必须由顶级机构，通过data[0]获取
                        topNodeId = this.model[0].data[0].id;
                    }
                    if (this.tempTopCategory.type == "business") {
                        if (arr.name == "全部分类") {
                            this.tempCheckValue["id"] = null;
                            this.tempCheckValue["name"] = null;
                            this.Nodeval.id = null;
                            this.Nodeval.name = null;
                        } else {
                            this.Nodeval.id = arr.id;
                            this.Nodeval.name = arr.name;
                            this.tempCheckValue["id"] = arr.id;
                            this.tempCheckValue["name"] = arr.name;
                        }
                    }
                    var eventParam = {
                        "event": event,
                        "nodeVal": this.tempCheckValue.name,
                        "nodeId": this.tempCheckValue.id,
                        "categoryType": this.tempTopCategory.type,
                        "topNodeId": topNodeId,
                        parentId: arr.parentId
                    };

                    //关闭分类DIV
                    this.doToggleCategory();
                    // 发送选中消息
                    if (eventParam.categoryType == "org") {
                        this.$emit("on-org-change", eventParam);
                    }
                    else {
                        this.$emit("on-change", eventParam);
                    }
                    this.editResult = false;
                }
            },
            //显示INPUT框
            do_showInput: function () {
                this.showInput = !this.showInput;
                this.editResult = false;
            },
            //重新根据prop数据源构造tree的数据源
            refreshModel: function (arr) {
                if (arr.orgList != undefined) {
                    arr = arr.orgList;
                } else if (arr.content != undefined) {
                    arr = arr.content;
                }
                if (arr instanceof Array) {
                    var newModel = [];
                    _.each(arr, function (item) {
                        newModel.push(_.extend({}, item));
                    });
                    var pidAttr = this.pidAttr;
                    var idAttr = this.idAttr;
                    var displayAttr = this.displayAttr;
                    var pidObjMap = _.groupBy(newModel, pidAttr);

                    var idArr = _.pluck(newModel, idAttr);
                    var pidArr = _.pluck(newModel, pidAttr);

                    var rootPids = _.difference(pidArr, idArr);

                    //构造属性结构
                    _.each(newModel, function (item) {
                        var id = item[idAttr];
                        if (pidObjMap[id]) {
                            item.children = item.children || [];
                            item.children = item.children.concat(pidObjMap[id]);
                        }
                    });

                    var rootDatas = _.filter(newModel, function (item) {
                        //parentId不存在， 或者parentId不存在在所有数据的id，则该数据为rootNode
                        return !item[pidAttr] || _.contains(rootPids, item[pidAttr]);
                    });
                    return rootDatas;
                }
            },
            //显示分类列表事件
            doToggleCategory: function () {
//				this.showCategory = !this.showCategory;
                this.hideTrigger++;
            },
            //显示修改NODE值到输入框
            showEditNode: function (obj) {
                this.tempActiveTopIndex = this.tempTopCategory.index;
                this.tempInputValue = obj.name;
                this.tempInputCode = obj.code;
                this.tmepEditId = obj.id;
                this.editAdd = true;
            },
            //根据ID初始化显示
            showParent: function (child, sId, ids) {
                for (var i in child) {
                    if (child[i].id === sId) {
                        this.parentIds.pid = ids;
                        this.parentIds.child = child[i].children;
                        break;
                    } else {
                        var nIds = ids ? ids.concat() : [];
                        var obj = {};
                        obj.id = child[i].id;
                        obj.name = child[i].name;
                        obj.parentId = child[i].pid;
                        obj.children = child[i].children;
                        nIds.push(obj);
                        this.showParent(child[i].children, sId, nIds);
                    }
                }
            },
            //添加NODE节点事件
            doAddNode: function (event) {
                if (this.tempInputValue && this.tempInputCode) {
                    //定义当前父级ID
                    var nowlb = "";
                    if (this.tempNodeCategory.length >= 1) {
                        nowlb = this.tempNodeCategory[this.tempNodeCategory.length - 1].id;
                    } else {
                        if (this.tempTopCategory.id != undefined) {
                            nowlb = this.tempTopCategory.id;
                        } else {
                            //当顶级返回null
                            nowlb = null;
                        }
                    }

                    this.tempActiveTopIndex = this.tempTopCategory.index;
                    this.$emit("do_add-node", {
                        "event": event,
                        "item": this.tempInputValue,
                        "itemCode": this.tempInputCode,
                        "parentid": nowlb,
                        "categoryType": this.tempTopCategory.type
                    });
                } else {
                    alert("请输入分类编码和名称");
                }
                this.tempInputValue = "";
                this.tempInputCode = "";

            },
            //点击保存修改节点事件
            doEditNode: function (event) {
                if (this.tempInputValue != "") {
                    var nowlb = "";
                    if (this.tempNodeCategory.length >= 1) {
                        nowlb = this.tempNodeCategory[this.tempNodeCategory.length - 1].id;
                    } else {
                        if (this.tempTopCategory.id != undefined) {
                            nowlb = this.tempTopCategory.id;
                        } else {
                            //当顶级返回null
                            nowlb = null;
                        }
                    }
                    if (this.tmepEditId) {
                        this.$emit("do_edit-node", {
                            "event": event,
                            "item": this.tempInputValue,
                            "itemid": this.tmepEditId,
                            "parentid": nowlb,
                            "categoryType": this.tempTopCategory.type
                        });
                    } else {
                        alert("请点击节点右侧的图标进行修改操作");
                    }

                } else {
                    alert("分类信息不能为空");
                }
                this.tempInputValue = "";
                this.tempInputCode = "";
                this.editAdd = false;
            },
            //点击删除节点事件
            doDelNode: function (event, obj) {
                this.tmepEditId = obj.id;
                if (obj.id != "") {
                    //定义当前父级ID
                    var nowlb = "";
                    if (this.tempNodeCategory.length >= 1) {
                        nowlb = this.tempNodeCategory[this.tempNodeCategory.length - 1].id;
                    } else {
                        if (this.tempTopCategory.id != undefined) {
                            nowlb = this.tempTopCategory.id;
                        } else {
                            //当顶级返回null
                            nowlb = null;
                        }
                    }
                    this.tempActiveTopIndex = this.tempTopCategory.index;
                    this.$emit("do_del-node", {
                        "event": event,
                        "itemid": this.tmepEditId,
                        "parentid": nowlb,
                        "categoryType": this.tempTopCategory.type
                    });
                }
            },
            refreshOrgList: function () {
                if (window.allClassificationOrgListVersion && this.orgListVersion != window.allClassificationOrgListVersion) {
                    this.orgListVersion = window.allClassificationOrgListVersion;
                    var defaultCfgData = LIB.setting.orgList;

                    defaultCfgData = this.refreshModel(defaultCfgData);
                    this.model[0].data = defaultCfgData;
                    // this.init();
                    this._afterRefreshList();

                    if (this.topCategory.id) {
                        var arr = LIB.setting.orgMap[this.topCategory.id];
                        this.topCategory = {};
                        this.topCategory.id = arr.id;
                        this.topCategory.title = arr.name;
                    }
                }
            },
            _afterRefreshList: function () {

                var index = 0,
                    cur = LIB.setting.orgMap[this.topCategory.id],
                    id = cur ? cur.parentId : '';

                this.tempTopCategory.data = this.model[index].data;

                var res = [],
                    found = false;
                var _getNodeItems = function(items) {

                    _.forEach(items, function (item) {
                        if(found) {
                            return false;
                        }
                        if(item.id === id) {
                            found = true;
                            res = item.children || [];
                            return false;
                        } else if(_.isArray(item.children)) {
                            _getNodeItems(item.children);
                        }
                    });
                };

                if(id) {
                    _getNodeItems(this.tempTopCategory.data);
                    this.nodeChilditem = res;
                } else {
                    this.nodeChilditem = this.model[index].data;
                }

            },
            setDisplayTitle: function (data) {
                if (data.type == "org") {
                    var org = LIB.setting.orgMap[data.value];
                    if (org) {
                        this.topCategory = {};
                        this.topCategory.id = org.id;
                        this.topCategory.title = org.name;
                    }
                }
            },

            //循环遍历
            getObj:function (obj) {
                var _this = this;
                var temp = null;
                if(obj && obj.parentId){
                    _.each(_this.orgIdList, function (item) {
                        if(item.id == obj.parentId){
                            temp = item;
                        }
                    })
                }
                if(temp){
                    if(temp.disable == 1){
                        return false;
                    }
                    return  _this.getObj(temp);
                }

            }
        },
        created: function () {
            var _this = this;
            var newModel = [];
            var num = 0;

            if (this.useDefaultCfg) {
                this.dataConfig.title = this.dataConfig.title || defaultCfg.title;
                if (this.dataConfig.config) {
                    var result = _.findWhere(this.dataConfig.config, {type: "org"});
                    if (!result) {
                        this.dataConfig.config.unshift(defaultCfg.config[0]);
                    }
                } else {
                    this.dataConfig.config = defaultCfg.config;
                }
            }

            _.each(this.dataConfig.config, function (item) {
                newModel.push(_.extend({}, item));
            });
            _this.model = newModel;
            var index = 0;

            var defaultLoadUrl = _this.model[0].url;
            if (defaultLoadUrl && defaultLoadUrl != "") {

                //处理缓存组织机构数据
                if (defaultLoadUrl == defaultCfg.config[0].url && defaultLocalData != null) {

                    _this.model[0].data = defaultLocalData;
                    return;
                }


                this.$resource(defaultLoadUrl).get().then(function (res) {
                    _this.model[0].data = this.refreshModel(res.data);
                    //缓存默认配置的组织机构数据
                    if (defaultLoadUrl == defaultCfg.config[0].url) {
                        defaultLocalData = _this.model[0].data;
                    }
                    _this.init();
                });

            }
            //如果配置了数据，则直接使用默认配置的数据
            else if (defaultCfg.config[0].data) {
                // var defaultCfgData = defaultCfg.config[0].data;
                var defaultCfgData = [];
                var data = defaultCfg.config[0].data.orgList;
                _.forEach(data,function (item) {
                    if (item.disable === '0' || item.parentId == undefined) {
                        defaultCfgData.push(item);
                    }
                });

                // panduan
                var a = defaultCfgData;
                defaultCfgData = this.refreshModel(defaultCfgData);
                _this.model[0].data = defaultCfgData;

                _this.orgIdList = data;
                var arr = [];
                for(var i=0; i<_this.model[0].data.length; i++){
                    if(_this.getObj(_this.model[0].data[i]) != false){
                        arr.push(_this.model[0].data[i])
                    }
                }
                _this.model[0].data = arr;
                // _.each(_this.model[0].data, function (items) {
                //     _.each(data,function (item) {
                //         // console.log(item.id == items.parentId,item.id , items.parentId);
                //         if(item.id == items.parentId){
                //             console.log(item.id , items.parentId);
                //             console.log(items)
                //         }
                //     });
                // })

                _this.init();
            }

            this.orgListVersion = 1;
            var d = _.find(this.model[index].data, function (item) {
                return item.name === _this.topCategory.title;
            });
            _this.showCrumbs(d, 1);
        },
        attached: function () {
            this.refreshOrgList();
            if (window.businessCache && this.model.length > 1) {
                this.queryOnServerLazyFunc(this);
            }
        }
    };

    var defaultCfg = {
        //添加全部分类默认显示文字
        title: "赛为集团",
        config: [{
            //是否显示设置按钮
            NodeEdit: false,
            //左侧类别名称
            title: "组织机构",
            //数据源网址  请求优先
//            url:"user/setting",
//            data : require('lib').setting.orgList,
            type: "org"
        }]
    };
    //缓存默认组织机构配置的数据，避免多次加载
    var defaultLocalData = null;

    var c = Vue.extend(opts);
    Vue.component('all-classification', c);

    var initDefaultCfg = function (cfg) {
        if (!_.isEmpty(cfg)) {
            defaultCfg = cfg;
        }
    };
    return {
        initDefaultCfg: initDefaultCfg
    }
});