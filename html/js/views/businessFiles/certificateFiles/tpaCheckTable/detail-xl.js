/**
 * Created by yyt on 2017/7/20.
 */
define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");

    //弹框
    var objectComponent = require("./dialog/selectCheckObject");
    var itemComponent = require("./dialog/selectCheckItem");
    var checkItemFormModal = require("componentsEx/formModal/tpaCheckItemFormModal");
    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");

    //初始化数据模型
    var newVO = function() {
        return {
            id :null,
            name:null,
            type :"1",//计划检查
            disable:"0",
            //orgId:null,
            org:{id:null,name:null},
            remarks:null,
            checkTableType:{id:null,name:null},
            checkTableTypeId : null,
            torList:[],
            //objectList : [],
            tirList:[],//检查表关联检查项集合
            checkItemList:[],
            group:{},//当前操作的检查表组信息
            //公司Id
            compId:null,
            //部门Id
            orgId:null,

            //公司id 用来做桥接
//			orgIdData:null,
            //部门id
//			perId:null,
            //获取部门数据 用来跟新
            deptList:[],
            //检查表-检查项关联关系
            tableItemRel:{},
            tpaCheckItem:{},
            tableType:"20",
            attr1:"0"
        }
    };
    //Vue数据
    var dataModel = {
        mainModel : {
            isReadOnly:true,//是否只读
            vo : newVO(),
            typeList:[{id:"1",name:"计划检查"}/*,{id:"0",name:"非计划检查"}*/],
            disableList:[{id:"0",name:"启用"},{id:"1",name:"停用"}],
            scrolled: true,
            opType : 'view',
            examineTypeList:[{id:"0",name:"船舶二级安全审查"},{id:"1",name:"船岸安全检查"},{id:"2",name:"船舶离泊前安全检查"},{id:"4",name:"槽罐车作业安全巡检"},{id:"5",name:"槽罐车准入审查"}]
        },
        isEditRel:false,//是否可以修改关联关系
        isShowIcon:false,//是否显示收缩/展开图标
        isGroupNum : -1,//分组序号
        checkTableTypeList:[],
        selectedCheckTableType:[],
        isShowCheckItem : true,
        isShowCheckObject : true,
        groupName : null,
        itemColumns:[
            {
                title:"检查项名称",
                fieldName:"name"
            },
            {
                title:"分类",
                fieldType:"custom",
                width : "180px",
                render: function(data){
                    if(data.riskType){
                        return data.riskType.name;
                    }
                }
            },
            {
                title:"类型",
                fieldType:"custom",
                width : "100px",
                render: function(data){
                    return LIB.getDataDic("pool_type",data.type);
                }
            },
            {
                title:"状态",
                fieldType:"custom",
                width : "100px",
                render: function(data){
                    return LIB.getDataDic("disable",data.disable);
                }
            },
            {
                title:"设备设施",
                fieldType:"custom",
                width : "200px",
                render: function(data){
                    return data.tpaEquipment == null ? "" : data.tpaEquipment.name;
                }
            },
            {
                title:"",
                fieldType:"tool",
                toolType:"edit,del"
            }
        ],
        itemModel:{
            //显示弹框
            show : false,
            title:"选择检查项",
            id: null
        },
        newItemModel:{
            show : false,
            title:"新增",
            id: null
        },
        selectedOrg:[],//选中的组织机构
        orgList:[],//机构下拉树数据
        //验证规则
        rules:{
            name:[{ required: true, message: '请输入检查表名称'},
                LIB.formRuleMgr.length(100)
            ],
            //checkTableTypeId:[{ required: true, message: '请选择检查表分类'}],
            type:[{ required: true, message: '请选择检查表类型'}],
//			orgIdData:[{ required: true, message: '请选择公司'}],
            compId:[{ required: true, message: '请选择所属公司'}],
//			perId: [{required: true, message: '请选择所属部门'}],
// 			orgId: [{required: true, message: '请选择所属部门'}],
            disable:[{ required: true, message: '请选择检查表状态'}]
        },
        emptyRules:{},
//		perId:null,
        orgName:null,
        tableModel : {
            deptTableModel : {
                url : "tpachecktable/depts/list/{curPage}/{pageSize}",
                columns : [{
                    title : "编码",
                    fieldName : "code",
                },{
                    title : "名称",
                    fieldName : "name",
                },{
                    title : "所属部门",
                    fieldType:"custom",
                    render: function(data){
                        return !!data.parentId ? LIB.getDataDic("org", data.parentId)["deptName"] : "";
                    }
                },{
                    title : "",
                    fieldType : "tool",
                    toolType : "del"
                }]
            },
        },
        selectModel : {
            deptSelectModel : {
                visible : false,
                filterData : {"criteria.strValue.compId" : null}
            },
        },
        formModel : {
            checkItemFormModel : {
                show : false,
                queryUrl : "tpacheckitem/{id}"
            }
        }
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	el
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
        mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        template: tpl,
        components : {
            "objectcomponent":objectComponent,
            "itemcomponent":itemComponent,
            "checkItemFormModal":checkItemFormModal,
            "deptSelectModal":deptSelectModal
        },
        data:function() {
            return dataModel
        },
        watch: {
            "mainModel.vo.compId" : function (nVal, oVal) {
                if (!_.isEmpty(oVal)) { //已选择过所属公司 才清除 部门
                    this.$refs.deptTable.doClearData();

                    //所属公司发生变化之后， 和编辑前的 所属公司一致时，重新加载部门
                    if(this.mainModel.beforeEditVo && nVal == this.mainModel.beforeEditVo.compId && this.mainModel.vo.id) {
                        this.$refs.deptTable.doQuery({id : this.mainModel.vo.id});
                    }
                }
            }
        },
        methods:{
            newVO: newVO,
            doEnableDisable:function(){
                var _this = this;
                var ids = dataModel.mainModel.vo.id;
                var disable=dataModel.mainModel.vo.disable;
                //0启用，1禁用
                if(disable==0){
                    api.batchDisable(null,[ids]).then(function(res){
                        var diable ="1";
                        LIB.Msg.info("已停用!");
                        dataModel.mainModel.vo.disable = diable;
                        _this.$dispatch("ev_detailFinshed",dataModel.mainModel.vo);
                    });
                }else{
                    api.batchEnable(null,[ids]).then(function(res){
                        var diable ="0";
                        LIB.Msg.info("已启用!");
                        dataModel.mainModel.vo.disable = diable;
                        _this.$dispatch("ev_detailFinshed",dataModel.mainModel.vo);
                    });
                }
            },
            doCancel:function(){
                var _this = this;
                if(_this.mainModel.vo.id) {
                    api.get({id : _this.mainModel.vo.id}).then(function(res){
                        var data = res.data;
                        _this.mainModel.vo = newVO();
                        _.deepExtend(_this.mainModel.vo, data);
                    });
                }
                _this.mainModel.isReadOnly = true;
                _this.afterInitData && _this.afterInitData();
            },
            //删除
            doDelete:function(){
                var _this = this;
                var deleteIds = new Array();
                deleteIds.push(dataModel.mainModel.vo.id);
                //权限控制
                var delObj ={};
                delObj.id  = this.mainModel.vo.id;
                delObj.orgId = this.mainModel.vo.orgId;
                delObj.compId = this.mainModel.vo.compId;


                api.del(null,delObj).then(function(data){
                    if (data.data && data.error != '0') {
                        return;
                    } else {
                        _this.$dispatch("ev_detailDelFinshed",dataModel.mainModel.vo);
                        LIB.Msg.success("删除成功");
                    }
                });

            },
            //关闭
            doClose:function(){
                this.$dispatch("ev_editCanceled");
            },
            doEdit:function(){
                this.mainModel.opType = "update";
                var _this = this;
                _this.mainModel.isReadOnly = false;
                _this.isEditRel=true;
                _this.isShowIcon=true
                _this.storeBeforeEditVo();
            },
            //保存
            doSave:function(){
                var _this = this;
                var _vo = dataModel.mainModel.vo;
                if(_this.selectedCheckTableType && _this.selectedCheckTableType.length >0){
                    _vo.checkTableTypeId = _this.selectedCheckTableType[0].id;
                    _vo.checkTableType = _this.selectedCheckTableType[0];
                }
                _vo.orgId = _vo.compId;
                if(dataModel.mainModel.opType == "create") {
                    _this.$refs.ruleform.validate(function (valid){
                        if(valid){
                            api.create(_.pick(_this.mainModel.vo,"id","name","checkTableTypeId","type","remarks","disable","orgId", "compId","tableType","attr1")).then(function(res){
                                LIB.Msg.info("保存成功");
                                _this.$dispatch("ev_gridRefresh");
                                dataModel.mainModel.opType = "update";
                                _this.isEditRel = true;
                                _this.isShowIcon = true;
                                _this.mainModel.isReadOnly = true;
                            });
                        }
                    });
                } else {
                    _this.$refs.ruleform.validate(function (valid){
                        if(valid){
                            api.update(_.pick(_this.mainModel.vo,"id","name","checkTableTypeId","type","remarks","disable","orgId", "compId","attr1")).then(function(res){
                                LIB.Msg.info("保存成功");
                                //更新部门数据
                                dataModel.mainModel.vo.org =_.find(_this.mainModel.vo.deptList, {id: _this.mainModel.vo.orgId}),
                                    _this.$dispatch("ev_editFinshed",dataModel.mainModel.vo);
                                _this.isEditRel = true;
                                _this.isShowIcon = true;
                                _this.mainModel.isReadOnly = true;
                            });
                        }
                    });
                }
            },
            //添加分组
            doAddGroup:function(){
                var _this = this;
                //window.addEventListener('scroll', this.handleScroll, true);
                //var scrollHeight=document.body.scrollHeight;
                //生成UUID
                api.getUUID().then(function(res){
                    var group={};
                    group.id=res.data;
                    var len = _this.mainModel.vo.tirList.length+1;
                    group.groupName = "分组"+len;
                    group.groupOrderNo = 0;
                    group.checkTableId = _this.mainModel.vo.id;
                    group.itemList = [];
                    //api.createTableItemRel(null,group).then(function(_res){
                        _this.mainModel.vo.tirList.push(group);
                        /*滚动条*/
                        _this.$nextTick(function () {
                            var scroll= document.getElementsByClassName('detail-large-container')[0];
                            scroll.scrollTop = scroll.scrollHeight;
                        })
                    //});
                });
            },
            //保存分组名称
            doSaveGroupName:function(tableId,name){
                var _this = this;
                if(name == null || name == ''){
                    LIB.Msg.warning("分组名称不能为空");
                    return;
                }
                var groupName = _this.groupName;
                var group={};
                group.checkTableId=tableId;
                group.groupName = groupName;
                //修改后的分组名
                group.attr1 = name;
                api.updateGroupName(null,group);
                _this.isGroupNum = -1;
            },
            //删除分组及分组下的关联检查项
            doDeleteGroup:function(tirId,groupName,index){
                var _this = this;
                dataModel.mainModel.vo.tableItemRel.groupName = groupName;
                dataModel.mainModel.vo.tableItemRel.checkTableId = tirId;
                api.delTableGroup(null,dataModel.mainModel.vo.tableItemRel).then(function(res){
                    _this.mainModel.vo.tirList.splice(index,1);
                });
            },
            //修改分组名称
            doUpdateGroupName:function (index,groupName) {
                var _this = this;
                _this.isGroupNum = index;
                _this.groupName = groupName;
            },
            //删除检查表关联检查项分组下的检查项
            delItemRelRowHandler: function(obj) {
                var _this = this;
                var item = obj.entry.data;
                api.delTableItem({checkItemId:item.id,checkTableId:dataModel.mainModel.vo.id}).then(function(){
                    _.each(_this.mainModel.vo.tirList,function(tir){
                        _.some(tir.itemList,function(i,index){
                            if(i.id == item.id){
                                tir.itemList.splice(index,1);
                                return true;
                            }
                        });
                    });

                });
            },
            editItemRelRowHandler: function(param) {
                this.formModel.checkItemFormModel.show = true;
                this.$refs.checkItemFormModal.init("update", {id : param.entry.data.id});
            },
            //添加检查项
            doAddCheckItem:function(tir){
                this.itemModel.show = true;
                this.$broadcast('ev_selectItemReload',dataModel.mainModel.vo,tir);
            },
            doNewCheckItem:function(tir){
                this.formModel.checkItemFormModel.show = true;
                this.mainModel.vo.tableItemRel.checkTableId = tir.checkTableId;
                this.mainModel.vo.tableItemRel.groupName = tir.groupName;
                this.$refs.checkItemFormModal.init("create");
            },
            doSaveCheckItem:function(data){
                this.formModel.checkItemFormModel.show = false;
                this.mainModel.vo.tpaCheckItem = data;
                this.mainModel.vo.tpaCheckItem.itemType = 30;
                var _vo = _.pick(this.mainModel.vo,'id','tpaCheckItem','tableItemRel');
                api.createItem({id:this.mainModel.vo.id},_vo).then(function(){
                    _this.reloadRel("checkItem",_this.mainModel.vo.id);
                    LIB.Msg.info("新增成功");
                });
            },
            doUpdateCheckItem:function(data){
                var _this = this;
                this.formModel.checkItemFormModel.show = false;
                //this.mainModel.vo.checkItem = data;
                //var _vo = _.pick(this.mainModel.vo,'id','checkItem','tableItemRel');
                api.updateItem(null,data).then(function(){
                    _this.reloadRel("checkItem",_this.mainModel.vo.id);
                    LIB.Msg.info("保存成功");
                });
            },

            doShowDeptSelectModal : function() {
                this.selectModel.deptSelectModel.visible = true;
                this.selectModel.deptSelectModel.filterData = {"criteria.strValue.compId" : this.mainModel.vo.compId};
            },
            doSaveDepts : function(selectedDatas) {
                if (selectedDatas) {
                    dataModel.mainModel.vo.depts = selectedDatas;
                    var param = _.map(selectedDatas, function(data){return {id : data.id,type : data.type,compId : data.compId}});
                    var _this = this;
                    api.saveDepts({id : dataModel.mainModel.vo.id}, param).then(function() {
                        _this.refreshTableData(_this.$refs.deptTable);
                        _this.$dispatch("ev_gridRefresh");
                    });
                }
            },
            doRemoveDepts : function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeDepts({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
                    _this.$refs.deptTable.doRefresh();
                    _this.$dispatch("ev_gridRefresh");
                });
            },
            //删除关联受检对象关系后刷新页面
            delRowHandler: function(obj) {
                var _this = this;
                var item = obj.entry.data;
                api.delTableObjRel({checkObjectId:item.checkObjectId,checkTableId:dataModel.mainModel.vo.id}).then(function(){
                    var index = -1;
                    _.each(_this.mainModel.vo.torList, function (items, i) {
                        if (items.checkObjectId == item.checkObjectId) {
                            index = i;
                            return;
                        }
                    })
                    if (index != -1) {
                        _this.mainModel.vo.torList.splice(index, 1);
                        LIB.Msg.info("删除成功！");
                    }
                })
            },
            //刷新关联关系
            reloadRel:function(type,nVal){
                var _vo = dataModel.mainModel.vo;
                if(type == 'checkObject'){
                    api.get({id:nVal}).then(function(res){
                        //已选受检对象
                        _vo.torList = res.data.torList;
                    });
                }
                else if(type == 'checkItem'){
                    api.get({id:nVal}).then(function(res){
                        //已选择的检查项
                        _vo.checkItemList = res.data.checkItemList;
                        _vo.tirList = res.data.tirList;
                    });
                }
            },
            //刷新页面
            reload:function(pageType,nVal){
                var _this = this;
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;

                this.isShowCheckItem =true;
                this.isShowCheckObject = true;
                //清空数据
                _this.selectedCheckTableType = new Array();
                _this.selectedOrg = new Array();
                _.extend(_vo,newVO());

                //初始化
                if(nVal){
                    api.get({id:nVal}).then(function(res){

                        _this.storeBeforeEditVo();

                        _data.opType = "update";
                        //初始化数据
                        _.deepExtend(_vo, res.data);
                        //已选受检对象
                        //_vo.objectList = res.data.objectList;
                        //已选择的检查项
                        _vo.checkItemList = res.data.checkItemList;
                        _data.opType = "detail";
                        //todo 暂时性的优化
                        if(_.isEmpty(dataModel.checkTableTypeList)) {
                            api.listTableType().then(function(_res){
                                dataModel.checkTableTypeList = _res.data;
                            });
                        }
                        if(res.data.checkTableType) {
                            _this.selectedCheckTableType.push(res.data.checkTableType);
                        }
                    });
                }else{
                    _data.opType = "create";
                    var _this = this;
                    api.getUUID().then(function(res){
                        _vo.id = res.data;
                    });
                    this.mainModel.vo.compId = LIB.user.compId;
                    //todo 暂时性的优化
                    var t = setTimeout(function (){
                        clearTimeout(t);
                        if(_this.$parent.show){
                            api.listTableType().then(function (res) {
                                dataModel.checkTableTypeList = res.data;
                            });
                        }
                    }, 800);

                }
            },
            buildSaveData: function(){
                var data = _.cloneDeep(this.mainModel.vo)
                if(data.tirList.length) {
                    data.tirList.forEach(function (item) {
                        if(item.itemList.length) {
                            item.itemList = item.itemList.map(function (v) {
                                return {id: v.id}
                            })
                        }
                    })
                }
                return data;
            }
        },
        events : {
            //edit框数据加载
            "ev_detailReload" : function(pageType,nVal){
                //清空验证
                this.$refs.ruleform.resetFields();
                this.$refs.deptTable.doClearData();
                var _this = this;
                //初始化
                this.mainModel.isReadOnly=true;//是否只读
                this.isEditRel=false;//是否可以修改关联关系
                this.isShowIcon = false;//是否显示收缩/展开图标
                api.listDept().then(function (res) {
                    _this.mainModel.vo.deptList = res.data;
                });
                if(pageType !="create"){
                    this.$refs.deptTable.doQuery({id : nVal});
                }
                //判断页面显示是否readOnly
                if(pageType == "create"){
                    this.init('create');
                    this.mainModel.isReadOnly = false;
                    _this.reload(pageType,nVal);
                }else if(pageType == "update"){
                    this.init('update', nVal);
                    this.mainModel.isReadOnly = false;
                    this.isEditRel = true;
                    this.isShowIcon = true;
                    _this.reload(pageType,nVal);
                }else{
                    this.mainModel.isReadOnly = true;
                    this.isEditRel = true;
                    this.isShowIcon = true;
                    _this.reload(pageType,nVal);
                }

            },
            //selectCheckItem框点击保存后事件处理
            "ev_selectItemFinshed" : function(data) {
                this.itemModel.show = false;
                var _this = this;
                //此处前端去重，因为受检对象table的数据为前端分页， TODO 自后要改成后端处理重复记录
                //受检对象有对个 通过id找到相应的
                var itemList;
                _.each(this.mainModel.vo.tirList,function(item){
                    if(data.mainModel.vo.id == item.id){
                        itemList = item;
                        return;
                    }
                })
                var curCheckObjRelList = itemList.itemList;
                var curCheckObjIdList = _.map(curCheckObjRelList, function(item){return item.id;});
                var addCheckObjList = _.filter(data.selectedDatas, function(item){ return !_.contains(curCheckObjIdList, item.id)});
                if(!_.isEmpty(addCheckObjList)) {
                    var addCheckObjRelList = _.map(addCheckObjList,function(item){ return {checkTableId : _this.mainModel.vo.id, checkItemId:item.id,
                        itemOrderNo:0,groupOrderNo:0,groupName:data.mainModel.vo.groupName}});
                        api.batchCreateTableItemRel(null, addCheckObjRelList).then(function () {
                            _this.reloadRel("checkItem", _this.mainModel.vo.id);
                            LIB.Msg.info("保存成功");
                        });
                }
            },
            //selectCheckItem框点击取消后事件处理
            "ev_selectItemCanceled" : function() {
                this.itemModel.show = false;
            },
        },
        ready : function() {
            this.$api = api;
        }
    });

    return detail;
});