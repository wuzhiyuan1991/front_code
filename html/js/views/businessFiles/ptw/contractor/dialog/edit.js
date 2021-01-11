define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit.html");
    //弹框

    var newVO = function () {
        return {
            lookUpVal:null,
            lookUpId:'',
            id:null,
            lookUpValue:null, // 资质证书
            lookUpValueAdd:null, // 添加资质证书
            certificateNo:null, // 编号
            contractorEmpId:null,  // 员工id
            contractorId:null,  // 承包商id
            type:1, // 0承包商资质,1员工资质,2工种
            expirationDate:null,
            fileList:[]
        }

    };

    //数据模型

    var dataModel = {
        arr: [],
        sureId:null,
        industryList: null,
        industryList2: null,
        mainModel: {
            vo: newVO(),
            opType: "",
            fileList:[]
        },
       addModel : {
            show : false,
            title:'新增'
            },
        // 文件参数
        uploadModel: {
            params: {
                recordId: null,
                dataType: 'EM1',
                fileType: 'EM'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,ppt,pptx"}]
            },
        },

        rules: {
            // "lookUpValue" : [{type:"array", required: true, message:"请选择任职/资质证书"}],
            "lookUpValue" : [LIB.formRuleMgr.require("任职/资质证书")],
            "certificateNo" : [LIB.formRuleMgr.length(50)],
            "expirationDate": [LIB.formRuleMgr.length(100),LIB.formRuleMgr.require("证书有效期")],
        },
        rules1: { 
            "lookUpValueAdd" : [LIB.formRuleMgr.length(200),LIB.formRuleMgr.require("任职/资质证书")],
        },
    }


    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: tpl,
        props:{
            visible:{
                default:true
            },
            title:{
                type:String,
                default:null
            },
            checkList:{
                default:null
            }
        },
        components: {

        },
        data: function () {
            return dataModel;
        },
        computed: {
            // industryName: function () {
                
            //     // $('.ivu-checkbox-wrapper span').removeClass('ivu-checkbox-checked')
			// 	var _this = this;
			// 	var industry = _.find(this.industryList, function (item) {
			// 		return item.id === _this.mainModel.vo.lookUpValue
            //     })
			// 	return industry ? industry.value : ''
            // }
        },
        watch: {
            visible:function (val) {
            },
        },
        methods: {
           
            doAdd1:function(){
             
             var _this=this
                this.addModel.show=true
               
                // api.createLookupCode({code:'iptw_cert'}).then(function(res){
                //     _this.mainModel.vo.lookUpId= res.data.id
                // })
            },
            doClose1:function(){
                
                this.addModel.show=false
            },
            getUUId:function () {
                
                var _this = this;
                _this.mainModel.vo = newVO();
                api.getUUID().then(function(res){
                    _this.mainModel.vo.id = res.data;
                    _this.uploadModel.params.recordId = _this.mainModel.vo.id;
                });
              
            },
            getData:function(arr){
                // [
                //     ["1","应拉断路器、隔离开关"],
                //     ["2","应装接地线、应合接地刀闸"],
                //     ["3","应设遮栏、应挂标示牌及防止二次回路误碰等措施"],
                //     ["4","工作条件"],
                //     ["5","注意事项"],
                //     ["6","操作项目"],
                //     ["7","工作地点保留带电部分或注意事项"]
                // ]
                LIB.registerDataDic("iptw_cert",arr);
            },
            getLookup:function(){
                
                var _this=this
                api.createLookupCode({code:'iptw_cert'}).then(function(res){
                    _this.mainModel.vo.lookUpId= res.data.id
                    api.updataLookup({id:_this.mainModel.vo.lookUpId}).then(function(res){
                        var data=res.data.list
                        data = _.map(data, function (item) {
                            return {
                                id: item.name,
                                label: item.value,
                            }
                        });
                     
                        var arr = _.map(data, function (item) {
                            return [
                                item.id,
                                item.label
                            ]
                        });
                        _this.arr = arr;
                        _this.mainModel.vo.lookUpVal=data
                        _this.industryList2=_.cloneDeep(data)
                    })
                });
                   
            },
            initFun:function (val) {
                var _this = this;
                if(val){
                    this.mainModel.opType = "update";
                    // this.getUUId();
                    this.mainModel.vo = _.cloneDeep(val);
                    this.mainModel.vo.lookUpVal=_.cloneDeep(this.industryList2);
                    this.uploadModel.params.recordId = this.mainModel.vo.id;
                    this.sureId= this.mainModel.vo.id;
                    this.getLookup();

                }else{
                    this.mainModel.opType = "create";
                    this.getUUId();
                    this.getLookup();
                }
            },
            doSave1:function(){
                
                var _this=this
                this.$refs.ruleform1.validate(function(valid) {
                    if (valid) {
                        api.createLookup({id:_this.mainModel.vo.lookUpId},{value:_this.mainModel.vo.lookUpValueAdd}).then(function(res){ 
                            // _this.getLookup();
                            var arr = _this.getDataDicList('iptw_cert')
                          
                            _this.mainModel.vo.lookUpVal.push({id: res.data.name, label: res.data.value});
                            _this.mainModel.vo.lookUpValue=res.data.name;
                            _this.arr.push([res.data.name, res.data.value])
                            _this.getData(_this.arr);
                            _this.addModel.show=false
                            // $('.ive-tree .custom-vi-tree-item>ul').children("li:last-child").children("div").children("label").children("span")[0].className= "ivu-checkbox ivu-checkbox-checked"
                        })
                        _this.mainModel.vo.lookUpValueAdd=''
                      
                    }
            })
            },
            doSave:function () {
                var _this = this;
                // if(this.checkList && this.checkList(_this.mainModel.vo)==false) return ;
                this.$refs.ruleform.validate(function(valid) {
                        if (valid) {
                            // _this.mainModel.vo.id=_this.sureId
                            if( _this.mainModel.opType == "update"){
                                _this.$emit("do-update", _this.mainModel.vo)
                            }else{
                                _this.$emit("do-add", _this.mainModel.vo)
                            }
                            _this.visible = false;
                        }
                })
              
            },

            // ------------------- 文件 ---------------------
            getFileList:function(id){
                var _this = this;
                api.getFileList({recordId:id}).then(function (res) {
                    _this.mainModel.vo.fileList = res.data;
                })
            },
            uploadClicked: function () {
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                this.mainModel.vo.fileList.push(con);
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
                            _this.mainModel.vo.fileList.splice(index, 1);
                        })
                    }
                });
            },
            doClickFile: function (index) {
                var files = this.mainModel.vo.fileList;
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
        events: {

        },
        ready: function () {
            this.isModalSet = false;
            // console.log(this.getDataDicList('iptw_cert'));
            var _this = this;
			api.queryIndustryList().then(function (res) {
				_this.industryList = res.data.list;
            })
           
            }
    });

    return detail;
});