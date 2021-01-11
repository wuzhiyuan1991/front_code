define(function (require) {
    var LIB = require('lib');
	var videoHelper = require("tools/videoHelper");
    //数据模型
    var api = require("../../vuex/api");
    var tpl = require("text!./reformSuccess.html");

    var newVO = function () {
        return {
            id: null,
            poolId: null,
            dealStep: null,
            emergencyStep: null,
            accepterId: null,
            schedule:null,
            scheduleList:[]
        }
    };

    //初始化上传组件RecordId参数
    var initUploadorRecordId = function (recordId) {
        dataModel.pictures.params.recordId = recordId;
        dataModel.videos.params.recordId = recordId;
        dataModel.files.params.recordId = recordId;
        dataModel.videoPics.params.recordId = recordId;
    }

    //图片上传后回调方法声明
    var uploadEvents = {
        //图片
        pictures: function (param) {
            var rs = param.rs;
            dataModel.mainModel.pictures.push({fileId: rs.content.id});
        },
        //视频
        videos: function (param) {
            var rs = param.rs;
            dataModel.mainModel.videos.push({fileId: rs.content.id});
        },
        //视频第一帧
        videoPics: function (param) {
            var rs = param.rs;
            dataModel.mainModel.videoPics.push({fileId: rs.content.id});
        },
        //文档
        files: function (param) {
            var rs = param.rs;
            dataModel.mainModel.files.push({fileId: rs.content.id});
        }
    }

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            pictures: [],
            videos: [],
            files: [],
            selectDatas: [],
            scheduleList:[]
        },
        //验证规则
        rules: {
            dealStep: [
                {required: true, message: '请输入整改方案'},
                LIB.formRuleMgr.length(500,1)
                //{min: 1, max: 500, message: '长度在 1 到 500 个字符'}
            ],
            emergencyStep: [
                {required: true, message: '请输入临时补救方案'},
                LIB.formRuleMgr.length(500,1)
                //{min: 1, max: 500, message: '长度在 1 到 500 个字符'}
            ],
            scheduleList:[//自定义校验规则
                {
                    required: true,
                    validator:function(rule, value, callback){
                    if(value.length > 0){
                        _.each(value, function(v, k) {
                            if (v.detail == "" || v.detail == null) {
                                 if(value.length == 1){
                                     return callback(new Error("请添加进度详情"));
                                 }else{
                                     value.splice(k,1);
                                 }

                            }
                        });
                        return callback();
                    }else {
                        return callback(new Error("请添加进度详情"));
                    }
                }}
            ],
        },
        //图片
        pictures: {
            params: {
                recordId: null,
                dataType: 'E11',
                fileType: 'E'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
            //},
            //events: {
            //    onSuccessUpload: uploadEvents.pictures
            }
        },
        //视频
        videos: {
            params: {
                recordId: null,
                dataType: 'E12',
                fileType: 'E'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
            //},
            //events: {
            //    onSuccessUpload: uploadEvents.videos
            }
        },
        //视频第一帧
        videoPics: {
            params: {
                recordId: null,
                dataType: 'E13',
                fileType: 'E'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
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
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt"}]
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
        showAdd:true,
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
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            addSchedule:function(){
                this.mainModel.vo.scheduleList.push({detail:'',date:'',operatorId:'',operatorName:''});
                //添加按钮只能添加一次
                this.showAdd = false;
            },
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        // _.each(_this.mainModel.vo.scheduleList, function(v, k) {
                        //     if (v.date == null || v.date == "") {
                        //         v.date = new Date().toLocaleDateString();
                        //     }
                        // });
                        _this.mainModel.vo.schedule = JSON.stringify(_this.mainModel.vo.scheduleList);
                        api.updateReform(null, _.pick(_this.mainModel.vo, "poolId", "id", "dealStep", "emergencyStep","schedule")).then(function (res) {
                            if (!res.data || res.data.error == "0") {
                                _this.$dispatch("ev_reformFinshed");
                                LIB.Msg.info("保存成功");
                            } else {
                                LIB.Msg.warning("保存失败");
                            }
                        });
                     }
                });
            },

            doSubmit: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        // _.each(_this.mainModel.vo.scheduleList, function(v, k) {
                        //     v.date = new Date().toLocaleDateString();
                        // });
                        _this.mainModel.vo.schedule = JSON.stringify(_this.mainModel.vo.scheduleList);
                        api.reformSuccess(null, _.pick(_this.mainModel.vo, "poolId", "id", "dealStep", "emergencyStep","schedule")).then(function (res) {
                            if (!res.data || res.data.error == "0") {
                                _this.$dispatch("ev_reformFinshed");
                                LIB.Msg.info("提交成功");
                            } else {
                                LIB.Msg.warning("提交失败");
                            }
                        });
                    }
                });
            },

            doCancel: function () {
                this.$dispatch("ev_reformCanceled");
            },
            doDeleteFile: function (fileId, index, arrays) {
                var ids = [];
                ids[0] = fileId;
                api._deleteFile(null, ids).then(function (data) {
                    if (data.data && data.error != '0') {
                        LIB.Msg.warning("删除失败");
                        return;
                    } else {
                        arrays.splice(index,1);
                        LIB.Msg.success("删除成功");
                    }
                });
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
            "ev_reformSuccessReload": function (row) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _this = this;
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                //reform id
                this.mainModel.vo.poolId = row.id;
                this.mainModel.vo.id = row.lastReformId;
                this.mainModel.pictures=[];
                this.mainModel.videos=[];
                _this.mainModel.vo.scheduleList = [];
                this.$refs.ruleform.resetFields();
                //添加按钮只能添加一次
                this.showAdd = true;
                api.getReforms({id: row.lastReformId}).then(function (res) {
                    if (res.data && res.status != "200") {
                        LIB.Msg.warning(res.data.message);
                    } else {
                        _this.mainModel.selectDatas.push(res.data.accepterId);
                        if (res.data.schedule) {
                            _this.mainModel.vo.scheduleList = JSON.parse(res.data.schedule);
                        }
                        _.each(res.data.cloudFiles, function (pic) {
                            if (pic.dataType == "E11") {
                                dataModel.mainModel.pictures.push({fileId: pic.id});
                            } else if (pic.dataType == "E12") {
                                dataModel.mainModel.videos.push({fileId: pic.id});
                            }
                        });

                        //初始化数据
                        _.deepExtend(_vo, res.data);
                    }
                });

                initUploadorRecordId(row.lastReformId);
            },
            //点击关闭的时候 清空上传的视频
            "ev_verifyDelPlay":function(){
                var ids = [];
                var fileId = [];
                var _this = this;
                api.getReforms({id:  this.mainModel.vo.id}).then(function (res) {
                    if (res.data && res.status != "200") {
                        LIB.Msg.warning(res.data.message);
                    } else {
                        if (res.data.schedule == null && res.data.dealStep == null && res.data.emergencyStep == null) {
                            if(dataModel.mainModel.videos.length > 0){
                                ids[0] =dataModel.mainModel.videos[0].fileId;
                                setTimeout(function(){
                                    api._deleteFile(null, ids).then(function (data) {
                                        if (data.data && data.error != '0') {
                                            return;
                                        }
                                    });
                                },1000)
                            }
                            if(dataModel.mainModel.pictures.length > 0){
                                //_.each(dataModel.mainModel.pictures,function(item){
                                //    setTimeout(function(){
                                //        fileId[0] = item.fileId;
                                //        api._deleteFile(null, fileId).then(function (data) {
                                //            if (data.data && data.error != '0') {
                                //                return;
                                //            }
                                //        });
                                //        },3000)
                                //})
                                 _this.counter = 0;
                                _this.doIncr();

                            }
                        }
                    }
                })
            }
        }
    });

    return detail;
});