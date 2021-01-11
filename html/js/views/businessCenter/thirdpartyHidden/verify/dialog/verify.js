define(function (require) {
    var LIB = require('lib');
	var videoHelper = require("tools/videoHelper");
    //数据模型
    var api = require("../../vuex/api");
    var tpl = require("text!./verify.html");

    var newVO = function () {
        return {
            id: null,
            remark: null,
            poolId: null,
            //判断 弹出框为合格/不合格   100:合格  2:不合格
            status: '100'
        }
    };

    //初始化上传组件RecordId参数
    var initUploadorRecordId = function (recordId) {
        dataModel.pictures.params.recordId = recordId;
        dataModel.videos.params.recordId = recordId;
        dataModel.videoPics.params.recordId = recordId;
    }

    //图片上传后回调方法声明
    var uploadEvents = {
        //图片
        pictures: function (param) {
            var rs = param.rs;
            dataModel.mainModel.pictures.push({fileId: rs.content.id});
        },
        //图片
        videos: function (param) {
            var rs = param.rs;
            dataModel.mainModel.videos.push({fileId: rs.content.id});
        },
        //图片
        videoPics: function (param) {
            var rs = param.rs;
            dataModel.mainModel.videoPics.push({fileId: rs.content.id});
        }
    }

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            pictures: [],
            videos: [],
            files: []
        },
        //验证规则
        rules: {
        	status:[{required: true, message: '请选择验证结果'}],
            remark: [
                {required: true, message: '请输入验证备注'},
                LIB.formRuleMgr.length(500,1)
                //{min: 1, max: 500, message: '长度在 1 到 500 个字符'}
            ]
        },
        verifyModel: {
            //控制编辑组件显示
            title: "验证",
            //显示编辑弹框
            show: false,
            remark: '备注',
            id: null
        },
        //图片
        pictures: {
            params: {
                recordId: null,
                dataType: 'E21'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
            },
            events: {
                onSuccessUpload: uploadEvents.pictures
            }
        },
        //视频
        videos: {
            params: {
                recordId: null,
                dataType: 'E22'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
            },
            events: {
                onSuccessUpload: uploadEvents.videos
            }
        },
        //视频第一帧
        videoPics: {
            params: {
                recordId: null,
                dataType: 'E23'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
            },
            events: {
                onSuccessUpload: uploadEvents.videos
            }
        },
        //附件配置
        files: {
            params: {
                recordId: null,
                dataType: 'F1'
            },
            events: {
                onSuccessUpload: uploadEvents.files
            }
        },
        playModel: {
            title: "视频播放",
            show: false,
            id: null
        },
        picModel: {
            title: "图片显示",
            show: false,
            id: null
        },
        counter:0
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
    	mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                var _this = this;

                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        api.verify(null, _.pick(_this.mainModel.vo, "poolId", "id", "remark", "status")).then(function (res) {
                            if (!res.data || res.data.error == "0") {
                                _this.$dispatch("ev_verifyFinshed");
                                LIB.Msg.info("保存成功");
                            } else {
                                LIB.Msg.warning("保存失败");
                            }
                        });
                    }
                });
            },
            doDeleteImg: function (fileId, index, arrays) {
                var ids = [];
                ids[0] = fileId;
                api._deleteFile(null, ids).then(function (data) {
                    if (data.data && data.error != '0') {
                        LIB.Msg.warning("删除失败");
                        return;
                    } else {
                        arrays.splice(index, 1);
                        LIB.Msg.success("删除成功");
                    }
                });
            },
            doCancel: function () {
                this.$dispatch("ev_verifyCanceled");
            },
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            doPlay: function (fileId) {
                this.playModel.show = true;
                setTimeout(function () {
                	videoHelper.create("player",fileId);
                }, 50);
            },
            doIncr:function(){
                var fileId = [];
                var _this = this ;
                _this.counter = dataModel.mainModel.pictures.length - 1;
                if(dataModel.mainModel.pictures.length > 0){
                        fileId[0] = dataModel.mainModel.pictures[_this.counter].fileId;
                        api._deleteFile(null, fileId).then(function (data) {
                            dataModel.mainModel.pictures.length --;
                            _this.counter--;
                            setTimeout(function(){
                                 _this.doIncr();
                            },2000)
                    });
                };

            },
            doVideosSuccessUpload:uploadEvents.videos,
            doPicSuccessUpload:uploadEvents.pictures,
            convertPicPath: LIB.convertPicPath,
            convertPath: LIB.convertPath
        },
        events: {
            //edit框数据加载
            "ev_verifyReload": function (row, status) {
                this.verifyModel.title = "验证";
                this.verifyModel.remark = "详情";
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = this.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                this.mainModel.pictures = [];
                this.mainModel.videos = [];
                //reform id
                _vo.poolId = row.id;
                _vo.id = row.lastReformId;

                initUploadorRecordId(row.lastReformId);
            },
            //点击关闭的时候 清空上传的视频
            "ev_verifyDelPlay":function(){
                var ids = [];
                var fileId = [];
                var _this = this;
                if(dataModel.mainModel.videos.length > 0){
                    ids[0] =dataModel.mainModel.videos[0].fileId;
                    setTimeout(function(){
                        api._deleteFile(null, ids).then(function (data) {
                            if (data.data && data.error != '0') {
                                return;
                            }
                        });
                    },1000);

                }
                if(dataModel.mainModel.pictures.length > 0){
                    //_.each(dataModel.mainModel.pictures,function(item){
                    //    fileId[0] = item.fileId;
                    //    setTimeout(function(){
                    //        api._deleteFile(null, fileId).then(function (data) {
                    //            if (data.data && data.error != '0') {
                    //                return;
                    //            }
                    //        });
                    //},30000);
                    //})
                    _this.counter = 0;
                    _this.doIncr();
                }

            }
        }
    });

    return detail;
});