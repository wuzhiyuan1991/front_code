define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var Vue = require('vue');
    //右侧滑出详细页
    var tpl = require("text!./detail.html");

    var filterComponent=require("./dialog/filter");
    var businessRole=require("./dialog/businessRole");
    //编辑弹框页面
    var editComponent = require("./dialog/edit");
    var activitiRoleModelerSelectModal = require("componentsEx/selectTableModal/activitiRoleModelerSelectModal");


    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            processType: null,
            name: null,
            reformerFlag: null,
            filterLookups: [],
            //审批对象 审批名称 单据类型
            code:null,
            //approvalobject:null,
            //approvalname:null,
            //approvaltype:null
            attr5:null,
            //启用 停用按钮
            disable:null,
            organizationList:[],
            attr2:null,
            // 流程id
            attr4:null,
            //工作流程
            //activitiProcess : {id:'', name:''},
        }
    };

    var lookUpVO=function(){
        return {
            id: null,
            attr1: null,
            attr2: null,
            attr3: null,
            attr5: null,
            code: null,
            name: null,
            targetName: null,
            targetFieldName: null,
            filterGroupId: null,
            conditionSeq: null,
            filterLookups: [],
            filterConditions: []
        }
    }

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            lookUpVO: function(){ return lookUpVO()},
            showTabs: true,
            modelId : "",
            showActivitiProcessSelectModal : false,
            //检查项类型
            types: LIB.getDataDicList("process_type")
        },
        itemColumns:[
            {
                title:"编码",
                fieldType:"custom",
                render: function(data){
                    if(data.code){
                        return data.code;
                    }
                }
            },
            {
                title:"名称",
                fieldType:"custom",
                render: function(data){
                    if(data.name){
                        return data.name;
                    }
                }
            },

            {
                title:"",
                fieldType:"tool",
                toolType:"del"
            }
        ],
        //审批阶段
        approvalStage: LIB.getDataDicList("approval_stage"),
        buttonShow: {
            //关闭按钮
            closeButton: true,
            //撤销按钮
            enableButton: false,
            //提交按钮
            unableButton: false,
            //删除按钮
            cancelButton: false
        },
        isTitle:"新增",
        isDetail:"详情",
        isUpdata:"修改",
        //用来控制是否是新增还是详情
        isReadOnly:false,
        isFlag:true,
        isBottom:false,
        object:[{id:"0",name:"隐患登记"}],
        //收起按钮
        isShowCardContent : true,
        //组织机构收起按钮
        isShowOrganization:true,
        //角色
        isShowRole:true,
        //显示是否新增 修改 或者 详情
        type:null,
        editModel: {
            //控制编辑组件显示
            title: "新增",
            //显示编辑弹框
            show: false,
            //编辑模式操作类型
            type: "create",
            id: null
        },

        chartModel: {
            //控制编辑组件显示
            title: "流程图",
            //显示编辑弹框
            show: false,
        },
        //流程图id
        flowchart:null,
        organization:{
            //控制编辑组件显示
            title: "添加公司",
            //显示编辑弹框
            show: false,
        },
        id:null,
        isOrgShow:false,
       //用来控制发布之后某些按钮隐藏
        isPrevent:false
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
		// mixins : [LIB.VueMixin.dataDic],
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        template: tpl,
        components:{
            "filter-component":filterComponent,
            "business-role":businessRole,
            "activitiRoleModelerSelectModal":activitiRoleModelerSelectModal,
            "edit-component": editComponent
        },
        data: function () {
            return dataModel;
        },
        methods: {
             doClose: function () {
                 this.$dispatch("ev_detailColsed");
             },
            doUpdate: function () {
                LIB.Msg.info("修改");
            },
            doSaveActivitiProcess : function(selectedDatas) {
                if (selectedDatas) {
                    //this.mainModel.vo.activitiModeler = selectedDatas[0].activitiModeler;
                    this.mainModel.vo.activitiProcess = selectedDatas[0];
                }
            },
            doDelete: function () {
                var _this = this;
                var ids = [];
                ids[0] = this.mainModel.vo.id;
                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        api.delete(null, ids).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("删除失败");
                                return;
                            } else {
                                _this.$dispatch("ev_detailColsed");
                                LIB.Msg.success("删除成功");

                            }
                        });
                    }
                });
            },
            doSave:function(){
                var _this = this;
                    //_this.mainModel.vo.attr4 = _this.mainModel.vo.activitiProcess.id;
                    //_this.mainModel.vo.attr1 = _this.mainModel.vo.activitiProcess.name;
                    var http = _this.mainModel.vo.id ? api.update : api.create;
                    http(_.pick(_this.mainModel.vo,"attr1" , "name", "processType", "id","attr2","attr4")).then(function (res) {
                      if(res.status == "200"){
                          //回调 给code复值
                          if(_this.mainModel.vo.id == null){
                              _this.mainModel.vo.code = res.body.code
                              dataModel.id = res.body.id;
                              _this.mainModel.vo.id = res.body.id;
                          }
                          _this.$broadcast("ev_filterReload",dataModel.id);
                          dataModel.isReadOnly = false;
                          dataModel.isFlag = false;
                          dataModel.isBottom = true;
                          dataModel.isPrevent = true;
                          _this.$dispatch("ev_editFinshed",_this.mainModel.vo,dataModel.type);
                          LIB.Msg.info("保存成功");
                      }

                    });
            },
            doEnable: function () {
                var _this = this;
                var ids = [];
                ids[0] = this.mainModel.vo.id;
                api.submit(null, ids).then(function (data) {
                    if (data.data && data.error != '0') {
                        LIB.Msg.warning("提交失败");
                        return;
                    } else {
                        _this.$dispatch("ev_editCanceled");
                        LIB.Msg.success("提交成功");
                    }
                });
            },
            doUnable: function () {
                var _this = this;
                var ids = [];
                ids[0] = this.mainModel.vo.id;
                api.undo(null, ids).then(function (data) {
                    if (data.data && data.error != '0') {
                        LIB.Msg.warning("撤销失败");
                        return;
                    } else {
                        _this.$dispatch("ev_editCanceled");
                        LIB.Msg.success("撤销成功");
                    }
                });
            },
            //新增审批阶段
            doApprovalStage:function(data){
                var index=this.mainModel.vo.filterLookups.length;
                dataModel.editModel.show = true;
                this.$broadcast("ev_editReload",index,null,this.mainModel.vo.filterLookups,"add");
                //if(index>=this.approvalStage.length){
                //if(index>=10){
                //    LIB.Msg.warning("审批阶段已满");
                //    return;
                //}
                //var lookup=this.mainModel.lookUpVO();
                //lookup.attr5 = this.mainModel.vo.id;
                //lookup.name= this.approvalStage[index].value;
                //lookup.conditionSeq=index;
                //lookup.filterLookups=[];
                //api.getUUID().then(function (res) {
                //    lookup.id = res.data;
                //    //保存审批阶段
                //    api.saveFilterLookup(_.pick(lookup,"id","attr5", "name","conditionSeq")).then(function (res) {
                //        _this.mainModel.vo.filterLookups.push(lookup);
                //    });
                //});
            },
            //流程图
            doOpenDiagram:function(){
     //       	window.open("/activiti-modeler/modeler.html?modedoApprovalStagelId=" + this.mainModel.modelId);
                this.chartModel.show = true;
                this.$broadcast("ev_ChartReload",dataModel.flowchart);
            },
            //发布
            doIssue:function(){
                var _this = this;
                if(this.mainModel.vo.filterLookups.length<2){
                    LIB.Msg.warning("请添加至少要两个流程才能发布");
                    return
                }
                LIB.Modal.confirm({
                    title: '确定要发布?',
                    onOk: function () {
                        api.issue({id:_this.mainModel.vo.id}).then(function (res) {
                            if(res){
                                dataModel.flowchart = res.body;
                                _this.isPrevent = false;
                                _this.$broadcast("ev_isPrevent");
                                LIB.Msg.success("发布成功");
                                //_this.$broadcast("ev_ChartReload",dataModel.flowchart);
                            }
                        });
                    }
                });

            },

            //停用按钮
            doDisable:function(){
                var _this = this;
                var diable = dataModel.mainModel.vo.disable==0?1:0;
                var ids = new Array();
                ids.push(dataModel.mainModel.vo.id);
                api.batchUpdate({disable:diable},ids).then(function(res){
                    dataModel.mainModel.vo.disable = diable;
                    _this.$dispatch("ev_editFinshed",{opType:"add"});
                    var info = diable==0?'启用':'停用';
                    LIB.Msg.info("已"+info+"!");
                });

            },
            //详情删除按钮
            doDel:function(){
                var _this = this;
                var deleteIds = [];
                deleteIds.push(this.mainModel.vo.attr5);
                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        api.delete(null, deleteIds).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("删除失败");
                                return;
                            } else {
                                LIB.Msg.success("删除成功");
                                _this.$dispatch("ev_detailColsed");
                            }
                        });
                    }
                });
            },
            //组织机构添加
            doAppend:function(){
                //控制组织结构显示
                dataModel.isOrgShow = true;
                this.organization.show = true;
                this.$broadcast('ev_orgReload');
            },
            delItemRelRowHandler: function (data) {
                var attr5 = dataModel.id;
                var id =  data.entry.data.id;
                var _vo = this.mainModel.vo;
                var _this = this;
                var callback=function(res) {
                    var attr = res.data.attr3;
                    //如果相等 说明 只有一条数据
                    if (id == attr) {
                        api.update({attr3: "", id: attr5}).then(function (res1) {
                            if (res1) {
                                //删除点击的数据
                                var index = -1;
                                _.each(_this.mainModel.vo.organizationList, function(item, i){
                                    if(item.id == id) {
                                        index = i;
                                        return;
                                    }
                                })
                                if(index != -1) {
                                    _this.mainModel.vo.organizationList.splice(index, 1);
                                    LIB.Msg.success("删除成功");
                                }
                            }
                        })
                    } else {
                        var attrSplit = res.data.attr3.split(",")
                       var org="";
                        attrSplit.forEach(function (e) {
                            if (id !== e) {
                                org += (e + ",");
                            }
                        });
                        org = org.substr(0, org.length - 1);
                        //如果attr3 含有多个
                        api.update({attr3: org, id: attr5}).then(function (res1) {
                            if (res1) {
                                 //删除点击的数据
                                    var index = -1;
                                    _.each(_this.mainModel.vo.organizationList, function(item, i){
                                        if(item.id == id) {
                                            index = i;
                                            return;
                                        }
                                    })
                                    if(index != -1) {
                                        _this.mainModel.vo.organizationList.splice(index, 1);
                                        LIB.Msg.success("删除成功");
                                    }
                            }
                        })
                    }
                }
                api.get({id:attr5}).then(callback)
            },

        },
        events: {
            //按钮显示控制ev_detailDataReload
            "ev_detailButton": function (button) {
                this.buttonShow = button;
            },
            //按钮显示控制
            "ev_detailReload": function (poolId, val) {
                //清空数据
                _.extend(_vo, newVO());
                dataModel.type = val;
                _.extend(this.mainModel.vo, newVO());
                this.mainModel.vo.attr5 = poolId;
                var _this = this
                //保存 main选中的id
                dataModel.id = poolId;
                //新增
                if (dataModel.type == "add") {
                    dataModel.isReadOnly = false
                    dataModel.isFlag = true;
                    dataModel.isBottom = false;
                    dataModel.isPrevent = false;
                    //清空之前的流程图id
                    dataModel.flowchart = null;
                }
                //修改
                else if (dataModel.type == "update") {
                    dataModel.isReadOnly = false;
                    dataModel.isFlag = true;
                    dataModel.isBottom = true;
                    var _vo = this.mainModel.vo;
                    api.get({id: poolId}).then(function (res) {
                        //初始化数据
                        _.deepExtend(_vo, res.data);
                        //_vo.activitiProcess.name = _vo.attr1;
                        //_vo.activitiProcess.id = _vo.attr4;

                        //判断是否有数据 如果有 则显示组织机构
                        if(res.data.organizationList && res.data.organizationList.length>0){
                            dataModel.isOrgShow = true;
                        }
                        dataModel.flowchart = res.data.attr5;
                        //判断是否有流程图id 如果有 就显示
                        if(dataModel.flowchart){
                            dataModel.isPrevent = false;
                            _this.$broadcast("ev_isPrevent");
                        }else{
                            dataModel.isPrevent = true;
                        }
                        //发送事件给流程图
                       // _this.$broadcast("ev_ChartReload", dataModel.flowchart);

                    });
                }
                //详情
                else {
                    dataModel.isReadOnly = true;
                    dataModel.isFlag = false;
                    dataModel.isBottom = true;
                    var _vo = this.mainModel.vo;
                    api.get({id: poolId}).then(function (res) {
                        //初始化数据
                        _.deepExtend(_vo, res.data);

                        //_vo.activitiProcess.name = _vo.attr1;
                        //_vo.activitiProcess.id = _vo.attr4;
                        //判断是否有数据 如果有 则显示组织机构
                        if(res.data.organizationList && res.data.organizationList.length>0){
                            dataModel.isOrgShow = true;
                        }
                        dataModel.flowchart = res.data.attr5;
                        if(dataModel.flowchart){
                            dataModel.isPrevent = false;
                            _this.$broadcast("ev_isPrevent");
                        }else{
                            dataModel.isPrevent = true;
                        }
                        //发送事件给流程图
                        //_this.$broadcast("ev_ChartReload", dataModel.flowchart);

                    });
                    this.$broadcast("ev_filterReload",poolId);
                }
            },
            //修改审批阶段
            "ev_editupdate":function(index, group){
                dataModel.editModel.show = true;
                this.$broadcast("ev_editReload",index,group,this.mainModel.vo.filterLookups,"update");
            },
            //审批流程的添加
            "ev_editAdd": function (data,type) {
                var _vo = this.mainModel.vo;
                var poolId = dataModel.id;
                data.attr5 = dataModel.id;
                data.conditionSeq = data.order;
                //修改
                if(type == "update"){
                    var callback =function(res){
                            dataModel.editModel.show = false;
                            api.get({id:poolId}).then(function (res1) {
                                //初始化数据
                                _.deepExtend(_vo, res1.data);
                            });
                    };
                    api.filterupdate(_.pick(data, "id",  "name", "conditionSeq","attr5")).then(callback);
                }else{
                    //新增
                    var _this = this;
                    var index = _this.mainModel.vo.filterLookups.length;
                    //添加的审核不能超过10条
                    if (index >= 10) {
                        LIB.Msg.warning("审批阶段已满");
                        return;
                    }
                    var lookup = _this.mainModel.lookUpVO();
                    lookup.attr5 = dataModel.id;
                    lookup.name = data.name;
                    lookup.conditionSeq = data.order;
                    lookup.filterLookups = [];
                    api.getUUID().then(function (res) {
                        lookup.id = res.data;
                        var callback1 =function(res){
                            dataModel.editModel.show = false;
                            api.get({id:poolId}).then(function (res1) {
                                //初始化数据
                                _.deepExtend(_vo, res1.data);
                            });
                        };
                        //保存审批阶段
                        //api.saveFilterLookup(_.pick(lookup, "id", "attr5", "name", "conditionSeq")).then(function (res) {
                        //    _this.mainModel.vo.filterLookups.push(lookup);
                        //    dataModel.editModel.show = false;
                        //});
                        api.saveFilterLookup(_.pick(lookup, "id", "attr5", "name", "conditionSeq")).then(callback1);
                    });
                }

            },
            //关闭 流程图modal
            "ev_detailClose":function(){
                this.chartModel.show = false;
            },
            //处理添加组织机构
            "ev_detailOrg":function(data){
                var _vo = this.mainModel.vo;
                var org="";
                var attr5 = dataModel.id;
                var tmp  = [],ret = [],end=[];
                api.get({id:attr5}).then(function(res1){
                    //判断attr3是否为空 如果为空 就直接拼接数据
                    if(!res1.data.attr3){
                        //拼接数据
                        data.forEach(function (e) {
                            org += (e.id + ",");
                        });
                        org = org.substr(0, org.length - 1);
                    }else{
                        //把之前的attr3弄成一个数组 去重
                        var arry = res1.data.attr3.split(",");
                        //在保存起来 合并之前的数据  在但数组去重
                        _.each(data,function(item){
                            tmp.push(item.id)
                        })
                        ret = tmp.concat(arry);

                        _.each(ret,function(item){
                            if(end.indexOf(item) === -1){
                                end.push(item);
                            }
                        })
                           end.forEach(function (e) {
                               org += (e + ",");
                           });
                           org = org.substr(0, org.length - 1);
                    }
                    var _this = this;
                    var callback=function(res2){
                        api.get({id:attr5}).then(function (res3) {
                            //初始化数据
                            _.deepExtend(_vo, res3.data);
                            dataModel.organization.show = false;
                        });
                    }
                    api.update({attr3:org,id:attr5,processType:_vo.processType}).then(callback)


                })


            }
        },
        ready : function() {
        	//var _this = this;
        	//this.$http.get("/activiti/process/modelId").then(function(res){
        	//	_this.mainModel.modelId = res.data;
        	//});
        }
    });
    return detail;
});