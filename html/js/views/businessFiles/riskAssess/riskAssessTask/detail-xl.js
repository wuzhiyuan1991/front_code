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
			//1:班组级,2:工段级,3:车间级,4:厂级,5公司级
			controlRank : null,
			//结束时间
			endDate : null,
			//1:未完成,2:已完成
			isComplete : null,
			//是否已读 0:未读,1:已读
			isRead : null,
			//开始时间
			startDate : null,
			//执行记录
			riskAssessRecord : {id:'', name:''},
			//安全风险研判
			riskAssess : {id:'', name:''},
			//负责人
			user : {id:'', name:'', orgId: ''},
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
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"completeDate" : [LIB.formRuleMgr.allowStrEmpty],
				"controlRank" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"endDate" : [LIB.formRuleMgr.allowStrEmpty],
				"isComplete" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"isRead" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"startDate" : [LIB.formRuleMgr.allowStrEmpty],
				"riskAssessRecord.id" : [LIB.formRuleMgr.allowStrEmpty],
				"riskAssess.id" : [LIB.formRuleMgr.require("安全风险研判")],
				"user.id" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
            groupTableModel: {
                columns : [
                    {
                        title : "研判项",
                        fieldName : "content",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title : "标准",
                        fieldName : "standard",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                        width: "300px",
                    },
                    {
                        title : "落实结果",
                        fieldName : "result",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                        width: "300px",
                    },
                    {
                        title : "检查情况",
                        fieldName : "score",
                        width: "120px",
                        render: function (data) {
                            var o = {
                                "0": "不符合",
                                "1": "符合",
                                "2": "不涉及"
                            };
                            return data.checkResult ? o[data.checkResult] : ""
                        }
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
        }
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
		components : {
        },
		data:function(){
			return dataModel;
		},
        computed: {
            displayYearText: function () {
                return this.mainModel.vo.startDate.substr(0, 16) + " ~ " + this.mainModel.vo.endDate.substr(0, 16);
            }
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
                api.listFile({recordId: this.mainModel.vo.riskAssessId}).then(function (res) {
                    _this.cloudFiles = res.data;
                });
                if (this.mainModel.vo.isComplete === '2') {
                    this._getGroupList();
                }
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