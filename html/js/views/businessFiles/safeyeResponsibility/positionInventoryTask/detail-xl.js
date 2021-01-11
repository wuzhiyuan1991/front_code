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
			//周期 1:天,2:月,3:旬,4:季度,5:半年,6:年(默认年)
			frequencyType : null,
			//1:未完成,2:已完成
			isComplete : null,
			//是否已读 0:未读,1:已读
			isRead : null,
			//当前期数
			num : null,
			//得分
			score : null,
			//开始时间
			startDate : null,
			//总期数
			total : null,
			//年份
			year : null,
			//岗位安全清单
			positionInventory : {id:'', name:''},
			//负责人
			user : {id:'', name:''},
			//执行记录
			positionInventoryRecord : {id:'', name:''},
            positions: null
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
				"endDate" : [LIB.formRuleMgr.allowStrEmpty],
				"frequencytype" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"isComplete" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"isRead" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"num" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"score" : [LIB.formRuleMgr.length(5)],
				"startDate" : [LIB.formRuleMgr.allowStrEmpty],
				"total" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"year" : [LIB.formRuleMgr.allowStrEmpty],
				"positionInventory.id" : [LIB.formRuleMgr.require("岗位安全清单")],
				"user.id" : [LIB.formRuleMgr.allowStrEmpty],
				"positionInventoryRecord.id" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
            groupTableModel: {
                columns: [
                    {
                        title: "量化考核内容",
                        fieldName: "content",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "考核标准",
                        fieldName: "standard",
                        width: "250px",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "考核落实结果",
                        fieldName: "result",
                        width: "250px",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "分值",
                        fieldName: "score",
                        width: "60px",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "实际得分",
                        fieldName: "actualScore",
                        width: "80px",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "考评简述",
                        fieldName: "evaluate",
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
        cloudFiles: null,
        groups: null,
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
		components : {

        },
		data:function(){
			return dataModel;
		},
        computed: {
            displayPositionText: function () {
                return _.pluck(this.mainModel.vo.positions, "name").join("、")
            },
            frequencyTypeText: function () {
                var text = this.getDataDic('isr_position_inventory_frequencyType', this.mainModel.vo.frequencyType)
                return "每" + text + "考核";
            },
            displayDate: function () {
                return this.mainModel.vo.startDate.substr(0, 10) + " ~ " + this.mainModel.vo.endDate.substr(0, 10);
            },
            displayPeriodText: function () {
                return "总共" + this.mainModel.vo.total + "期，当前第" + this.mainModel.vo.num + "期";
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
                api.listFile({recordId: this.mainModel.vo.positionInventoryId}).then(function (res) {
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