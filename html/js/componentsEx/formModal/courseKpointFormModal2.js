define(function (require) {
    var LIB = require('lib');
    var BASE = require('base');
    var polyvUploadModule = require('views/businessFiles/trainingManagement/course/uploadify/polyv-upload.min');
    var PolyvUpload = polyvUploadModule ? polyvUploadModule.PolyvUpload : undefined;
    //数据模型
    var tpl = require("text!./courseKpointFormModal2.html");
    var api = require("views/businessFiles/trainingManagement/course/vuex/api");

    //初始化数据模型
    var newVO = function () {
        return {
            //
            id: null,
            //节点名称
            name: null,
            code: null,
            ////文本
            //content : null,
            ////禁用标识， 1:已禁用，0：未禁用，null:未禁用
            //disable : null,
            // 1视频 2音频 3图片 4word 5excel 6ppt 7pdf
            fileType: '1',
            ////是否可以试听1免费2收费
            //isFree : null,
            ////节点类型 0文件目录 1视频
            kpointType: "0",
            courseType: 0,
            cloudFile: {id: '', name: ''}, // 课件地址
            videoUrl: null,
            videoType: "PLOYV",
            parentId: null,
            paperIds: [],//存放新选择的试卷id
            papers: [],
            videoModel: {
                showVideoUploader: false,
                kpointType: "1",
                videoUrl: null,
                fileType: '1', // 课件类型，用做form表单校验, 默认视频类型
            },
            playTime: null,

            ////直播开始时间
            //liveBeginTime : null,
            ////直播结束时间
            //liveEndTime : null,
            ////直播地址
            //liveUrl : null,
            ////页数
            //pageCount : null,
            ////课后作业版本号（更新次数）
            //paperVersion : null,
            ////播放次数
            //playCount : null,
            ////播放时间
            //playTime : null,
            ////视频类型
            //videoType : null,
            ////视频地址
            //videoUrl : null,
            ////修改日期
            //modifyDate : null,
            ////创建日期
            //createDate : null,
            ////课程
            course: {id: '', name: ''},
            //用来做name的桥接
            chapterName: null,
            ////试卷
            //examPapers : [],
        }
    };
    //图片上传后回调方法声明
    var uploadEvents = {
        courseware: function (file, rs) {
            dataModel.mainModel.vo.cloudFile = {id: rs.content.id};
        },
        //参考资料
        referMater: function (file, rs) {
            dataModel.referenceMaterials.push({fileId: rs.content.id, orginalName: rs.content.orginalName});
        }
    };
    //初始化上传组件RecordId参数
    var initUploadorRecordId = function (recordId) {
        dataModel.coursewareModel.params.recordId = recordId;
        //dataModel.referMaterModel.params.recordId = recordId;
    };
    var FILE_FILTER_TYPE = {
        1: 'avi,wmv,mp4;mp3,mov,flv,mkv,rmvb',// 视频
        2: 'wav,midi,cda,mp3',  // 音频
        3: 'png,jpg,jpeg,bmp',    	// 图片
        4: 'doc,docx,word',        // word
        5: 'xls,xlsx',        // excel
        6: 'ppt,pptx',        // ppt
        7: 'pdf'       // pdf
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'create',
            isReadOnly: false,
            title: "添加",
            videoTypeList: [{type: "POLYV", name: "云视频"}],
            url: null,
            //验证规则
            rules: {
                "name": [LIB.formRuleMgr.require("目录名称"), LIB.formRuleMgr.length(20, 1)],
                "kpointType": [{required: true, message: '请选择节点类型'}],
                "chapterName": [LIB.formRuleMgr.require("章节名称"), LIB.formRuleMgr.length(20, 1)],
                videoModel: [
                    {
                        validator: function (rule, value, callback) {
                            if (value.fileType == '1'
                                && value.showVideoUploader
                                && value.kpointType == 1
                                && (value.videoUrl == null || value.videoUrl == "")) {
                                return callback(new Error('请上传视频'));
                            }
                            return callback();
                        }
                    }
                ],
                "cloudFile.id": [LIB.formRuleMgr.require("课件")]

            },
            emptyRules: {},
            filtersRules: '', // 过滤规则
        },
        selectModel: {
            // examPaperSelectModal : {
            // 	visible : false,
            // 	filterData : {"criteria.strsValue.excludeId":null}
            // },
        },
        isSelectedUploadPolyvVideoFile: false,
        uploader: null,
        // 是否能播放flash,默认为允许
        isCanPlayFlash: true,
        coursewareModel: {
            params: {
                'criteria.strValue': {oldId: null},
                recordId: false,
                dataType: 'L3',
                fileType: 'L'
            },
            filters: {
//                max_file_size: '20mb',
                //mime_types: [{title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,word"}]
            },
            events: {
                onSuccessUpload: uploadEvents.courseware
            },
            fileExt: '',

        },
        videoUploadModel: {
            params: {
            },
            filters: {
                max_file_size: '500mb',
                mime_types: [{
                    title: "files",
                    extensions: "avi,wmv,mp4,mp3,mov,flv,mkv,rmvb"
                }]
            },
            events: {
                onSuccessUpload: true,
            }
        },
        courseIdUrl: '', 		// 图片地址
        coursewareFileName: '', // 课件文件名称
        isUploading: false,
        uploadProgress: 0,
        videoTypeList: [
            {id: '1', label: '上传本地视频'},
            {id: '2', label: '引用保利威视频课程资源'}
        ],
        videoType: '1',
        addedFileName: '',
        videoHash:null//上传保利威视频时用于覆盖原视频
    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components: {},
        computed: {
            'progressStyle': function () {
                return {
                    "width": this.uploadProgress + "%"
                }
            },
            'selectStyle': function () {
                return {
                    "width": this.videoType === '1' ? "200px" : "260px",
                    "z-index": 2
                }
            }
        },
        data: function () {
            return dataModel;
        },
        watch: {
            'visible': function (val) {
                if(val) {
                    this.initState();
                }
            },
            'mainModel.vo.videoUrl': function (val, oldVal) {
                this.mainModel.vo.videoModel.videoUrl = val;

                if(this.mainModel.vo.fileType == 1 && val && val.length >= 32) {
                    this.videoHash = val.substring(0,32);
                }
            },
            'videoType': function (val) {
                var $upload = document.getElementById("video-upload-box").querySelector('.uploadify-queue');
                if(!$upload) {
                    return;
                }
                if(val === '1') {
                    $upload.style.display = 'flex';
                } else {
                    $upload.style.display = 'none';
                }
            }
        },
        methods: {
            initState: function () {
                this.videoType = '1';
                this.addedFileName = '';
                this.videoHash = null;
                this.$refs.ruleform.resetFields();
            },
            newVO: newVO,
            /**
             * 更改课件类型
             * @param fileType 文件类型
             * @param isInit
             */
            doFileTypeChange: function (fileType, isInit) {
                var ext = FILE_FILTER_TYPE[fileType];
                this.coursewareModel.filters.mime_types = [{title: "file", extensions: ext}];
                this.coursewareModel.filters.max_file_size = '20mb';
                this.mainModel.filtersRules = ext;
                this.coursewareModel.fileExt = ext;
                this.mainModel.vo.videoModel.fileType = fileType;
                if (isInit !== 'init') {
                    this.mainModel.vo.videoUrl = null;
                    this.courseIdUrl = '';
                    this.mainModel.vo.cloudFile.id = '';
                    this.doRemoveFileFromQueue();
                }
                // 切换时清除视频文件
                if ($(".uploadify-queue-item").length > 0 && this.mainModel.vo.fileType !== '1') {
                    $('#polyvFileUpLoad').uploadify('cancel');
                }
            },
            doUploadCourseware: function (data) {
                var cloudFile = data.rs.content;
                this.mainModel.vo.cloudFile = {id: cloudFile.id};
                initUploadorRecordId(this.mainModel.vo.cloudFile.id);
                this.courseIdUrl = cloudFile.orginalName;
                this.coursewareFileName = cloudFile.orginalName;
            },
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {

                        if (_this.mainModel.vo.chapterName) {
                            _this.mainModel.vo.name = _this.mainModel.vo.chapterName;
                        }
                        if (this.autoHide) {
                            _this.visible = false;
                        }
                        if (_this.mainModel.opType == "create") {
                            _this.$emit("do-save", _.omit(_this.mainModel.vo, "chapterName"));
                        } else if (_this.mainModel.opType == "update") {
                            _this.$emit("do-update", _.omit(_this.mainModel.vo, "chapterName"));
                        }
                    }
                });
            },
            initUploader: function () {
                var _this = this;
                $.ajax({
                    url: BASE.ctxpath + '/polyv/uploadsettings',
                    type: 'get',
                    dataType: 'json',
                    data: {},
                    async: false,
                    success: function (result) {
                        if (result.error == "0") {
                            var data = result.content;
                            if (_.isEmpty(data.cataid)) {
                                LIB.Msg.warning("尚未指定上传目录，请联系运维人员！");
                                return false;
                            }
                            var obj = {
                                uploadButtton: 'polyvFileUpLoad',
                                userid: data.userid,
                                ts: data.ts,
                                hash: data.hash,
                                sign: data.sign,
                                cataid: data.cataid,
                                fileLimit: "500M",
                                fileNumberLimit: 1,
                                width: 900,
                                height: 500,
                                fileNumberLimitTips: "每次只能上传一个视频",
                                defaultTagPlaceholder:"1111111",
                                defaultDescPlaceholder:"222222",
                                luping: 1,
                                component: 'uploadList', // 可以设置为videoList（只显示视频列表）、 uploadList（只显示上传列表）、all（默认值，显示上传列表和视频列表）
                                // luping: 1,//开启视频课件优化处理，对于上传录屏类视频清晰度有所优化。可设置为0或1，默认值为0，表示不开启课件优化
                                // extra: {
                                //     keepsource: 1,//源文件播放（不对源文件进行编码）。可设置为0（对源文件进行编码）或1（源文件播放）
                                // },
                                response: function(data) {
                                    console.log('该视频信息如下：');
                                    console.log(data);

                                    document.getElementById('videoInfo').innerHTML = JSON.stringify(data);

                                    upload.closeWrap();
                                },
                                uploadSuccess: function(fileData) {
                                    LIB.globalLoader.hide();
                                    console.log('上传完毕！ 上传成功的文件：');
                                    console.log(JSON.stringify(fileData));
                                },
                                uploadFail: function(err) {debugger;
                                    LIB.globalLoader.hide();
                                    console.log('上传失败，失败原因：', err.data);
                                },
                            };
                            _this.upload = new PolyvUpload(obj);
                            setTimeout(function(){document.getElementById('polyv-wrapAll').style["z-index"] = 2000}, 500);
                        }
                    },
                    error: function (error) {
                        LIB.Msg.warning("系统繁忙，请稍后再操作！");
                    }
                });

                setInterval(function() {
                    $.ajax({
                        url: BASE.ctxpath + '/polyv/uploadsettings',
                        type: 'get',
                        dataType: 'json',
                        async: false,
                        success: function (result) {
                            if (result.error == "0") {
                                var data = result.content;
                                _this.upload.update(data);
                            }
                        },
                        error: function (error) {
                            LIB.Msg.warning("系统繁忙，请稍后再操作！");
                        }
                    })
                }, 2 * 60 * 1000);
            },
            /**
             * 保利威视频上传
             */
            doUpload: function () {
                var _this = this;
                if (!_this.mainModel.vo.chapterName) {
                    LIB.Msg.warning("请输入章节名称");
                    return;
                }
                if (!window.navigator.onLine) {
                    LIB.Msg.error("请检查网络连接");
                    return;
                }
                LIB.globalLoader.show();
            },
            //addVideo: function () {
            //    var _this=this;
            //    this.$refs.uploader.$el.firstElementChild.click();
            //
            //},
            /**
             * 初始化方法
             * @param opType
             * @param nVal
             */
            init: function (opType, nVal) {
                if (this.isRequireLazyLoaded()) {
                    this.requireLazyLoad(opType, nVal);
                    return;
                }

                var _this = this;
                this.initUploader();
                this.courseIdUrl = ''; // 清空课件链接
                this.mainModel.title = opType == "create" ? "添加" : "修改";
                var _data = dataModel.mainModel;
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                //_vo.kpointType = "0";
                _data.opType = nVal.opType;
                _vo.courseType = nVal.courseType;
                _vo.course = {id: nVal.courseId};
                //_vo.courseType == 1 &&
                if (nVal.kpointType == 1) {
                    _vo.videoModel.showVideoUploader = true;
                }
                if (nVal.id && nVal.id != null) {
                    //修改查询单个课程章节
                    api.queryCourseKpoint({id: nVal.courseId, coursekpointId: nVal.id}).then(function (res) {
                        _.extend(_vo, res.data);
                        _this.doFileTypeChange(_vo.fileType, 'init');

                        if (res.data.kpointType == 1) {
                            _vo.chapterName = _vo.name;
                        }
                        if (_vo.cloudFile.id) {
                            initUploadorRecordId(_vo.cloudFile.id);
                            _this.coursewareFileName = _vo.cloudFile.orginalName;
                            _this.courseIdUrl = _vo.cloudFile.orginalName;
                        }

                    });
                } else {
                    _.extend(_vo, nVal);
                    api.getUUID().then(function (res) {
                        _vo.id = res.data;
                        initUploadorRecordId(res.data);
                    });
                    _this.doFileTypeChange(_vo.fileType);
                }

                this.coursewareModel.fileExt = FILE_FILTER_TYPE[_vo.filetype];
                dataModel.coursewareModel.params['criteria.strValue'] = {oldId: _vo.cloudFile.id};
            },
            ready: function () {
            },
            /**
             * 清空视频文件（假清空，清空这些值后表单验证不能通过）
             */
            doClearFile: function () {
                this.courseIdUrl = '';
                this.mainModel.vo.cloudFile.id = '';
                this.mainModel.vo.videoUrl = '';
            },
            /**
             * 非视频上传，文件添加后钩子事件
             * @param up
             * @param files
             */
            onFileAdded: function (up, files) {
                  if(files.length > 0) {
                      this.addedFileName = files[0].name;
                  }
            },
            /**
             * 非视频上传，手动触发上传
             */
            doStartUpload: function () {
                this.$broadcast("doUploadStart");
            },
            /**
             * 非视频上传，从待上传队列中删除文件事件
             */
            doRemoveFileFromQueue: function () {
                if (this.$refs.uploader) {
                    this.$refs.uploader.remove(0, 1);
                }
            },
            /**
             * 非视频上传，在删除文件后事件
             * @param up
             * @param files
             */
            onFileRemoved: function (up, files) {
                this.addedFileName = '';
            },
            /**
             * 非视频上传， 上传出错钩子事件
             */
            onUploadError: function () {
                this.isUploading = false;
                this.uploadProgress = 0;
                if (this.timer) {
                    clearInterval(this.timer);
                }
            },
            _onProgress: function () {
                var randomNum = _.random(2, 5),
                    total = this.uploadProgress + randomNum;
                if (99 < total) {
                    this.uploadProgress = 99;
                } else {
                    this.uploadProgress = total;
                }
            },
            /**
             * 非视频上传， 上传之前设置进度条
             */
            onUploadBefore: function () {
                this.isUploading = true;
                this.uploadProgress = 5;
                this.timer = setInterval(this._onProgress, 300)
            },
            /**
             * 非视频上传，上传完成后清除进度条
             */
            onUploadComplete: function () {
                var _this = this;
                this.uploadProgress = 100;
                setTimeout(function () {
                    _this.isUploading = false;
                    _this.addedFileName = '';
                    clearInterval(_this.timer);
                }, 300);
            },
            doPreview: function () {
                var id, name;
                var type = this.mainModel.vo.fileType;
                if (type === '1') {
                    id = this.mainModel.vo.videoUrl;
                    name = this.mainModel.vo.chapterName;
                    if(!id) {
                        return LIB.Msg.error("请先上传课件");
                    }
                } else {
                    id = this.mainModel.vo.cloudFile.id;
                    name = this.courseIdUrl;
                    if(!id) {
                        return;
                    }
                }

                window.open(LIB.ctxPath('/front/kpoint/preview?id=' + id + '&type=' + type + '&name=' + name));
            }
        },
        init: function () {
        }

    });

    return detail;
});