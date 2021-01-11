define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");

    var DEFAULT_IMG = 'css/images/course2.jpg';
	//初始化数据模型
	var newVO = function() {
		return {
			//课程id
            id: null,
            //编码
            code: null,
            //上架/下架状态 0上架 1下架
            disable:null,
            //课程类型名称
            attr1: null,
            //课程名称
            name: null,
            //课程类型
            categorySubject: {id: null},
            //默认复培周期 以年为单位,0表示无需复培
			frequence : null,
			//是否可以下载课件 默认1允许 0不允许
			isDownloadable : '1',
			//语言 0中文 1英语 2其他
			language : '0',
            //默认培训时长 单位天
			defaultPeriod : null,
			orgId:null,
            //公司Id
            compId: null,
            //授课类型 1自学 2教学 3实操
            type: '1',
            //培训要求 默认2掌握 1了解 2掌握 3掌握及指导他人 4资质取证
			requirement : '2',
            //培训学时
            trainHour: null,
            //取证类型
            certificationSubject : {id: "", name: ""},
            cloudFile: {id: "", name: ""},
            //课程简介
            description: null,
            //课程章节
            kpointList: [],
            //判断是否被引用
            isDataReferenced: false,
			//讲师
			teachers:[],
			//学习详情
			studyDetails : [],
			//模拟卷
			analogVolume : [],
			//所属行业
			industry:null,

		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
	        },
	        emptyRules:{},
		},
		tableModel : {
			teacherTableModel: {
                url: "course/teachers/list/{curPage}/{pageSize}",
                columns: [{
                    title: "编码",
                    fieldName: "code"
                }, {
                    title: "讲师名称",
                    fieldName: "name",
                }]
            },
            industryCategoryTableModel: {
                url: "course/industrycategories/list/{curPage}/{pageSize}",
                columns: [{
                    title: "编码",
                    fieldName: "code"
                }, {
                    title: "行业名称",
                    fieldName: "name",
                }]
            },
            examPointTableModel: LIB.Opts.extendDetailTableOpt({
                url: "course/exampoints/list/{curPage}/{pageSize}",
                columns: [
                    {
                        title: "知识点名称",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                        width: 300
                    },
                    _.extend(_.omit(LIB.tableMgr.column.company, "filterType"))]
            }),
		},
		formModel : {
		},
		cardModel : {
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
		selectModel : {
		},
		//模拟卷
        analogVolume: [],
        //模拟卷
        examinationPaper: [],
        referenceMaterials:[],
        //图片地址
        courseIdUrl: DEFAULT_IMG,
        picModel: {
            title: "图片显示",
            show: false,
            id: null
        },
	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doAddToTask : function() {
				var _this = this;
                var vo = this.mainModel.vo;
                LIB.Modal.confirm({
                    title: '确定添加任务?',
                    onOk: function () {
                        api.createTrainTask({
                            course: {id:vo.id}
                        }).then(function (res) {
                            LIB.Msg.info("添加成功!");
                            _this.$dispatch("ev_dtDelete");

                        });

                    }
                });
			},
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            buildCoverImgURL: function (fileId, type) {
                if (!fileId) {
                    return DEFAULT_IMG;
                }
                return LIB.convertPicPath(fileId, type)
            },
			doPlay: function (kpointId) {
            	window.open(LIB.ctxPath("/front/course/" + this.mainModel.vo.id + "?kpointId=" + kpointId));
            },
            doStartExercise : function(paperId) {
            	window.open(LIB.ctxPath("/front/exercise/course/"+paperId));
            },
            getKpointList: function () {
                //查询获取章节
                var _this = this;
                api.queryCourseKpoints({id: this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.kpointList = res.data;
                });
            },
            beforeInit : function() {
            	this.$refs.exampointTable.doClearData();
                this.$refs.industrycategoryTable.doClearData();
                this.referenceMaterials = [];
                this.examinationPaper = [];
                this.analogVolume = [];
                this.mainModel.vo.kpointList = [];
            },
			afterInitData : function() {
				var _this = this;
                this.$refs.industrycategoryTable.doQuery({id: this.mainModel.vo.id});
                this.$refs.exampointTable.doQuery({id: this.mainModel.vo.id});
				api.get({id:_this.mainModel.vo.id}).then(function(rest){
					_.deepExtend(_this.mainModel.vo, rest.data);
					_this.mainModel.vo.frequence = rest.data.frequence.charAt(0);
					if ( _this.mainModel.vo.frequence != 0) {
						_this.mainModel.vo.frequence = parseFloat(_this.mainModel.vo.frequence) + "个月";
                    } else if (_this.mainModel.vo.frequence == 0) {
                    	_this.mainModel.vo.frequence = "无需复培";
                    }
					_this.mainModel.vo.trainHour = parseFloat(rest.data.trainHour);
				});

                // 课程封面
                if (this.mainModel.vo.cloudFile.id) {
                    this.courseIdUrl = LIB.convertPicPath(this.mainModel.vo.cloudFile.id);
                } else {
                    this.courseIdUrl = DEFAULT_IMG;
                }
				
				this.getKpointList();
				
				_this.mainModel.vo.percent = _this.mainModel.vo.percent +"%";
				
				//获取模拟试卷
                api.queryExamPapers({
                    id: _this.mainModel.vo.id,
                    "criteria.intValue": {examPaperType: 2}
                }).then(function (res4) {
                    _this.analogVolume = res4.data;
                });

                //获取考试卷
                api.queryExamPapers({
                    id: _this.mainModel.vo.id,
                    "criteria.intValue": {examPaperType: 3}
                }).then(function (res5) {
                    _this.examinationPaper = res5.data;
                });

                //查询上传课件
                _this.referenceMaterials = [];
                //初始化
                api.listFile({recordId: _this.mainModel.vo.id, dataType: "L2"}).then(function (res) {
                    var fileData = res.data;
                    dataModel.referenceMaterials = [];
                    _.each(fileData, function (pic) {
                        if (pic.dataType == "L2") {
                            dataModel.referenceMaterials.push({fileId: pic.id, orginalName: pic.orginalName});
                        }
                    });
                });

			},

		},
		events : {
		},
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});