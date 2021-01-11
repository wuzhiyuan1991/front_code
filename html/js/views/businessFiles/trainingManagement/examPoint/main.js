define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");

    var tpl = LIB.renderHTML(require("text!./main.html"));
    // 编辑弹框页面
    var editComponent = require("./edit");
    // 右侧滑出知识点详情页
    var detailXlPanel = require("./detail-xl");
    // 知识点树弹窗
    var selectPointModal = require('./dialog/selectPointModal');

    //vue数据 配置url地址 拉取数据
    var dataModel = {
        categoryType: null,
        topCompId:null,

        mainModel: {
            detailXlPanelClass: "large-info-aside"
        },
        innerAddFun: {
            type: Function
        },
        exampoint: {
            data: null,
            showHide: false,
            selectedDatas: [],
            compIds:[],
        },
        addModel: {
            //显示弹框
            show: false,
            title: "修改",
            id: null
        },
        editPermission: {},   // 编辑权限组
        renderEditBtnStr: '', // 自定义编辑按钮
        detailModel: {
            show: false,
            id: null
        },
        selectPointModal: {
            show: false
        },
        // 待移动的知识点
        movePoint: {},
        uploadModel: {
            url: "/exampoint/importExcel"
        },
        exportModel : {
            url: "/exampoint/exportExcel"
        },
        templete : {
            url: "/exampoint/file/down"
        },
        importProgress:{
            show: false
        }
    };


    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //引入html页面
        template: tpl,
        components: {
            "editcomponent": editComponent,
            "detailXlPanel": detailXlPanel,
            'selectPointModal': selectPointModal
        },
        data: function () {
            return dataModel;
        },
        computed: {
            'renderEditBtnStr': function () {
                //if (this.hasPermission('4020001001'))<Icon type="arrow-move"></Icon>
                return '<span  class="treeGridEditIco_info" style="cursor:pointer;padding-right:10px">' +
                    '<i class="ivu-icon ivu-icon-ios-information" style="margin-right:3px"></i>详情</span>' +
                    '<span  class="treeGridEditIco_move" style="cursor:pointer;padding-right:10px">' +
                    '<i class="ivu-icon ivu-icon-arrow-move" style="margin-right:3px"></i>移动分类</span>';
            }
        },
        methods: {
            doExportExcel: function() {
                var _this = this;
                if(_this.exampoint.compIds.length > 1){
                    LIB.Msg.warning("当前数据存在多家公司数据，当前只支持导出一家公司数据！",3)
                    return;
                }
                LIB.Modal.confirm({
                    title: '导出数据?',
                    onOk: function() {
                        var obj = 'compId='+ _this.compId;
                        if(_this.categoryType == 'org'){
                            obj = 'orgId=' + _this.compId;
                        }
                        window.open(_this.exportModel.url+"?"+ obj);
                    }
                });
            },
            doImport:function(){
                this.importProgress.show = true;
            },
            //全部显示
            treeShowList: function () {
                this.$refs.exampoint.$children[0].doShowNode(function () {
                })
            },
            //全部隐藏
            treeHide: function () {
                this.$refs.exampoint.$children[0].doHideNode(function () {
                })
            },
            //新增
            treeAdd: function () {
                this.addModel.show = true;
                this.addModel.title = "新增"
                this.$broadcast('ev_detailAdd');
            },
            doAddNode: function (value, innerAddFun) {
                if (!this.hasPermission('4020004001')) {
                    LIB.Msg.warning("你没有此权限!");
                    return;
                }
                this.innerAddFun = innerAddFun;
                this.addModel.title = "新增"
                this.$broadcast('ev_detailReload', value, "add");
                this.addModel.show = true;
            },
            //修改
            doEditNode: function (value) {
                if (!this.hasPermission('4020004002')) {
                    LIB.Msg.warning("你没有此权限!");
                    return;
                }
                this.treeGridName = value;
                this.addModel.title = "修改"
                this.$broadcast('ev_detailReload', value, "update");
                this.addModel.show = true;
            },
            //删除
            doDelNode: function (value) {
                if (!this.hasPermission('4020004003')) {
                    LIB.Msg.warning("你没有此权限!");
                    return;
                }
                var id = value.data.id;
                var _this = this;
                if (value.data.children && value.data.children.length > 0) {
                    LIB.Msg.error("该分类下面存在子分类，不可删除！");
                    return
                }
                var callback = function (res) {
                    if (res.status == 200) {
                        window.businessCache = true;
                        LIB.Msg.info("删除成功");
                        value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
                    }
                }

                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        api.remove(null, {id: value.data.id}).then(callback);
                    }
                });
            },
            doEditAdd: function (value, type) {
                var obj = {
                    id: value.vo.id,
                    name: value.vo.name,
                    code: value.vo.code,
                    open: true
                }
                this.retrieveData();
                this.addModel.show = false;
            },
            //获取数据
            retrieveData: function () {
                var _this = this;
                if(this.categoryType == 'org'){
                    var obj = {orgId: this.compId}
                }else{
                    var obj = {compId: this.compId}
                }
                api.list(obj).then(function (res) {
                    _this.exampoint.data = res.data;
                    _this.exampoint.compIds = _.uniq(_.map(res.data, "compId"));
                });
            },
            doUpdate: function (value, flag) {
                this.retrieveData();
                window.businessCache = true;
                this.addModel.show = false;
            },
            doEditClick: function (data) {
                if (data.event.target.className === "treeGridEditIco_info") {
                    this.showDetail(data.entity, {opType: "view"});
                } else if (data.event.target.className === "treeGridEditIco_move") {
                    this.movePoint = data.entity;
                    this.selectPointModal.show = true;
                }
            },

            /**
             * 修改知识点分类
             */
            doChangePointParent: function (data) {
                var _this = this;
                var updateObj = {
                    id: _this.movePoint.id,
                    name: _this.movePoint.name,
                    code: _this.movePoint.code,
                    attr1: _this.movePoint.attr1,
                    parentId: data.id
                };
                api.update(null, updateObj).then(function (res1) {
                    LIB.Msg.info("修改成功");
                    _this.movePoint = {}; // 清空数据
                    _this.retrieveData();
                });
            },
            onCategoryChange: function (data) {
                this.compId = data.nodeId;

                this.categoryType = data.categoryType;
                // 没有parentId代表根目录 不传parentId
                if (!data.parentId) {
                    this.compId = null;
                    this.categoryType = 1;
                    this.topCompId = data.nodeId;
                }
                if(data.nodeId && !data.topNodeId){
                    this.topCompId = data.nodeId;
                }
                if(data.nodeId == data.topNodeId){
                    this.categoryType = 1;
                    this.topCompId = data.topNodeId;
                }

                if(this.categoryType != 1){
                    var comp = LIB.getDataDic('org', this.compId);
                    if(comp.t == '1'){
                        this.categoryType = 'comp'
                    }
                }

                this.retrieveData();
            }
        },
        events: {
            //修改
            "ev_editUpdata": function (value, flag) {

            },
            "ev_editAdd": function (value, type) {
                var obj = {
                    id: value.vo.id,
                    name: value.vo.name,
                    code: value.vo.code,
                    attr1: value.vo.attr1
                }
                this.exampoint.data.push(obj);
                this.addModel.show = false;
            },
            "ev_dtDelete": function () {
                this.retrieveData();
            }
        },

        ready: function () {
            this.compId = LIB.user.compId;
            // this.retrieveData();
            // this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.compId});
        }
    })
    return vm;
})