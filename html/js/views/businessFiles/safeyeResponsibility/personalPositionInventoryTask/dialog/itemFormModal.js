define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var template = LIB.renderHTML(require("text!./itemFormModal.html"));

    // var vo = {
    //     commitmentId: '',
    //     commitmentTaskId: '',
    //     userId: '',
    //     completeDate: '',
    //     commitmentRecordDetails: [
    //         {
    //             commitmentId: '',//         安全承诺书id
    //             commitmentTaskId: '',//     任务id
    //             actualScore: '',//     实际得分
    //             evaluate: '',//     评价
    //             itemId: '',//     项id
    //             groupId: '',//     组id
    //             groupName: '',//     组名
    //             groupOrderNo: '',//     组排序
    //             itemContent: '',//     项内容
    //             itemScore: '',//     项分值
    //             itemStandard: '',//     项考核标准
    //             itemResult: '',//     项落实结果
    //             itemOrderNo: '' //     项排序
    //         }
    //     ]
    // };

    var newVO = function () {
        return {
            recordId: null, // 记录ID
            commitmentId: null,//         安全承诺书id
            commitmentTaskId: null,//     任务id
            actualScore: null,//     实际得分
            evaluate: null,//     评价
            id: null,//     项id
            groupId: null,//     组id
            groupName: null,//     组名
            groupOrderNo: null,//     组排序
            content: null,//     项内容
            score: null,//     项分值
            standard: null,//     项考核标准
            result: null,//     项落实结果
            orderNo: null, //     项排序
            cloudFiles: []
        }
    };


    var dataModel = {
        mainModel: {
            title: '修改考核结果',
            vo: newVO(),
            rules: {
                "actualScore": [
                    LIB.formRuleMgr.require("实际得分"),
                    {
                        validator: function (rule, value, callback) {
                            var re = /^(([1-9](\d{0,3})?)|0)(\.\d{1,2})?$/;
                            if (Number(value) < 0) {
                                return callback(new Error('实际得分不能小于0'));
                            }
                            if (Number(value) > Number(dataModel.mainModel.vo.score)) {
                                return callback(new Error('实际得分不能大于该项分值'));
                            }
                            if (!re.test(value)) {
                                return callback(new Error('请输入正确的数字格式'));
                            }
                            return callback();
                        }
                    }
                ],
                "evaluate": [LIB.formRuleMgr.length(500)]
            }
        },
        uploadModel: {
            params: {
                recordId: null,
                dataType: 'AQZRZ0',
                fileType: 'AQZRZ'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,ppt,pptx" }]
            }
        },
        images: null
    };



    var opts = {
        mixins : [LIB.VueMixin.dataDic],
        template: template,
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        computed: {},
        data: function () {
            return dataModel
        },
        methods: {
            init: function (params) {
                var _this = this;
                this.mainModel.vo = newVO();

                _.deepExtend(this.mainModel.vo, params);

                this.mainModel.vo.cloudFiles = [];

                if (!this.mainModel.vo.recordId) {
                    api.getUUID().then(function (res) {
                        _this.mainModel.vo.recordId = res.data;
                        _this.uploadModel.params.recordId = res.data;
                    })
                } else {
                    _this.uploadModel.params.recordId = this.mainModel.vo.recordId;
                }
            },



            doSave : function() {
                var _this = this;
                var vo = this.mainModel.vo;
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        _this.$emit("do-save", vo);
                    }
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
            doViewImages: function (index) {
                var files = this.mainModel.vo.cloudFiles;
                var file = files[index];
                var _this = this;

                var images;
                // 如果是图片
                if (_.includes(['png', 'jpg', 'jpeg'], file.ext)) {
                    images = _.filter(files, function (item) {
                        return _.includes(['png', 'jpg', 'jpeg'], item.ext)
                    });
                    this.images = _.map(images, function (content) {
                        return {
                            fileId: content.id,
                            name: content.orginalName,
                            fileExt: content.ext
                        }
                    });

                    setTimeout(function () {
                        _this.$refs.imageViewer.view(_.findIndex(images, "id", file.id));
                    }, 100);
                } else {
                    window.open("/file/down/" + file.id)
                }
            },
        }
    };

    return opts;
});