define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    //编辑弹框页面
    var editComponent = require("./edit");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    var riskAssessmentKind = require("componentsEx/formModal/riskAssessmentKind")

    // 公司组件相关
    var companySelectModel = require("componentsEx/selectTableModal/companySelectModel");


    //vue数据 配置url地址 拉取数据
    var dataModel = {
        equipmentType: {
            url:"documentclassification' + '/list/{curPage}/{pageSize}'",
            data: null,
            showHide: false
        },
        industryCategory: {
            data: null,
            showHide: false
        },
        courseCategory: {
            data: null,
            showHide: false
        },
        certificationSubject: {
            data: null,
            showHide: false
        },
        certType: {
            data: null,
            showHide: false,
            showImport:false,
            importUrl:"/certtype/importExcel",
            templateUrl:"/certtype/file/down"
        },
        riskType: {
            data: null,
            showHide: false
        },
        tableType: {
            data: null,
            showHide: false
        },
        hazardFactor: {
            data: null,
            showHide: false,
            showImport:false,
            importUrl:"/hazardfactor/importExcel",
            templateUrl:"/hazardfactor/file/down",
            catalogLists: [], // 左侧列表
            selectCatalogIndex: 0, // 选中的序号
            catalogVisible: false,
            companyList:[],
            columns: [
                _.extend(_.clone(LIB.tableMgr.column.company),{title:'公司名称'})
            ],
            companySelectModel:{
                show: false,
                filterData:{}
            },
        },
        checkObjectCatalog: {
            data: null,
            showHide: false,
            showImport:false,
            importUrl:"/checkobjectcatalog/importExcel",
            templateUrl:"/checkobjectcatalog/file/down"
        },
        checkObjectCatalogClassify: {
            data: null,
            showHide: false,
            showImport:false,
            importUrl:"/checkobjectcatalogclassify/importExcel",
            templateUrl:"/checkobjectcatalogclassify/file/down"
        },
        checkBasisType: {
            data: null,
            showHide: false
        },
        addModel: {
            //显示弹框
            show: false,
            title: "修改",
            id: null
        },
        uploadModel: {
            url: null
        },
        templete : {
            url: null
        },
        importProgress:{
            show: false
        },
        selectedTreeDatas: [],
        currentList: null,
        bizType:null,
        showEquipmentTypeCode:false,
    };
    var vm = LIB.VueEx.extend({
        //引入html页面
        template: require("text!./main.html"),
        components: {
            "editcomponent": editComponent,
            "importprogress":importProgress,
            "riskAssessmentKind": riskAssessmentKind,
            "companySelectModel": companySelectModel
        },
        computed: {
            routeType: function () {
                var path = this.$route.path;
                if(_.startsWith(path, '/trainingManagement')) {
                    return 'trainingManagement'
                }
                else if(_.startsWith(path, '/hiddenDanger') || _.startsWith(path, '/randomInspection') || _.contains(path,'bizType')) {//有bizType的 默认为该模式
                    return 'hiddenDanger'
                }
                else if(_.startsWith(path, '/riskAssessment')) {
                    if(_.endsWith(path, '/equipmentType')){
                        return 'equipmentType'
                    }
                    return 'riskAssessment'
                }
                else if(_.startsWith(path, '/majorRiskSource')) {
                    return 'majorRiskSource'
                }
                else if(_.startsWith(path, '/expertSupport')) {
                    return 'expertSupport'
                }

                return 'default'
            }
        },
        data: function () {
            return dataModel;
        },
        methods: {
            doDeleteCompany: function (item) {
                var _this = this;
                var obj = this.hazardFactor.catalogLists[this.hazardFactor.selectCatalogIndex];
                LIB.Modal.confirm({
                    title: '确认删除?',
                    onOk: function () {
                        api.delHazardFactorCompany({id: obj.id},[{id: item.id}]).then(function (res) {
                            LIB.Msg.info("删除成功");
                            _this.getCompanyList()
                        })
                    }
                })
            },
            getCompanyList: function () {
                var _this = this;
                var obj = this.hazardFactor.catalogLists[this.hazardFactor.selectCatalogIndex];
                api.queryHazardFactorCompanyList({id: obj.id}).then(function (res) {

                    _this.hazardFactor.companyList = res.data.list;
                })
            },
            doSaveCompany: function (arr) {
                var _this = this;
                var obj = this.hazardFactor.catalogLists[this.hazardFactor.selectCatalogIndex];
                api.createHazardFactorCompany({id: obj.id},arr).then(function (res) {
                    _this.getCompanyList()
                });
            },
            doAddCompany: function () {
                this.hazardFactor.companySelectModel.show = true;
            },
            doDeleteCatalog: function () {
                var _this = this;
                var obj = this.hazardFactor.catalogLists[this.hazardFactor.selectCatalogIndex];
                LIB.Modal.confirm({
                    title: '确认删除该分类?',
                    onOk: function () {
                        api.delHazardFactorSystem(null, {id: obj.id}).then(function(res){
                            //前端更新修改数据
                            _this.hazardFactor.catalogLists.splice(_this.hazardFactor.selectCatalogIndex,1);
                            _this.hazardFactor.selectCatalogIndex = 0;
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },

            doSelectHazardCatalogs:function (index) {
                this.hazardFactor.selectCatalogIndex = index;
                this._getHazardFactorData();
            },

            getHazardFactorCatalogsList: function () {
                var _this = this;
                api.queryHazardFactorSystemList().then(function (res) {
                    _this.hazardFactor.catalogLists = res.data.list;
                    _this._getHazardFactorData();
                });
            },

            initHazardFactor: function () {
                this._getHazardFactorData();
                return false;
            },

            doCreateCatalog: function () {
                this.hazardFactor.catalogVisible = true;
                this.$refs.riskAssessmentKind.init();
            },

            doUpdateCatalog: function (item) {
                var _this = this;
                api.updateHazardFactorSystem(item).then(function (res) {
                    _this.hazardFactor.catalogLists[_this.hazardFactor.selectCatalogIndex].name = item.name;
                });
            },

            doSaveCatalog: function (item) {
              var _this = this;
              api.createHazardFactorSystem(item).then(function (res) {
                item.id = res.data.id;
                var obj = _.clone(item);
                _this.hazardFactor.catalogLists.push(obj);
                if(_this.hazardFactor.catalogLists.length == 1){
                    _this.hazardFactor.selectCatalogIndex=0;
                }
              });
            },

            doShowUpdateCatalog: function () {
                var obj = this.hazardFactor.catalogLists[this.hazardFactor.selectCatalogIndex];
                this.$refs.riskAssessmentKind.init(obj);
                this.hazardFactor.catalogVisible = true;
            },

            /**
             * 获取当前页签的类型
             * @return {String}
             * @private
             */
            _getType: function () {
                var _t = this.routeType,
                    _key = this.tabKey || '1';

                var types = {
                    'default-1': 'equipmentType',
                    'default-2': 'industryCategory',
                    'trainingManagement-1': 'courseCategory',
                    'trainingManagement-2': 'certificationSubject',
                    'trainingManagement-3': 'certType',
                    'hiddenDanger-1': 'riskType',
                    'hiddenDanger-2': 'tableType',
                    'riskAssessment-1': 'hazardFactor',
                    'majorRiskSource-1': 'checkObjectCatalog',
                    'majorRiskSource-2': 'checkObjectCatalogClassify',
                    'expertSupport-1': 'checkBasisType',
                    'equipmentType-1': 'equipmentType',

                }

                // 路由类型-页签key
                var key = _t + '-' + _key;

                return types[key];
            },

            /**
             * 获取请求的URL
             * @param type
             * @param method [GET|DELETE] 请求的类型：获取数据或者删除数据
             * @return {Function}
             * @private
             */
            _getURL: function (type, method) {
                var getURLs = {
                  
                    certType: api.listCertType // 证书类型
                };

                var deleteURLs = {
                 
                    certType: api.delCertType // 证书类型
                };

                if (method === 'GET') {
                    return getURLs[type];
                }
                else if(method === 'DELETE') {
                    return deleteURLs[type];
                }
            },

            /**
             * 获取 hazardFactor 数据
             * @param type
             * @private
             */
            _getHazardFactorData: function () {
                this._getData(true);
                this.getCompanyList();
            },

            /**
             * 获取数据
             * @param type
             * @private
             */
            _getData: function (isHazardFactor) {
                
                var _this = this;
                this.currentList = null;

                var type = this._getType();
                var apiURL = this._getURL(type, 'GET');

                if (type === 'industryCategory') {
                    LIB.globalLoader.show();
                }
                var param = {bizType:this.$route.query.bizType};

                if(type == 'hazardFactor' && !isHazardFactor){
                    this.getHazardFactorCatalogsList();
                    return ;
                }
                if(type == 'hazardFactor'){
                    param.systemId = this.hazardFactor.catalogLists[this.hazardFactor.selectCatalogIndex].id;
                    if(!param.systemId) return ;
                }


                // // 测试数据 start
                // var datas = [
                //     {
                //         id:'1000',
                //         name:'人员证件'
                //     },
                //     {
                //         id:'1100',
                //         parentId:'1000',
                //         name:'人员证件1'
                //     },
                //     {
                //         id:'1110',
                //         parentId:'1000',
                //         name:'人员证件2'
                //     },
                //     {
                //         id:'2000',
                //         name:'企业证件'
                //     },
                //     {
                //         id:'2100',
                //         parentId:'2000',
                //         name:'企业证件1'
                //     },
                //     {
                //         id:'2200',
                //         parentId:'2000',
                //         name:'企业证件2'
                //     },
                //     // {
                //     //     id:'1200',
                //     //     parentId:'1000',
                //     //     name:'二级安全机构01'
                //     // },
                //     // {
                //     //     id:'1210',
                //     //     parentId:'1200',
                //     //     name:'三级安全机构01'
                //     // },
                //     // {
                //     //     id:'1300',
                //     //     parentId:'1000',
                //     //     name:'二级安全机构02'
                //     // },
                //     // {
                //     //     id:'1310',
                //     //     parentId:'1300',
                //     //     name:'三级安全机构02'
                //     // },
                // ];
              

                // this.equipmentType.data = datas;
                // // 测试数据 end


                api.listCertType(param).then(function (res) {
                    _this[type].data = res.data;

                    _this[type].dataCode = res.data;
                    _.each(_this[type].dataCode,function(item){
                        item.nameCode = item.name+"  ["+item.code+"]";
                    })

                    _this.currentList = res.data;
                    LIB.globalLoader.hide(_this);
                })

                
                // api.listCertType().then(function (res) {
                //     _.each(res.data, function (item) {
                //         item.nameCode = _.uniq();
                //     })
                    
                //     _this.equipmentType.data = res.data;
                // })
            },

            doTabs: function (data) {
                this.tabKey = data.key;
                this._getData();
            },

            showAll: function () {
                
                var type = this._getType();
                var refName = 'treeGrid' + _.capitalize(type);
                this.$refs[refName].$children[0].doShowNode();
            },
            hideAll: function () {
                
                var type = this._getType();
                var refName = 'treeGrid' + _.capitalize(type);
                this.$refs[refName].$children[0].doHideNode();
            },

            // 新增(全部折叠右侧的按钮)
            treeAdd: function (val) {
                
                this.addModel.show = true;
                this.addModel.title = "新增";
                var systemId = null;
                if(this.hazardFactor.catalogLists && this.hazardFactor.catalogLists.length>0)
                 systemId = this.hazardFactor.catalogLists[this.hazardFactor.selectCatalogIndex].id;

                this.$broadcast('ev_topAdd', val, systemId);
            },

            // 新增(节点上的按钮)
            doAddNode: function (value) {
                
                var type = this._getType();
                this.addModel.title = "新增";
                // var systemId = this.hazardFactor.catalogLists[this.hazardFactor.selectCatalogIndex].id;
                var systemId = null;
                if(this.hazardFactor.catalogLists && this.hazardFactor.catalogLists.length>0)
                    systemId = this.hazardFactor.catalogLists[this.hazardFactor.selectCatalogIndex].id;

                this.$broadcast('ev_detailReload', value, type, "add", systemId);
                this.addModel.show = true;
            },

            // 修改节点
            doEditNode: function (value) {
                var type = this._getType();
                this.addModel.title = "修改";
                this._currentId = value.data.id;
                var systemId = null;
                if(this.hazardFactor.catalogLists && this.hazardFactor.catalogLists.length>0)
                    systemId = this.hazardFactor.catalogLists[this.hazardFactor.selectCatalogIndex].id;
                this.$broadcast('ev_detailReload', value, type, "update", systemId);
                this.addModel.show = true;
            },

            // 删除节点
            doDeleteNode: function (value) {
                var id = value.data.id;
                var _this = this;
                if (_.isArray(value.data.children) && value.data.children.length > 0) {
                    LIB.Msg.error("该分类下面存在子分类，不可删除！");
                    return
                }

                var type = this._getType();
                var apiURL = this._getURL(type, 'DELETE');


                var callback1 = function (res) {
                    if (res.status === 200) {
                        window.businessCache = true;
                        LIB.Msg.info("删除成功");
                        // value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
                        _this._getData(true);
                    }
                }
                var callback2 = function (res) {
                    if("false" == res.body){
                        LIB.Modal.confirm({
                            title: '该分类已经被其他业务数据引用,是否删除?',
                            onOk: function () {
                                apiURL(null, {id: id,criteria:{intValue:{"ignoreDeleteFlag_":1}}}).then(callback2)
                            }
                        });
                        return;
                    }
                    if (res.status === 200) {
                        window.businessCache = true;
                        LIB.Msg.info("删除成功");
                        _this._getData(true);
                        // value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
                    }
                }

                var c2 = [
                    'checkObjectCatalogClassify',
                    'checkObjectCatalog'
                ];

                // 构造参数
                var p1 = [
                    'riskType',
                    'tableType',
                    'hazardFactor',
                    'checkBasisType'
                ];
                var p2 = [
                    'courseCategory',
                    'certificationSubject',
                    'checkObjectCatalogClassify',
                    'checkObjectCatalog',
                    'equipmentType',
                    'industryCategory',
                    'certType'
                ];
                var param = null;
                if(_.includes(p1, type)) {
                    param = [id]
                }
                else if(_.includes(p2, type)) {
                    param = {id: id}
                }

                if (_.includes(c2, type)) {
                    apiURL(null, param).then(callback2)
                }
                else {
                    
                    LIB.Modal.confirm({
                        title: '删除当前数据?',
                        onOk: function() {
                            api.delCertType(null, param).then(callback1);
                        }
                    });
                }



            },

            /**
             * 修改弹窗保存后的回调
             * @param value
             * @param method
             * @param type
             */
            doUpdate: function (value, method, type) {
                if(method === 'update') {
                    this.selectedTreeDatas = [{id: this._currentId}];
                }
                this._getData(type);
                window.businessCache = true;
                this.addModel.show = false;
            },

            /**
             * 添加弹窗保存后的回调
             * @param value
             * @param type
             */
            doEditAdd: function (value, type) {
                var _this = this;
                var obj = {
                    id: value.vo.id,
                    name: value.vo.name,
                    code: value.vo.code,
                    orderNo: value.vo.orderNo,
                }
                this._getData(type);
                this.addModel.show = false;
            },

            // 导入
            doImport:function(type){
                if(type == 'hazardFactor'){
                    var obj = this.hazardFactor.catalogLists[this.hazardFactor.selectCatalogIndex];
                    if(!obj) return ;
                    this[type].importUrl = "/hazardfactor/importExcel?systemId="+obj.id;
                }
                if(!!this[type] && !!this[type].importUrl && !!this[type].templateUrl) {
                    this[type].showImport = true;
                }
            }

        },
        attached: function () {
            this.tabKey = '1';
            this.bizType = this.$route.query.bizType;
            this.hazardFactor.selectCatalogIndex = 0;
            this.hazardFactor.catalogLists=[];
            this._getData();
        }
    });
    return vm;
});