define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
    var videoHelper = require("tools/videoHelper");

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//完成时间
			completeDate : null,
			//结束时间
			endDate : null,
			//1:未完成,2:已完成
			isComplete : null,
			//是否已读 0:未读,1:已读
			isRead : null,
			//得分
			score : null,
			//开始时间
			startDate : null,
			//设置
			commitmentSetting : {type: '', year: ''},
			//执行记录
			commitmentRecord : {id:'', name:''},
			//安全承诺书
			commitment : {id:'', name:''},
			//负责人
			user : {id:'', name:''},
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
	        }
		},
        tableModel : {
            commitmentGroupTableModel: {
                columns : [
                    {
                        title : "量化考核内容",
                        fieldName : "content",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title : "考核标准",
                        fieldName : "standard",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                        width: "240px",
                    },
                    {
                        title : "考核落实结果",
                        fieldName : "result",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                        width: "240px",
                    },
                    {
                        title : "分值",
                        fieldName : "score",
                        width: "80px",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title : "实际得分",
                        fieldName : "actualScore",
                        width: "80px",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title : "考评简述",
                        fieldName : "evaluate",
                        width: "200px",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: '附件',
                        render: function (data) {
                            var result = '';
                            var files = _.filter(data.cloudFiles, function (item) {
                                return !_.includes(['AQZRZ3', 'AQZRZ7', 'FXYP3'], item.dataType);
                            });
                            _.forEach(files, function (item) {
                                result += '<div class="lite-table-file-row" data-action="VIEWFILE" data-id="' + item.id + '" title="' + item.orginalName + '">' + item.orginalName +'</div>';
                            });
                            return result;
                        },
                        event: true,
                        width: "150px"
                    }
                ]
            }
        },
		groups: null,
        cloudFiles: null,
        images: null,
        playModel:{
            title : "视频播放",
            show : false,
            id: null
        },
        audioModel: {
            visible: false,
            path: null
        },
        totalScore: 0,
        totalActualScore: 0
	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	 el
		 template
		 components
		 componentName
		 props
		 data
		 computed
		 watch
		 methods
			 _XXX    			//内部方法
			 doXXX 				//事件响应方法
			 beforeInit 		//初始化之前回调
			 afterInit			//初始化之后回调
			 afterInitData		//请求 查询 接口后回调
			 afterInitFileData  //请求 查询文件列表 接口后回调
			 beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
			 afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
			 buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
			 afterDoSave		//请求 新增/更新 接口后回调
			 beforeDoDelete		//请求 删除 接口前回调
			 afterDoDelete		//请求 删除 接口后回调
		 events
		 vue组件声明周期方法
		 init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		data:function(){
			return dataModel;
		},
		computed: {
            displayDate: function () {
				return this.mainModel.vo.startDate.substr(0, 10) + "~" + this.mainModel.vo.endDate.substr(0, 10);
            },
            displayYearText: function () {
                var vo = this.mainModel.vo;
                var type = _.get(vo, "commitmentSetting.type", "1");
                var year = _.get(vo, "commitmentSetting.year", "");
                var halfYear = _.get(vo, "commitmentSetting.halfYear", "1");
                var quarter = _.get(vo, "commitmentSetting.quarter", "1");
                var halfMap = {
                    "1": "上半年",
                    "2": "下半年"
                };
                var quarterMap = {
                    "1": "第一季度",
                    "2": "第二季度",
                    "3": "第三季度",
                    "4": "第四季度"
                };
                var yearText = year.substr(0, 4) + "年";
                if (type === '1') {
                    return yearText;
                } else if (type === '2') {
                    return yearText + halfMap[halfYear];
                } else if (type === '3') {
                    return yearText + quarterMap[quarter];
                }

                return "";
            },
		},
		methods:{
			newVO : newVO,
            _getGroupList: function () {
                var container = this.$els.container;
                var top = container.scrollTop;
                var _this = this;
                api.getGroupList({id: this.mainModel.vo.id}).then(function (res) {
                    var groups = res.data.group;
                    var items = res.data.item;
                    _this._convertData(groups, items);
                    _this.$nextTick(function () {
                        container.scrollTop = top;
                    })
                })
            },
            _convertData: function (groups, items) {
                // 组按orderNo排序
                var _groups = _.sortBy(groups, function (group) {
                    return parseInt(group.orderNo);
                });
                // 项按stepId分组
                var _items = _.groupBy(items, "groupId");
                // 项按orderNo排序, 并将项添加到对应的组中
                _.forEach(_groups, function (group) {
                    group.items = _.sortBy(_items[group.id], function (item) {
                        return parseInt(item.orderNo);
                    });
                });

                this.groups = _groups;
                this._calculateTotalScore();
            },
            _calculateTotalScore: function () {
                var total = 0;
                var totalActual = 0;
                _.forEach(this.groups, function (group) {
                    _.forEach(group.items, function (item) {
                        total = total + (Number(item.score) || 0);
                        totalActual = totalActual + (Number(item.actualScore) || 0);
                    })
                });
                this.totalScore = total;
                this.totalActualScore = totalActual;
            },
            onRowClicked: function (item, e) {
                  var el = e.target;
                  var action = _.get(el, "dataset.action");
                  if (action !== 'VIEWFILE') {
                      return;
                  }
                  var files = item.cloudFiles;
                  var fileId = el.dataset.id;
                  var index = _.findIndex(files, "id", fileId);

                  this.doClickFile(index, files);
            },

            doClickFile: function (index, fileList) {
                var files = fileList || this.cloudFiles;
                var file = files[index];
                var _this = this;
                var images;
                if (_.includes(['AQZRZ2', 'AQZRZ6', 'FXYP2'], file.dataType)) {

                    this.playModel.show=true;
                    setTimeout(function() {
                        videoHelper.create("player",file.id);
                    }, 50);

                } else if (_.includes(['AQZRZ4', 'AQZRZ8', 'FXYP4'], file.dataType)) {
                    this.audioModel.path = file.ctxPath;
                    this.audioModel.visible = true;
                }
                else if (_.includes(['png', 'jpg', 'jpeg'], file.ext)) {
                    images = _.filter(files, function (item) {
                        return _.includes(['png', 'jpg', 'jpeg'], item.ext) && !_.includes(['AQZRZ3', 'AQZRZ7', 'FXYP3'], item.dataType)
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
			beforeInit: function () {
                this.groups = null;
                this.cloudFiles = null;
            },
            afterInitData: function () {
                var _this = this;
				if (this.mainModel.vo.isComplete === '2') {
                    this._getGroupList();
                }
                api.listFile({recordId: this.mainModel.vo.commitmentId}).then(function (res) {
                    _this.cloudFiles = res.data;
                })
            }
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});