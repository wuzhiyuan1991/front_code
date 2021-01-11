define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./mytable.html");
    var api = require("../vuex/api");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var levelSelectModal = require("componentsEx/selectTableModal/levelSelectModal");
    var templeteSelectModal = require("componentsEx/selectTableModal/templeteSelectModal");
    var riskJudgmentTempleteFormModal = require("componentsEx/formModal/riskJudgmentTempleteFormModal");

    //导入
    var importProgress = require("componentsEx/importProgress/main");
    var riskSelectInput = require("components/riskSelectInput/main");

    var columns = [

        {
            title: '研判层级单位名称',
            render: function (data) {
                return data.name;
            },
            width: "150px"
        },
        {
            title: '研判负责人',
            render: function (data) {
                return _.pluck(data.users, "username").join("，")
            },
            width: "150px"
        },
        {
            title: '下辖研判单位',
            render: function (data) {
                return _.pluck(data.subordinateUnits, "name").join("，")
            },
            width: "150px"
        },
        {
            title:'研判书模板',
            render:function (data) {
                return  _.pluck([data.riskJudgmentTemplete], "name").join("，")
            }
        }

        ]

    var newRiskJudgmentLevel = function() {
        return {
            id : null,
            name: null,
            ratedCompleteDate:null,
            remark : null,
            riskJudgmentGroups:[],
            riskTemplateConfig:{id:null,name:null}
        }
    };

    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //
            code: null,
            //禁用标识 0未禁用，1已禁用
            disable: "0",
            //所属部门id
            orgId: null,
            //额定完成时间
            ratedCompleteDate: null,
            //备注
            remark: null,
            cloudFiles: [],
            users: [],
            depts: [],
            deptName:'',
            riskJudgmentTemplete:[]
        }
    };

    var detail = LIB.Vue.extend({
        computed:{
            toolColumn: function () {
                if(this.isEdit == 1)
                return ['update', 'del']
                else{
                    return[]
                }
            },
            leftWidth:function () {
              return  "left:-" +this.tabPage * 100 *this.tabPageNum + "px;" +"width:" + 100 *this.tabPageNum +"px";;
            },
            borderWidth:function () {
                return "width:" + 100 *this.tabPageNum +"px";
            },
            checkBoxValue:function (val) {
                if(val == 0){
                    return false;
                }
                return true;
            },
        },
        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        components:{
            "userSelectModal": userSelectModal,
            "templeteSelectModal":templeteSelectModal,
            "levelSelectModal": levelSelectModal,
            "importprogress":importProgress,
            "riskSelectInput":riskSelectInput,
            "riskJudgmentTempleteFormModal":riskJudgmentTempleteFormModal,
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
                default: ''
            },
            isEdit:{
                type:String,
                // default:''
            },
            compId:{
                type:String
            }
        },
        watch: {
            visible: function (nVal) {
                this.mainVisible = true;
                nVal && this._init();
            },
            // 弹框消失并设置selectType值
            selectType: function (nVal) {
                if(!nVal) this.selectType = 0;
            },
        },
        data:function(){
            return {

                nodeFlag: {

                }, // 编辑框相关插入操作记录

                updateGroupNameItem:{},
                showPreview:false,
                upDateId:'',
                upDateOrPost:'', // 2 为updata  1为提交
                mypromiseHtml :'',
                mypromise:null,
                mainVisible:false,
                isShowAddItem:false,
                groupItemModel: {
                    title : "修改组名",
                    curEditItem : null,
                    show:false,
                    vo : {
                        id : '',
                        name : ''
                    },
                    rules:{
                        "name" : [LIB.formRuleMgr.length(100),LIB.formRuleMgr.require("组名")],
                    }
                },
                mainModel : {
                    mainLevelList:[],
                    title: "设置",
                    isReadOnly:false,
                    riskJudgmentUnits:[],
                    filterKey:'',  // 查询人员
                    riskJudgmentLevel:newRiskJudgmentLevel(),
                    vo: newVO(),
                    opType: 'view',
                    //验证规则
                    rules:{
                        "ratedCompleteDate" : [LIB.formRuleMgr.allowStrEmpty,LIB.formRuleMgr.require("额定完成时间"),{required: true}],
                        "level":[LIB.formRuleMgr.length(200),{required: true}],
                        "remark" : [LIB.formRuleMgr.length(200)],
                        // "cloudFiles":[{required:true}]
                        "cloudFiles":[]
                    },
                    info2Rules:{
                        "deptName" : [LIB.formRuleMgr.length(100),{required:true,message:'请输入研判层级单位名称'}],
                        "users" : [{type:'array',required: true, message: '请选择研判负责人'}],
                        "riskJudgmentTemplete" : [{type:'array',required: true, message: '请选择研判书模本'}],
                    },
                    extRules4info2Rules : {
                        "depts" : [{type:'array', message: '请选择下级研判单位'}]
                    },

                    isEdit:false
                },
                tabs: [
                    {
                        id: '1',
                        name: '研判内容'
                    },
                    {
                        id: '2',
                        name: '研判人员'
                    },
                ],
                checkedTabId: '', // 顶部研判内容跟研判人员的切换标记
                // columns: columns,
                riskJudgmentUnits: null, // 研判单位
                // showSendNotice: false,
                // images: null,
                riskJudgmentLevelList:[],
                checkedDepartmentIndex:0,  // 左侧导航栏选中 标记
                riskJudgmentTempletes:[],  // 模板列表
                oldLists:[],  // 当前未区分分组的列表
                templeteIndex:0,  // 顶部选中  模板标记
                groups:[],

                selectType: 0,   // 编辑模板弹框插入类型  1为插入下拉框 2为多选框
                selectIndex:-1,  // 当前选择组的序号   -2：为承诺内容
                editGroupItem:null,
                editRiskPromise:null,
                isShowAddGroupItem:false,
                addGroupItemName:'',
                levelId:'',
                columns: columns,

                selectModel: {
                    userSelectModel: {
                        visible: false,
                        filterData: {orgId: null}
                    },
                    leveltSelectModel: {
                        visible: false,
                        filterData: {}
                    },
                    signViewModel: {
                        visible: false
                    },
                    taskViewModel: {
                        visible: false
                    },
                    editDivModel:{
                      visible: false
                    },
                    contralItemModel:{
                      visible:false,
                        itemCount:7
                    },
                    templeteModel:{
                        visible:false,
                        filterData:{}
                    },
                    showUserAddModal:false,

                },
                formModel : {
                    riskJudgmentTempleteFormModel : {
                        show : false,
                        // hiddenFields : ["riskJudgmentId"],
                        queryUrl : "riskjudgmenttemplete/{id}"
                    },
                },
                // 文件参数
                uploadModel: {
                    params: {
                        recordId: null,
                        dataType: 'FXYP0',
                        fileType: 'FXYP'
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,ppt,pptx"}]
                    },
                    url: "/riskjudgmentunit/importExcel",
                },
                importProgress:{
                    show: false
                },
                exportModel : {
                    url: "/riskjudgmentunit/exportExcel",
                },
                templete : {
                    url: "/riskjudgmentunit/file/down"
                },
                listIndex:0,
                tabPage:0, // 模板页码
                tabPageNum: 4
            };
        },

        methods:{
        //    获取文件
        //    this.getFileList(this.uploadModel.params.recordId);


            doFilter:function () {
                  this.doSelectDepartment(this.checkedDepartmentIndex)
            },

            nextTabPage:function (val) {
                this.tabPage+=val;
                if(this.tabPage <0){
                    this.tabPage = 0;
                }
                if( this.riskJudgmentTempletes.length%this.tabPageNum==0 &&this.tabPage >= parseInt(this.riskJudgmentTempletes.length/this.tabPageNum)){
                    this.tabPage =  parseInt(this.riskJudgmentTempletes.length/this.tabPageNum) -1;
                }
                if(this.tabPage > parseInt(this.riskJudgmentTempletes.length/this.tabPageNum)){
                    this.tabPage-=1;
                }
            },

            // 模板弹框
            doShowRiskJudgmentTempleteFormModal4Update : function(param) {
                var obj = this.riskJudgmentTempletes[this.templeteIndex]
                this.formModel.riskJudgmentTempleteFormModel.show = true;
                this.$refs.riskjudgmenttempleteFormModal.init("update", {id:obj.id});
            },

            // 模板弹框
            doShowRiskJudgmentTempleteFormModal4Create : function(param) {
                this.formModel.riskJudgmentTempleteFormModel.show = true;
                this.$refs.riskjudgmenttempleteFormModal.init("create");
            },

            updateDisable:function (val) {
                var _this = this;
              api.updateTempleteDisable({id:this.riskJudgmentTempletes[this.templeteIndex].id, disable:val}).then(function () {
                  _this.riskJudgmentTempletes[_this.templeteIndex].disable = val;
                  if(val == 0){
                      LIB.Msg.info("启用成功");
                  }else{
                      LIB.Msg.info("停用成功");
                  }

              })
            },

             // 修改模板名称
            doUpdateTemplete:function (data) {
                var _this = this;

                var isExit = 0;
                _.each(this.riskJudgmentTempletes, function (item) {
                    if(data.id == item.id){
                        return;
                    }
                    if(data.name == item.name){
                        isExit +=1;
                        return true;
                    }
                });
                if(isExit>0){
                    LIB.Msg.warning("模板名称重复");
                    return;
                }

                var obj = {name:data.name, riskJudgmentLevelId:this.riskJudgmentLevelList[this.checkedDepartmentIndex].id, riskJudgmentId:this.id, id:this.riskJudgmentTempletes[this.templeteIndex].id}
                api.updateRiskJudgmentTemplete(obj).then(function (res) {
                    _this.riskJudgmentTempletes[_this.templeteIndex].name = data.name;
                })
            },
            // 创建模板
            doSaveTemplete:function (data) {
                var _this = this;


                var isExit = 0;
                _.each(this.riskJudgmentTempletes, function (item) {
                    if(data.name == item.name){
                        isExit +=1;
                        return true;
                    }
                })
                if(isExit>0){
                    LIB.Msg.info("模板名称重复");
                    return;
                }

                var obj = {name:data.name, riskJudgmentLevelId:this.riskJudgmentLevelList[this.checkedDepartmentIndex].id, riskJudgmentId:this.id, ratedCompleteDate : "10:00:00"}
              api.createRiskJudgmentTemplete(obj).then(function (res) {

                  _this.riskJudgmentTempletes.push({
                      disable:1,
                      id:res.body.id,
                      name: res.body.name,
                      ratedCompleteDate: res.body.ratedCompleteDate,
                      riskJudgmentLevelId: res.body.riskJudgmentLevelId
                  });


                  _this.oldLists.riskJudgmentGroups.push(res.body.riskJudgmentGroups[0]);
                  _this.doChangeTemplete(_this.riskJudgmentTempletes.length-1)
                  // _this.riskJudgmentTempletes.push   [_this.templeteIndex]
              })
            },
            // 更新模板时间
            changeRatedCompleteDate:function(time){
                var _this = this;
                time = time+":00";
                var obj = {ratedCompleteDate:time, riskJudgmentLevelId:this.riskJudgmentLevelList[this.checkedDepartmentIndex].id, riskJudgmentId:this.id, id:this.riskJudgmentTempletes[this.templeteIndex].id}
                api.updateRiskJudgmentTemplete(obj).then(function (res) {
                    LIB.Msg.info("保存成功");
                    _this.riskJudgmentTempletes[_this.templeteIndex].ratedCompleteDate = time;
                })
            },

            doImport:function(){
                var _this=this;
                var url = "/riskjudgmentunit/importExcel?riskJudgmentId="+_this.id;
                this.$broadcast("ev_update_url",url);
                _this.importProgress.show = true;
            },

            // 弹出组名框
            doShowGroupName:function (item) {
                this.groupItemModel.vo.id = '';
                this.groupItemModel.vo.name = '';
                //编辑
                if(item != null) {
                    this.groupItemModel.title = '修改组名';
                    this.groupItemModel.curEditItem = item;
                    this.groupItemModel.vo.id = item.id;
                    this.groupItemModel.vo.name = item.name;
                } else{
                    this.groupItemModel.title = '新增组';
                }
                this.groupItemModel.show =  true;
            },

            checkName:function (obj, arr) {
                var isExit = false;
                for(var i=0; i<arr.length; i++){
                    for(var item in arr[i]){
                        if(arr[i][item].name == obj.name && obj.id != arr[i][item].id){
                            isExit = true;
                        }
                    }
                }
                return isExit;
            },

            // 保存修改组名
            doSaveGroupName:function(){
                var _this = this;

                this.$refs.groupitemform.validate(function (valid) {
                    if (valid) {
                        var obj = {id:_this.groupItemModel.vo.id, name:_this.groupItemModel.vo.name}
                        if(_this.checkName(obj, _this.groups)){

                            LIB.Msg.info("组名重复")
                            //清空绑定值

                            return;
                        }

                        //新增
                        if(_.isEmpty(_this.groupItemModel.vo.id)){
                            var str = _this.groupItemModel.vo.name;
                            var obj = {name:str, textObj:null, content:''};
                            // this.groups.push(obj);
                            // this.addGroupItemName = '';
                            var param = {
                                name:str,
                                riskJudgmentLevel:{id: _this.levelId},
                                riskJudgmentId: _this.id,
                                riskJudgmentTempleteId:_this.riskJudgmentTempletes[_this.templeteIndex].id
                            }
                            api.addRiskjudgmentGroupName(param).then(function (res) {
                                // _this.doSelectDepartment(_this.checkedDepartmentIndex)
                                var tempObj = _this.shallowCopy(_this.groups[0]);
                                // tempObj.id =
                                tempObj.name = param.name;
                                tempObj.content = '';
                                tempObj.id = res.body.id;
                                tempObj.riskJudgmentTempleteId = _this.riskJudgmentTempletes[_this.templeteIndex].id;
                                allExclude: false;
                                tempObj.textObj='';
                                // _this.groups.push(tempObj);
                                _this.oldLists.riskJudgmentGroups.push(tempObj);
                                _this.doChangeTemplete(_this.templeteIndex);

                                //清空绑定值
                                _this.groupItemModel.vo.id = '';
                                _this.groupItemModel.vo.name = '';
                                _this.groupItemModel.show =  false;
                                LIB.Msg.info("保存成功");
                            })
                        }
                        //编辑
                        else {
                            api.upDateRiskjudgmentGroupName(_this.groupItemModel.vo).then(function () {
                                //更新视图
                                _this.groupItemModel.curEditItem.name = _this.groupItemModel.vo.name;
                                _.each(_this.oldLists.riskJudgmentGroups,function (item) {
                                    if(item.riskJudgmentTempleteId == _this.riskJudgmentTempletes[_this.templeteIndex].id){
                                        item.name = _this.groupItemModel.vo.name;
                                    }
                                });

                                //清空绑定值
                                _this.groupItemModel.vo.id = '';
                                _this.groupItemModel.vo.name = '';
                                _this.groupItemModel.show =  false;

                                LIB.Msg.info("保存成功");
                                // _this._init();
                            });
                        }
                    }
                });
                // var obj ={
                //     id:this.updateGroupNameItem.id,
                //     name: this.updateGroupNameItem.name
                // }
                // api.upDateRiskjudgmentGroupName(obj).then(function () {
                //     // _this._init();
                // })
            },
            doCloseGroupName:function () {
                //清空绑定值
                this.groupItemModel.vo.id = '';
                this.groupItemModel.vo.name = '';
                this.groupItemModel.show =  false;
            },
            doCloseEditGroup: function () {
              this.selectModel.editDivModel.visible = false;
            },

            //删除模板
            doDeleteTemplate:function () {
                var _this = this;
                var obj = {
                    id:this.riskJudgmentTempletes[this.templeteIndex].id
                };

                LIB.Modal.confirm({
                    title: '确定删除该模板吗？',
                    onOk: function () {
                        api.deleteRiskJudgmentTemplete(null,obj).then(function() {
                            // // _this._init();
                            // _this.riskJudgmentTempletes.splice(this.templeteIndex, 1);
                            // _this.templeteIndex = 0;
                            // _this.doChangeTemplete( _this.templeteIndex);
                            // _this.doSelectDepartment(_this.checkedDepartmentIndex);
                            _this.templeteIndex-=1;
                            if(_this.templeteIndex<0){
                                _this.templeteIndex = 0;
                            }
                            _this.queryRiskjudgmentGroup(_this.checkedDepartmentIndex);

                        });
                    }
                });
            },

            // 删除组
            doDeleteGroup:function (item,idx) {
                var _this = this;
                var obj = {
                    id:item.id
                };
                LIB.Modal.confirm({
                    title: '确定删除该组吗？',
                    onOk: function () {
                        api.deleteRiskjudgmentGroup(null,obj).then(function() {
                            // _this._init();
                            _this.groups.splice(idx, 1);
                            // 更新oldlist
                            var i=-1;
                            _.each(_this.oldLists.riskJudgmentGroups,function (item, index) {
                                if(item.id == obj.id){
                                    i = index;
                                }
                            });
                            _this.oldLists.riskJudgmentGroups.splice(i, 1);
                        });

                    }
                });
            },

            checkListFile:function(type){
                var _this = this;
                // criteria.strsValue.recordId=[]

                var arr =[]
                for(var i=0; i<this.riskJudgmentLevelList.length;i++){
                    arr.push(this.riskJudgmentLevelList[i].id);
                }
                // var param ={
                //     'criteria.strsValue.recordId' : JSON.stringify(arr)
                // }
                var param ={
                    'criteria.strsValue' : JSON.stringify({recordId:arr})
                }

                api.getDepartmentFileLists(param).then(function (res) {
                    var istrue = false;
                    for(var i=0; i<arr.length; i++){
                        istrue = false;
                        istrue =  res.body.some(function (val) {
                            if(val.recordId == arr[i]){
                                return true;
                            }
                        })
                        if(!istrue){
                            LIB.Msg.info("信息未填写完整");
                            break;
                        }
                    }
                    if(istrue){
                        _this.doSave(type)
                    }
                })
            },

            updataStatus:function(item){

                var obj ={
                    id:item.id,
                    allExclude: !item.allExclude?1:0
                }
                api.upDateRiskjudgmentGroupName(obj).then(function () {

                })
            },

            selectModalAddUser:function (item) {

                if(this.isEdit != 1){
                    return;
                }

                //动态设置form校验
                if(this.checkedDepartmentIndex > 0) {
                    LIB.Vue.set(this.mainModel.info2Rules, "depts", this.mainModel.extRules4info2Rules.depts);
                } else {
                    delete this.mainModel.info2Rules.depts;
                }

                var val = _.cloneDeep(item);

                if(val == 0){
                    this.mainModel.vo.users = [];
                    this.mainModel.vo.depts=[];
                    this.mainModel.vo.deptName='';
                    this.upDateOrPost = 1;
                    this.mainModel.vo.riskJudgmentTemplete = [];
                    this.upDateId = '';
                }else if(typeof val == "object"){
                    this.mainModel.vo.users = val.users;
                    this.mainModel.vo.depts = val.subordinateUnits;
                    this.mainModel.vo.deptName= val.name;
                    this.mainModel.vo.riskJudgmentTemplete = [val.riskJudgmentTemplete];
                    this.upDateOrPost = 2;

                    this.upDateId = val.id;
                }
                this.selectModel.showUserAddModal = true;
            },

            doItemDelete: function (row) {

                if(this.isEdit != 1){
                    return;
                }

                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.riskjudgmentunitDelete(null,{id:row.id}).then(function () {
                            // _this._getGroupList();
                            _this.doSelectDepartment(_this.checkedDepartmentIndex)
                        })
                    }
                });

            },


            doSave:function(val){

                // this.checkListFile();
                // return;

                var str = '';
                var _this  = this;

                // if(this.mainModel.vo.cloudFiles.length == 0){
                //     LIB.Msg.warning("未上传研判和承诺书")
                //     return ;
                // }
                this.checkTeamList();
                this.getTeamListOldValue();

                // TODO 后台接口还没弄好  数组 mainMoodel.mainLevelList 为相关数组
                for(var i=0; i<this.mainModel.mainLevelList.length; i++){
                    var arr = this.mainModel.mainLevelList[i].ratedCompleteDate;
                    if (arr.length > 0 && typeof arr == "object") {
                        str = arr[0] + ":" + arr[1] + ":00";
                    };
                    this.mainModel.mainLevelList[i].ratedCompleteDate = str;
                }

                api.riskjudgmentlevel(obj).then(function (res) {
                    LIB.Msg.info("保存成功");
                    if(val == 0) _this.visible = false;
                })


                return;

                // this.$refs.ruleform.validate(function (valid) {
                //     if (valid) {
                        var arr = _this.mainModel.riskJudgmentLevel.ratedCompleteDate.split(":");
                        if (arr.length > 0 && typeof arr == "object") {
                            str = arr[0] + ":" + arr[1] + ":00";
                        }
                        var obj = {
                            remark: _this.mainModel.riskJudgmentLevel.remark,
                            ratedCompleteDate: str,
                            id: _this.riskJudgmentLevelList[_this.checkedDepartmentIndex].id
                        }


                        api.riskjudgmentlevel(obj).then(function (res) {
                            LIB.Msg.info("保存成功");
                            if(val == 0) _this.visible = false;
                        })
                    // }
                // })

            },
            doShowTempleteSelectModel:function () {
                this.selectModel.templeteModel.filterData = {'riskJudgmentLevelId':this.riskJudgmentLevelList[this.checkedDepartmentIndex].id,'disable':0};
                this.selectModel.templeteModel.visible = true;
            },

            doShowDepartmentSelectModal: function () {
                this.selectModel.leveltSelectModel.filterData = {'riskJudgmentLevel.riskJudgmentId':this.id,'riskJudgmentLevel.orderNo':this.riskJudgmentLevelList[this.checkedDepartmentIndex].orderNo};
                this.selectModel.leveltSelectModel.visible = true;
            },
            doSaveTempleteUnit: function (selectedDatas) {
                this.mainModel.vo.riskJudgmentTemplete = _.map(selectedDatas, function (row) {
                    return {
                        id: row.id,
                        name: row.name,
                        orgId: row.orgId
                    }
                });
                // this.mainModel.vo.users = _.map(selectedDatas, function (row) {
                //     return {
                //         id: row.id,
                //         name: row.name,
                //         orgId: row.orgId
                //     }
                // });
            },
            doSaveUsers: function (selectedDatas) {
                 var tempList = _.map(selectedDatas, function (row) {
                    return {
                        id: row.id,
                        name: row.name,
                        orgId: row.orgId
                    }
                });
                var list  = this.mainModel.vo.users.concat(tempList);
                this.mainModel.vo.users = this.unique(list);
            },
            unique :function (arr) {
                for(var i=0; i<arr.length; i++){
                    for(var j=i+1; j<arr.length; j++){
                        if(arr[i].id==arr[j].id){         //第一个等同于第二个，splice方法删除第二个
                            arr.splice(j,1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            doSaveBizOrgRels :function(selectedDatas){
                this.mainModel.vo.depts = _.map(selectedDatas, function (row) {
                    return {
                        id: row.id,
                        name: row.name,
                        orgId: row.orgId
                    }
                });
            },
            // addToGroups: function(){
            //     var str = this.addGroupItemName;
            //     var obj = {name:str, textObj:null, content:''};
            //         // this.groups.push(obj);
            //     this.addGroupItemName = '';
            //     var param = {
            //         name:str,
            //         riskJudgmentLevel:{id:this.levelId},
            //         riskJudgmentId:this.id,
            //     }
            //     var _this = this;
            //     api.addRiskjudgmentGroupName(param).then(function (res) {
            //         // _this.doSelectDepartment(_this.checkedDepartmentIndex)
            //         var tempObj = _this.shallowCopy(_this.groups[0]);
            //         // tempObj.id =
            //         tempObj.name = param.name;
            //         tempObj.content = '';
            //         tempObj.id = res.body.id;
            //         allExclude: false;
            //         tempObj.textObj='';
            //         _this.groups.push(tempObj);
            //     })
            // },
            shallowCopy: function (src) {
                var dst = {};
                for (var prop in src) {
                    if (src.hasOwnProperty(prop)) {
                        dst[prop] = src[prop];
                    }
                }
                return dst;
            },

            // 更新组内容
            upDateRiskjudgmentGroup: function(){

                var _this = this;
                this.previewAction();
                var obj = {};

                for(var item in this.editGroupItem){
                    if(item != 'content'){
                        obj[item] = this.editGroupItem[item];
                    }
                }
                this.$nextTick(function () {
                    if(_this.selectIndex != -2){
                        var param ={
                            id:_this.groups[_this.selectIndex].id,
                            itemContent:_this.editGroupItem.content,
                            riskTemplateConfig: {content:JSON.stringify(obj)}
                        }
                        api.upDateRiskjudgmentGroup(param).then(function (res) {

                            if(res.ok){
                                LIB.Msg.info("保存成功");
                                _this.groups[_this.selectIndex].textObj = obj;
                                _this.groups[_this.selectIndex].content = _this.deel(_this.editGroupItem);

                                // 保存到oldlists里面
                                _.each(_this.oldLists.riskJudgmentGroups,function (item) {
                                    if(item.id == _this.groups[_this.selectIndex].id){
                                        item.itemContent = param.itemContent;
                                        item.riskTemplateConfig = param.riskTemplateConfig;
                                    }
                                })
                            }

                            // _this.doSelectDepartment(_this.checkedDepartmentIndex);
                        })
                    }

                    if(this.selectIndex == -2){
                        var content = (_this.editGroupItem &&  _this.editGroupItem.content)? _this.editGroupItem.content:'';
                        if(!content){LIB.Msg.error("研判承诺不能为空"); return false;}
                        var paramObj ={
                            // id: _this.riskJudgmentLevelList[_this.checkedDepartmentIndex].id,
                            id:_this.riskJudgmentTempletes[this.templeteIndex].id,
                            promise:content,
                            riskTemplateConfig:{
                                content:JSON.stringify(obj)
                            }
                        };
                        api.upDateriskjudgmentPromise(paramObj).then(function (res) {
                            // _this.doSelectDepartment(_this.checkedDepartmentIndex);
                            if(res.ok){
                                LIB.Msg.info("保存成功");
                            }
                            _this.mypromiseHtml = document.getElementById("editionDiv").innerHTML;
                            // 保存承诺到模板
                            _this.riskJudgmentTempletes[_this.templeteIndex].promise = paramObj.promise;
                            _this.riskJudgmentTempletes[_this.templeteIndex].riskTemplateConfig.content = paramObj.riskTemplateConfig.content;
                        })
                    }

                    _this.selectModel.editDivModel.visible = false;

                })

            },

            initGroup: function(valArr){
                var arr = valArr;

                this.groups = [];
                for(var i=0; i<arr.length; i++){
                    var obj = {name: '', content:' ', textObj:null, allExclude:arr[i].allExclude==0?false:true};
                    var o ={};
                    obj.name = arr[i].name;
                    obj.id = arr[i].id;
                    if(arr[i].itemContent) o.content = arr[i].itemContent;
                    else o.content = '';
                    if(valArr[i].riskTemplateConfig && arr[i].riskTemplateConfig.content!=''){
                        var temp = JSON.parse(arr[i].riskTemplateConfig.content);
                        for(var item in temp){
                            o[item] = temp[item];
                        }
                    }
                    obj.content = this.deel(o)
                    obj.textObj = o;
                    this.groups.push(obj);
                }
            },

            doCloseAddItem:function () {

                if(this.nodeFlag.id){

                }

                this.nodeFlag.id = '';
            },

            insertCheckBox: function(){
                // 1为插入下拉框 2为多选框
                if(this.selectType == 1){
                    this.addSelectBoxToHtml();
                }else if(this.selectType==2){
                    this.addCheckBoxToHtml();
                }
                this.selectModel.contralItemModel.visible = false;
                this.selectType = 0;
            },
            addCheckBoxToHtml: function(){

                var els = document.getElementsByName("editDomCheckInput");
                // var str = "&nbsp;<p style='display:inline-block;' class='check' id='myBox_" + numRandom+"' name='mycheckBox' > ";
                var str="";
                var oldHtml = this.getOldHtml();
                for(var i=0; i<els.length; i++){
                    if(els[i].value!=''){
                        str+=  els[i].value +" <input disabled  type='checkBox' name='checkBoxInput' value='"+els[i].value+"' />";
                    }
                }
                if(str.indexOf("<input")<0){
                    return;
                }
                if(this.nodeFlag.id){
                    document.getElementById(this.nodeFlag.id).innerHTML = str;
                    this.nodeFlag.id = '';
                }
                // this.insertLastNode(str)
                // document.getElementById("editionDiv").innerHTML = oldHtml + str;

            },
            addSelectBoxToHtml: function(){
                var numRandom = this.getRand();
                var els = document.getElementsByName("editDomCheckInput");
                var str = "&nbsp;<select id='myselect_" + numRandom+"' name='myselect' class='myselect' >";
                var oldHtml = this.getOldHtml();
                for(var i=0; i<els.length; i++){
                    if(els[i].value!='')
                        str+="<option>"+els[i].value+"</option>";
                }
                str+= "</select>&nbsp;";
                if(str.indexOf("<option>")<0){
                    return;
                }
                document.getElementById("editionDiv").innerHTML = oldHtml + str;
            },
            showEditDom: function(val){
                this.selectType = val;

                // 插入p标签
                if(this.selectType == 2){
                    var numRandom = this.getRand();
                    var str = "&nbsp;<p contenteditable='false' style='display:inline-block;border:1px solid #ddd;' class='check' id='myBox_" + numRandom+"' name='mycheckBox' ></p>&nbsp;";
                    this.nodeFlag.id = "myBox_"+ numRandom;
                    this.insertHtmlAtCaret(str);
                    var ele = document.getElementById(this.nodeFlag.id);
                    if(document.getElementById("editionDiv").innerHTML.indexOf(this.nodeFlag.id)<0){
                        LIB.Msg.info("请将光标移到输入框");
                        var parent = ele.parentNode;
                        parent.removeChild(ele);
                        parent.innerHTML = parent.innerHTML.replace(/&nbsp;/g,"");

                        // 点击事件失效
                        $("#addCheckBoxGroups").unbind("click").bind("click", this.showEditDom);

                        // parent.innerHTML = parent.innerHTML.replace(/ /g,"");
                        return;
                    }

                }

                this.selectModel.contralItemModel.visible = true;
                var elDiv = document.getElementsByName("editDomCheckBoxBody")[0];
                elDiv.innerHTML = '';
                for(var i=0; i<this.selectModel.contralItemModel.itemCount; i++){
                    var it = document.createElement("input");
                    it.className = 'editDomCheckInput';
                    it.name = "editDomCheckInput";
                    var divBorder = document.createElement("div");
                    divBorder.style = "padding-top:10px;"
                    divBorder.innerHTML = ' <span class="myCheckboxStyle"></span><input  class="editDomCheckInput" name="editDomCheckInput"/>'
                    elDiv.append(divBorder);
                }
            },

            addcheckBoxInput: function(){
                var elDiv = document.getElementsByName("editDomCheckBoxBody")[0];
                var it = document.createElement("input");
                it.className = 'editDomCheckInput';
                it.name = "editDomCheckInput";
                var divBorder = document.createElement("div");
                divBorder.style = "padding-top:10px;"
                divBorder.innerHTML = ' <span class="myCheckboxStyle"></span><input  class="editDomCheckInput" name="editDomCheckInput"/>'
                elDiv.append(divBorder);

            },

            doSelectDepartment:function(index){

                if (this.checkedTabId) {
                    if (this.checkedTabId === '1') {

                        this.checkedDepartmentIndex = index;
                        this.templeteIndex = 0;
                        this.queryRiskjudgmentGroup(index);
                    }
                    if (this.checkedTabId === '2') {
                        this.checkedDepartmentIndex = index;
                        this.getRiskDetail(index);
                    }
                }
                this.checkedDepartmentIndex = index;
                this.templeteIndex = 0;
            },

            // 遍历当前项是否存在在队列数组里面
            checkTeamList: function (obj) {
                var isExit = false;
                for(var i=0; i<  this.mainModel.mainLevelList.length; i++){

                    if(this.mainModel.mainLevelList[i].id == this.mainModel.riskJudgmentLevel.id){
                        isExit  = true;
                        this.mainModel.mainLevelList[i].ratedCompleteDate = this.mainModel.riskJudgmentLevel.ratedCompleteDate;
                    }
                }
                if(!isExit && this.mainModel.riskJudgmentLevel.id){
                    this.mainModel.mainLevelList.push(this.mainModel.riskJudgmentLevel);
                }
            },
            // 如果当前项在队列里面取出相应的值
            getTeamListOldValue:function (obj) {
                for(var item=0; item< this.mainModel.mainLevelList.length; item++){
                    if(this.mainModel.mainLevelList[item].id == this.mainModel.riskJudgmentLevel.id){
                        this.mainModel.riskJudgmentLevel.ratedCompleteDate = this.mainModel.mainLevelList[item].ratedCompleteDate;
                        this.mainModel.riskJudgmentLevel.remark = this.mainModel.mainLevelList[item].remark;
                    }
                }
            },

            getFileList:function(id){
                var _this = this;
                api.getFileList({recordId:id}).then(function (res) {
                    _this.mainModel.vo.cloudFiles = res.data;
                })
            },

            doClose: function () {
                if(this.selectModel.editDivModel.visible == false)
                    this.visible = false;
                else this.selectModel.editDivModel.visible = false;
            },
            doTabClick: function (id) {
                this.checkedTabId = id;
                this.doSelectDepartment(this.checkedDepartmentIndex);
            },
            // sendBatchNotify: function () {
            //     var users = _.filter(this.allValues, "isSign", '0');
            //     var ids = _.pluck(users, "id");
            //     api.sendNotify(ids).then(function (res) {
            //         LIB.Msg.info("提醒发送成功");
            //     })
            // },
            _getList: function () {
                var _this = this;
                _this.riskJudgmentLevelList = [];
                _this.mainModel.mainLevelList = []; // 初始化

                api.queryRiskjudgmentlevels({'riskJudgment.id': this.id}).then(function (res) {
                   var a  = res.data;
                    _this.riskJudgmentLevelList = a;
                    // _this.riskJudgmentLevelList =  a.sort(function(a, b){
                    //    // if(parseInt(a.orderNo) <parseInt(b.orderNo)) return -1;
                    //    // else if(parseInt(a.orderNo) > parseInt(b.orderNo)) return 1;
                    //    // else return 0;
                    //    if(a.orderNo > b.orderNo) return -1;
                    // });
                    _this.$nextTick(function () {
                        if(_this.riskJudgmentLevelList.length>0){
                            _this.doSelectDepartment(0);
                        }
                    })
                })
            },
            // 过滤老的html
            getOldHtml : function (){
                var oldHtml = document.getElementById("editionDiv").innerHTML;
                while(oldHtml.indexOf("<div><br></div>")>-1){
                    var order = "<div><br></div>";
                    oldHtml = oldHtml.replace(order, "<br>")
                }
                while(oldHtml.indexOf("<div>")>-1 || oldHtml.indexOf("</div>")>-1){
                    var order = "<div>";
                    var order1 = "</div>";
                    oldHtml = oldHtml.replace(order, "<br>");
                    oldHtml = oldHtml.replace(order1, "");
                }
                return oldHtml;
            },

            addInput : function(){
                var numRandom = this.getRand();
                var oldHtml = this.getOldHtml();
                var str = "&nbsp;<input disabled id='control_" + numRandom +"' name='myInput' class='inputClass inClass' />&nbsp; "
                this.nodeFlag.id = "control_"+ numRandom;
                this.insertHtmlAtCaret(str);
                var ele = document.getElementById("control_"+ numRandom);
                if(document.getElementById("editionDiv").innerHTML.indexOf("control_"+ numRandom)<0){
                    LIB.Msg.info("请将光标移到输入框");
                    var parent = ele.parentNode;
                    parent.removeChild(ele);
                    parent.innerHTML = parent.innerHTML.replace(/&nbsp;/g,"");

                    // 以上操作完之后监听事件失效
                    $("#addInput").unbind("click").bind("click", this.addInput);
                    return true;
                }
                // document.getElementById("editionDiv").innerHTML =oldHtml + str;
            },

            // 添加日期
            addSystemTime : function(){
                var numRandom = this.getRand();
                var oldHtml = this.getOldHtml();
                var str = "&nbsp;<input disabled value='____年____月____日' disabled=true id='input_date_" + numRandom +"' name='myInput' class='input_date' />&nbsp;"
                this.nodeFlag.id = "input_date_"+ numRandom;
                this.insertHtmlAtCaret(str);
                var ele = document.getElementById("input_date_"+ numRandom);
                if(document.getElementById("editionDiv").innerHTML.indexOf("input_date_"+ numRandom)<0){
                    LIB.Msg.info("请将光标移到输入框");
                    var parent = ele.parentNode;
                    parent.removeChild(ele);
                    parent.innerHTML = parent.innerHTML.replace(/&nbsp;/g,"");

                    // 以上操作完之后监听事件失效
                    $("#addDaate").unbind("click").bind("click", this.addSystemTime);
                    return true;
                }
                // document.getElementById("editionDiv").innerHTML =oldHtml + str;
            },

            addSystemOperator : function(){
                var numRandom = this.getRand();
                var oldHtml = this.getOldHtml();
                var str = "&nbsp;<input value='' disabled=true id='input_operator_" + numRandom +"' name='myInput' class='inputOperator' />&nbsp;&nbsp;&nbsp;"
                this.nodeFlag.id = "input_date_"+ numRandom;
                this.insertHtmlAtCaret(str);
                var ele = document.getElementById("input_operator_"+ numRandom);
                if(document.getElementById("editionDiv").innerHTML.indexOf("input_operator_"+ numRandom)<0){
                    LIB.Msg.info("请将光标移到输入框");
                    var parent = ele.parentNode;
                    parent.removeChild(ele);
                    parent.innerHTML = parent.innerHTML.replace(/&nbsp;/g,"");

                    // 以上操作完之后监听事件失效
                    $("#addOperate").unbind("click").bind("click", this.addSystemOperator);
                    return true;
                }
                // document.getElementById("editionDiv").innerHTML =oldHtml + str;
            },


            getLastNode: function () {
                this.nodeFlag = window.getSelection();
            },
            insertLastNode:function (html) {

            },

            // 获取光标位置 然后插入 标签
            insertHtmlAtCaret :function (html){
                var sel, range;
                if (window.getSelection) {
                // IE9 and non-IE
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();
                        var el = document.createElement("div");
                        el.innerHTML = html;
                        var frag = document.createDocumentFragment(), node, lastNode;
                        while((node = el.firstChild)){
                            lastNode=frag.appendChild(node);
                        }
                        range.insertNode(frag);
                        // Preserve the selection
                        if (lastNode) {
                            range = range.cloneRange();
                            range.setStartAfter(lastNode);
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }
                } else if (document.selection && document.selection.type != "Control") {
                    // IE < 9
                    document.selection.createRange().pasteHTML(html);
                }
            },


            toHtml: function () {
                var str = this.deel(this.editGroupItem) || '';
                if(this.selectIndex>=0){
                    this.groups[this.selectIndex].content = str;
                    var arr = this.groups;
                    this.groups = [];
                    for(var i=0;i<arr.length;i++){
                        this.groups.push(arr[i]);
                    }
                }
            },

            doChangeAllExclude:function(val,a,b){
                val.allExclude = val.allExclude=='1'?'3':'1';
                api.upDateRiskjudgmentGroupName({allExclude:val.allExclude,id:val.id}).then(function (res) {
                    LIB.Msg.info("设置成功");
                })
            },

            // 预览按钮
            previewAction: function () {
                this.showPreview = true;
                var str = document.getElementById("editionDiv").innerHTML;
                this.editGroupItem =this.toMyAttemplate(str);
                this.toHtml();
            },

            getRand: function() {
                var b = parseInt(Math.random()*10000)*100000 + Date.parse(new Date())/1000%10000;
                return b;
            },

            isShowEdition: function(tir,index){
                this.showPreview = false;
                if(index>-1){  // 编辑组
                    this.selectIndex = index;
                    document.getElementById("editionDiv").innerHTML =  this.groups[index].content;
                    document.getElementById("webview").innerHTML =  this.groups[index].content;
                }else if(index==-1){ // 新增组
                    this.selectIndex = -1;
                    document.getElementById("editionDiv").innerHTML = '';
                    document.getElementById("webview").innerHTML =  '';
                }else if(index == -2){ //承诺书
                    this.selectIndex = -2;
                    document.getElementById("editionDiv").innerHTML = this.mypromiseHtml;
                    document.getElementById("webview").innerHTML =  this.mypromiseHtml;
                }
                this.selectModel.editDivModel.visible = true;
            },

            // 将html里面的标签 整成 后端需要的数据
            // textObj 返回值
            // myBox_xx: Object
            // control_xx: Object
            // content: "asdf&nbsp;{input_control_35709251}&nbsp;iiuusfgghsgh&nbsp;{templateCheck_myBox_9509256}&nbsp;"
            toMyAttemplate :function (str) {
                if(str=='') return;
                var textObj={};
                var template = str;
                // 去除div符号
                while(template.indexOf("<div>")>-1 || template.indexOf("</div>")>-1 || template.indexOf("</span>")>-1 || template.indexOf("<span>")>-1){
                    template = template.replace("<div>", "<br>");
                    template = template.replace("</div>", "");
                    template = template.replace("<span>", "");
                    template = template.replace("</span>", "");
                }

                var index = 0;
                // 过滤下拉框
                while(template.indexOf("<select")>-1){
                    var iEle =  document.getElementById("editionDiv").getElementsByTagName("select");
                    var opt = iEle[index].getElementsByTagName("option");
                    var obj = {};
                    obj.list = [];
                    for(var i=0; i<opt.length; i++){
                        obj.list.push(opt[i].innerHTML);
                    }
                    obj.class = iEle[index].className;
                    obj.id = iEle[index].id;
                    obj.value = iEle[index].value;
                    obj.name = iEle[index].name;
                    template = template.replace(/<select.+\/select>/, "{templateSelect_"+iEle[index].id+"}");
                    textObj[obj.id] = obj;
                    index++;
                }
                // 过滤多选框
                index=0;
                while(template.indexOf("mycheckBox")>-1){
                    var obj = {};
                    var iEle = document.getElementById("editionDiv").getElementsByTagName("p");
                    var opt = iEle[index].getElementsByTagName("input");
                    obj.list = [];
                    obj.value = [];
                    for(var i=0; i<opt.length; i++){
                        obj.list.push(opt[i].value);
                        if(opt[i].checked == true){
                            obj.value.push(opt[i].value);
                        }
                    }
                    obj.class = iEle[index].className;
                    obj.id = iEle[index].id;
                    obj.name = iEle[index].name;
                    template = template.replace(/<p .+?mycheckBox.+?\/p>/, "{templateCheck_"+iEle[index].id+"}");
                    textObj[obj.id] = obj;
                    index++;
                }

                // 过滤输入框
                index=0;
                while( template.indexOf("<input")>=0 && template.indexOf("mycheckBox")<0){
                    var obj ={};
                    // var iEle = document.getElementsByName("myInput");
                    var iEle = $('#editionDiv').find('input[name="myInput"]');

                    obj.class = iEle[index].classList.value;
                    obj.id = iEle[index].id;
                    obj.value = iEle[index].value;
                    obj.name = iEle[index].name;
                    template = template.replace(/<input.+?>/, "{input_"+iEle[index].id+"}");
                    textObj[obj.id] = obj;
                    index++;
                }
                textObj.content = template;
                return textObj;
            },

             // 将textObj直接 转换成 html 标签
             deel : function(textObj) {
                 if(!textObj || textObj.content == '') return '';

                 var template = textObj.content;
                 for(var item in textObj){
                    if(item == "content") continue;
                    // 过滤input
                    if(template.indexOf("{input_"+textObj[item].id+"}")>-1){
                        var str = "<input  disabled value='"+textObj[item].value+"' id='"+textObj[item].id+"' name='"+textObj[item].name+"' class='"+textObj[item].class+"' />"
                        var order = '{input_'+item +"}";
                        template = template.replace(order, str);
                    }
                    // 过滤select
                    if(template.indexOf("templateSelect_"+textObj[item].id)>-1){
                        var str = "<select disabled value='"+textObj[item].value+"' id='"+textObj[item].id+"' name='";
                        str+= textObj[item].name+"' class='"+textObj[item].class+"' >"
                        for(var i=0; i<textObj[item].list.length; i++){
                            str+= "<option>"+textObj[item].list[i]+"</option>"
                        }
                        str+="</select>"
                        var order = '{templateSelect_'+textObj[item].id+"}";
                        template = template.replace(order, str);
                    }
                    // 过滤多选框
                    if(template.indexOf("templateCheck_"+textObj[item].id)>-1){
                        var str = "<p  contenteditable='false' class='"+textObj[item].class+"'" + "name='mycheckBox' id='"+textObj[item].id+"'  >";
                        for(var i=0; i<textObj[item].list.length;i++){
                            // str += "<span>"
                            str+= textObj[item].list[i] + "<input disabled type='checkBox' value='"+textObj[item].list[i]+"'  />";
                            // var order = 'templateSelect_'+textObj[item].id;
                            // str += "</span>"
                        }
                        str+="</p>";
                        var order = '{templateCheck_'+textObj[item].id+"}";
                        template = template.replace(order, str);
                    }
                }
                return template;
            },
            // 研判人员列表
            getRiskDetail:function(index){
                var _this = this;
                _this.mainModel.riskJudgmentUnits = [];

                var param = {
                    "riskJudgmentLevel.id":_this.riskJudgmentLevelList[index].id,
                    // criteria:{strValue:{keyWordValue:this.mainModel.filterKey}}
                    "criteria.strValue":{"keyWordValue":this.mainModel.filterKey}
                }

                api.queryRiskDetail(param).then(function (res) {
                    // _this.mainModel.riskJudgmentUnits = res.data.riskJudgmentUnits;
                    _this.mainModel.riskJudgmentUnits = res.data
                })
            },
            
            doChangeTemplete:function (nVal) {
                var _this = this;
                _this.templeteIndex = nVal;
                var arr = _.filter( _this.oldLists.riskJudgmentGroups, function (val) {
                    if(val.riskJudgmentTempleteId == _this.riskJudgmentTempletes[nVal].id){
                        return true;
                    }
                });
                this.uploadModel.params.recordId = _this.riskJudgmentTempletes[nVal].id;
                this.getFileList(this.uploadModel.params.recordId);
                _this.initGroup(arr);
                _this.initPromise(_this.riskJudgmentTempletes[nVal]);
            },

            queryRiskjudgmentGroup:function(index){
                var _this = this;
                _this.mainModel.riskJudgmentLevel = newRiskJudgmentLevel();
                _this.levelId = _this.riskJudgmentLevelList[index].id;
                api.queryRiskjudgmentGroup({ids:_this.riskJudgmentLevelList[index].id}).then(function (res) {
                    _this.riskJudgmentTempletes = res.data[0].riskJudgmentTempletes;
                    _this.getFileList(_this.riskJudgmentTempletes[0].id);
                    _this.oldLists = res.data[0];
                    _this.uploadModel.params.recordId = _this.riskJudgmentTempletes[0].id;
                    var arr = _.filter(_this.oldLists.riskJudgmentGroups, function (val) {
                        if(val.riskJudgmentTempleteId == _this.riskJudgmentTempletes[_this.templeteIndex].id){
                            return true;
                        }
                    });
                    _this.initGroup(arr);
                    _this.initPromise(_this.riskJudgmentTempletes[_this.templeteIndex]);
                    _this.mainModel.riskJudgmentLevel = res.data[0];
                })
            },

            getGroupsList:function(){

            },

            initPromise: function(data){
                var promise = '';
                var config = {};
                this.mypromise = {};
                if(data && data.promise){
                    promise  = data.promise;
                }else{
                    this.mypromiseHtml = ' ';
                    return;
                }
                if(data.riskTemplateConfig && data.riskTemplateConfig.content){
                    config = JSON.parse(data.riskTemplateConfig.content);
                    for(var item in config){
                        this.mypromise[item] = config[item];
                    }
                }
                this.mypromise["content"] = promise;
                this.mypromiseHtml = this.deel(this.mypromise);
            },

            doShowUserSelectModal: function () {
                // var orgIds = _.pluck(this.mainModel.vo.depts, "id");
                this.selectModel.userSelectModel.visible = true;
                this.selectModel.userSelectModel.filterData = {compId: this.compId};
            },

            doAddRiskjudgmentunit:function () {
                var _this = this;
                this.$refs.info2ruleform.validate(function (valid) {
                    if(valid) {
                        var users = _.each(_this.mainModel.vo.users,function (item) {
                            return item.id;
                        })
                        var depts = _.each(_this.mainModel.vo.depts,function (item) {
                            return item.id;
                        });
                        //  判断是否被关联
                        var arr = [];
                         _.each(_this.mainModel.riskJudgmentUnits, function (data) {
                            arr = arr.concat(data.subordinateUnits);
                        });
                        
                        var obj = {
                            users:users,
                            subordinateUnits: depts,
                            riskJudgmentLevel:{
                                id:_this.riskJudgmentLevelList[_this.checkedDepartmentIndex].id
                            },
                            name:_this.mainModel.vo.deptName,
                            riskJudgmentTempleteId:_this.mainModel.vo.riskJudgmentTemplete[0].id
                        }
                        if(_this.upDateOrPost ==1){
                            api.riskjudgmentunit(obj).then(function (res) {
                                LIB.Msg.info("保存成功");
                                _this.doSelectDepartment(_this.checkedDepartmentIndex);
                                _this.selectModel.showUserAddModal = false;
                            })
                        }else if(_this.upDateOrPost == 2){
                            obj.id =_this.upDateId;
                            api.riskjudgmentunitUpdate(obj).then(function (res) {
                                LIB.Msg.info("保存成功");
                                _this.doSelectDepartment(_this.checkedDepartmentIndex);
                                _this.selectModel.showUserAddModal = false;
                            })
                        }
                    }
                });
            },

            // 绑定复制的监听事件
            initListen: function (e) {
                (e.clipboardData || window.clipboardData).clearData('Text');
                var str = (e.clipboardData || window.clipboardData).getData('text');
                str = str.replace(/<.+?>/g, "");
                str = str.replace(/\(\)/g, "");
                str = str.replace(/\(/g, "（");
                str = str.replace(/\)/g, "）");
                var a = [];
                var arr = [];
                a = str.match(/（(.+?□.+?)）/g);
                if(_.isArray(a)){
                    arr = copyCheckBox(a);
                }
                var index = 0;
                while(str.indexOf("□")>-1){
                    if(arr[index]){
                        str = str.replace(/（.+?□.+?）/,arr[index]);
                        index++;
                    } else{
                        break;
                    }
                }
                // 过滤 _  下划线为 input框
                while(str.indexOf("_______")>-1){
                    str = str.replace(/_______/, copyInput());
                }
                while(str.indexOf("______")>-1){
                    str = str.replace(/______/, copyInput());
                }
                while(str.indexOf("_____")>-1){
                    str = str.replace(/_____/, copyInput());
                }
                while(str.indexOf("____")>-1){
                    str = str.replace(/____/, copyInput());
                }

                while(str.indexOf("___")>-1){
                    str = str.replace(/___/, copyInput());
                }
                while(str.indexOf("__")>-1){
                    str = str.replace(/__/, copyInput());
                }
                // while(str.indexOf("_")){
                //     str = str.replace(/___/g, copyInput());
                // }

                const selection = window.getSelection();
                // Cancel the paste operation if the cursor or highlighted area isn't found
                if (!selection.rangeCount) return false;
                var div = document.createElement("span");
                div.innerHTML = str;
                // Paste the modified clipboard content where it was intended to go
                selection.getRangeAt(0).insertNode(div);

                var that = this;

                function getRand  () {
                    var b = parseInt(Math.random()*1000)*100000 + Date.parse(new Date())/1000%10000;
                    return b;
                }

                function copyInput(){
                    var numRandom = getRand();
                    var str = "&nbsp;<input id='control_" + numRandom +"' name='myInput' class='inputClass inClass' />&nbsp; "
                    return str;
                }

                function copyCheckBox(arr){
                    var result = []
                    for(var index=0; index<arr.length; index++){
                        var numRandom = getRand();
                        if(arr[index].indexOf("□")<0){
                            continue;
                        }
                        arr[index] = arr[index].replace(/（/g, "");
                        arr[index] = arr[index].replace(/）/g, "");
                        var els = arr[index].split("□");
                        var str = "&nbsp;(<p style='display:inline-block;' class='check' id='myBox_" + numRandom+"' name='mycheckBox' contenteditable='false' > ";

                        for(var i=0; i<els.length; i++){
                            if(els[i]!='' && els[i] && els[i] !=" " ){
                                str+=  els[i] +" <input disabled  type='checkBox' name='checkBoxInput' value='"+els[i]+"' />";
                            }
                        }
                        str+= "</p>)&nbsp;";
                        result.push(str);
                    }
                    return result;
                }
            },

            // 初始化方法
            _init: function () {
                this.mainModel.filterKey = '';
                this.riskJudgmentUnits = null;
                this.groups = null;
                // 左侧导航栏 等级的显示
                this.mainModel.riskJudgmentLevel = newRiskJudgmentLevel();

                // 顶部 研判内容跟研判人员的切换
                this.checkedTabId = '1';

                if(this.isEdit == 1){
                    this.mainModel.title = "设置"
                }else{
                    this.mainModel.title = "查看"
                }
                // this.isShowEdit = false;
                this.selectType = 0;
                this._getList();
            },

            // ------------------- 文件 ---------------------
            uploadClicked: function () {
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                this.mainModel.vo.cloudFiles.push(con);
                LIB.globalLoader.hide();
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
            },
            removeFile: function (fileId, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: "确定删除文件？",
                    onOk: function() {
                        api.deleteFile(null, [fileId]).then(function () {
                            _this.mainModel.vo.cloudFiles.splice(index, 1);
                        })
                    }
                });
            },
            doClickFile: function (index) {
                var files = this.mainModel.vo.cloudFiles;
                var file = files[index];
                // var _this = this;

                window.open(LIB.convertFilePath(LIB.convertFileData(file)))

                // 如果是图片
                // if (_.includes(['png', 'jpg', 'jpeg'], file.ext)) {
                //     images = _.filter(files, function (item) {
                //         return _.includes(['png', 'jpg', 'jpeg'], item.ext)
                //     });
                //     this.images = _.map(images, function (content) {
                //         return {
                //             fileId: content.id,
                //             name: content.orginalName,
                //             fileExt: content.ext
                //         }
                //     });
                //     setTimeout(function () {
                //         _this.$refs.imageViewer.view(_.findIndex(images, "id", file.id));
                //         // _this.$refs.imageViewer.view(0)
                //     }, 100);
                // } else {
                //     window.open("/file/down/" + file.id)
                // }
            },
        },

    });

    return detail;
});