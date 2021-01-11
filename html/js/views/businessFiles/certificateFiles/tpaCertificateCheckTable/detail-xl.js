/**
 * Created by yyt on 2017/7/20.
 */
define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");

    //弹框
    var itemComponent = require("./dialog/selectCheckItem");

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
            //获取部门数据 用来跟新
            deptList:[],
            //检查表-检查项关联关系
            tableItemRel:{},
            tpaCheckItem:{},
            tableType:"10"
        }
    };
    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            typeList:[{id:"1",name:"计划检查"}/*,{id:"0",name:"非计划检查"}*/],
            disableList:[{id:"0",name:"启用"},{id:"1",name:"停用"}],
            scrolled: true,
            opType : 'view'
        },
        isReadOnly:true,//是否只读
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
            //{
            //    title:"分类",
            //    fieldType:"custom",
            //    width : "180px",
            //    render: function(data){
            //        if(data.riskType){
            //            return data.riskType.name;
            //        }
            //    }
            //},
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
                toolType:"del"
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
            type:[{ required: true, message: '请选择检查表类型'}],
            compId:[{ required: true, message: '请选择所属公司'}],
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
            "itemcomponent":itemComponent
        },
        data:function() {
            return dataModel
        },
        methods:{
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
                _this.isReadOnly = true;
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

                //api.del(null,deleteIds).then(function(res){
                //	LIB.Msg.info("已删除!");
                //	_this.$dispatch("ev_detailDelFinshed",dataModel.mainModel.vo);
                //});
                LIB.Modal.confirm({
                    title:'确定删除?',
                    onOk:function(){
                        api.del(null,delObj).then(function(data){
                            if (data.data && data.error != '0') {
                                return;
                            } else {
                                _this.$dispatch("ev_detailDelFinshed",dataModel.mainModel.vo);
                                LIB.Msg.success("删除成功");
                            }
                        });
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
                _this.isReadOnly = false;
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
                            api.create(_.pick(_this.mainModel.vo,"id","name","checkTableTypeId","type","remarks","disable","orgId", "compId","tableType")).then(function(res){
                                LIB.Msg.info("保存成功");
                                _this.$dispatch("ev_gridRefresh");
                                dataModel.mainModel.opType = "update";
                                _this.isEditRel = true;
                                _this.isShowIcon = true;
                                _this.isReadOnly = true;
                            });
                        }
                    });
                } else {
                    _this.$refs.ruleform.validate(function (valid){
                        if(valid){
                            api.update(_.pick(_this.mainModel.vo,"id","name","checkTableTypeId","type","remarks","disable","orgId", "compId")).then(function(res){
                                LIB.Msg.info("保存成功");
                                //更新部门数据
                                dataModel.mainModel.vo.org =_.find(_this.mainModel.vo.deptList, {id: _this.mainModel.vo.orgId}),
                                    _this.$dispatch("ev_editFinshed",dataModel.mainModel.vo);
                                _this.isEditRel = true;
                                _this.isShowIcon = true;
                                _this.isReadOnly = true;
                            });
                        }
                    });
                }
            },
            editItemRelRowHandler: function(param) {
                this.formModel.checkItemFormModel.show = true;
                this.$refs.checkItemFormModal.init("update", {id : param.entry.data.id});
            },
            //添加检查项
            doShowCheckItemModel:function(tir){
                var _this = this;
                _this.itemModel.show = true;
                if(_this.mainModel.vo.tirList.length==0){
                    api.getUUID().then(function(res){
                        var group={};
                        group.id = res.data;
                        var len = 1;
                        group.groupName = "分组"+len;
                        group.checkTableId = _this.mainModel.vo.id;
                        group.itemList = [];
                        _this.mainModel.vo.tirList.push(group);
                        _this.$broadcast('ev_selectItemReload',dataModel.mainModel.vo,group);
                    });
                }else{
                    _this.$broadcast('ev_selectItemReload',dataModel.mainModel.vo,_this.mainModel.vo.tirList);
                }

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
            //刷新关联关系
            reloadRel:function(type,nVal){
                var _vo = dataModel.mainModel.vo;
                if(type == 'checkItem'){
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
        },
        events : {
            //edit框数据加载
            "ev_detailReload" : function(pageType,nVal){
                //清空验证
                this.$refs.ruleform.resetFields();
                var _this = this;
                //初始化
                this.isReadOnly=true;//是否只读
                this.isEditRel=false;//是否可以修改关联关系
                this.isShowIcon = false;//是否显示收缩/展开图标
                api.listDept().then(function (res) {
                    _this.mainModel.vo.deptList = res.data;
                });
                //判断页面显示是否readOnly
                if(pageType == "create"){
                    this.isReadOnly = false;
                    _this.reload(pageType,nVal);
                }else if(pageType == "update"){
                    this.isReadOnly = false;
                    this.isEditRel = true;
                    this.isShowIcon = true;
                    _this.reload(pageType,nVal);
                }else{
                    this.isReadOnly = true;
                    this.isEditRel = true;
                    this.isShowIcon = true;
                    _this.reload(pageType,nVal);
                }

            },
            //selectCheckItem框点击保存后事件处理
            "ev_selectItemFinshed" : function(data) {
                this.itemModel.show = false;
                var _this = this;
                var itemList;
                _.each(this.mainModel.vo.tirList,function(item){
                    if(data.mainModel.vo.id == item.id){
                        itemList = item;
                        return;
                    }
                });
                var curCheckObjRelList = itemList.itemList;
                var curCheckObjIdList = _.map(curCheckObjRelList, function(item){return item.id;});
                var addCheckObjList = _.filter(data.selectedDatas, function(item){ return !_.contains(curCheckObjIdList, item.id)});
                if(!_.isEmpty(addCheckObjList)) {
                    var addCheckObjRelList = _.map(addCheckObjList,function(item){ return {checkTableId : _this.mainModel.vo.id, checkItemId:item.id,
                        itemOrderNo:0,groupOrderNo:0,groupName:"分组1"}});
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
    });

    return detail;
});