define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var template = require("text!./baseinfo.html");
    var formItemRow = require("./form-item-row");
    var commonApi = require("../../api");
    var model = require("../../model");
    var propMixins = require("./mixins");
    var ptwJsaMasterSelectModal = require("../../js/componentsEx/selectTableModal/ptwJsaMasterSelectModal");
    var contractorEmpSelectModal = require("componentsEx/selectTableModal/contractorEmpSelectModal");
    var  contractorSelectModal= require("componentsEx/selectTableModal/contractorSelectModal");
    var deptSelect =require("views/reportManagement/reportDynamic/dialog/objSelect");/*报表那边的选择组件*/
    var multiInputSelect = require("componentsEx/multiInputSelector/main");
    var selectWorker=require("./selectWorker/main");
    return Vue.extend({
        mixins: [propMixins],
        template: template,
        components: {
            "formItemRow": formItemRow,
            "ptwJsaMasterSelectModal": ptwJsaMasterSelectModal,
            "contractorEmpSelectModal":contractorEmpSelectModal,
            "contractorSelectModal":contractorSelectModal,
             deptSelect:deptSelect,
            multiInputSelect:multiInputSelect,
            selectWorker:selectWorker,
        },
        props:{
            permitModel:{
                type:Object,
                default:null
            },
            pms:{
                type:Object,
                default:null
            },
            model:{
                type:Object,
                default:null
            },
        },
        data: function () {
            return {
                jsonStrList:[],
                showSelect:false,
                showJsaModal: false,
                showContactEmp:false,
                contactEmpModel:{
                    show:false,
                    filterData:{},
                },
                contactModel:{
                    show:false,
                },
                figureUpModel: {//附图
                    files:[],
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{ title: "files", extensions: "png,jpg,jpeg" }]
                    },
                    params: {
                        // 'criteria.strValue': {oldId: null},
                        recordId:"",// this.permitModel.id,
                        dataType: 'PTW3',
                        fileType: 'L'
                    },
                    events: {
                        onSuccessUpload:true,
                    }
                },
                planUpModel: {//应急预案
                    params: {
                        recordId:"",// this.permitModel.id,
                        dataType: 'PTW2', //检查方法数据来源标识(参考资料)
                        fileType: 'I',
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt,mp4,avi,flv,3gp" }]
                    },
                    events: {
                        onSuccessUpload:true,
                    }
                },
                schemeUpModel:{
                    params: {
                        recordId:"",// this.permitModel.id,
                        dataType: 'PTW1', //检查方法数据来源标识(参考资料)
                        fileType: 'I',
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt,mp4,avi,flv,3gp" }]
                    },
                    events: {
                        onSuccessUpload:true,
                    }
                },
                otherUpModel:{
                    params: {
                        recordId:"",// this.permitModel.id,
                        dataType: 'PTW4', //检查方法数据来源标识(参考资料)
                        fileType: 'I',
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt,mp4,avi,flv,3gp" }]
                    },
                    events: {
                        onSuccessUpload:true,
                    }
                },
                certificateList:[],
                equipmentList:[],
                isSignRequired4SpecialWorke:false,
            }
        },
        created:function(){
          this.loadList();//加载签发人员
        },
        watch: {
            'permitModel': function (val) {
                this.figureUpModel.params.recordId =val.id;
                this.planUpModel.params.recordId =val.id;
                this.schemeUpModel.params.recordId =val.id;
                this.otherUpModel.params.recordId =val.id;
                if(val){ this.loadList();}
                this.loadJson(val);

            },
        },
        methods: {
            loadJson: function (val) {
                var columnSetting =val.attr3 || this.model.columnSetting;
                if(columnSetting.length > 5){
                    var list = JSON.parse(columnSetting);
                    _.each(this.jsonStrList,function (item) {
                        if(item.dataType=='7' || item.dataType=='8'){
                            item.value = [];
                        }
                        if(item.dataType == '6'){
                            item.value = {value1:null, value2:null}
                        }
                        if(item.dataType == '9'){
                            item.value = {value1:[], value2:[]}
                        }
                    });
                    _.each(list, function (item) {
                        if((item.dataType=='7' || item.dataType=='8')&&!item.value){
                            item.value = [];
                        }
                        if(item.dataType == '6'&&!item.value){
                            item.value = {value1:null, value2:null}
                        }
                        if(item.dataType == '9' &&!item.value){
                            item.value = {value1:[], value2:[]}
                        }
                    });
                    this.$set("jsonStrList", list);
                    this.permitModel.jsonStrList = this.jsonStrList;
                }
            },
            changeTpl:function(){
                var setting = arguments[0].columnSetting
                var _this=this;
                this.$nextTick(function () {
                    _this.loadList(true);
                    _this.loadJson(setting);
                });

            },
            loadList:function(){
                //羡慕是获取是否会 特种作业人员/特种设备操作人员需要签字确认
                this.isSignRequired4SpecialWorke=LIB.getBusinessSetByNamePath('ptw.isSignRequired4SpecialWorker').result === '2';
                //下面加载签发人员
                var list=this.permitModel.tempWorkStuffs.certificateList;
                var users=this.permitModel.workPersonnels.filter(function (item) {
                    if(item.contractorEmp){item.user=item.contractorEmp}
                    return   item.certStuffId
                });
                var keyIndex=[];
                list.forEach(function (item) {
                    keyIndex.push(item.id);
                    Vue.set(item,"ptwWorkPersonnels",[]);
                });
                var  tempworkStuffs=this.permitModel.tempWorkStuffs.certificateList;
                users.forEach(function (item) {
                    if(item.cert){
                        var index=keyIndex.indexOf(item.cert.stuffId);
                        if(index>-1){
                            list[index].ptwWorkPersonnels.push(item);
                        }}
                });
                this.certificateList=list;
            },
            doShowSelectWorker:function(index,item){
                this.handlingCertStuff=item;//当前处理的certstuff
                var personels=[];
                var personelsId=[LIB.user.id];
                personels.push({user:{id:LIB.user.id,name:LIB.user.name}});
                var addUsers=function(users){
                    users.forEach(function (item) {
                        if(personelsId.indexOf(item.user.id)===-1){
                            personelsId.push(item.user.id);
                            personels.push(item);
                        }
                    })
                };
                addUsers(this.permitModel.selworkPersonnels['4']);//内部
                addUsers(this.permitModel.selworkPersonnels['5']);//承包商
                addUsers(this.permitModel.selworkPersonnels['6']);//检维修
                //users=users.concat(this.permitModel.selworkPersonnels['4'],this.permitModel.selworkPersonnels['5'])
                if(personels.length===0){
                    LIB.Msg.error("请先选择作业人员");
                    return ;
                }
                this.$refs.selectWorker.init(personels,item.ptwWorkPersonnels);
            },
            doSelectedWorker:function(fworkers){

                var _this=this;
                var  hasPersonIds= this.handlingCertStuff.ptwWorkPersonnels.map(function (item) {
                    return  item.user.id;
                });

                var workers = uniqWorkers(fworkers, 'user');

                workers.forEach(function (item) {
                    if(hasPersonIds.indexOf(item.user.id)===-1){
                        _this.handlingCertStuff.ptwWorkPersonnels.push(item);
                    }
                });
                //this.handlingCertStuff.ptwWorkPersonnels=workers;
                var  workStuffs=this.permitModel.tempWorkStuffs.certificateList;
                var index=_.findIndex(workStuffs,function (item) {
                    return _this.handlingCertStuff.id==item.id;
                })
                var workStuff=workStuffs[index];
                workStuff.ptwWorkPersonnels=this.handlingCertStuff.ptwWorkPersonnels;

                // 去除重复的成员
                function uniqWorkers(arr, key) {
                    var obj = {};
                    var tempArr = [];
                    for(var i=0; i<arr.length; i++){
                        if(!obj[arr[i][key].id]){
                            tempArr.push(arr[i]);
                            obj[arr[i][key].id] = arr[i][key].id;
                        }
                    }
                    return tempArr;
                }

            },
            doSaveJsa: function (seldata) {
                if (seldata) {
                    var data = seldata[0];
                    this.permitModel.jsaMaster = data;
                }
            },
            doShowContactEmp:function(){
                this.contactEmpModel.filterData["criteria.strsValue.contractorId"]=
                    this.permitModel.workContractors.map(function(item){
                        return item.id;
                    })
                this.contactEmpModel.show=true;
                this.$refs.contractEmp.init(-1);
            },
            doShowContactEmp2:function(index){
                this.contactEmpModel.filterData["criteria.strsValue.contractorId"] = null;
                this.contactEmpModel.show=true;
                this.$refs.contractEmp.init(index);

            },
            doSaveContractorEmp:function(selectedDatas, index){
                var _this=this;
                if(index == -1){
                    this.permitModel.selworkPersonnels["5"] = selectedDatas.map(function (item) {
                        return {
                            type: "5",
                            user: {id: item.id, name: item.name},
                        }
                    });
                    this.certificateList.forEach(function(cert){
                        cert.ptwWorkPersonnels.splice(0);
                    })
                }else if(index >-1){
                    var arr = _.map(selectedDatas, function (item) {
                        return {
                            id: item.id,
                            name: item.name
                        }
                    });
                    if(this.jsonStrList[index].dataType == '8')
                        this.jsonStrList[index].value = arr;
                    else
                        this.jsonStrList[index].value.value2 = arr;
                }
            },
            doShowContactModel:function(){
                    // this.contactModel.filterData["criteria.intsValue.contractor"]=
                    //     this.permitModel.workContractor.map(function(item){
                    //         console.log("xx",item);
                    //         return item.id;
                    //     })
                    this.contactModel.show = true;
            },
            doSaveContactAll:function(seldata){

                if (seldata) {
                    this.permitModel.workContractors=seldata;
                    // var data = seldata[0];
                    // this.permitModel.workContractor =data;
                    // this.permitModel.attr1=data.id;
                }
            },
            doRemoveWorkContractors:function(item,index){
                this.permitModel.workContractors.splice(index,1);
               // this.permitModel.attr1=undefined;
            },
            doRemoveUserJWX:function(item,index){

            },
            convertFilePath: LIB.convertFilePath,
            doUploadFigure:function (data) {
                var content= data.rs.content;
                this.permitModel.figureFiles.push(LIB.convertFileData(content));
            },
            doUploadPlan:function(data){
                var content= data.rs.content;
                this.permitModel.planFiles.push(LIB.convertFileData(content))
            },
            doUploadOther:function(data){
                var content= data.rs.content;
                this.permitModel.otherFiles.push(LIB.convertFileData(content))
            },
            doUploadScheme:function(data){
                var content= data.rs.content;
                this.permitModel.schemeFiles.push(LIB.convertFileData(content))
            },
            doDeleteFile: function(fileId, index, array) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除?',
                    onOk: function() {
                        commonApi.deleteFile(null, [fileId]).then(function(data) {
                            if (data.data && data.error != '0') {
                                return;
                            } else {
                                array.splice(index, 1);
                                LIB.Msg.success("删除成功");
                            }
                        })
                    }
                });
            },
            updateUserSelectFun:function (arr, index) {
                if(this.jsonStrList[index].dataType == 7)
                    this.jsonStrList[index].value = _.map(arr,function (item) {
                        return {
                            id:item.id,
                            username:item.name
                        }
                    });
                else if(this.jsonStrList[index].dataType == 9){
                    this.jsonStrList[index].value.value1 = _.map(arr,function (item) {
                        return {
                            id:item.id,
                            username:item.name
                        }
                    });
                }
            }
        },
        events: {
            "changeShowSelect" :function () {
                this.showSelect = arguments[0];
            },
            "updateUserSelect" :function () {
                this.updateUserSelectFun(arguments[0], arguments[1])
            }
        }

    })
})
