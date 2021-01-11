define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit.html");
    //弹框

    var newVO = function () {
        return {
            id:null,
            lookUpValue:null, // 资质证书
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
        mainModel: {
            vo: newVO(),
            opType: "",
            fileList:[]
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
            "lookUpValue" : [LIB.formRuleMgr.require("请选择任职/资质证书")],
            "certificateNo" : [LIB.formRuleMgr.length(50)],
            "expirationDate": [LIB.formRuleMgr.length(100),LIB.formRuleMgr.require("证书有效期")],
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

        },
        watch: {
            visible:function (val) {
            }
        },
        methods: {
            getUUId:function () {
                var _this = this;
                _this.mainModel.vo = newVO();
                api.getUUID().then(function(res){
                    _this.mainModel.vo.id = res.data;
                    _this.uploadModel.params.recordId = _this.mainModel.vo.id;
                });
            },

            initFun:function (val) {
                var _this = this;
                if(val){
                    this.mainModel.opType = "update";
                    this.mainModel.vo = _.cloneDeep(val);
                    _this.uploadModel.params.recordId = _this.mainModel.vo.id;

                }else{
                    this.mainModel.opType = "create";
                    this.getUUId();
                }
            },

            doSave:function () {
                var _this = this;
                if(this.checkList && this.checkList(_this.mainModel.vo)==false) return;
                this.$refs.ruleform.validate(function(valid) {
                        if (valid) {
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
        }
    });

    return detail;
});