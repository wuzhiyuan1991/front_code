define(function (require) {
    var Vue = require("vue");
    var LIB = require('lib');
    var Msg = require("components/iviewMessage");
//	var template =  '<div><button class="btn btn-default pop_up_button">上传</button></div>';
//	var template =  '<div><div style="height:80px;width: 80px;border: 1px solid #c8c8c8;"><Icon type="plus-round" style="font-size: 35px;padding: 20px 26px;"></Icon></div></div>';
    var template = require("text!./plupload-vue.html");
    var helper = require("./pluploadHelper");

    var loading = new Msg.circleLoading();

    var _defaultSuccessUploadEvent = function () {
        Msg.info("上传成功");
    }

    var _defaultErrorUploadEvent = _.throttle(function (up, rs) {
        if (rs.error == "-601") {
            Msg.error("上传文件类型错误");
        } else if (rs.error == "-600") {
            Msg.error("上传文件大小错误,最大为:" + up.settings.filters.max_file_size) + ".";
        } else if(null != rs.message && "" != rs.message){
            Msg.error(rs.message);
        }else {
            Msg.error("上传失败");
        }
    }, 3000, {'trailing': false})
    var opts = {
        template: template,
        data: function () {
            return {
                fileUploader: null,
                showLoading:false,
                fileQueue:[],//已上传的文件队列，用于依次上传文件信息到服务器，启用第三方文件服务时需要
                isSendingCloudFile: false,//是否正在上传文件信息，启用第三方文件服务时需要
            }
        },
        props: {
            checkFiles:{
                default:null
            },
            customStyle: {
                type: Boolean,
                'default': false
            },
            url: {
                type: String,
                'default': '/file/upload'
            },
            //需要上传确认但仍未执行确认或取消操作时为true，其他情况都为false
            isConfirming: {
                type: Boolean,
                default: false
            },
            multiSelection: {
                type: Boolean,
                'default': true
            },
            params: {
                type: Object,
                'default': null
            },
            paramsRender: {
                type: Function,
                'default': null
            },
            events: {
                type: Object,
                'default': function () {
                    return {
                        onErrorUpload: _defaultErrorUploadEvent,
                        onSuccessUpload: _defaultSuccessUploadEvent
                    }
                }
            },
            filters: {
                type: Object,
                'default': function () {
                    return {
                        max_file_size: '10mb',
                        mime_types: [{title: "图片", extensions: "jpg,png,bmp,jpeg"}]
                    }
                }
            },
            fileExt: {
                type: String
            },
            maxFileSize: {
                type: String
            },
            //判断是最新模板 如果是 则不直接提交上传
            autoUpload: {
                type: Boolean,
                'default': true
            }
        },
        events: {
            "doUploadStart": function () {
                this.fileUploader.start();
            },
            "doConfirm": function () {
                var _this = this;
                //校验并确认之后上传原文件
                var confirmedFiles = _.map(this.fileUploader.files, function(file){
                   return  file.getNative();
                });
                var url = "";
                if (this.fileUploader.getOption("url").indexOf("?") == -1) {
                    url = this.fileUploader.getOption("url") + "?isConfirmed=1" ;//isConfirmed参数告诉后端已确认
                } else {
                    url = this.fileUploader.getOption("url") + "&isConfirmed=1" ;//isConfirmed参数告诉后端已确认
                }
                this.fileUploader.setOption("url", url);
                this.fileUploader.splice(0, 300);
                _.each(confirmedFiles, function(file){
                    _this.fileUploader.addFile(file);
                });

                this.isConfirming = false;
                this.fileUploader.start();
                //上传之后还原url
                this.fileUploader.setOption("url", helper.ctxpath() + this.url);
            },
            "doClearFiles": function() {
                this.fileUploader.splice(0, 300);
            }
        },
        watch: {
            fileExt: function (val) {
                this.fileExt = val;
                this.fileUploader && this.fileUploader.destroy();
                this.initUpload();
            },
            url: function (val) {
                this.fileUploader.setOption("url", helper.ctxpath() + val);
            },
            filters:function (val) {
                if(val.max_file_size){
                    this.fileUploader.setOption("filters",val);
                }
            },
            fileQueue: function() {
                if(!this.isSendingCloudFile && this.fileQueue.length > 0) {
                    this.sendCloudFile(this.fileQueue[0]);
                }
            }
        },
        methods: {
            // 初始化上传组件
            initUpload: function () {
                var _this = this;
                if (this.fileExt) {
                    this.filters.mime_types = [{title: "file", extensions: this.fileExt}];
                }
                if (this.maxFileSize) {
                    this.filters.max_file_size = this.maxFileSize;
                }
                var _opts = {
                    url: helper.ctxpath() + this.url,
                    multiSelection: this.multiSelection,
                    params: this.params,
                    paramsRender : this.paramsRender,
                    events: this.events,
                    filters: this.filters
                };
                //配置项参考 http://www.plupload.com/docs/v2/Uploader#BeforeUpload-event
                var uploader = new plupload.Uploader({
                    browse_button: this.$el.firstElementChild,
                    runtimes: 'html5,flash',
                    headers: {
                        accept: "text/plain"
                    },
                    url: _opts.url,
                    file_data_name: 'file',
                    multi_selection: this.multiSelection,
                    flash_swf_url: helper.ctxpath() + "/html/js/libs/plupload-2.1.9/js/Moxie.swf",
                    filters: _opts.filters,
                    init: {
                        //选中图片直接上传
                        FilesAdded: function (up, files) {
                            if(_this.checkFiles && _this.checkFiles(files)==false){
                                up.files.length=0;//清空文件
                                return ;
                            }
                            var reader = new FileReader();
                            reader.readAsArrayBuffer(files[0].getNative())
                            reader.onload = function(){
                                var str = '';
                                var view = new DataView(reader.result);
                                if(files[0].size > 16){
                                    for(var i=0; i<16; i++){
                                        str += view.getUint8(i).toString(16) + "";
                                    }
                                    // wmv 格式需要排除
                                    if(str == '3026b2758e66cf11a6d90aa062ce6c'){
                                        Msg.error('系统暂时不支持该视频编码格式');
                                        up.splice(0, 300);
                                        return ;
                                    }
                                }
                                //用于图片显示不需要传入后台，reader.result的结果是base64编码数据，直接放入img的src中即可
                                if (_this.autoUpload) {
                                    _this.$emit("doUploadStart");
                                } else {
                                    //return _this._data.fileUploader;
                                    _this.$emit("on-upload", up, files);
                                    //console.log(_this._data.fileUploader.files[0].name);
                                }
                            }
                        },
                        FilesRemoved: function (up, files) {
                            _this.$emit('on-file-removed', up, files);
                        },
                        //上传成功
                        FileUploaded: function (up, file, data) {
                            if(LIB.setting.fileServer == 'oss') {//oss响应后，将文件信息保存到本地数据库
                                if(data.status == "200") {
                                    var cloudFile = {
                                        attr5:"OSS",
                                        recordId: _opts.params.recordId,
                                        dataType: _opts.params.dataType,
                                        fileType: _opts.params.fileType,
                                        realPath: _this.oss.realPath,
                                        ctxPath : _this.oss.host + "/" + _this.oss.realPath,
                                        fileName: _this.oss.fileName + _this.oss.ext,
                                        ext: _this.oss.ext.replace(".", ""),
                                        orginalName: file.name,
                                        fileSize: file.size,
                                        uploader: up,
                                        opts:_opts,
                                        response: rs,
                                        uploadFile: file
                                    };
                                    _this.fileQueue.push(cloudFile);
                                } else {
                                    var rs = {
                                        error: "E500",
                                        message: "上传文件到OSS失败"
                                    };
                                    _this.doSuccessUpload(up, _opts, rs, file);
                                }
                            }else {
                                var rs = JSON.parse(data.response);
                                _this.doSuccessUpload(up, _opts, rs, file);
                            }
                        },
                        //上传前对form附加参数
                        BeforeUpload: function (uploader, file) {
                            if(file.name.length > 100) {
                                Msg.error('文件名不能超过100个字符');
                                uploader.stop();
                                uploader.removeFile(file);
                                return;
                            }
                            // 文件上传
                            var param = _opts.params;
                            if(_opts.paramsRender) {
                                param = _opts.paramsRender(file, _opts.params);
                            }
                            if(param && (!param.recordId || param.recordId === 'false')) {
                                //设置recordId
                                if (!_this.uuids || _.isEmpty(_this.uuids)) {
                                    _this.getUUID(uploader.files.length);
                                }
                                param.recordId = _this.uuids.shift();
                            }
                            if(LIB.setting.fileServer == 'oss') {
                                $.ajax({
                                    url: helper.ctxpath() + "/file/oss/signature",
                                    async: false,
                                    data: param,
                                    success: function (res) {
                                        var oss = res.content;
                                        if(oss) {
                                            _this.oss = oss;
                                            var suffix = _this.getFileSuffix(file.name);
                                            var key = oss.dir + oss.fileName + suffix;
                                            _this.oss.realPath = key;
                                            _this.oss.ext = suffix;
                                            var multipart_params = {
                                                key : key,
                                                policy : oss.policy,
                                                OSSAccessKeyId : oss.accessid,
                                                success_action_status : "200",
                                                signature : oss.signature,
                                                //callback : oss.callback
                                            };
                                            uploader.setOption({
                                                'url': oss.host,
                                                'multipart_params': multipart_params
                                            });
                                        } else {
                                            Msg.error('从服务器获取OSS签名失败');
                                            return false;
                                        }

                                    }
                                });

                            }else {
                                uploader.setOption("multipart_params", param);
                            }
                            _this.$emit("on-before-upload", uploader);
                        },
                        UploadFile: function (up, file) {
                            _this.$emit("on-uploading");
                        },
                        Error: function (up, err) {
                            var rs = {
                                "error": err.code,
                                "message": err.message
                            };
                            if (_opts.events.onErrorUpload) {//使用自定义上传错误处理
                                if (helper.defaultErrorFunc) {
                                    helper.defaultErrorFunc(up, rs);
                                }
                                _this.$emit("on-error-upload", {up: up, rs: rs});
                                //_opts.events.onErrorUpload(up,rs);
                            } else {
                                _defaultErrorUploadEvent(up, rs);
                                _this.$emit("on-error-upload");
                            }
                        },
                        UploadComplete: function (uploader, files) {
                            // 清除已上传的文件（上传过的文件会一直在队列中）
                            !_this.isConfirming && uploader.splice(0, 300);

                            // loading.hide();
                            // LIB.globalLoader.hide();
                            _this.$emit("on-upload-complete", _this.isConfirming);
                        }
                    }
                });
                uploader.init();
                this.fileUploader = uploader;
            },
            sendCloudFile: function(cloudFile) {
                var _this = this;

                var up = cloudFile.uploader;
                var _opts = cloudFile.opts;
                var res = cloudFile.response;
                var file = cloudFile.uploadFile;

                delete cloudFile.uploader;
                delete cloudFile.opts;
                delete cloudFile.response;
                delete cloudFile.uploadFile;

                this.isSendingCloudFile = true;

                $.ajax({
                    type:"POST",
                    dataType:"json",
                    contentType:"application/json;charset=utf-8",
                    url: helper.ctxpath() + "/file",
                    async: false,
                    data: JSON.stringify(cloudFile),
                    success: function (res) {
                        setTimeout(function(){
                            _this.isSendingCloudFile = false;
                            _this.fileQueue.shift();
                        }, 300);
                        _this.doSuccessUpload(up, _opts, res, file);

                    }
                });
            },
            getFileSuffix:function (filename) {
                var pos = filename.lastIndexOf('.')
                var suffix = ''
                if (pos != -1) {
                    suffix = filename.substring(pos)
                }
                return suffix;
            },
            doSuccessUpload: function(up, _opts, rs, file) {
                if (rs.error != '0') {
                    if (helper.defaultErrorFunc) {
                        helper.defaultErrorFunc(up, rs);
                    }
                    if (_opts.events.onErrorUpload) {
                        _opts.events.onErrorUpload(up, rs);
                    } else {
                        _defaultErrorUploadEvent(up, rs);
                    }
                } else if (rs.error == '0') {
                    if (_opts.events.onSuccessUpload) {
                        if (helper.defaultBeforeSuccessUploadFunc) {
                            helper.defaultBeforeSuccessUploadFunc(up, rs);
                        }
                        //_opts.events.onSuccessUpload.call(up, file, rs);
                        this.$emit("on-success-upload", {up: up, file: file, rs: rs});
                    } else {
                        _defaultSuccessUploadEvent();
                    }
                }
            },
            remove: function (start, length) {
                this.fileUploader.splice(start, length);
            },
            setOption: function (k, v) {
                this.fileUploader.setOption(k, v);

                //暂时未找到api解决的方法，暂时用jquery找到指定组件下面的input，修改accept解决
                if(k == "filters" && v.mime_types[0] && v.mime_types[0].extensions) {
                    var accept = "." + v.mime_types[0].extensions.replace(",",",.");
                    $(this.$el).find("input").attr("accept", accept);
                }
            },

            setOptionFileExtensions: function (v) {

                //这里无作用，只是为了保证参数一致
                var curFilters = this.fileUploader.getOption("filters");

                //未设置mime_types, 或者 后缀名 未变化 则不处理
                if(v && curFilters && curFilters.mime_types && curFilters.mime_types.length > 0 && curFilters.mime_types[0].extensions != v) {

                    curFilters.mime_types[0].extensions = v;
                    this.fileUploader.setOption("filters", curFilters);
                    //暂时未找到api解决的方法，暂时用jquery找到指定组件下面的input，修改accept解决
                    var accept = "." + v.replace(new RegExp( ',' , "g" ),",.");
                    $(this.$el).find("input").attr("accept", accept);
                }
            },
            getUUID: function (size) {
                var _this = this;
                var xhr = new XMLHttpRequest();
                var url = "/helper/getUUID/list?size=" + size;
                xhr.open("GET", url , false);
                xhr.withCredentials = true;
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function () {
                    var XMLHttpReq = xhr;
                    if (XMLHttpReq.readyState === 4) {
                        if (XMLHttpReq.status === 200) {
                            var res = JSON.parse(xhr.responseText);
                            if (res.error === '0') {
                                _this.uuids = res.content;
                            } else {
                                Msg.error("文件上传出错");
                                _this.uuids = null;
                            }
                        } else {
                            Msg.error("文件上传出错");
                            _this.uuids = null;
                        }
                    }
                };
                xhr.send(null);
            }
        },
        ready: function () {
            this.showLoading = false;
            this.initUpload();
        }
    };

    var comp = Vue.extend(opts);
    Vue.component('vue-file-upload', comp);
});
