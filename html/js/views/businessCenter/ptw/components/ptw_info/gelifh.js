define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./gelifh.html");
    var commonApi=require("../../api");
    var propMixins=require("./mixins");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var ptwWorkerSelectModal = require("componentsEx/selectTableModal/ptwWorkerRolesSelectModal");
    var ptwBlindPlateFormModal = require("componentsEx/formModal/ptwBlindPlateFormModal");


    return Vue.extend({
        mixins:[propMixins],
        template: template,
        components:{
            "userSelectModal":userSelectModal,
            "ptwWorkerSelectModal": ptwWorkerSelectModal,
            "ptwBlindPlateFormModal": ptwBlindPlateFormModal,
        },
        data:function(){
            return {
                blindPlateType:'',
                showUserSelectModal:false,
                showUserSelectModal1:false,

                userKeyName:undefined,
                type:undefined,
                process:{},
                mechanical:{},
                electric:{},
                systemMask:{},
                geliffList:[],
                enableIsolator: false,
                showPtwSelectModal : false,
                ptwWorkerFilterData:{
                    type:2,
                    compId: LIB.user.compId
                },
                tableModel:{
                    values:[],
                    columns: [
                        //  LIB.tableMgr.column.cb,
                        //  LIB.tableMgr.column.code,
                        //  LIB.tableMgr.column.disable,
                        {
                            title: "管道设备",
                            fieldName: "pipeName",
                            // orderName: "riskPointType",
                            // renderClass: 'riskPointType textarea',

                            width: 100
                        },
                        {
                            //风险点
                            title: "介质",
                            fieldName: "medium",
                            width: 80
                        },
                        {
                            title: "温度",
                            fieldName: "temperature",
                            width: 80,
                            // render(data) {
                            //     var reg = /^\d+(?:\.\d{0,1})?$/;
                            //    return data.match(reg)  
                            // },
                        },
                        {
                            title: "压力",
                            fieldName: "pressure",
                            // renderClass: 'textarea',
                            width: 80,
                            // render(data) {
                            //     var reg = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/;
                            //    return data.match(reg)  
                            // },
                        },
                        {
                            title: "盲板",
                            width: 240,
                            "children": [
                                {
                                    title: "材质",
                                    fieldName: "texture",
                                    width: 80

                                },
                                {
                                    title: "规格",
                                    fieldName: "specification",
                                    width: 80

                                },
                                {
                                    title: "编号",
                                    fieldName: "number",
                                    width: 80
                                },
                            ]
                        },
                        {
                            title : "",
                            fieldType : "tool",
                            toolType : "edit,del"
                        }
                    ]
                },
                formModel:{
                    type: '',
                    index:'',
                    show: false
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
                        dataType: 'PTW32',
                        fileType: 'I',
                    },
                    events: {
                        onSuccessUpload:true,
                    }
                },
            }
        },
        computed:{
            tableList: function () {
                return this.permitModel.blindPlates || [];
            },
            figureUpModelParams: function () {
                return {
                    recordId:this.permitModel.id,// this.permitModel.id,
                    dataType: 'PTW32',
                    fileType: 'I',
                }
            },
            // //隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
            // process:function () {
            //     return  _.findWhere(this.permitModel.workIsolations,{type:"1"});
            // },
            // mechanical:function () {
            //     return  _.findWhere(this.permitModel.workIsolations,{type:"2"});
            // },
            // electric:function(){
            //     return  _.findWhere(this.permitModel.workIsolations,{type:"3"});
            // },
            // systemMask:function(){
            //     return  _.findWhere(this.permitModel.workIsolations,{type:"4"});
            // },
            // geliffList:function () {
            //     return  this.model.ptwCardStuffs.filter(function (item) {
            //         return  item.type==5;
            //     })
            // },
        },
        created:function(){
           // this.initData();
        },
        methods: {
            getFiles: function (data, type) {
                var files = [];
                _.each(data, function (item) {
                    if (item.dataType == type) {
                        files.push(LIB.convertFileData(item));
                    }
                });
                return files;
            },
            doUploadFigure:function (data) {
                var content= data.rs.content;
                this.permitModel.fileList.push(content);
            },
            doDeleteFile: function (fileId, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除?',
                    onOk: function () {
                        this.$resource("file").delete("file", [fileId]).then(function (data) {
                            if (data.data && data.error != '0') {
                                return;
                            }
                            _this.permitModel.fileList.splice(index, 1);
                            LIB.Msg.success("删除成功");

                        })
                    }
                });
            },
            doRemoveBandPlate: function (obj) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        _this.permitModel.blindPlates.splice(obj.cell.rowId,1);
                    }
                })
            },
            doShowAddBlindPlate: function () {
                this.formModel.type = 'add';
                this.formModel.show = true;
                this.$refs.ptwBlindForm.initData();
            },
            doEditBandPlate: function (obj) {
                this.formModel.type = 'update';
                this.formModel.show = true;
                this.formModel.index = obj.cell.rowId;
                this.$refs.ptwBlindForm.initData(obj.entry.data);
            },
            doSaveBlindPlateVo: function (vo) {
                if(vo.temperature){
                    vo.temperature = parseFloat(vo.temperature).toFixed(1);
                }

                if(this.formModel.type == 'add')
                    this.permitModel.blindPlates.push(vo);
                if(this.formModel.type == 'update')
                    _.extend(this.permitModel.blindPlates[this.formModel.index], vo);
            },
            initData:function(){
                this.process=  _.findWhere(this.permitModel.workIsolations,{type:"1"});
                this.mechanical=  _.findWhere(this.permitModel.workIsolations,{type:"2"});
                this.electric=  _.findWhere(this.permitModel.workIsolations,{type:"3"});
                this.systemMask=  _.findWhere(this.permitModel.workIsolations,{type:"4"});

                if(this.model.enableProcessIsolation==1 ) this.permitModel.enableProcessIsolation='1';
                if(this.model.enableMechanicalIsolation==1 ) this.permitModel.enableMechanicalIsolation='1';
                if(this.model.enableElectricIsolation==1 ) this.permitModel.enableElectricIsolation='1';
                if(this.model.enableSystemMask==1 ) this.permitModel.enableSystemMask='1';
                if(this.model.enableBlindPlate ==1 ) this.permitModel.enableBlindPlate ='1';

                if(this.model.enableProcessIsolation==2 && !this.permitModel.workTpl) this.permitModel.enableProcessIsolation='0';
                if(this.model.enableMechanicalIsolation==2 && !this.permitModel.workTpl) this.permitModel.enableMechanicalIsolation='0';
                if(this.model.enableElectricIsolation==2 && !this.permitModel.workTpl) this.permitModel.enableElectricIsolation='0';
                if(this.model.enableSystemMask==2 && !this.permitModel.workTpl) this.permitModel.enableSystemMask='0';
                if(this.model.enableBlindPlate ==2 && !this.permitModel.workTpl) this.permitModel.enableBlindPlate ='0';


                this.enableIsolator = LIB.getBusinessSetStateByNamePath('ptw.enableWorkRole.enableIsolator',LIB.user.compId);
            },
            changeTpl:function(){
                var _this=this;
                this.$nextTick(function () {
                    _this.initData();
                });
            },
            doSaveBlindPlateUser: function (datas) {
                // this.permitModel.selworkPersonnels[this.blindPlateType] = datas;
                var type = this.blindPlateType;
                this.permitModel.selworkPersonnels[type] = datas.map(function (item) {
                    return {
                        type: type,
                        user: {id: item.id, name: item.name},
                        name:item.name
                    }
                });
            },

            showBlindPlateUser: function (type) {
                this.showUserSelectModal1 =  true;
                this.blindPlateType = type;
            },

            showSelectUser:function(type,userKeyName,workIsolationkey){
                this.type=type+"";
                this.userKeyName=userKeyName;
                if(this.enableIsolator) this.showPtwSelectModal=true;
                else this.showUserSelectModal=true;
                this.workIsolationkey=workIsolationkey||['','process','mechanical','electric','systemMask'][type];
            },
            doSaveUser:function(datas){
                if(datas){
                    var data=datas[0];
                    var item= this[this.workIsolationkey];  //_.findWhere(this.permitModel.workIsolations,{type:this.type});
                    if(!item){
                        var item={type:this.type};
                        Vue.set(this,this.workIsolationkey,item);
                        this.permitModel.workIsolations.push(item);
                    }
                    // Vue.set(item,this.userKeyName,{id:data.id,name:data.name});

                    if(this.enableIsolator) datas = _.map(datas, function (item) {
                        return {
                            id: item.user.id,
                            username: item.user.name,
                            name: item.user.name
                        }
                    });

                    Vue.set(item,this.userKeyName,datas);
                    if(this.userKeyName==="isolators"&&(!item.disisolator||!item.disisolator.id)){
                        // Vue.set(item,"disisolators",{id:data.id,name:data.name});
                        Vue.set(item,"disisolators",datas);
                    }
                }
            },
            changeEnable:function (event,type) {
                var checked =event.target.checked;
                if(checked===true){return}
                var item=_.findWhere(this.permitModel.workIsolations,{type:type});
                if(item){
                item.isolator={};
                item.disisolator={};
                }
            }
        },
        watch:{
            'permitModel':function(){
                this.initData();
            },
        }

    })
})
