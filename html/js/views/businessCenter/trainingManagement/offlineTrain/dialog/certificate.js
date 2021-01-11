define(function (require) {

    var LIB = require('lib');
    var template = require("text!./certificate.html");
    var api = require("../vuex/api");

    var newVO = function () {
        return {
            id:null,
            pictures:[]
        }
    };

    //图片上传后回调方法声明
    var uploadEvents = {
        //图片
        pictures: function (param) {
            var rs = param.rs;
            dataModel.mainModel.vo.pictures.push({fileId: rs.content.id});
        },
    }
    var dataModel = {
        mainModel:{
            vo: newVO()
        },
        picModel: {
            title: "图片显示",
            show: false,
            id: null
        },
        //图片
        pictures: {
            params: {
                recordId: null,
                dataType: 'T2'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                //},
                //events: {
                //    onSuccessUpload: uploadEvents.pictures
            }
        },
    };

    var initUploadorRecordId = function (recordId) {
        dataModel.pictures.params.recordId = recordId;
    }

    var detail = LIB.Vue.extend({
        template: template,
        data: function () {
            return dataModel;
        },
        methods: {
            _init: function (id) {
                this.mainModel.vo = newVO();
                initUploadorRecordId(id);
                this.mainModel.vo.id = id;
            },
            doPicSuccessUpload: uploadEvents.pictures,
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            doDeleteFile: function (fileId, index, arrays) {
                var ids = [];
                ids[0] = fileId;

                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        api._deleteFile(null, ids).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("删除失败");
                            } else {
                                arrays.splice(index, 1);
                                LIB.Msg.success("删除成功");
                            }
                        });
                    }
                });
            },
            _getFiles: function (id) {
                if (_.isEmpty(id)) {
                    return;
                }
                var _this = this;
                api.listFile({recordId: id,dataType:"T2"}).then(function (res) {

                    var fileData = res.data;
                    //初始化图片数据
                    var pictures = [];
                    _.each(fileData, function (pic) {
                        pictures.push({fileId: pic.id});
                    });
                    _this.mainModel.vo.pictures = pictures.concat();

                });
            },
            convertPath: LIB.convertPath,
            doClose: function () {
                this.visible = false;
            }
        },
        events: {
            "ev_certificate_detail": function (id) {
                this._init(id);
                this._getFiles(id);
            }
        }
    });

    return detail;
});