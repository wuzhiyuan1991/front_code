define(function (require) {
    //基础js
    var LIB = require('lib');
    var commonApi = require("../api");
    var api = require("./vuex/api");
    _.extend(api,commonApi);
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var liteNewTable = require('components/lite-new-table/main');
    var model=require('../model');
    // 弹框
	var ptwCatalogTypeFormModal = require('./dialog/catalogTypeFormModal')
    var mainGasCheck=require('./main-gascheck');
    var mainWorkLevel=require('./main-worklevel');
    var mainCommentType=require('./main-commenttype');
    var workRoles = require('./workRoles');
    var workDisclose = require('./workDisclose');


    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"


    LIB.registerDataDic("iptw_catalog_type", [
        ["1","作业类型"],
        ["2","作业分级"],
        ["3","个人防护设备"],
        ["4","气体检测指标"],
        ["5","岗位承诺"],
        ["6", "作业角色人员"],
        ["7", "安全交底内容"]
    ]);
    LIB.registerDataDic("iptw_catalog_gas_type", [
        ["1","有毒有害气体或蒸汽"],
        ["2","可燃气体或蒸汽"],
        ["3","氧气"],
    ]);
    LIB.registerDataDic("iptw_catalog_enable_commitment", [
        ["0","否"],
        ["1","是"]
    ]);


    LIB.registerDataDic("iptw_catalog_gas_value_case", [
        ["1","<"],
        ["2","<="]
    ]);

    LIB.registerDataDic("iptw_catalog_gas_type", [
        ["1","有毒有害气体或蒸汽"],
        ["2","可燃气体或蒸汽"],
        ["3","氧气"]
    ]);

    var initDataModel = function () {
        return {
            isTop: false,
            moduleCode: "ptwCatalog",
            checkedGroupIndex:0, // 导航下标
            tabList:[],//数据字典列表
            //控制全部分类组件显示
            // mainModel:{
            //     showHeaderTools: false,
            //     //当前grid所选中的行
            //     selectedRow: [],
            //     detailPanelClass : "middle-info-aside"},
            detailModel: {
                show: false
            },
            detailModel1:{
                show:false
            },
            taskType:{
                values:[],
                index:0,
            },
            taskPersonalProtection:{
                values:[],
                index:0
            },
            tableModel:{
                selectedDatas:[]
            },
            selectOrgId: ''
        };
    }

    var vm = LIB.VueEx.extend({
		// mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],

        //Legacy模式
//		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
			"ptwCatalogTypeFormModal":ptwCatalogTypeFormModal,
            "mainGasCheck":mainGasCheck,
            "mainWorkLevel":mainWorkLevel,
            "mainCommentType":mainCommentType,
            "workRoles": workRoles,
            "workDisclose": workDisclose
            // "liteNewTable":liteNewTable
			//Legacy模式
//			"ptwcatalogFormModal":ptwCatalogFormModal,
            
        },
        computed:{
          currentTab:function(){
               return this.tabList[this.checkedGroupIndex]||{};
          },
          currentWorkCatalog:function(){
            return  this.taskType.values[this.taskType.index]
          }

        },
        methods: {
            queryWorkcatalogtree: function () {
                api.queryWorkcatalogtree({compId: this.selectOrgId}).then(function (res) {
                    console.log(res);
                })
            },
            //显示详情面板
            showDetail: function(row, opts) {
                var opType = (opts && opts.opType) ? opts.opType : "view";
                //this.$broadcast('ev_dtReload', "view", row.id);
                this.$broadcast('ev_dtReload', opType, row.id, row, opts);
                this.detailModel1.show = true;
            },

            doDelCataLogTypeAll:function (obj, that) {
                var _this = this;
                api.removeAll({type:obj[0].type}).then(function () {
                    LIB.Msg.info('删除成功');
                    that.selectedIndex=-1;
                     _this.getList(true);
                });
            },
            _getPms:function() {
                var type=this.currentTab.id;
                var pms={
                    type:type,
                    compId:this.selectOrgId || LIB.user.compId
                };
                if(type==2){
                    pms.parentId=this.currentWorkCatalog.id;
                }
                return pms;
            },
            doSelectGroup:function (index,item) {
                this.checkedGroupIndex = index;
                if(item.id == '2'){
                    this.$refs.mainWorkLevel.getReadyType();
                }
                if("2,4,5,6".match(new RegExp(item.id))){return}
                this.getList();
            },
            onMoveRow:function (val, obj) {
                var _this = this;
                var params = {
                    type:this.currentTab.id,
                    criteria: {intValue: {offset: val}},
                    offset:val,
                    id:obj.id
                };
                api.order(params).then(function (res) {
                })
            },
            doEditCatalogType:function (item,name, that) {
                var temp=_.extend({},item);
                temp.name=name;
                var _this = this;
                api.update(temp).then(function(){
                    item.name=name;
                    _this.getList(true);
                    LIB.Msg.info("保存成功");
                    that.modalEdit.show = false;
                })
            },
            doSaveCatalogType:function (items, that) {
			    var _this = this;
			    var pms=this._getPms();
                items.forEach(function(item){
                   _.extend(item,pms);
                });
                if(this.isTop) return LIB.Msg.error("请选择公司");
				api.createBatch(items).then(function () {
                    _this.getList(true);
                    that.modalAdd.show = false;
                })
            },
            doDelCataLogType:function(data,index, that){
                var _this = this;
                api.removeSingle(null, data).then(function (res) {
                    LIB.Msg.info('删除成功');
                    that.values.splice(index,1);
                    if(that.values.length===0){
                        that.selectedIndex=-1;
                    }
                    else if(that.values.length<that.selectedIndex+1){
                        that.selectedIndex=that.values.length-1;
                    }
                    _this.getList(true);
                })
            },
            getList:function (reload) {
                var type = this.currentTab.id;
                var _this = this;
                var pms = this._getPms();
                // if(!reload && this.currentTab.load){return}
                api.list(pms).then(function (res) {
                   if(type==1){
                       _this.taskType.values = res.data;
                   }
                   else if(type == 3){
                       _this.taskPersonalProtection.values = res.data;
                   }
                   // if(_this.tabList && _this.tabList[_this.checkedGroupIndex])
                   // _this.tabList[_this.checkedGroupIndex].load=true;//表示已加载
                })
            },
            doOrgCategoryChange: function(obj) {
                var _this = this;
                var isTop = false;
                //条件 后台搜索的 值
                if (obj.categoryType == "org" && obj.topNodeId == obj.nodeId) {
                    //如果是根据当前最大组织机构过滤时,则不传参数,后台默认处理
                    var node = _this.$refs.categorySelector.model[0].data;
                    this.selectOrgId = node[0].id;
                    if(node[0].name == '所有公司'){isTop = true;}
                } else {
                    this.selectOrgId = obj.nodeId;
                }
                this.getList();
                // 更新列表操作
                this.isTop = isTop;
                this.$broadcast('do-org-category-change', this.selectOrgId, isTop);

            },

        },
        init: function(){
        	this.$api = api;
        },
        ready: function () {
            var _this = this;
            this.tabList = this.getDataDicList('iptw_catalog_type');
            _this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.compId})
            this.selectOrgId = LIB.user.compId;
            this.getList();
            setTimeout(function () {
                _this.$broadcast('do-org-category-change', _this.selectOrgId, false);
            },200)


            // var node = this.$refs.categorySelector.model[0].data;
            //
            // this.selectOrgId = node[0].name=='所有公司'?LIB.user.compId: node[0].id;
            // this.getList();
            // setTimeout(function () {
            //     _this.$broadcast('do-org-category-change',   _this.selectOrgId );
            // },100)
        },
        route:{
            activate: function(transition) {
                var _this = this;
                if(this.$route.query.type){
                    this.checkedGroupIndex = parseInt(this.$route.query.type);
                    this.$nextTick(function () {
                        _this.checkedGroupIndex = parseInt(_this.$route.query.type);
                        _this.tabList = _this.getDataDicList('iptw_catalog_type');
                        // _this.getList();
                    })
                }

                // setTimeout(function () {
                //     _this.$refs.according.doSelectItem(parseInt(_this.checkedGroupIndex),_this.tabList[_this.checkedGroupIndex]);
                // },500);

                // !this.initData ? this.refreshMainTable() : this.initData();
                transition.next();
            }
        }
       ,
    });

    return vm;
});
