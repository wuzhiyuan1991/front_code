define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./backNode.html");
    var api = require("../vuex/api");

    //初始化数据模型
    var newVO = function () {
        return {
            rollbackStep:null,
            user:{
                name:LIB.user.name,
                id:LIB.user.id
            },
            operateTime : (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
            effectiveDate:(new Date()).Format("yyyy-MM-dd hh:mm:ss"),
            fileList:[],
            remark:'',
            editDate:(new Date()).Format("yyyy-MM-dd hh:mm:ss")
        }
    };

    var detail = LIB.Vue.extend({
        computed:{
            getList:function () {
                var arr = this.getDataDicList('iem_emer_plan_status');
                var list = [];
                var _this = this;
                if(parseInt(this.vo.type) === 3){
                    _.each(arr, function (item, index) {
                        if(index !== 3 && index!==4 && index < parseInt(_this.vo.status)-1){
                            list.push(item);
                        }
                    })
                }else{
                    _.each(arr, function (item, index) {
                        if(index < parseInt(_this.vo.status)-1){
                            list.push(item);
                        }
                    })
                }
                return list;
            }
        },
        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        components:{
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            vo:{
                type:Object,
                // default:''
            },
        },
        watch:{
            visible:function(val){
                val && this._init()
            }
        },

        data:function(){
            return {
                nodeFlag: {

                }, // 编辑框相关插入操作记录
                mainModel : {
                    title:"详情",
                    vo:newVO(),
                    isReadOnly:true,
                    info2Rules:{
                        // "shipOptions":[{type:'array', required:true, message: '请选择研目的地'}]
                        "remark":[LIB.formRuleMgr.length(500),LIB.formRuleMgr.require("回退操作理由")],
                        "rollbackStep":[LIB.formRuleMgr.length(500),LIB.formRuleMgr.require("回退节点")],
                        "effectiveDate":[]
                    }
                },
                tabs: [

                ],
                tableLists:[],
                selectModel: {
                    cargoPointSelectModel:{
                        visible:false,
                        filterData:{
                            id:''
                        }
                    }
                },
                formModel : {

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
                    // url: "/riskjudgmentunit/importExcel",
                },

            };
        },

        methods:{
            getOperateTime:function (val) {
                var str  = (val + "").substr(0, 16);
                return str;
            },
            //    获取文件
            //    this.getFileList(this.uploadModel.params.recordId);
            _init:function () {
                this.mainModel.vo.shipOptions = null;
                this.mainModel.vo.user = LIB.user.name;

                this.mainModel.vo = newVO();
                this.mainModel.vo.rollbackStep = this.getList[this.getList.length-1].id;

            },
            doSaveSelectPoint:function () {
                var _this = this;
                this.$refs.info2ruleform.validate(function (valid) {
                    if(valid){
                        _this.mainModel.vo.result = '3';
                        _this.$emit("do-save", _this.mainModel.vo);
                        _this.visible = false;
                    }
                })
            },
            doClose:function () {
                this.visible = false;
            },
            doShowCargoPoint:function () {
                this.selectModel.cargoPointSelectModel.filterData.id = this.id;
                this.selectModel.cargoPointSelectModel.visible = true;
            },

            getUUId:function () {
                api.getUUID().then(function(res){
                    var group={};
                    group.id = res.data;

                });
            },

            // ------------------- 文件 ---------------------
            getFileList:function(id){
                var _this = this;
                api.getFileList({recordId:id}).then(function (res) {
                    _this.mainModel.vo.fileList = res.data;
                });
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

                window.open("/file/down/" + file.id)

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
        init: function(){
            this.$api = api;
        }

    });

    return detail;
});