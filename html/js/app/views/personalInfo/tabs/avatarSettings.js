define(function (require) {
    var LIB = require('lib');
    var api = null;

    //数据模型
    var tpl = require("text!./avatarSettings.html");
    var newVO = function () {
        return {
            id: null,

        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            pictures: [],
            uploadButton: true
        },
        isShowUpload: true,
        //图片判断
        isUploadPic: true,
        //图片
        pictures: {
            params: {
                recordId: null,
                dataType: 'K11',
                fileType: 'E'
            },
            filters: {
                max_file_size: '3mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg,gif,bmp"}]
            }
        },
        //图片显示
        picModel: {
            title: "图片显示",
            show: false,
            id: null
        },
        //图片文件
        faceFile: null,
        //图片访问路径
        faceUrl: null,
    };

    //声明detail组件
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
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            //图片
            doPictures: function (data) {
                //dataModel.mainModel.pictures.push(LIB.convertFileData(data.rs.content));
                dataModel.mainModel.uploadButton = false;
                LIB.user.faceid = data.rs.content.id;
                LIB.user.face = data.rs.content.ctxPath;

                dataModel.faceFile = {faceid: LIB.user.faceid, face: LIB.user.face};

                dataModel.isUploadPic = false;
                var user = {};
                user.faceid = LIB.user.faceid;
                user.face = LIB.user.face;
                user.id = LIB.user.id;
                setTimeout(function () {
                    api.updateUserinfo(user);
                }, 800);

            },
            //删除文件
            doDeleteFile: function (fileId) {
                var _this = this;
                var id = [];
                id[0] = fileId
                LIB.Modal.confirm({
                    title: '确定删除?',
                    onOk: function () {
                        api.deleteFile(null, [fileId]).then(function (data) {
                            var user = {};
                            LIB.Msg.success("删除成功");
                            _this.faceFile = null
                            user.faceid = "";
                            user.face = "";
                            user.id = LIB.user.id;
                            _this.faceUrl = ""
                            dataModel.isUploadPic = true;

                            setTimeout(function () {
                                api.updateUserinfo(user);
                            }, 800);

                        })
                    }
                });
            },
        },
        watch: {
            faceFile: function (val) {
                if (val) {
                    this.faceUrl = LIB.isURL(val.face) ? val.face : LIB.convertPicPath(val.faceid);
                }
               
                this.$dispatch("ev_detailFace", val);
            }
        },
        events: {
            //convert框数据加载
            "ev_picface": function (obj) {
                var _this = this;
                _this.faceFile = obj;
                if (_this.faceFile) {
                    _this.isUploadPic = false
                }
            }
        },
        ready: function () {
            require(["../vuex/api"], function (data) {
                api = data;
            });
        }
    });

    return detail;
});