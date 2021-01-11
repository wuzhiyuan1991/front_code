define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var courseKpointFormModal = require("./dialog/courseKpointFormModal");
    require("componentsEx/treeModal/treeModal");

    var DEFAULT_IMG = 'css/images/course2.jpg';
    // var evaluationModel = require("../courseEvaluation/main");
    //编辑章节页面
    //var editKpointComponent = require("./dialog/editKpoint");

    var isEmer = 0;

    //初始化数据模型
    var newVO = function () {
        return {
            id : null,
            //编码
            code : null,
            //课程名称
            name : null,
            //禁用标识 0未禁用，1已禁用
            disable : "0",
            //所属公司
            compId : null,
            //所属部门
            orgId : null,
            //分类
            classification : null,
            //课程描述
            description : null,
            cloudFile: {id: "", name: ""},
            //课程章节
            kpointList: [],
            //判断是否被引用
            isDataReferenced: false,
            teachers: [],
            //复审周期（月）
            recheckCycle : null,
            //是否需要取证
            isCertRequired: '0',
            activeKey:'kpoint'
        }
    };
    //图片上传后回调方法声明
    var uploadEvents = {
        courseLogo: function (file, rs) {
            dataModel.mainModel.vo.cloudFile = rs.content;
        }
    }
    //初始化上传组件RecordId参数
    var initUploadorRecordId = function (recordId) {
        dataModel.courseLogoModel.params.recordId = recordId;
    }


    //Vue数据
    var dataModel = {
        mainModel: {
            isShowAllDescription:0, // 0 不显示按钮  1 显示收起 2显示更多
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            periodList: LIB.getDataDicList("course_frequency"),
            //periodList:[{type:"0",name:"无需复培"},{type:"1",name:"1年"},{type:"2",name:"2年"},{type:"3",name:"3年"},{type:"4",name:"4年"},{type:"5",name:"5年"},],
            //languages:[{type:"0",name:"中文"},{type:"1",name:"英语"}],
            //types:[{type:"1",name:"自学"},{type:"2",name:"教学"},{type:"3",name:"实操"}],
            // industryList:[],//行业
            industryListData: null,//行业数据
            industryListTitle: "选择行业",
            //课程类型
            categorys: [],
            categoryName: null,
            teacherList: [],//讲师列表
            certifications: [],//认证类型
            certificationsName: null,
            //验证规则
            disabledFrequenceInput: false, // 禁用复培周期输入
            rules:{
                name: [
                    {required: true, message: '请输入课程名称'},
                    LIB.formRuleMgr.length(200)
                    //{ min: 2, max: 255, message: '长度在 2到 255 个字符'}
                ],
                "description" : [LIB.formRuleMgr.length(500)].concat(LIB.formRuleMgr.allowIntEmpty),
                "classification" : [LIB.formRuleMgr.length(100)].concat(LIB.formRuleMgr.allowIntEmpty),
                trainHour: [
                    // {type:'number',required: true, message: '请输入培训学时'},
                    // {type:'integer',min: 1.0,message: '请填写大于0的整数'}
                    {
                        required: true,
                        validator: function (rule, value, callback) {
                            var a =  /^(([1-9][0-9]*)|(([0]\.\d{1}|[1-9][0-9]*\.\d{1})))$/.test(String(value));

                            if(value <= 0){
                                return callback(new Error("请输入大于0的数"));
                            }

                            if(a){
                                if (value > 10000) {
                                    return callback(new Error("培训学时不能大于10000"));
                                }
                                return callback();
                            }else{
                                return callback(new Error("请输入一位小数"));
                            }
                        }
                    },
                ],
                defaultPeriod: [
                    {
                        required: true,
                        validator: function (rule, value, callback) {
                            if (value > 0) {
                                if (value.indexOf('.') > -1) {
                                    return callback(new Error("请输入正整数"));
                                }
                                if (value > 10000) {
                                    return callback(new Error("默认培训期限不能大于10000"));
                                }
                                return callback();
                            } else if (!value) {
                                return callback(new Error("请输入默认培训时长"));
                            } else {
                                return callback(new Error("请输入正整数"));
                            }
                        }
                    }
                ],
                type: [
                    {type: 'integer', required: true, message: '请选择培训方式'},
                    {type: 'integer', min: 1, max: 3, message: '请选择正确的培训方式'}
                ],
                "categorySubject.id": [{required: true, message: '请选择课程类型'}],
                "compId": [{required: true, message: '请选择所属公司'}],
                language: [{required: true, message: '请选择培训语言'}],
                requirement: [{required: true, message: '请选择培训要求'}],
                frequence: [
                    {
                        required: true,
                        validator: function (rule, value, callback) {

                            if (value === '' || value == null) {
                                return callback(new Error("请输入默认复培周期"));
                            } else if (value < 0) {
                                return callback(new Error("请输入正数"));
                            } else if (value > 120) {
                                return callback(new Error("默认复培周期不能大于120"));
                            } else {
                                return callback();
                            }
                        }
                    }
                ],
                "cloudFile.id": [{required: true, message: '请上传封面图片'}],
                orgId: [{required: true, message: '请选择所属部门'}]
            }
        },
        courseLogoModel: {
            params: {
                'criteria.strValue': {oldId: null},
                recordId: null,
                dataType: 'ICM15',
                fileType: 'ICM'
            },
            events: {
                onSuccessUpload: uploadEvents.courseLogo
            }
        },
        cardModel: {
            teacherCardModel: {
                showContent: true
            },
            industryCategoryCardModel: {
                showContent: true
            },
            examPointCardModel: {
                showContent: true
            },
        },
        formModel: {
            courseKpointFormModel: {
                show: false,
                queryUrl: "icmcourse/{id}/icmcoursekpoint/{icmcoursekpointId}"
            },
        },
        selectModel: {
        },
        selectedCategory: [],
        selectedIndustry: [],
        selectedCertification: [],
        editKpointModel: {
            id: null,
            //控制组件显示
            title: "新增章节",
            //显示编辑弹框
            show: false,
            type: "create"
        },
        picModel: {
            title: "图片显示",
            show: false,
            pic: null
        },
        isShowCardContent: true,
        //行业
        selectedIndustries: [],
        industryName: "",
        //图片地址
        courseIdUrl: DEFAULT_IMG,
        //模拟卷
        analogVolume: [],
        //模拟卷
        examinationPaper: [],
        //控制章节信息是否显示
        isKpoint: true,
        filterModel: {
            kPointKeyword: ''
        },
        fileModel: {
            default: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'ICM15',
                        fileType: 'ICM'
                    },
                    filters: {
                        max_file_size: '50mb',
                        mime_types: [{title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,word"}]
                    }
                },
                data: []
            }
		},
        isEmer: false,
        description:null
    };
    //Vue组件
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
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "coursekpointFormModal": courseKpointFormModal,
        },
        data: function () {
            return dataModel;
        },
        // watch: {
        //     "mainModel.vo.type": function (val) {
        //         if (val == 1) {
        //             this.isKpoint = true
        //         } else {
        //             this.isKpoint = false
        //         }
        //     }
        // },
        computed: {
            isClass: function () {
                return this.mainModel.opType == "view" ? true : false
            },
            description: function () {
                return this.getDescription(this.mainModel.vo.description)
            }
        },
        methods: {
            newVO: newVO,
            // 判断名字长度
            strlen: function (str){
                var _this = this;
                if(str){
                    var len = 0;
                    var numIndex = 0;
                    var count = 0;
                    for (var i=0; i<str.length; i++) {

                        var c = str.charCodeAt(i);
                        if(c == 10){
                            len+=81;
                        }
                        //单字节加1
                        else if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                            len++;
                        }
                        else {
                            len+=2;
                        }
                        if(len > 308) {
                            if(c == 10 && count == 0){
                                // numIndex==0?(numIndex = i):(numIndex=numIndex);
                                len -= 81;
                                count = 1;
                            }else if(c == 10 && count != 0){
                                numIndex==0?(numIndex = i):(numIndex=numIndex);
                            }
                            else
                                numIndex==0?numIndex = i:numIndex=numIndex;
                        }


                    }
                    return {len:len, numIndex:numIndex};
                }
                return {len:0, numIndex:0}
            },
            getDescriptionType: function () {
                var strObj = this.strlen(this.mainModel.vo.description);
                var len = strObj.len;
                if(len > 304){
                    this.mainModel.isShowAllDescription = '2';
                }else this.mainModel.isShowAllDescription = 0;
            },
            getDescription: function (str) {
                // isShowAllDescription
                var numIndex = this.strlen(this.mainModel.vo.description).numIndex;
                if(this.mainModel.isShowAllDescription >1){
                    return str.slice(0,numIndex);
                }
                return str;
            },
            doRemoveFromEmer: function() {
                var _this = this;
                var ids = [this.mainModel.vo.id];
                this.$api.removeFromEmer(null, ids).then(function(res){
                    _this.$dispatch("ev_dtUpdate");
                    _this.$dispatch("ev_dtClose");
                });
            },
            changeCertRequired: function (checked) {
                this.mainModel.vo.isCertRequired = checked ? '1' : '0';
                this.mainModel.vo.recheckCycle = "";
            },
            // doPublish: function () {
            //     var _this = this;
            //     LIB.Modal.confirm({
            //         title: '确定上架?',
            //         onOk: function () {
            //             api.publish(_this.mainModel.vo).then(function (res) {
            //                 LIB.Msg.success("上架成功");
            //                 _this.mainModel.vo.disable = "0";
            //                 _this.changeView("view");
            //                 _this.$dispatch("ev_dtUpdate");
            //             })
            //         }
            //     });
            // },
            // doDisable: function () {
            //     var _this = this;
            //     LIB.Modal.confirm({
            //         title: '确定下架?',
            //         onOk: function () {
            //             api.disable(_this.mainModel.vo).then(function (res) {
            //                 LIB.Msg.success("下架成功");
            //                 _this.mainModel.vo.disable = "1";
            //                 _this.changeView("view");
            //                 _this.$dispatch("ev_dtUpdate");
            //             })
            //         }
            //     });
            // },
            doGetSubject: function (type) {
                var field = "subject" + type;
                var subject = "";
                _.each(this.mainModel.vo.course, function (value, key) {
                    if (key == field) {
                        subject = value;
                    }
                });
                return subject;
            },
            doAddKpoint: function (kpointId) {
                // if (this.mainModel.vo.isDataReferenced) {
                //     LIB.Msg.warning("课程被引用无法添加!");
                //     return;
                // }
                var param = {};
                param.courseId = this.mainModel.vo.id;
                if (typeof kpointId == "string") {
                    param.parentId = kpointId;
                    param.kpointType = "1";
                }

                param.opType = "create";
                param.courseType = this.mainModel.vo.type;
                this.formModel.courseKpointFormModel.show = true;
                this.$refs.coursekpointFormModal.init("create", param);
            },

            getKpointList: function () {
                //查询获取章节
                var _this = this;
                api.queryCourseKpoints({id: this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.kpointList = res.data;
                });
            },
            //章节信息保存
            doSaveCourseKpoint: function (data) {
               if (!data.videoModel.showVideoUploader) {
                data.fileType=null
               }
                var _this = this;
                api.saveCourseKpoint({id: dataModel.mainModel.vo.id}, data).then(function (res) {
                    _this.getKpointList();
                    _this.formModel.courseKpointFormModel.show = false;
                });
            },
            //章节信息保存
            doUpdateCourseKpoint: function (data) {
                var _vo = dataModel.mainModel.vo;
                var courseId = _vo.id;
                var _this = this;
                api.updateCourseKpoint({id: dataModel.mainModel.vo.id}, data).then(function (res) {
                    _this.getKpointList();
                });
                _this.formModel.courseKpointFormModel.show = false;
            },
            doUpdateKpoint: function (kpointId, data) {
                if (typeof kpointId != "string") {
                    LIB.Msg.info("系统异常");
                    return;
                }

                this.editKpointModel.show = true;
                this.editKpointModel.title = "修改章节";
                this.editKpointModel.type = "update";
                var param = {};
                param.id = kpointId;
                param.courseId = this.mainModel.vo.id;
                param.courseType = this.mainModel.vo.type;
                param.kpointType = data.kpointType;
                param.opType = "update";
                //this.$broadcast('ev_editKpointReload', param);
                this.formModel.courseKpointFormModel.show = true;
                this.$refs.coursekpointFormModal.init("update", param);
            },
            doDeleteKpoint: function (kpointId) {
                if (this.mainModel.vo.isDataReferenced) {
                    LIB.Msg.warning("课程被引用无法删除!");
                    return;
                }
                var _this = this;
                var ids = [];
                var delObj = {};
                delObj.id = kpointId;
                LIB.Modal.confirm({
                    title: '确定删除节点及其子节点?',
                    onOk: function () {
                        api.removeCourseKpoints({id: _this.mainModel.vo.id}, [{id: kpointId}]).then(function (res) {
                            LIB.Msg.success("删除成功");
                            _this.reload();
                            _this.$broadcast('ev_update')
                        })
                    }
                })
            },
            reload: function () {
                var _vo = dataModel.mainModel.vo;
                var courseId = _vo.id;
                api.queryCourseKpoints({id: courseId}).then(function (res) {
                    _vo.kpointList = res.data;
                });
                this.editKpointModel.show = false;
            },
            afterDoCancel: function () {
                this.mainModel.vo.frequence = parseInt(this.mainModel.vo.frequence);
            },

            gotoPaper:function (id) {
                window.open(LIB.ctxPath("/front/exampaper/view/" + id));
            },

            //点击详情查询
            afterInitData: function () {

                //this.getDescriptionType();


                //this.mainModel.vo.trainHour = parseFloat(this.mainModel.vo.trainHour);
                this.fileModel.default.cfg.params.recordId=this.mainModel.vo.id
                var _this = this;
                var _data = dataModel.mainModel;
                _this.industryName = "";
                this.mainModel.vo.frequence = parseFloat(this.mainModel.vo.frequence);
                _this.mainModel.categoryName = "";
                _this.mainModel.certificationsName = "";

                // 查询获取章节
                this.$api.queryCourseKpoints({id: _this.mainModel.vo.id}).then(function (res3) {
                    _this.mainModel.vo.kpointList = res3.data;
                });

                if (this.mainModel.vo.cloudFile.id) {
                    initUploadorRecordId(this.mainModel.vo.cloudFile.id);
                    this.courseIdUrl = LIB.convertImagePath(LIB.convertFileData(this.mainModel.vo.cloudFile));
                } else {
                    this.courseIdUrl = DEFAULT_IMG;
                }

                if (_this.mainModel.vo.id) {
                    initUploadorRecordId(_this.mainModel.vo.id);
                }
            },
            beforeDoSave: function () {
                if (this.mainModel.vo.type != 1)
                    this.mainModel.vo.isDownloadable = 0;
            },
            //获取课程类型的父节点
            rebuildCourseType: function (id) {
                var spliteChar = " / ";
                var name;
                var _this = this;
                _.each(_this.mainModel.categorys, function (item) {
                    if (id == item.id) {
                        //为了显示需要 父节点需要在前面
                        name = item.name + spliteChar + _this.mainModel.categoryName;
                        _this.mainModel.categoryName = name;
                        _this.rebuildCourseType(item.parentId);
                    }
                });
                //去掉最后的斜杠
                _this.mainModel.categoryName = _this.mainModel.categoryName.substr(0, _this.mainModel.categoryName.length - 1);
            },
            beforeInit: function (data, opType) {
                var _data = dataModel.mainModel;
                this.mainModel.vo.industryCategories = [];
                this.selectedCategory = [];
                this.selectedCertification = [];
                this.examinationPaper = [];
                this.analogVolume = [];
                this.examinationPaper = [];

                if (opType.opType === 'create') {
                    //创建一个recordId
                    var id = new Date().getTime().toFixed(9);
                    var recordId = id.toString().slice(0, 9);
                    initUploadorRecordId(recordId);
                }
                if (opType.opType === "update") {
                    this.selectedCategory.push(this.mainModel.vo.categorySubject);
                    this.selectedCertification.push(this.mainModel.vo.certificationSubject);
                }
            },
            // 重置滚动条顶部距离
            doResetScrollTop: function () {
                this.$nextTick(function () {
                    document.querySelectorAll('.detail-large-container')[0].scrollTop = 0;
                })
            },
            //新增
            afterInit: function () {
                this.doResetScrollTop();
                this.mainModel.vo.kpointList = [];
                if (this.mainModel.opType === 'create') {
                    this.mainModel.vo.type = '1';
                }
                this.isShowAllDescription = 0;
                this.mainModel.vo.activeKey = 'kpoint'; // 标签页初始化
                this.courseIdUrl = DEFAULT_IMG;

                // this.$refs.evaluation.doClean();
            },
            afterDoSave: function (type, data) {
                // 设置上传组件的recordId
                if (type.type === 'C') {
                    initUploadorRecordId(data.id);
                    this.mainModel.vo.disable = '1';
                }
                var _this = this;
                _this.mainModel.vo.attr1 = data.attr1;
                _this.mainModel.vo.orgId = data.orgId;
                _this.mainModel.certificationsName = "";

                //认证类型的name
                _.each(dataModel.mainModel.certifications, function (item2) {
                    if (_this.mainModel.vo.certificationSubject.id == item2.id) {
                        _this.mainModel.certificationsName = item2.name
                    }
                })
                this.afterInitData();
            },
            //编辑
            afterDoEdit: function () {
                this.doResetScrollTop();
                initUploadorRecordId(this.mainModel.vo.id);
                //课程类型跟取证类型的下拉树选中状态
                this.selectedCategory.push(this.mainModel.vo.categorySubject);
                this.selectedCertification.push(this.mainModel.vo.certificationSubject);
            },
            doUploadLogo: function (data) {
                this.mainModel.vo.cloudFile = data.rs.content;
                initUploadorRecordId(this.mainModel.vo.cloudFile.id);
                this.courseIdUrl = LIB.convertImagePath(LIB.convertFileData(data.rs.content));
            },
            doEditKpointFinished: function () {
                var _vo = dataModel.mainModel.vo;
                var courseId = _vo.id;
                api.listkpoint({id: courseId}).then(function (res) {
                    _vo.kpointList = res.data;
                });
                this.editKpointModel.show = false;
            },
            doPic: function (file) {
                this.picModel.show = true;
                this.picModel.file = LIB.convertFileData(file);
            },
            //删除文件
            doDeleteFile: function () {
                var _this = this;
                var fileId = this.mainModel.vo.cloudFile.id;
                if (!this.hasPermission('4020001035')) {
                    LIB.Msg.warning("你没有此权限!");
                    return;
                }

                LIB.Modal.confirm({
                    title: '确定删除?',
                    onOk: function () {
                        api.deleteFile(null, [fileId]).then(function (data) {
                            LIB.Msg.success("删除成功");
                            _this.mainModel.vo.cloudFile = {id: '', name: ''};
                            dataModel.courseIdUrl = DEFAULT_IMG;
                        })
                    }
                });
            },
            convertPicPath: LIB.convertPicPath,
            buildCoverImgURL: function (file, type) {
                if (!file || !file.id) {
                    return DEFAULT_IMG;
                }
                return LIB.convertImagePath(file, type);
            },
            doKPointFilter: function (kw) {
                kw = kw || '';
                this.filterModel.kPointKeyword = kw.trim();
            },
            kPointFilter: function (v) {
                return v.name.indexOf(this.filterModel.kPointKeyword) > -1;
            },
            kPointListFilter: function (v) {
                var _this = this;
                var hasChildInclude = false;
                if (v.kpointList && v.kpointList.length > 0) {
                    hasChildInclude = _.some(v.kpointList, function (item) {
                        return item.name.indexOf(_this.filterModel.kPointKeyword) > -1;
                    })
                }
                return !this.mainModel.vo.kpointList ||
                    v.name.indexOf(this.filterModel.kPointKeyword) > -1 || hasChildInclude;
            },
            doNoRetrainChange: function () {
                if (this.mainModel.vo.frequence === 0) this.mainModel.vo.frequence = '';
                else this.mainModel.vo.frequence = 0;
            },
            seeEvaluation: function () {
                window.open("/html/main.html#!/courseEvaluationView?id=" + this.mainModel.vo.id);
            },
            // 设置定时器监听播放页面的关闭事件
            addListen:function () {
                var _this = this;
                if(this.timeoutParam){
                    clearTimeout(this.timeoutParam);
                }
                this.timeoutParam = setTimeout(timeoutFun,3000);
                localStorage.setItem("tempStore", 0);
                function timeoutFun() {
                    if(localStorage.getItem("tempStore")!=0){
                        clearTimeout(_this.timeoutParam);
                        _this.init("view",_this.mainModel.vo.id);
                    }else{
                        _this.timeoutParam = setTimeout(timeoutFun,3000)
                    }
                }
            },
            doPlay: function (id, fileType) {
                // this.addListen();
                window.open(LIB.ctxPath("/icmfront/course/" + this.mainModel.vo.id + "?kpointId=" + id));
            },
            afterInitFileData: function(items){
                var files = [];
                _.forEach(items, function (item) {
                    if(item.dataType === 'ICM15') {
                        files.push({
                            fileId: item.id,
                            fileExt: item.ext,
                            orginalName: item.orginalName
                        })
                    }
                });
                this.fileModel.default.data = files;
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        },
    });

    return detail;
});