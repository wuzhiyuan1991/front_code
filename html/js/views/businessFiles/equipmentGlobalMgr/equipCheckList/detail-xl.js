/**
 * Created by yyt on 2017/7/20.
 */
define(function (require) {
    var Vue = require("vue");
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var helper = require("./helper");

    var videoHelper = require("tools/videoHelper");

    //弹框
    var checkObjectSelect = require("./dialog/selectCheckObject");
    var itemComponent = require("./dialog/selectCheckItem");
    var checkItemFormModal = require("componentsEx/formModal/checkItemFormModal");

    var equipmentSelectModal = require("componentsEx/selectTableModal/riskSourceEquipSelectModal");
    var processEquipTypeSelectModal = require("componentsEx/selectTableModal/processEquipTypeSelectModal");
    var checkObjSelectModal = require("componentsEx/checkObjSelectModal/main");

    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

    require("componentsEx/treeModal/treeModal");

    var checkObjectType; // 定义检查对象类型，用于在表格列中判断


    var tabs = [
        {id: '1', name: '属地'},
        {id: '2', name: '设备设施'},
        {id: '1001', name: '重大危险源'},
        {id: '1002', name: '重点化学品'},
        {id: '1003', name: '重点化学工艺'}
    ];


    LIB.registerDataDic("equipment_table_lt_type", [
        ["1","设备检定作业"],
        ["2","设备维修作业"],
        ["3","设备保养作业"]
    ]);



    var uploadEvents = {
        pic:function(data){
            dataModel.fileModel.pic.data.push({fileId:data.rs.content.id,fileExt:data.rs.content.ext});
        },
        video:function(data){
            //dataModel.videoList.push({fileId:data.rs.content.id,fileExt:data.rs.content.ext});
            dataModel.fileModel.video.data.push({fileId:data.rs.content.id,fileExt:data.rs.content.ext});
        },
    }

    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            name: null,
            type: "0",//计划检查
            disable: "1",
            //orgId:null,
            org: {id: null, name: null},
            remarks: null,
            //checkTableType:{id:null,name:null},
            checkTableTypeId: null,
            torList: [],
            //objectList : [],
            tirList: [],//检查表关联检查项集合
            checkItemList: [],
            group: {},//当前操作的检查表组信息
            //公司Id
            compId: null,
            //部门Id
            orgId: null,
            //检查表-检查项关联关系
            tableItemRel: {},
            checkItem: {},
            checkObjType: '', // 检查对象
            focusType: '' // 重点关注类型
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            typeList: [{id: "1", name: "计划检查"}, {id: "0", name: "非计划检查"}, {id: "2", name: "通用"}],
            disableList: [{id: "0", name: "启用"}, {id: "1", name: "停用"}],
            bizEquipType : null,
            //保存分组table当前选中项
            selectedGroupItemMap:{},
            scrolled: true,
            opType: 'view',
            isReadOnly: true, //是否只读
            //验证规则
            rules: {
                name: [{required: true, message: '请输入检查表名称'},
                    LIB.formRuleMgr.length(100)
                ],
                type: [{required: true, message: '请选择检查表类型'}],
                compId: [{required: true, message: '请选择所属公司'}],
                disable: [{required: true, message: '请选择检查表状态'}],
                checkObjType: [{required: true, message: '请选择检查对象'}]
            },
            emptyRules: {}
        },
        isEditRel: false,//是否可以修改关联关系
        isShowIcon: false,//是否显示收缩/展开图标
        isGroupNum: -1,//分组序号
        checkTableTypeList: [],
        selectedCheckTableType: [],
        isShowCheckItem: true,
        isShowCheckObject: true,
        groupName: null,
        itemModel: {
            //显示弹框
            show: false,
            title: "选择检查项",
            id: null
        },
        newItemModel: {
            show: false,
            title: "新增",
            id: null
        },
        tableModel: {
            checkItemTableModel : {
                columns: [
                    {
                        title: "检查项内容",
                        fieldName: "name",
                        'renderClass': "textarea",
                    },
                    {
                        title: "类型",
                        fieldType: "custom",
                        width: 80,
                        render: function (data) {
                            return LIB.getDataDic("pool_type", data.type);
                        }
                    },
                    // {
                    //     title: "状态",
                    //     fieldType: "custom",
                    //     width: 80,
                    //     render: function (data) {
                    //         return LIB.getDataDic("disable", data.disable);
                    //     }
                    // },
                    {
                        title: "否决项",
                        fieldType: "custom",
                        width: 80,
                        renderClass: 'text-center',
                        showTip: false,
                        render: function (data) {
                            if (data.vetoItem == 1) {
                                return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                            }else {
                                return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                            }
                        }
                    },
                    {
                        title: "",
                        fieldType: "custom",
                        width: 110,
                        showTip: false,
                        fieldName: "up",
                        render: function (data) {
                            return '<span  class="tableCustomIco_Up" title="上移" style="margin-left: 0;"><i class="ivu-icon ivu-icon-arrow-up-a"></i></span><span class="tableCustomIco_Down" title="下移"><i class="ivu-icon ivu-icon-arrow-down-a"></i></span>' +
                                '<span class="tableCustomIco_Edit" title="编辑"><i class="ivu-icon ivu-icon-edit"></i></span><span class="tableCustomIco_Del" title="删除"><i class="ivu-icon ivu-icon-trash-a"></i></span>'

                        }
                    }
                ]
            },
            commonModel: {
                url: 'checktable/checkobjects/list',
                columns: [],
                values: []
            },
            specialAreaModel: {
                url: 'checktable/list/specialdominationareas/{curPage}/{pageSize}',
                columns:[
                    {
                        title: '属地',
                        fieldName: 'name'
                    },
                    {
                        title: '所属公司',
                        render: function (data) {
                            if (data.compId) {
                                return LIB.getDataDic("org", data.compId)["compName"];
                            }
                        }
                    },

                    {
                        title: '所属部门',
                        render: function (data) {
                            if (data.orgId) {
                                return LIB.getDataDic("org", data.orgId)["deptName"];
                            }
                        }
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            }
        },
        selectModel: {
            checkObjSelectModel: {
                visible: false,
                filterData: {"criteria.strValue.compId": null}
            },
            equipmentSelectModel:{
                visible : false,
                filterData: {}
            },
            equipmentTypeSelectModel:{
                visible : false,
                filterData: {}
            },
            dominationAreaSelectModel: {
                visible: false,
                filterData: null
            }
        },
        formModel: {
            checkItemFormModel: {
                show: false,
                queryUrl: "checkitem/{id}"
            }
        },
        rowIndex: null,
        columnIndex: null,
        craftTypeModel: {
            visible: false,
            title: '选择工艺类型',
            items: []
        },
        checkObjModel: {
            filterKey: '',
            cacheKey: '',
            icon: 'ios-search',
            text: '搜索',
            showInput: false
        },
        checkObjectSelectModel: {
            visible: false,
            checkObjId: ''
        },
        fileCategorys:[{id:'file',name:"文件"},{id:'pic',name:"图片"}, {id:'video',name:"视频"}],
        fileModel:{
            file : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'AA1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                        fileType: 'AA'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                    },
                    filters: {
                        max_file_size: '10mb',
                    },
                },
                data : []
            },
            pic : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'AA2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                        fileType: 'AA'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                    },
                    events:{
                        onSuccessUpload:uploadEvents.pic
                    }
                },
                data : []
            },
            video : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'AA3', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                        fileType: 'AA'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
                    },
                    events:{
                        onSuccessUpload:uploadEvents.video
                    }
                },
                data : []
            }
        },
        playModel: {
            title: "视频播放",
            show: false,
            id: null
        },
        fileTabId:'file',
        tabSelectId: '',
        isAllDomination: false,
        enableMajorRiskSource: true
    };
    //Vue组件
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
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "itemcomponent": itemComponent,
            "checkItemFormModal": checkItemFormModal,
            checkObjectSelect: checkObjectSelect, // 检查表选择检查对象
            "equipmentSelectModal":equipmentSelectModal,
            processEquipTypeSelectModal: processEquipTypeSelectModal,
            checkObjSelectModal: checkObjSelectModal, // 检查项选择检查对象, 属地类
            dominationAreaSelectModal: dominationAreaSelectModal
        },
        computed: {
            shouldShowBtn: function () {
               if(this.mainModel.opType === 'create' || !this.hasAuth('edit')){
                   return false;
               }
               return true;
            },
            showCheckItemNewBtn: function () {
                return _.includes(['1', '2', '3', '4', '12'], this.mainModel.vo.checkObjType);
            },
            tabs: function () {
                var vo = this.mainModel.vo,
                    res = [];
                if(vo.checkObjType === '2') { // 设备设施
                    res.push(tabs[0],tabs[1]);
                } else if(vo.checkObjType === '6') { // 通用
                    res.push(tabs[0], tabs[1]);
                } else { // 属地
                    res.push(tabs[0]);
                }
                switch (vo.focusType) {
                    case '1001': res.push(tabs[2]);break;
                    case '1002': res.push(tabs[3]);break;
                    case '1003': res.push(tabs[4]);break;
                    default:
                }
                return res;
            }
        },
        data: function () {
            return dataModel
        },

        methods: {
            newVO: newVO,
            doFileTabClick:function(fileTabId) {
                var _this = this;
                this.fileTabId = fileTabId;

                if(fileTabId == "pic") {//图片组件加载问题处理
                    setTimeout(function () {
                        _this.setPictures();
                    }, 50);
                }
            },
            setPictures: function() {
                this.fileModel.pic.data = this.fileModel.pic.data.concat();
            },
            //doPic: function (fileId) {
            //    this.picModel.show = true;
            //    this.picModel.id = fileId;
            //},
            doDeleteFile: function (fileId, index, arrays) {
                var ids = [];
                ids[0] = fileId;
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        api.deleteFile(null, ids).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("删除失败");
                            } else {
                                arrays.splice(index, 1);
                                LIB.Msg.success("删除成功");
                            }
                        });
                    }
                });
            },
            doPlay: function (fileId) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", fileId);
                }, 50);
            },
            convertPicPath: LIB.convertPicPath,
            convertPath: LIB.convertPath,
            getTemporaryColumnSetting: function () {
                var _this = this;
                api.getTemporaryColumnSetting().then(function (res) {
                    _this.showTemporaryColumns = (_.get(res.data, "result", "1") === "2")
                });
            },
            doEnableDisable: function () {
                var _this = this;
                var ids = dataModel.mainModel.vo.id;
                var disable = dataModel.mainModel.vo.disable;
                //0启用，1禁用
                if (disable == 0) {
                    api.batchDisable(null, [ids]).then(function (res) {
                        dataModel.mainModel.vo.disable = '1';
                        _this.$dispatch("ev_dtUpdate");
                        LIB.Msg.info("已停用!");
                    });
                } else {
                    api.batchEnable(null, [ids]).then(function (res) {
                        dataModel.mainModel.vo.disable = '0';
                        _this.$dispatch("ev_dtUpdate");
                        LIB.Msg.info("已启用!");
                    });
                }
            },
            doCellIndex: function (groupId,id) {
                var _this = this;
                _.each(_this.mainModel.vo.tirList, function (item, index) {
                    if (item.itemList) {
                        _.each(item.itemList, function (date, columnIndex) {
                            if (id === date.id && groupId == item.groupId) {
                                _this.mainModel.selectedGroupItemMap[item.groupId]=date.itemOrderNo;
                                _this.rowIndex = index;
                                _this.columnIndex = columnIndex;
                                return false;
                            }
                        })
                    }

                })
            },
            /**
             * 设置检查项为否决项
             * 如果检查项为最高风险，可以勾选为否决项
             * 如果检查项不是最高风险，不能勾选为否决项，给出对应提示
             */
            doChangeVetoItem:function(groupIndex, rowIndex, tableItemRel1, item){
                var _this = this,
                    riskModel;
                // try {
                //     riskModel = JSON.parse(item.riskModel);
                // } catch (e) {
                    // return;
                    // LIB.Msg.warning("该检查项不是最高风险，不能设置为否决项")
                // }

                // if(!riskModel || !_.isString(riskModel.result) || riskModel.result.indexOf('重大') < 0) {
                //     return LIB.Msg.warning("该检查项不是最高风险，不能设置为否决项")
                // }

                if (1 == item.vetoItem){
                    LIB.Modal.confirm({
                        title: '取消该否决项?',
                        onOk: function () {
                            api.updateRelVetoItem({vetoItem:0}, tableItemRel1).then(function(res){
                                //前端更新修改数据
                                item.vetoItem = 0;
                                LIB.Msg.info("操作成功");
                            });
                        }
                    });

                }else {
                    LIB.Modal.confirm({
                        title: '设置为否决项?',
                        onOk: function () {
                            api.updateRelVetoItem({vetoItem:1}, tableItemRel1).then(function(res){
                                item.vetoItem = 1;
                                LIB.Msg.info("操作成功");
                            });
                        }
                    });
                }
            },
            // 保存设备设施个体
            doSaveEquipment : function(items) {
                var _this = this;
                var item = items[0];
                var params = {
                    checkTableId: this.mainModel.vo.id,
                    checkItemId: this.checkItemId,
                    checkObjId: item.id,
                    checkObjType: '4',
                    isItem: '1'
                };
                this.selectModel.equipmentSelectModel.visible = false;
                api.updateCheckItem(null, params).then(function () {
                    var _item = _this.mainModel.vo.tirList[_this.rowIndex].itemList[_this.columnIndex];
                    Vue.set(_item, "checkObject", item);
                    LIB.Msg.info("保存成功");
                });
            },
            doSaveEquipmentType: function (items) {
                var _this = this;
                var item = items[0];
                var params = {
                    checkTableId: this.mainModel.vo.id,
                    checkItemId: this.checkItemId,
                    checkObjId: item.id,
                    checkObjType: '3',
                    isItem: '0'
                };
                this.selectModel.equipmentTypeSelectModel.visible = false;
                api.updateCheckItem(null, params).then(function () {
                    var _item = _this.mainModel.vo.tirList[_this.rowIndex].itemList[_this.columnIndex];
                    Vue.set(_item, "checkObject", item);
                    LIB.Msg.info("保存成功");
                });
            },
            doSaveCheckItemCheckObj: function(obj){
                var _this = this;
                this.checkObjectSelectModel.visible = false;

                var params = {
                    checkTableId: this.mainModel.vo.id,
                    checkItemId: this.checkItemId,
                    checkObjId: obj.checkObj.id,
                    checkObjType: obj.checkObjType,
                    isItem: obj.isItem
                };

                api.updateCheckItem(null, params).then(function () {
                    var _item = _this.mainModel.vo.tirList[_this.rowIndex].itemList[_this.columnIndex];
                    Vue.set(_item, "checkObject", obj.checkObj);
                    LIB.Msg.info("保存成功");
                });
            },
            doClickCell: function (data) {
                this.checkItemId = data.entry.data.id;
                this.doCellIndex(data.entry.data.groupId,data.entry.data.id);
                //分页数据
                var page = data.cell.rowId + 1 + (data.page.currentPage - 1) * data.page.pageSize,
                    cell = data.cell,
                    target = data.event.target,
                    parentNode = target.parentNode;

                // 否决项
                if ( 3 === cell.colId){
                    this.doChangeVetoItem(
                        this.rowIndex,
                        this.columnIndex,
                        {"checkItemId":data.entry.data.id,"checkTableId":this.mainModel.vo.id, "groupId":this.mainModel.vo.tirList[this.rowIndex].groupId},
                        data.entry.data
                    );
                    return;
                }

                // 最后一列操作对象
                if (parentNode.className === "tableCustomIco_Up") {
                    this.doMoveItems(1, this.mainModel.vo.id, data.entry.data.id, this.rowIndex, page, this.columnIndex);
                }
                else if (parentNode.className === "tableCustomIco_Down") {
                    this.doMoveItems(2, this.mainModel.vo.id, data.entry.data.id, this.rowIndex, page, this.columnIndex);
                }
                else if (parentNode.className === "tableCustomIco_Del") {
                    this.delItemRelRowHandler(this.mainModel.vo.id, data.entry.data.id);
                }
                else if (parentNode.className === "tableCustomIco_Edit") {
                    if(this.hasDataAuth(data.entry.data.orgId)) {
                        this.editItemRelRowHandler(data.entry.data.id);
                    }
                }
            },
            //删除
            doDelete: function () {
                var _this = this;
                //权限控制
                var delObj = {
                    id: this.mainModel.vo.id,
                    orgId: this.mainModel.vo.orgId,
                    compId: this.mainModel.vo.compId
                };

                LIB.Modal.confirm({
                    title: '确定删除?',
                    onOk: function () {
                        api.remove(null, delObj).then(function (data) {
                            if (data.data && data.error != '0') {
                                return;
                            }
                            _this.$dispatch("ev_dtDelete");
                            LIB.Msg.success("删除成功");
                        });
                    }
                });
            },
            //添加分组
            doAddGroup: function () {
                var _this = this;
                //生成UUID
                api.getUUID().then(function (res) {
                    var group = {};
                    group.id = res.data;
                    var len = _this.mainModel.vo.tirList.length + 1;
                    group.groupName = "分组" + len;
                    while (true) {
                        var isGroupNameExist = _this.mainModel.vo.tirList.some(function (t) {
                            return t.groupName === group.groupName;
                        })
                        if (isGroupNameExist) {
                            len += 1;
                            group.groupName = "分组" + len;
                        } else {
                            break;
                        }
                    }
                    group.groupOrderNo = 0;
                    group.checkTableId = _this.mainModel.vo.id;
                    group.itemList = [];
                    //api.createTableItemRel(null,group).then(function(_res){
                    _this.mainModel.vo.tirList.push(group);
                    /*滚动条*/
                    _this.$nextTick(function () {
                        var scroll = document.getElementsByClassName('detail-large-container')[0];
                        scroll.scrollTop = scroll.scrollHeight;
                    })
                    //});
                });
            },
            //删除分组及分组下的关联检查项
            doDeleteGroup: function (tirId, groupName, index) {
                var _this = this;
                dataModel.mainModel.vo.tableItemRel.groupName = groupName;
                dataModel.mainModel.vo.tableItemRel.checkTableId = tirId;
                api.delTableGroup(null, dataModel.mainModel.vo.tableItemRel).then(function (res) {
                    _this.mainModel.vo.tirList.splice(index, 1);
                });
            },

            delItemRelRowHandler: function (checkTableId, checkItemId) {
                var _this = this;
                var params = [];
                params.push({
                    checkItemId: checkItemId
                });
                api.delTableItem({id: checkTableId},params).then(function () {
                    _.each(_this.mainModel.vo.tirList, function (tir) {
                        _.some(tir.itemList, function (i, index) {
                            if (i.id === checkItemId) {
                                tir.itemList.splice(index, 1);
                                return true;
                            }
                        });
                    });
                });
            },
            doMoveItems: function (flag, checkTableId, checkItemId, groupIndex, page, columnIndex) {
                var _this = this;
                var data = _this.mainModel.vo.tirList[groupIndex].itemList[columnIndex];
                if (flag === 1) {
                    if (page === 1) {
                        return;
                    }
                    //上移
                    var tableItemRel1 = {checkItemId: "", checkTableId: ""};
                    tableItemRel1.checkItemId = checkItemId;
                    tableItemRel1.checkTableId = checkTableId;
                    tableItemRel1.groupId = _this.mainModel.vo.tirList[groupIndex].groupId;
                    //修改数据
                    api.updateItemOrderNo({type: "1"}, tableItemRel1).then(function (res) {
                        /*   _this.reloadRel("checkItem",checkTableId);*/
                        //前端更新修改数据
                        _this.mainModel.vo.tirList[groupIndex].itemList.splice(columnIndex, 1);
                        _this.mainModel.vo.tirList[groupIndex].itemList.splice(columnIndex - 1, 0, data);
                        LIB.Msg.info("移动成功");
                    });

                } else if (flag === 2) {
                    //var maxIndex = itemList.length-1;
                    if (page === this.mainModel.vo.tirList[groupIndex].itemList.length) {
                        return;
                    }
                    var _tableItemRel1 = {
                        checkItemId: checkItemId,
                        checkTableId: checkTableId,
                       groupId: _this.mainModel.vo.tirList[groupIndex].groupId
                    };
                    //修改数据
                    api.updateItemOrderNo({type: "2"}, _tableItemRel1).then(function (res) {
                        /*   _this.reloadRel("checkItem",checkTableId);*/
                        //前端更新修改数据
                        _this.mainModel.vo.tirList[groupIndex].itemList.splice(columnIndex, 1);
                        _this.mainModel.vo.tirList[groupIndex].itemList.splice(columnIndex + 1, 0, data);
                        LIB.Msg.info("移动成功");
                    });

                }
            },
            //保存分组名称
            doSaveGroupName: function (tableId, name,groupOrderNo) {
                var _this = this;
                if (!name) {
                    LIB.Msg.warning("分组名称不能为空");
                    return;
                }
                if (name.length > 50) {
                    LIB.Msg.warning("分组名称长度不能超过50个字符");
                    return;
                }
                var groupName = _this.groupName;
                var group = {};
                group.checkTableId = tableId;
                group.groupName = groupName;
                group.groupOrderNo = groupOrderNo;
                //修改后的分组名
                group.attr1 = name;
                api.updateGroupName(null, group);
                _this.isGroupNum = -1;
            },
            //修改分组名称
            doUpdateGroupName: function (index, groupName, e) {
                var _this = this;
                _this.isGroupNum = index;
                _this.groupName = groupName;
                this.$nextTick(function () {
                    e.target.closest(".clearfix").querySelector('.left input').focus();
                })
            },
            editItemRelRowHandler: function (param) {
                this.formModel.checkItemFormModel.show = true;
                this.$refs.checkItemFormModal.init("update", {id: param});
            },
            //添加检查项
            doAddCheckItem: function (index,tir) {
                this.itemModel.show = true;
                this.$broadcast('ev_selectItemReload', dataModel.mainModel.vo, tir);
            },
            doNewCheckItem: function (tir) {
                var values = this.tableModel.commonModel.values;
                var checkObjId = values.length > 0 ? values[0].checkObjId : '';
                this.formModel.checkItemFormModel.show = true;
                this.mainModel.vo.tableItemRel.checkTableId = tir.checkTableId;
                this.mainModel.vo.tableItemRel.groupName = tir.groupName;
                this.mainModel.vo.tableItemRel.groupOrderNo = tir.groupOrderNo;
                this.$refs.checkItemFormModal.init("create", '', {checkObjId: checkObjId});
            },
            /**
             * 新增检查表
             * @param data
             */
            doSaveCheckItem: function (data) {
                var _this = this;
                this.formModel.checkItemFormModel.show = false;
                var _vo = this.mainModel.vo;
                _vo.checkItem = data;
                _vo.checkItem.bizType = this.$route.query.bizType;
                var _vo = _.pick(this.mainModel.vo, 'id', 'checkItem', 'tableItemRel');
                if (_vo.tableItemRel.groupName && _vo.tableItemRel.groupName.length > 50) {
                    LIB.Msg.warning("分组名称长度不能超过50个字符");
                    return;
                }
                api.createItem({id: this.mainModel.vo.id}, _vo).then(function () {
                    _this.reloadRel("checkItem", _this.mainModel.vo.id);
                    LIB.Msg.info("新增成功");
                });
            },
            /**
             * 修改保存检查项
             * @param data
             */
            doUpdateCheckItem: function (data) {
                var _this = this;
                this.formModel.checkItemFormModel.show = false;
                api.updateItem(null, data).then(function () {
                    var item = _this.mainModel.vo.tirList[_this.rowIndex].itemList[_this.columnIndex]
                    //前端更新数据
                    //name
                    item.name = data.name;
                    //风险类别
                    //类型
                    item.type = data.type;
                    //所属公司
                    item.compId = data.compId;
                    //检查项分类
                    item.riskType = data.riskType;
                    if (item.riskType) {
                        item.riskType.name = data.riskType.name;
                        item.riskType.id = data.riskType.id;
                    }
                    //备注
                    item.remarks = data.remarks;
                    /*  _this.reloadRel("checkItem",_this.mainModel.vo.id);*/
                    LIB.Msg.info("保存成功");
                });
            },

            doShowDeptSelectModal: function () {
                this.selectModel.deptSelectModel.visible = true;
                this.selectModel.deptSelectModel.filterData = {"criteria.strValue.compId": this.mainModel.vo.compId};
            },
            doSaveDepts: function (selectedDatas) {
                if (selectedDatas) {
                    dataModel.mainModel.vo.depts = selectedDatas;
                    var param = _.map(selectedDatas, function (data) {
                        return {id: data.id, type: data.type, compId: data.compId}
                    });
                    var _this = this;
                    api.saveDepts({id: dataModel.mainModel.vo.id}, param).then(function () {
                        _this.refreshTableData(_this.$refs.deptTable);
                        _this.$dispatch("ev_gridRefresh");
                    });
                }
            },
            doRemoveDepts: function (item) {
                var _this = this;
                var data = item.entry.data;
                api.removeDepts({id: this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                    _this.$refs.deptTable.doRefresh();
                    _this.$dispatch("ev_gridRefresh");
                });
            },
            //删除关联受检对象关系后刷新页面
            delRowHandler: function (obj) {
                var _this = this;
                var item = obj.entry.data;
                api.delTableObjRel({
                    checkObjectId: item.checkObjectId,
                    checkTableId: dataModel.mainModel.vo.id
                }).then(function () {
                    var index = -1;
                    _.each(_this.mainModel.vo.torList, function (items, i) {
                        if (items.checkObjectId === item.checkObjectId) {
                            index = i;
                            return false;
                        }
                    })
                    if (index !== -1) {
                        _this.mainModel.vo.torList.splice(index, 1);
                        LIB.Msg.info("删除成功！");
                    }
                })
            },
            //刷新关联关系
            reloadRel: function (type, nVal) {
                var _vo = dataModel.mainModel.vo;
                if (type === 'checkObject') {
                    api.get({id: nVal}).then(function (res) {
                        //已选受检对象
                        _vo.torList = res.data.torList;
                    });
                }
                else if (type === 'checkItem') {
                    api.get({id: nVal}).then(function (res) {
                        //已选择的检查项
                        _vo.checkItemList = res.data.checkItemList;
                        _vo.tirList = res.data.tirList;
                        dataModel.mainModel.selectedGroupItemMap={};
                        if(_vo.tirList.length > 0) {
                            _.each(_vo.tirList, function (item) {
                                Vue.set(item, 'keyWord', '');
                                Vue.set(item, 'showInput', false);
                            })
                        }
                    });
                }
            },
            buildSaveData: function () {
                var data = _.cloneDeep(this.mainModel.vo)
                // if (data.tirList.length) {
                //     data.tirList.forEach(function (item) {
                //         if (item.itemList.length) {
                //             item.itemList = item.itemList.map(function (v) {
                //                 return {id: v.id}
                //             })
                //         }
                //     })
                // }
                data = _.omit(data, "tirList");
                data.bizType = this.$route.query.bizType;
                return data;
            },
            beforeInit: function (vo, opts) {
                this.mainModel.vo.compId = '';
                var _this = this;
                if (_.isEmpty(dataModel.checkTableTypeList) || opts.opType != "view") {
                    //todo 暂时性的优化,会导致无法获取最新的类型
                    // var t = setTimeout(function () {
                        // clearTimeout(t);
                        // if (_this.$parent.show) {
                                // api.listTableType().then(function (res) {
                                //     _this.$nextTick(function () {
                                //     dataModel.checkTableTypeList = res.data;
                                // });
                            // });
                        // }
                    // }, 800);

                    // dataModel.checkTableTypeList = [
                    //     {id:1, name:"设备检定作业"},
                    //     {id:2, name:"设备维修作业"},
                    //     {id:3, name:"设备保养作业"}
                    // ];


                }
                this.mainModel.vo.tirList = null;
                this.tabSelectId = '';
                this.isAllDomination = false;
                this.$refs.commonTable.doClearData();
            },
            afterInit: function (vo, obj) {
                if (this.mainModel.opType === 'create') {
                    this.isEditRel = false;//是否可以修改关联关系
                    this.isShowIcon = false;//是否显示收缩/展开图标
                } else {
                    this.isEditRel = true;
                    this.isShowIcon = true;
                }
                this.selectedCheckTableType = [];

                this.mainModel.vo.checkTableTypeId = this.$route.query.equipBizType;
                this.mainModel.vo.checkObjType = '2';
            },
            afterInitData: function () {
                var _this = this;

                var _id = this.tabs[0].id;
                this.doTabClick(_id);

                // 向tirList的每项中添加一些参数，方便控制页面显示
                if(this.mainModel.vo.tirList.length > 0) {
                    _.each(this.mainModel.vo.tirList, function (item) {
                        Vue.set(item, 'keyWord', '');
                        Vue.set(item, 'showInput', false);
                    })
                }
                checkObjectType = this.mainModel.vo.checkObjType;
                // this._setTableColumns();

                this.isAllDomination = (this.mainModel.vo.isAllDomination === '1');


                //_this.$api.listFile({recordId: this.mainModel.vo.id}).then(function (res) {
                //
                //    _.each(_this.fileModel,function (item, key) {
                //        _.each(res.data, function (file) {
                //            if(file.dataType == item.cfg.params.dataType) {
                //                dataModel.fileModel[key].data.push({
                //                    fileId: file.id,
                //                    fileExt: file.ext,
                //                    orginalName: file.orginalName
                //                });
                //            }
                //        });
                //    });
                //});

            },
            afterDoSave: function (t) {
                var _this = this;
                _this.isEditRel = true;
                _this.isShowIcon = true;
                _this.mainModel.isReadOnly = true;
                if("C" === t.type) {
                    // this._setTableColumns();
                    var _id = this.tabs[0].id;
                    this.doTabClick(_id, true);
                }
            },
            doItemFilter: function (item, k) {
                if (item.name.indexOf(k) > -1) {
                    return true;
                }
                if (item.riskType && item.riskType.name.indexOf(k) > -1) {
                    return true;
                }
                if (LIB.getDataDic("pool_type", item.type).indexOf(k) > -1) {
                    return true;
                }
                if (LIB.getDataDic("disable", item.disable).indexOf(k) > -1) {
                    return true;
                }
                if (item.equipment && item.equipment.name && item.equipment.name.indexOf(k) > -1) {
                    return true;
                }
                return false;
            },
            toggleItemInput: function (tir, value) {
                tir.showInput = value;
                if(!value) {
                    tir.keyWord = '';
                    tir._keyWord = '';
                }
            },
            setFilterValue: function (val, index) {
                this.mainModel.vo.tirList[index].keyWord = val;
            },
            _doMoveGroup: function (direction, index) {
                var _this = this;
                var length = this.mainModel.vo.tirList.length;
                if(length < 2) {
                    return;
                }
                if(direction === 'up' && index === 0) {
                    return;
                }
                if(direction === 'down' && index === length - 1) {
                    return;
                }
                var item = this.mainModel.vo.tirList.splice(index, 1);
                if(direction === 'up') {
                    this.mainModel.vo.tirList.splice(index - 1, 0, item[0]);
                } else {
                    this.mainModel.vo.tirList.splice(index + 1, 0, item[0]);
                }
                var groupId = _.map(this.mainModel.vo.tirList, 'groupId');
                api.sortGroup(groupId).then(function (res) {
                    _this.reloadRel("checkItem", _this.mainModel.vo.id);
                })
            },
            doMoveGroup: function(direction, index) {
                var _this = this;
                setTimeout(function () {
                    _this._doMoveGroup(direction, index);
                }, 200)
            },
            changeCheckObjectType: function (cbt) {
                var _this = this,
                    vo = this.mainModel.vo,
                    beforeVo = this.mainModel.beforeEditVo,
                    title = '';

                var group = ['1', '3', '4', '5'];

                // 新建时切换
                if(this.mainModel.opType === 'create') {
                    return;
                }

                if(cbt === beforeVo.checkObjType) {
                    return;
                }

                if('1' === cbt || '1' === beforeVo.checkObjType) {
                    var id = _this.tabs[0].id;
                    _this.tableModel.commonModel.columns = _this._buildTableColumns(id);
                }

                // 其他类型切换为通用类型
                if(cbt === '6') {
                    return;
                }

                // 属地类型之间切换
                if(_.includes(group, cbt) && _.includes(group, beforeVo.checkObjType)) {
                    return;
                }

                var _tit1 = this.getDataDic('check_obj_risk_type', cbt),
                    _tit2 = this.getDataDic('check_obj_risk_type', beforeVo.checkObjType);

                // 设备、通用切换为属地类型
                if(_.includes(group, cbt)) {
                    title = '风险点类型由' + _tit2 + '切换为' + _tit1 + ', <br>会导致清空设备设施并提交所有基本信息修改，<br>确认操作?'
                }
                else if(cbt === '2') {
                    title = '风险点类型由' + _tit2 + '切换为' + _tit1 + ', <br>会导致清空属地并提交所有基本信息修改，<br>确认操作?'
                }


                var sureCallback = function () {

                    var params = _.omit(vo, ['tirList', 'torList']);
                    api.clearCheckObject(params).then(function () {

                        LIB.Msg.success("修改成功");
                        _this.afterDoSave({ type: "U" });
                        _this.changeView("view");
                        _this.$dispatch("ev_dtUpdate");
                        _this.storeBeforeEditVo();

                        _this.$refs.commonTable.doClearData();
                        _this.tableModel.commonModel.values = [];
                        // _this.tableModel.commonModel.columns = _this._buildTableColumns(cbt);

                        var _id = _this.tabs[0].id;
                        _this.doTabClick(_id);
                    });
                };
                var cancelCallback = function () {
                    vo.checkObjType = beforeVo.checkObjType;
                    checkObjectType = beforeVo.checkObjType;
                };

                LIB.Modal.confirm({
                    title: title,
                    onOk: sureCallback,
                    onCancel: cancelCallback
                });

            },
            changeFocusType: function (ft) {
                var _this = this,
                    vo = this.mainModel.vo,
                    beforeVo = this.mainModel.beforeEditVo,
                    title = '';

                if(this.mainModel.opType === 'create') {
                    return;
                }

                if(!beforeVo.focusType) {
                    return;
                }

                if(beforeVo.focusType === ft) {
                    return;
                }

                var _tit1 = this.getDataDic('special_type', ft),
                    _tit2 = this.getDataDic('special_type', beforeVo.focusType);

                if(ft) {
                    title = '重点关注类型由' + _tit2 + '切换为' + _tit1 + ', <br>会导致清空' + _tit2 + '并提交所有基本信息修改，<br>确认操作?';
                } else {
                    title = '删除重点关注类型' + _tit2 + ', <br>会导致清空' + _tit2 + '并提交所有基本信息修改，<br>确认操作?';
                }

                var sureCallback = function () {

                    var params = _.omit(vo, ['tirList', 'torList']);
                    api.clearCheckObject(params).then(function () {

                        LIB.Msg.success("修改成功");
                        _this.afterDoSave({ type: "U" });
                        _this.changeView("view");
                        _this.$dispatch("ev_dtUpdate");
                        _this.storeBeforeEditVo();

                        _this.$refs.commonTable.doClearData();
                        _this.tableModel.commonModel.values = [];
                        // _this.tableModel.commonModel.columns = _this._buildTableColumns(cbt);

                        var _id = _this.tabs[0].id;
                        _this.doTabClick(_id);
                    });
                };
                var cancelCallback = function () {
                    vo.focusType = beforeVo.focusType;
                };

                LIB.Modal.confirm({
                    title: title,
                    onOk: sureCallback,
                    onCancel: cancelCallback
                });
            },
            /**
             * 显示选择检查对象弹窗
             */
            doShowCommonSelectModal: function () {
                var vo = this.mainModel.vo,
                    beforeVo = this.mainModel.beforeEditVo;

                if(!vo.checkObjType) {
                    return LIB.Msg.warning("请选择检查对象");
                }
                if(this.tabSelectId === '1003') {
                    this.craftTypeModel.visible = true;
                    this.getCraftTypes();
                } else {

                    this.selectModel.checkObjSelectModel.visible = true;
                }
            },
            /**
             * 获取工艺类型
             */
            getCraftTypes: function () {
                var _this = this;
                api.getCraftTypes().then(function (res) {
                    _this.craftTypeModel.items = res.data;
                })
            },
            /**
             * 删除检查对象
             * @param row
             */
            doRemoveCheckObj: function (row) {
                var _this = this;
                var id = row.entry.data.checkObjId;
                var params = [];

                params.push({
                    checkObjectId: id
                });
                api.delCheckObj({id: this.mainModel.vo.id}, params).then(function () {
                    LIB.Msg.success("删除成功");
                    _this.getCheckObjects();
                })
            },
            /**
             * 接收弹窗中选择的数据
             * @param {Array<Object>} items 选择的数据
             */
            acceptCheckObject: function (items) {
                var _this = this;
                var _params = _.map(items, function (item) {
                    if(_this.tabSelectId ==='1') {
                        return {
                            checkObjId: item.id,
                            checkObjType: _this.mainModel.vo.checkObjType,
                            tabType:_this.tabSelectId
                        }
                    } else if (_this.tabSelectId === '2') {
                        return {
                            checkObjId: item.id,
                            checkObjType: '2',
                            tabType:_this.tabSelectId
                        }
                    } else {
                        return {
                            checkObjId: item.id,
                            checkObjType: _this.mainModel.vo.focusType,
                            tabType:_this.tabSelectId
                        }
                    }

                });
                this.saveCheckObject(_params);
            },
            /**
             * 保存检查对象
             * @param params
             */
            saveCheckObject: function (params) {
                var _this = this;
                api.saveCheckObject({id: this.mainModel.vo.id}, params).then(function (res) {
                    LIB.Msg.success("保存成功");
                    _this.getCheckObjects();
                })
            },
            /**
             * 获取检查对象
             */
            getCheckObjects: function () {
                var _this = this;
                var params = {
                    id: this.mainModel.vo.id,
                    tabType: this.tabSelectId
                };
                this.$api.getCheckObjects(params).then(function (res) {
                    _this.tableModel.commonModel.values = res.data || [];
                })
            },
            /**
             * 根据检查对象类型创建表格列
             * @param id 检查对象类型
             * @private
             * @return {Array}
             */
            _buildTableColumns: function (id) {
                return helper.getCheckObjectColumns(id, this.mainModel.vo.checkObjType, this.showTemporaryColumns);
            },

            /**
             * 设置table列
             */
            _setTableColumns: function() {
                if(!this.mainModel.vo.checkObjType) {
                    return;
                }
                this.getCheckObjects();
            },
            setCheckObjFilterValue: function () {
                this.checkObjModel.filterKey = this.checkObjModel.cacheKey;
            },
            doCheckObjFilter: function (item, k) {
                if (item.checkObjName.indexOf(k) > -1) {
                    return true;
                }
                return false;
            },
            toggleCheckObjSearchInput: function () {
                this.checkObjModel.showInput = !this.checkObjModel.showInput;
                if(this.checkObjModel.showInput === false) {
                    this.checkObjModel.filterKey = '';
                    this.checkObjModel.cacheKey = '';
                    this.checkObjModel.text = "搜索";
                    this.checkObjModel.icon = "ios-search";
                } else {
                    this.checkObjModel.text = "折叠";
                    this.checkObjModel.icon = "power";
                }
            },
            afterDoCancel:function () {
                this._setTableColumns();
            },
            doShowAreaSelectModal: function () {
                this.selectModel.dominationAreaSelectModel.filterData = {compId: this.mainModel.vo.compId};
                this.selectModel.dominationAreaSelectModel.visible = true;
            },
            _getSpecialDominationAreas: function () {
                this.$refs.specialTable.doQuery({checkTableId: this.mainModel.vo.id});
            },
            getSpecialDominationAreas: function () {
                if(this.mainModel.vo.checkObjType === '2'){
                    this.$nextTick(function () {
                        this._getSpecialDominationAreas();
                    });
                }
            },
            doRemoveSpecialCheckObj: function (row) {
                var _this = this;
                var id = row.entry.data.id;
                var params = [];
                params.push({
                    id: id
                });
                api.delSpecialDominationArea({checkTableId: this.mainModel.vo.id}, params).then(function () {
                    LIB.Msg.success("删除成功");
                    _this.getSpecialDominationAreas();
                })
            },
            doSaveDominationArea: function (items) {
                var _this = this;
                var params = _.map(items, function (item) {
                    return {id: item.id}
                });
                this.$api.saveSpecialDominationArea({checkTableId: this.mainModel.vo.id}, params).then(function (res) {
                    _this.getSpecialDominationAreas();
                })
            },
            doTabClick: function (id, isCreate) {
                this.tabSelectId = id;
                this.tableModel.commonModel.columns = this._buildTableColumns(id);
                if(isCreate) {
                    return;
                }
                this.getCheckObjects();
            },
            doChangeAllDomination: function (data) {
                api.changeIsAllDomination({id: this.mainModel.vo.id, isAllDomination: Number(data),orgId:this.mainModel.vo.compId,checkObjType:this.mainModel.vo.checkObjType}).then(function () {
                    LIB.Msg.success("保存成功");
                })
            },
            doClickCOCell: function(data) {
                var _this = this,
                    cell = data.cell,
                    row = data.entry.data;
                var el = data.event.target;
                var isDisabled = el.closest(".ivu-checkbox-wrapper") && (el.closest(".ivu-checkbox-wrapper").classList.contains("ivu-checkbox-wrapper-disabled"));
                // 否决项
                if ( 'special' === cell.fieldName){
                    var isSpecial = row.isSpecial === '0' ? 1 : 0;
                    api.changeIsSpecial({id: row.id, isSpecial: isSpecial}).then(function () {
                        _this.getCheckObjects();
                    })
                }
                //固有
                if ( 'isInherent' === cell.fieldName && isDisabled === false){
                    var isInherent = (row.isInherent === '0' || !row.isInherent) ? 10 : 0;
                    api.changeIsTemporary({id: row.id, isInherent: isInherent}).then(function () {
                        _this.getCheckObjects();
                    })
                }
                //临时
                if ( 'isTemporary' === cell.fieldName && isDisabled === false){
                    var isTemporary = (row.isTemporary === '0' || !row.isTemporary) ? 10 : 0;
                    var isTemporaryEnable = isTemporary === 0 ? 0 : null;
                    api.changeIsTemporary({id: row.id, isTemporary: isTemporary,isTemporaryEnable: isTemporaryEnable}).then(function () {
                        _this.getCheckObjects();
                    })
                }
                //启动临时
                if ( 'isTemporaryEnable' === cell.fieldName && isDisabled === false){
                    var isTemporaryEnable = row.isTemporaryEnable === '0' ? 10 : 0;
                    api.changeIsTemporaryEnable({id: row.id, isTemporaryEnable: isTemporaryEnable}).then(function () {
                        _this.getCheckObjects();
                    })
                }
            }
        },
        filters: {
            itemFilter: function (value, k) {
                var _this = this;
                if (!k || _.isEmpty(value)) {
                    return value;
                }
                return _.filter(value, function (item) {
                    return _this.doItemFilter(item, k.trim());
                })
            },
            checkObjFilter: function (value, k) {
                var _this = this;
                if (!k || _.isEmpty(value)) {
                    return value;
                }
                return _.filter(value, function (item) {
                    return _this.doCheckObjFilter(item, k.trim());
                })
            }
        },
        events: {
            //selectCheckObject框点击保存后事件处理
            "ev_selectObjectFinshed": function (data) {
                var _this = this;
                //此处前端去重，因为受检对象table的数据为前端分页， TODO 自后要改成后端处理重复记录
                var curCheckObjRelList = this.mainModel.vo.torList;
                var curCheckObjIdList = _.map(curCheckObjRelList, function (item) {
                    return item.checkObject.id;
                });
                var addCheckObjList = _.filter(data, function (item) {
                    return !_.contains(curCheckObjIdList, item.id)
                });

                if (!_.isEmpty(addCheckObjList)) {
                    var addCheckObjRelList = _.map(addCheckObjList, function (item) {
                        return {checkTableId: _this.mainModel.vo.id, checkObjectId: item.id}
                    });
                    api.batchCreateTableObjectRel(null, addCheckObjRelList).then(function () {
                        //curCheckObjRelList.push(addCheckObjList[0]);
                        _this.reloadRel("checkObject", _this.mainModel.vo.id);
                        LIB.Msg.info("保存成功");
                    });
                }


                //刷新
                //this.reloadRel("checkObject",nVal);
            },
            //selectCheckItem框点击保存后事件处理
            "ev_selectItemFinshed": function (data) {
                this.itemModel.show = false;
                var _this = this;
                //此处前端去重，因为受检对象table的数据为前端分页， TODO 自后要改成后端处理重复记录
                //受检对象有对个 通过id找到相应的
                var itemList;
                _.each(this.mainModel.vo.tirList, function (item) {
                    if (data.mainModel.vo.id === item.id) {
                        itemList = item;
                        return false;
                    }
                });
                var curCheckObjRelList = itemList.itemList;
                var curCheckObjIdList = _.map(curCheckObjRelList, function (item) {
                    return item.id;
                });
                var addCheckObjList = _.filter(data.selectedDatas, function (item) {
                    return !_.contains(curCheckObjIdList, item.id)
                });
                if (!_.isEmpty(addCheckObjList)) {
                    var addCheckObjRelList = _.map(addCheckObjList, function (item) {
                        return {
                            checkTableId: _this.mainModel.vo.id,
                            checkItemId: item.id,
                            itemOrderNo: 0,
                            groupId: data.mainModel.vo.groupId,
                            groupOrderNo: data.mainModel.vo.groupOrderNo,
                            groupName: data.mainModel.vo.groupName
                        }
                    });
                    if (addCheckObjRelList.groupName && addCheckObjRelList.groupName.length > 50) {
                        LIB.Msg.warning("分组名称长度不能超过50个字符");
                        return;
                    }
                    var selectedItemOrderNo = _.propertyOf(this.mainModel.selectedGroupItemMap)(data.mainModel.vo.groupId);
                    if(selectedItemOrderNo){//在选中的检查项下面添加
                        api.batchCreateTableItemRel2({groupId:data.mainModel.vo.groupId,itemOrderNo:selectedItemOrderNo},
                            addCheckObjRelList).then(function () {
                                _this.reloadRel("checkItem", _this.mainModel.vo.id);
                                LIB.Msg.info("保存成功");
                        });
                    }else{
                        api.batchCreateTableItemRel(null, addCheckObjRelList).then(function () {
                            _this.reloadRel("checkItem", _this.mainModel.vo.id);
                            LIB.Msg.info("保存成功");
                        });
                    }
                }
            },
            //selectCheckItem框点击取消后事件处理
            "ev_selectItemCanceled": function () {
                this.itemModel.show = false;
            }
        },
        init: function () {
            this.$api = api;
        },
        attached: function () {
        },
        ready: function () {
            this.commonTable = this.$refs.commonTable;
            this.enableMajorRiskSource = window.enableMajorRiskSource;
            this.getTemporaryColumnSetting();
        }
    });

    return detail;
});
