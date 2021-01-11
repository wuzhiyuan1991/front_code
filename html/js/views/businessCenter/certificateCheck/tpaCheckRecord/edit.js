define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./edit.html");
    //查看不合格检查项弹框页面
    var viewDetailComponent = require("./dialog/viewDetail");
    //编辑检查结果弹框
    var viewEditComponent = require("./dialog/editCheckResult");
    //input弹窗选人
    var checkTaskSelectModal = require("componentsEx/selectTableModal/tpaCheckTaskSelectModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var checkTableSelectModal = require("componentsEx/selectTableModal/tpaCheckTableSelectModal");
    var checkPlanSelectModal = require("componentsEx/selectTableModal/tpaCheckPlanSelectModal");
	//var checkObjectSelectModal = require("componentsEx/selectTableModal/checkObjectSelectModal");
    var getNowDateStr = function(){
        return new Date().Format("yyyy-MM-dd hh:mm:ss");
    }
    //初始化数据模型
    var newVO = function() {
        return {
            id :null,
            orgId:null,
            compId:null,
            checkDate:null,
            checkSource:null,
            checkResultDetail:null,
            checkResult:"1",
            checkerId : null,
            checkObjectId: null,
            checkTableId:null,
            checkPlanId:null,
            checkUser :{username:null},
            checkObject:{name:null},
            checkRecordDetailVoList:[],
            tpaCheckTable:{name:null},
            tpaCheckPlan:{name:null},
            tpaBehaviorComms:[],
            tpaCheckRecordDetails : [],
            type:0,
            checkTaskId:null,
            //检查任务
            tpaCheckTask : {},
            startDate:null,
            endDate:null,
            checkBeginDate:null,
            checkEndDate:null
        }
    };
    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            userDetail:null,
            selectedUser:[],
            selectedList:[],
            selectedPlan:[],
            selectedObject:[],
            selectedCheckItem:{},
            checkRecordDetail:{},
            checkDetailList : [],
            groupOrderNo : null,
            groupName : null,
            opType : '',
            checkplanSelectFilterValue : {disable:1},
            checkTableFilterValue : {"disable":0,"criteria.strValue.selectWithExistCheckItem":"true","type":0},
            config:{
                checkResult :{
                    notRefer : 1,
                    illegal :{ "description" : 1,"photoForce" : 0,"videoForce" : 0 }, "legal" :{ "description" : 0,"photoForce" : 0,"videoForce" : 0 }
                },
            },
            checkItemIds:[],
            allCheckItemIds:[],
            remainingCheckItemId:null,
            typeList:[{id:0,name:"非计划检查"},{id:1,name:"计划检查"}],
            showCheckTaskSelectModal : false,
            showUserSelectModal : false,
            //showCheckObjectSelectModal : false,
            showCheckTableSelectModal : false,
			showCheckPlanSelectModal : false
        },
        isReadOnly:true,//是否只读

        isSelected:true,
        itemColumns1:[
            {
                title:"编码",
                fieldName:"code"
            },
            {
                title:"检查项",
                fieldName:"name"
            }, {
                title : "类型",
                fieldName : "type",
                fieldType : "custom",
                render: function(data){
                    return LIB.getDataDic("pool_type",[data.type]);
                }
            }, {
                title : "分类",
                fieldType : "custom",
                render: function(data){
                    if(data.riskType){
                        return data.riskType.name;
                    }
                }
            }, {
                title : "结果",
                fieldType : "custom",
                fieldName : "operation1",
                width:"80px",
                render: function(data){
                    if(data.checkResult == 1){
                        return "<a style='color:blue;'>合格</a>";
                    }else if (data.checkResult == null){
                        return "<a style='color:#cecece;'>合格</a>";
                    }else{
                        return "<a style='color:#cecece;'>合格</a>";
                    }
                },
                tipRender : function (data) {
                    if(data.checkResult == 1){
                        return "合格";
                    }else if (data.checkResult == null){
                        return "合格";
                    }else{
                        return "合格";
                    }
                }
            },{
                title : "",
                fieldType : "custom",
                fieldName : "operation2",
                width:"80px",
                render: function(data){
                    if(data.checkResult == 0){
                        return "<a style='color:red;'>不合格</a>";
                    }else if (data.checkResult == null){
                        return "<a style='color:#cecece;'>不合格</a>";
                    }else{
                        return "<a style='color:#cecece;'>不合格</a>";
                    }
                },
                tipRender : function (data) {
                    if(data.checkResult == 0){
                        return "不合格";
                    }else if (data.checkResult == null){
                        return "不合格";
                    }else{
                        return "不合格";
                    }
                }
            }
        ],
        viewDetailModel1 : {
            //控制编辑组件显示
            title : "详情",
            //显示编辑弹框
            show : false,
            id: null
        },
        detailModel : {
            //控制编辑组件显示
            title : "新增",
            //显示编辑弹框
            show : true,
            //编辑模式操作类型
            type : "create",
            id: null
        },
        //控制检查表
        showModal : false,
        legalVal : false,
        illegalVal : false,
        opType : null,
        // isEnvConfigLate : false,//系统参数是否比检查任务后加载
        //验证规则
        rules:{
            "checkUser.username":[{ required: true, message: '请选择检查人名称'}],
            "tpaCheckTable.name":[{ required: true, message: '请选择检查表'}],
            'checkDate':[{ required: true, message: '请选择检查时间'}],
            "checkObject.name":[{ required: true, message: '请选择受检对象'}],
            "orgId":[{ required: true, message: '请选择所属部门'}],
            "compId":[{ required: true, message: '请选择所属公司'}],
            "tpaCheckTask.name":[{required: true, message: '请选择检查任务'}]
        },
        selectModal:{
        	//checkObjectSelectModal:{
        	//	filterData:{checkTableId:null}
        	//},
        	checkTaskSelectModal:{
        		filterData:{
        			"criteria.intValue":{isLateCheckAllowed:0},
        			checkPlanId:null
        			}
        	},
            checkTableSelectModal : {
                filterData : {
        	      type : 0,
        	      "criteria.strValue.selectWithExistCheckItem":"true"
                }
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
        // mixins : [LIB.VueMixin.dataDic],
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        template: tpl,
        components : {
            "viewdetailcomponent":viewDetailComponent,
            "viewEditComponent" : viewEditComponent,
            //"userSelect":userSelect,
            //"checkobjectSelectModals":checkObjectSelectModal,
            "checktableSelectModal":checkTableSelectModal,
			"checkplanSelectModal":checkPlanSelectModal,
            "checktaskSelectModal":checkTaskSelectModal,
            "userSelectModal":userSelectModal
        },
        data:function(){
            return dataModel;
        },
        methods:{
            doClose:function(){
                var _this=this;
                _this.$dispatch('ev_detailColsed');
            },
            doSave:function () {
                var _this=this;
                //总数
                var sum=0;
                //不合格数
                var disqualification=0;
                //不涉及数
                var notinvolving=0;
                var isCheckResultValid = true;
                var checkResultHint = null;


                var detailErrorMsg =  "检查结果有误";

                _this.mainModel.allCheckItemIds = [];
                var orgId = _this.mainModel.vo.orgId;
                var compId = _this.mainModel.vo.compId;
                if (orgId != null && compId != null && orgId == compId) {
                    _this.mainModel.vo.orgId = null;
                }
                _.each(_this.mainModel.vo.checkRecordDetailVoList, function (itemList) {
                    //总数
                    sum += itemList.itemList.length;

                    _.each(itemList.itemList, function (checkItems) {
                        _this.mainModel.allCheckItemIds.push(checkItems.id);
                        //不涉及项
                        if (checkItems.checkResult == 2) {
                            notinvolving = notinvolving + 1;
                        };
                        //不合格项
                        if (checkItems.checkResult == 0) {
                            _this.mainModel.vo.checkResult = "0";
                            disqualification = disqualification + 1;
                        }
                    });
                });
                var nums = 0;
                _this.mainModel.remainingCheckItemId = _.difference(_this.mainModel.allCheckItemIds,_this.mainModel.checkItemIds)[0];
                _.each(_this.mainModel.vo.checkRecordDetailVoList, function (itemList) {
                    _.each(itemList.itemList, function (checkItems) {
                        nums++;
                        if(checkItems.checkResult == "") {
                            isCheckResultValid = false;
                            checkResultHint = itemList.groupName + "第" + Math.ceil(nums / 10) + "页第" + nums % 10 + "行";
                            detailErrorMsg = "检查记录未设置检查结果";
                            return false;
                        }
                        if ((dataModel.legalVal == true && checkItems.checkResult == 1) || (dataModel.illegalVal == true && checkItems.checkResult == 0)) {
                            if (checkItems.id == _this.mainModel.remainingCheckItemId) {
                                isCheckResultValid = false;
                                checkResultHint = itemList.groupName + "第" + Math.ceil(nums / 10) + "页第" + nums % 10 + "行";
                                return false;
                            }
                        }
                    });
                    if (!isCheckResultValid) {
                        return false;
                    }
                    nums = 0;
                });

                if (!isCheckResultValid){
                    LIB.Msg.error(checkResultHint + detailErrorMsg, 5);
                    return false;
                }

                _this.mainModel.vo.checkResultDetail = sum + "/" + disqualification;
                if(disqualification > 0){
                    _this.mainModel.vo.checkResult = "0";
                }else{
                    _this.mainModel.vo.checkResult = "1";
                };
                if(dataModel.mainModel.opType == "check") {
                	if(_this.mainModel.vo.checkPlanId == null) {
                		LIB.Msg.info("请选择检查计划");
                		return;
                	}
                	if(this.mainModel.vo.checkTaskId == null) {
                		LIB.Msg.info("请选择检查任务");
                		return;
                	}
                }

                //设置检查记录的检查结束时间
                this.mainModel.vo.checkEndDate = getNowDateStr();
                //判断是否检查开始时间有值（执行editDetail）
                if(!this.mainModel.vo.checkBeginDate){
                    this.mainModel.vo.checkBeginDate = this.mainModel.vo.checkEndDate;
                }
                //保存检查记录
                if(dataModel.mainModel.opType == "create" || dataModel.mainModel.opType == "check") {
                    this.$refs.ruleform.validate(function (valid) {
                        if (valid) {
                            api.create(_.pick(_this.mainModel.vo, "id", "orgId","compId",  "checkDate", "checkTableId", "checkerId", "checkObjectId", "checkPlanId", "checkResult", "checkResultDetail","tpaBehaviorComms", "tpaCheckRecordDetails","checkTaskId","type","checkBeginDate","checkEndDate")).then(function (res) {
                                _this.$dispatch('ev_detailCreate');
                                LIB.Msg.success("保存成功");
                            })
                        } else {
                            return false;
                        }
                    });
                } else {
                    this.$refs.ruleform.validate(function (valid) {
                        if (valid) {
                            api.update(_.pick(_this.mainModel.vo, "id", "checkDate", "checkTableId", "checkerId", "checkObjectId", "checkPlanId", "checkResult", "checkResultDetail","compId", "orgId", "tpaBehaviorComms", "tpaCheckRecordDetails","checkTaskId","type","checkBeginDate","checkEndDate")).then(function (res) {
                                _this.$dispatch('ev_detailCreate');
                                LIB.Msg.success("修改成功");
                            })
                        } else {
                            return false;
                        }
                    });
                }
            },
            convertPicPath:LIB.convertPicPath,
            editDetail:function(obj){
                var _vo = obj.entry.data;
                var _this=this;
                _.each(_this.mainModel.vo.checkRecordDetailVoList,function (result) {
                    _.each(result.itemList,function (checkItemList) {
                        if (checkItemList.id == _vo.id){
                            dataModel.mainModel.groupName = result.groupName;
                            dataModel.mainModel.groupOrderNo = result.groupOrderNo;
                        }
                    })
                });
                this.mainModel.selectedCheckItem = obj.entry.data;
                this.viewDetailModel1.title = "结果";
                if(!_.contains(['operation1','operation2','operation3'],obj.cell.fieldName)) return;
                //设置检查记录的检查开始时间
                this.mainModel.vo.checkBeginDate = getNowDateStr();

                if(obj.cell.fieldName == 'operation1') {
                    if (dataModel.legalVal){
                        this.viewDetailModel1.show = true;
                        //把modal数据从detail带过去
                        var str;
                        if(_vo.type==0){
                            if(_this.mainModel.vo.tpaBehaviorComms && _this.mainModel.vo.tpaBehaviorComms.length>0)
                                _.each(_this.mainModel.vo.tpaBehaviorComms,function(item1){
                                    if(item1.checkItemId == _vo.id){
                                        str = item1;
                                        return false;
                                    }
                                });
                        }else{
                            if(_this.mainModel.vo.tpaCheckRecordDetails && _this.mainModel.vo.tpaCheckRecordDetails.length>0)
                                _.each(_this.mainModel.vo.tpaCheckRecordDetails,function(item){
                                    if(item.checkItemId == _vo.id){
                                        str = item;
                                        return false;
                                    }
                                });
                        }
                        this.$broadcast('ev_editCheckResult', _vo, this.mainModel.vo.id,this.mainModel.config,obj.cell.fieldName,str);
                    } else {
                        this.$dispatch("ev_gridRefresh",null,1,null,null,obj.entry.data.id);
                    }
                }else if(obj.cell.fieldName == 'operation2'){
                    if (dataModel.illegalVal) {
                        this.viewDetailModel1.show = true;
                        //把modal数据从detail带过去
                        var str;
                        if(_vo.type==0){
                            if(_this.mainModel.vo.tpaBehaviorComms && _this.mainModel.vo.tpaBehaviorComms.length>0)
                                _.each(_this.mainModel.vo.tpaBehaviorComms,function(item1){
                                    if(item1.checkItemId == _vo.id){
                                        str = item1;
                                        return false;
                                    }
                                });
                        }else{
                            if(_this.mainModel.vo.tpaCheckRecordDetails && _this.mainModel.vo.tpaCheckRecordDetails.length>0)
                                _.each(_this.mainModel.vo.tpaCheckRecordDetails,function(item){
                                    if(item.checkItemId == _vo.id){
                                        str = item;
                                        return false;
                                    }
                                });
                        }
                        this.$broadcast('ev_editCheckResult', _vo, this.mainModel.vo.id, this.mainModel.config, obj.cell.fieldName,str);
                    } else {
                        this.$dispatch("ev_gridRefresh",null,0,null,null,obj.entry.data.id);
                    }
                }else if (obj.cell.fieldName == 'operation3' && this.mainModel.config.checkResult.notRefer == 1){
                    this.$dispatch("ev_gridRefresh",null,2,null,null,obj.entry.data.id);
                }
            },
            //检查人
            doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
                    var _vo = this.mainModel.vo;
                    _vo.checkerId =selectedDatas[0].id;
                    _vo.checkUser = selectedDatas[0];
				}
			},
            //检查表
			doSaveCheckTable:function(res){
                var _vo = this.mainModel.vo;
                _vo.checkTableId =res[0].id;
                _vo.tpaCheckTable = res[0];
                _vo.checkPlanId = null;
                _vo.tpaCheckPlan = {};
                _vo.compId = null;
                _vo.compId = res[0].compId;
                _vo.orgId = res[0].orgId;
                //this.selectModal.checkObjectSelectModal.filterData.checkTableId = res[0].id;
                this.queryCheckItem(res[0].id);
            },
            //检查计划
            doSaveCheckPlan:function(res1){
                var _vo = this.mainModel.vo;
                var _res = res1[0];
                _vo.checkPlanId =_res.id;
                _vo.tpaCheckPlan = _res;
                _vo.tpaCheckTable = _res.tpaCheckTable;
                _vo.checkTableId = _res.checkTable.id;

                if(this.mainModel.config.checkTaskSet) {
                    this.selectModal.checkTaskSelectModal.filterData["criteria.intValue"].isLateCheckAllowed = this.mainModel.config.checkTaskSet.isLateCheckAllowed;
                }
                this.selectModal.checkTaskSelectModal.filterData.checkPlanId = _res.id;
                _vo.checkUser = {};
                _vo.tpaCheckTask = {};
                this.queryCheckItem(_res.checkTable.id);
            },
			doSaveCheckTask : function(selectedDatas) {
                var _vo = this.mainModel.vo;
                var _data = selectedDatas[0];
				if (selectedDatas) {
                    _vo.tpaCheckPlan =_data.tpaCheckPlan;
                    _vo.checkPlanId =_data.checkPlanId;
                    _vo.tpaCheckTable =_data.tpaCheckTable;
                    _vo.checkTableId = _data.tpaCheckTable.id;
                    _vo.checkTaskId = _data.id;
                    _vo.tpaCheckTask = _data;
                    _vo.checkUser = _data.checkUser;
                    _vo.checkerId = _data.checkUser.id;
                    _vo.startDate = _data.startDate;
                    _vo.endDate = _data.endDate;
                    _vo.compId = null;
                    _vo.compId = _data.tpaCheckPlan.compId;
                    _vo.orgId = _data.tpaCheckPlan.orgId;
                    this.queryCheckItem(_data.tpaCheckTable.id);
				}
			},
            //受检对象
			doSaveCheckObject:function(res2){
                var _vo = this.mainModel.vo;
                _vo.checkObjectId =res2[0].id;
                _vo.checkObject= res2[0];
            },
            queryCheckItem : function(_id){
			    if (!_id) {
			        return;
                }
                var _this = this;
                var cfg_checkResult_legal = _this.mainModel.config.checkResult.legal;
                if (cfg_checkResult_legal.photoForce == 1 || cfg_checkResult_legal.videoForce == 1
                    || cfg_checkResult_legal.description == 1){
                    _this.legalVal = true;
                }
                if (_this.mainModel.config.checkResult.illegal.photoForce == 1 || _this.mainModel.config.checkResult.illegal.videoForce == 1
                    || _this.mainModel.config.checkResult.illegal.description == 1){
                    _this.illegalVal = true;
                }
                if (_this.mainModel.config.checkResult.notRefer == 1){
                    _this.notRefer();
                }
                _this.mainModel.vo.tpaBehaviorComms = [];
                _this.mainModel.vo.tpaCheckRecordDetails = [];
                _this.mainModel.checkItemIds = [];
                api.getCheckTable({id:_id}).then(function (data) {
                    var checkRecordDetalList = data.data.tirList;
                    _.each(checkRecordDetalList, function (checkItemGroup) {
                        _.each(checkItemGroup.itemList, function (checkItem) {
                            var checkRedcord={};
                            checkItem['checkResult'] = _this.mainModel.config.defaultResultValue;
                            checkRedcord['checkResult'] = _this.mainModel.config.defaultResultValue;
                            checkRedcord['checkItemId'] = checkItem.id;
                            checkRedcord['checkRecordId'] = _this.mainModel.vo.id;
                            checkRedcord ['isRectification'] = 0;
                            checkRedcord ['checkItemType'] = checkItem.type;
                            checkRedcord['groupName']=checkItemGroup.groupName;
                            checkRedcord['groupOrderNo']=checkItemGroup.groupOrderNo;
                            _this.mainModel.checkRecordDetail = {};
                            if (checkItem.type == "0"){
                                _this.mainModel.vo.tpaBehaviorComms.push(checkRedcord);
                            }else {
                                _this.mainModel.vo.tpaCheckRecordDetails.push(checkRedcord);
                            }
                        })
                    });
                    _this.mainModel.vo.checkRecordDetailVoList = checkRecordDetalList;
                });
            },
            notRefer : function () {
                var _this = this;
                _this.itemColumns1 = _this.itemColumns1.slice(0,6);
                _this.itemColumns1.push({
                    title : "",
                    fieldType : "custom",
                    fieldName : "operation3",
                    width:"80px",
                    render: function(data){
                        if(data.checkResult == 2){
                            return "<a style='color:dodgerblue;'>不涉及</a>";
                        }else if (data.checkResult == null){
                            return "<a style='color:#cecece;'>不涉及</a>";
                        }else {
                            return "<a style='color:#cecece;'>不涉及</a>";
                        }
                    },
                    tipRender : function (data) {
                        if(data.checkResult == 2){
                            return "不涉及";
                        }else if (data.checkResult == null){
                            return "不涉及";
                        }else {
                            return "不涉及";
                    }
                    }
                });
            },
            //加载检查项 （当 pageType=="check"[通过执行检查任务跳转过来时] 并且存在对应的检查表Id才进行加载）
            loadCheckItemByEnvCfgOnExcuteCheckTask :function() {
                var checkTableId = this.mainModel.vo.checkTableId;
                if(this.mainModel.config.checkResult && checkTableId) {
                    this.queryCheckItem(checkTableId);
                }
            }
        },
        events : {
            //edit框数据加载
            "ev_editReload" : function(pageType,nVal){
                var _this = this;

                this.$refs.ruleform.resetFields();
                _this.mainModel.vo.tpaBehaviorComms = [];
                _this.mainModel.vo.tpaCheckRecordDetails = [];
                _this.mainModel.checkItemIds = [];

                dataModel.mainModel.opType = pageType;
                var _vo = dataModel.mainModel.vo;

                var _select = dataModel.selectModal;
                api.getEnvConfig({type:"BUSINESS_SET"}).then(function (data) {
                    // if(_vo.checkTableId) {
                    // 	_this.isEnvConfigLate = true;
                    // }
                    if(!data.data.checkTaskSet) {
                    	data.data.checkTaskSet = {isLateCheckAllowed:0};
                    }
                    _select.checkTaskSelectModal.filterData["criteria.intValue"].isLateCheckAllowed = data.data.checkTaskSet.isLateCheckAllowed;
                    dataModel.mainModel.config = data.data;

                    if(pageType=="check") {
                        _this.loadCheckItemByEnvCfgOnExcuteCheckTask();
                    }

                });
              // dataModel.mainModel.opType = 'create';
                //清空数据
                _.extend(_vo,newVO());
                if(pageType=="create"){
                    //组织机构id
                    // _vo.orgId=LIB.user.compId;
                    this.mainModel.vo.checkDate = (new Date()).Format("yyyy-MM-dd") ;
                    this.isReadOnly = false;
                    this.isSelected = false;
                    this.mainModel.vo.compId = LIB.user.compId;
                    api.getUUID().then(function (res) {
                        _vo.id = res.data;
                    });
                }else if(pageType=="update"){
                    api.get({id:nVal}).then(function(res){
                        //初始化数据
                        _.deepExtend(_vo, res.data);
                        _vo.tpaCheckTable = res.data.tpaCheckTable;
                        _vo.checkObject = res.data.checkObject;
                        _vo.checkUser = res.data.checkUser;
                        _this.notRefer();
                    });
                    this.isReadOnly = false;
                    this.isSelected = true;
                }else if(pageType=="check") {
                	api.getCheckTask({id:nVal}).then(function(res){
                        //初始化数据
                        // _vo.orgId = res.orgId;
                        // _vo.compId = res.compId;
                        _vo.tpaCheckPlan = res.data.tpaCheckPlan;
                        _vo.tpaCheckTable = res.data.tpaCheckTable;
                        _vo.checkUser = res.data.user;
                        _vo.tpaCheckTask = res.data;
                        _vo.checkPlanId = res.data.checkPlanId;
                        _vo.checkTableId = res.data.checkTableId;
                        _vo.checkerId = res.data.checkerId;
                        _vo.checkTaskId = res.data.id;
                        _vo.startDate = res.data.startDate;
                        _vo.endDate = res.data.endDate;
                        _vo.orgId = res.data.tpaCheckPlan.orgId;
                        _vo.compId = res.data.tpaCheckPlan.compId;
                        _vo.type = res.data.attr1;
                        //_select.checkObjectSelectModal.filterData.checkTableId = res.data.checkTableId;
                        _select.checkTaskSelectModal.filterData.checkPlanId = res.data.checkPlanId;
                        _this.notRefer();
                        // if(dataModel.mainModel.config.checkResult) {
                        // 	console.log("准时加载");
                        // 	_this.queryCheckItem(res.data.checkTableId);
                       // }
                        _this.loadCheckItemByEnvCfgOnExcuteCheckTask();
                    });
                    this.isReadOnly = false;
                    this.isSelected = false;
                    api.getUUID().then(function (res) {
                        _vo.id = res.data;
                    });
                }
            },
            //detail框点击关闭后事件处理
            /*"ev_viewDetailColsed" : function(){
                this.viewDetailModel.show = false;
            },*/
            "ev_gridRefresh":function (id,checkResult,problem,remark,checkItemId) {
                this.mainModel.checkItemIds.push(checkItemId);
                this.mainModel.selectedCheckItem.checkResult = checkResult;
                this.viewDetailModel1.show = false;
                _.each(this.mainModel.vo.tpaBehaviorComms, function (behaviorComm) {
                    if (behaviorComm.checkItemId == checkItemId) {
                        if (id != null){
                            behaviorComm.id=id;
                        }
                        behaviorComm.checkResult = checkResult;
                        behaviorComm.talkResult = problem;
                        behaviorComm.suggestStep = remark;
                    }
                });
                _.each(this.mainModel.vo.tpaCheckRecordDetails, function (detail) {
                    if (detail.checkItemId == checkItemId) {
                        if (id != null){
                            detail.id=id;
                        }
                        detail.checkResult = checkResult;
                        detail.problem = problem;
                        detail.remark = remark;
                    }
                });
            }
        },
        watch:{
        	"mainModel.vo.type":function(val, oldVal) {
        		var _vo = dataModel.mainModel.vo;
        		if(val == 0 && oldVal == 1) {
        			//清空数据
                    _.extend(_vo,newVO());
        		}
        		dataModel.selectModal.checkTableSelectModal.filterData.type = val;
        	}
        	// "mainModel.config":function(val, oldVal) {
        	// 	var opType = dataModel.mainModel.opType;
        	// 	var _vo = dataModel.mainModel.vo;
        		// if(opType == "check" && this.isEnvConfigLate) {
        		// 	console.log("延时加载");
        		// 	this.queryCheckItem(_vo.checkTableId);
        		// }
        	// }
        },
        ready:function(){
            this.$api = api;
        }
    });
    return detail;
});