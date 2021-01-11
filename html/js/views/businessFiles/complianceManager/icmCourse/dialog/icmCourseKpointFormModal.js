define(function(require){
	var LIB = require('lib');
	var BASE = require('base');
	 //数据模型
	 var api = require("../vuex/api");
	var tpl = require("text!./icmCourseKpointFormModal.html");
	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//节点名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//文本
			content : null,
			//课件类型 1视频 2图片 3word 4excel 5ppt 6pdf
			fileType : '1',
			//是否可以试听 1免费,2收费
			isFree : null,
			//节点类型 0章,1节
			kpointType : null,
			//直播开始时间
			liveBeginTime : null,
			//直播结束时间
			liveEndTime : null,
			//直播地址
			liveUrl : null,
			//页数
			pageCount : null,
			//课后作业版本号 更新次数
			paperVersion : null,
			//播放次数
			playCount : null,
			//播放时间
			playTime : null,
			//视频类型
			videoType : null,
			//视频地址
			videoUrl : null,
			//培训课件
			icmCourse : {id:'', name:''},
			chapterName:null,
			cloudFile: {id: '', name: ''},
			videoModel: {
                showVideoUploader: false,
                kpointType: "1",
                videoUrl: null,
                fileType: '1', // 课件类型，用做form表单校验, 默认视频类型
            },
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
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",
            
			//验证规则
	        rules:{
				// "code" : [LIB.formRuleMgr.length(100)],
				// "name" : [LIB.formRuleMgr.length(255)],
				// "disable" :LIB.formRuleMgr.require("状态"),
				// "content" : [LIB.formRuleMgr.length(2147483647)],
				// "fileType" : [LIB.formRuleMgr.length(20)],
				// "isFree" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				// "kpointType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				// "liveBeginTime" : [LIB.formRuleMgr.allowStrEmpty],
				// "liveEndTime" : [LIB.formRuleMgr.allowStrEmpty],
				// "liveUrl" : [LIB.formRuleMgr.length(200)],
				// "pageCount" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				// "paperVersion" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				// "playCount" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				// "playTime" : [LIB.formRuleMgr.length(100)],
				// "videoType" : [LIB.formRuleMgr.length(30)],
				// "videoUrl" : [LIB.formRuleMgr.length(500)],
				// "icmCourse.id" : [LIB.formRuleMgr.allowStrEmpty],
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
                "cloudFile.id": [{required: true, message: '请上传课件'}]

	        },
	        emptyRules:{}
		},
		selectModel : {
			icmCourseSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
		isSelectedUploadPolyvVideoFile: false,
        uploader: null,
        // 是否能播放flash,默认为允许
        isCanPlayFlash: true,
        coursewareModel: {
            params: {
                'criteria.strValue': {oldId: null},
                recordId: false,
                dataType: 'ICM14',
                fileType: 'ICM'
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
        courseIdUrl: '', 		// 图片地址
        coursewareFileName: '', // 课件文件名称
        isUploading: false,
        uploadProgress: 0,
        videoTypeList: [
            {id: '1', label: '上传本地视频'},
            {id: '2', label: '引用保利威视频课程资源'}
        ],
        percent:0,
        videoType: '1',
        addedFileName: '',
        showpolyv:false,
        filename:'',
        progress:'',
        videoHash:null//上传保利威视频时用于覆盖原视频

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {

        },
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
		data:function(){
			return dataModel;
		},
		watch: {
            //'mainModel.vo.kpointType':function(val, oldVal){debugger
            //	this.mainModel.vo.videoModel.kpointType = val;
            //	if(val == 1 && this.mainModel.vo.courseType == 1) {
            //		var flashChecker = this.flashChecker();
            //		if(flashChecker.v < 9){
            //			LIB.Msg.warning("你的浏览器版本过低，请及时更新");
            //			return
            //		}
            //		this.mainModel.vo.videoModel.showVideoUploader = true
            //	}else {
            //		this.mainModel.vo.videoModel.showVideoUploader = false;
            //	}
            //},
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
            /**
             * 上传视频时，添加上传按钮()
             * @private
             */
            _appendButton: function() {
                if(this.isCanPlayFlash) {
                    var button = document.createElement("button");
                    button.classList.add('video-upload-button');
                    button.textContent = "上传";
                    document.getElementById("video-upload-box").querySelector(".uploadify-queue").appendChild(button);
                    button.addEventListener('click', this.doUpload)
                }
            },
            /**
             * 保利威视频上传
             */
            doSelectFile: function () {
                $('#myupdate').click()
                this.isSelectedUploadPolyvVideoFile = true
               
             
            },
            doChangeVideo:function(){
                this.filename=$('#myupdate')[0].files[0].name
                this.showpolyv=true
                this.percent = 0
                this.mainModel.vo.videoUrl=null
            },
            doUpdatepolyv: function () {
                var _this = this;
                this.percent = 0
                if (!_this.mainModel.vo.chapterName) {
                    LIB.Msg.warning("请输入章节名称");
                    return;
                }
                if (!this.isSelectedUploadPolyvVideoFile) {
                    LIB.Msg.warning("请选择视频");
                    return;
                }
                if (!window.navigator.onLine) {
                    LIB.Msg.error("请检查网络连接");
                    return;
                }
                this.timer = setInterval(function () {
                    if (_this.percent < 50) {
                        _this.percent += 3;
                    } else if (_this.percent <= 97) {
                        _this.percent += 2;
                    } else {
                        clearInterval(_this.timer);
                    }
                }, 100)
                
                var cataId = '';
                var videoTag = 'ckTag';
                var videoDes = 'ckDes';
                //				var writeToken = $("#writeToken").val();
                var jsonRpc = '{"title": "' + encodeURI(this.mainModel.vo.chapterName) + '", "tag": "' + videoTag + '", "desc": "' + videoDes + '"}';
                var fd = new FormData();
                $.ajax({
                    url: BASE.ctxpath + '/polyv/uploadsetting',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        'cataId': cataId,
                        'jsonRpc': jsonRpc
                    },
                    async: false,
                    success: function (result) {
                        if (result.success == false) {
                            alert(result.message);
                        } else {
                            var hash = result.content.hash;
                            var writeToken = result.content.writeToken;
                            // var json = {};
                            if (result.content.cataid) {
                                cataId = result.content.cataid;
                            }
                            if (!cataId || cataId == null || cataId == '') {
                                LIB.Msg.warning("尚未指定上传目录，请联系运维人员！");
                                return false;
                            } else {
                                // json['cataid'] = cataId;
                                // json['writetoken'] = writeToken;
                                // json['JSONRPC'] = jsonRpc;
                                // json['sign'] = hash;
                                // json['luping'] = 1;
                                // if(_this.videoHash && _this.videoHash.length == 32){
                                //     json['videohash'] = _this.videoHash;
                                // }

                               
                                fd.append("Filedata", $('#myupdate')[0].files[0]);
                                fd.append("cataid", cataId);
                                fd.append("title", $('#myupdate')[0].files[0].name);
                                fd.append("Filename", $('#myupdate')[0].files[0].name);
                                fd.append("writetoken", writeToken);
                                fd.append("JSONRPC", jsonRpc);
                                fd.append("sign", hash);
                                fd.append("luping", 1);
                                if (_this.videoHash && _this.videoHash.length == 32) {
                                    fd.append("videohash", _this.videoHash);
                                }
                                
                            }
                        }
                    },
                    error: function (error) {
                        LIB.Msg.warning("系统繁忙，请稍后再操作！");
                    }
                });
                $.ajax({
                    url: 'http://v.polyv.net/uc/services/rest?method=uploadfile',
                    type: 'post',
                    contentType: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    processData: false,
                    data:fd,
                    async: false,
                    success:function(result){
                        
                        var jsonobj = result

                                    if (jsonobj.error && jsonobj.error == '22') {
                                        LIB.Msg.warning("对不起，你没有权限上传视频！");
                                        return;
                                    }
            
                                    dataModel.mainModel.vo.videoUrl = jsonobj.data[0].vid;
                                    dataModel.mainModel.vo.playTime = jsonobj.data[0].duration;
                                   
                                    _this.percent = 100
                                    setTimeout(function(){
                                        _this.showpolyv=false
                                        _this.percent = 0
                                    },500)
                    },
                    error: function (error) {
                        LIB.Msg.warning("系统繁忙，请稍后再操作！");
                      
                    }
                })
            },
//             doUpload: function () {
//                 var _this = this;
//                 if (!_this.mainModel.vo.chapterName) {
//                     LIB.Msg.warning("请输入章节名称");
//                     return;
//                 }
//                 if (!this.isSelectedUploadPolyvVideoFile) {
//                     LIB.Msg.warning("请选择视频");
//                     return;
//                 }
//                 if (!window.navigator.onLine) {
//                     LIB.Msg.error("请检查网络连接");
//                     return;
//                 }
//                 var cataId = '';
//                 var videoTag = 'ckTag';
//                 var videoDes = 'ckDes';
// //				var writeToken = $("#writeToken").val();
//                 var jsonRpc = '{"title": "' + encodeURI(this.mainModel.vo.chapterName) + '", "tag": "' + videoTag + '", "desc": "' + videoDes + '"}';
//                 $.ajax({
//                     url: BASE.ctxpath + '/polyv/uploadsetting',
//                     type: 'get',
//                     dataType: 'json',
//                     data: {
//                         'cataId': cataId,
//                         'jsonRpc': jsonRpc
//                     },
//                     async: false,
//                     success: function (result) {
//                         if (result.success == false) {
//                             alert(result.message);
//                         } else {
//                             var hash = result.content.hash;
//                             var writeToken = result.content.writeToken;
//                             var json = {};
//                             if (result.content.cataid) {
//                                 cataId = result.content.cataid;
//                             }
//                             if (!cataId || cataId == null || cataId == '') {
//                                 LIB.Msg.warning("尚未指定上传目录，请联系运维人员！");
//                                 return false;
//                             } else {
//                                 json['cataid'] = cataId;
//                                 json['writetoken'] = writeToken;
//                                 json['JSONRPC'] = jsonRpc;
//                                 json['sign'] = hash;
//                                 json['luping'] = 1;
//                                 if(_this.videoHash && _this.videoHash.length == 32){
//                                     json['videohash'] = _this.videoHash;
//                                 }
//                                 _this.uploader.uploadify('settings', 'formData', json);
//                                 _this.uploader.uploadify('upload');
//                             }
//                         }
//                     },
//                     error: function (error) {
//                         LIB.Msg.warning("系统繁忙，请稍后再操作！");
//                     }
//                 });
//             },
//             /**
//              * 初始化保利威上传组件
//              */
//             initUploader: function () {
//                 var _this = this;
//                 if ($(".uploadify-queue-item").length > 0) {
//                     $('#polyvFileUpLoad').uploadify('destroy');
//                 }
//                 // 删除多余的上传队列dom元素
//                 if ( $('.uploadify-queue').length>0) {
//                     var $queue = document.getElementById("video-upload-box").querySelector('.uploadify-queue');
//                 if($queue) {
//                     $queue.parentNode.removeChild($queue);
//                 }
//                 }
               
                

//                 this.uploader = $('#polyvFileUpLoad').uploadify({
//                     'auto': false,
//                     'fcharset': 'ISO-8859-1',
//                     'buttonText': '添加',
//                     'fileSizeLimit': '500MB',
//                     'fileTypeDesc': '视频文件',
//                     'fileTypeExts': '*.avi; *.wmv; *.mp4;*.mp3; *.mov; *.flv; *.mkv; *.rmvb',//文件类型过滤
//                     'swf': BASE.ctxpath + '/html/js/views/businessFiles/complianceManager/icmCourse/uploadify/uploadify.v3.2.1.swf',
//                     'button_image_url': BASE.ctxpath + '/html/js/views/businessFiles/complianceManager/icmCourse/uploadify/callback.png',
//                     'multi': true,
//                     'successTimeout': 1800,
//                     'queueSizeLimit': 1,
//                     'uploader': 'http://v.polyv.net/uc/services/rest?method=uploadfile',
//                     'onSelect': function (file) {
//                         this.addPostParam("title", encodeURI(encodeURI(file.name)));//设置上传文件的名字
//                         dataModel.isSelectedUploadPolyvVideoFile = true;
//                         _this.mainModel.vo.videoUrl = '';
//                         _this._appendButton();
//                         document.getElementById('video-upload-box').querySelector('.uploadify-queue').classList.add('border');
//                     },
//                     'onCancel': function () {
//                         var $box = document.getElementById("video-upload-box");
//                         var $queue = $box.querySelector(".uploadify-queue");
//                         $queue.innerHTML = '';
//                         document.getElementById('video-upload-box').querySelector('.uploadify-queue').classList.remove('border');
//                     },
//                     "onDialogOpen": function () {
//                         $('#polyvFileUpLoad').uploadify('cancel');
//                     },
//                     // "onSelectError":function(d, g, f){
//                     	// this.queueData = "";
//                     	// if (this.settings.queueSizeLimit > f) {
//                     	// 	LIB.Msg.error("所选文件数超过剩余的上传限制");
//                     	// } else {
//                     	// 	LIB.Msg.error("所选择的文件数超过大小限制 (" + this.settings.queueSizeLimit + ")") ;
//                     	// }
//                     // },
//                     //onUploadSuccess为上传完视频之后回调的方法，视频json数据data返回，
//                     //下面的例子演示如何获取到vid
//                     'onUploadSuccess': function (file, data, response) {
//                         var jsonobj = eval('(' + data + ')');

//                         if (jsonobj.error && jsonobj.error == '22') {
//                             LIB.Msg.warning("对不起，你没有权限上传视频！");
//                             return;
//                         }

//                         dataModel.mainModel.vo.videoUrl = jsonobj.data[0].vid;
//                         dataModel.mainModel.vo.playTime = jsonobj.data[0].duration;

//                         var $box = document.getElementById("video-upload-box");
//                         var $queue = $box.querySelector(".uploadify-queue");
//                         $queue.innerHTML = '';
//                         $queue.classList.remove('border');
//                     }
//                 });

//             },
            /**
             * 检查浏览器flash插件是否可用
             * @return {{f: number, v: number}}
             */
            flashChecker: function () {
                var hasFlash = 0; //是否安装了flash
                var flashVersion = 0; //flash版本
                if (document.all) {
                    var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if (swf) {
                        hasFlash = 1;
                        var VSwf = swf.GetVariable("$version");
                        flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                    }
                } else {
                    if (navigator.plugins && navigator.plugins.length > 0) {
                        var swf = navigator.plugins["Shockwave Flash"];
                        if (swf) {
                            hasFlash = 1;
                            var words = swf.description.split(" ");
                            for (var i = 0; i < words.length; ++i) {
                                if (isNaN(parseInt(words[i]))) continue;
                                flashVersion = parseInt(words[i]);
                            }
                        }
                    }
                }
                return {f: hasFlash, v: flashVersion};
            },
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
                // this.initUploader();
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
                    api.queryIcmCourseKpoint({id: nVal.courseId, icmcoursekpointId: nVal.id}).then(function (res) {
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
                  
                        _this.doFileTypeChange(_vo.fileType, 'init');
                      
                }

                // 初始化判断是否能播放flash
                // var fc = this.flashChecker();
                // this.isCanPlayFlash = (fc.v >= 9);
               
                this.coursewareModel.fileExt = FILE_FILTER_TYPE[_vo.filetype];
              
                dataModel.coursewareModel.params['criteria.strValue'] = {oldId: _vo.cloudFile.id};
            },
            ready: function () {
                // this.initUploader();
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

                window.open(LIB.ctxPath('/icmfront/kpoint/preview?id=' + id + '&type=' + type + '&name=' + name));
            }
        },
        init: function () {
            this.requireLazy = {
                "uploadify": "views/businessFiles/complianceManager/icmCourse/uploadify/jquery.uploadify.min.v3.2.1",
                "swfobject": "views/businessFiles/complianceManager/icmCourse/uploadify/swfobject"
            };
        }
	});
	
	return detail;
});