define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var recordDetail = require("./dialog/recordDetail");

	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//检查结果详情 如10/10,10条合格,10条不合格
			checkResultDetail : null,
			//检查结果 0:不合格,1:合格
			checkResult : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//检查时间
			checkDate : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//检查开始时间
			checkBeginDate : null,
			//检查结束时间
			checkEndDate : null,
			//来源 0:手机检查,1:web录入
			checkSource : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查人
			user : {id:'', name:''},
			//巡检表
			riCheckTable : {id:'', name:''},
			//巡检任务
			riCheckTask : null,
			//巡检计划
			riCheckPlan : {id:'', name:''},
			//巡检记录明细
			riCheckRecordDetails : [],
            cloudFiles: null,
            faceSignName:null // 人脸识别签名
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:""
		},
		tableModel: {
			columns: [
				{
					title: '巡检内容',
					fieldName: 'riCheckItem.name',
					width: "250px"
				},
                {
                    title: '巡查评判标准',
                    fieldName: 'riCheckItem.checkBasis'
                },
                {
                    title: '巡检类型',
					render: function (item) {
                    	var types = _.get(item, "riCheckItem.riCheckTypes");
                        var arr = _.map(types, function (val) {
                            return val.name
                        });
                        return arr.join(",")
                    },
                    width: "150px"
                },
                {
                    title: '巡检结果',
					event: true,
                    render: function (item) {
                    	var results = _.get(item, "riCheckItem.riCheckResults");
                    	if(results && results.length > 0) {
                            var result = results[0];
                            if(!_.isEmpty(result)) {
                                if(item.checkResult === '1') {
                                    return '<span style="color: blue;">' + result.name + '</span>'
                                } else {
                                    return '<span style="color: red;">' + result.name + '</span>'
                                }
                            }
                            return '';
						} else {
                    		var params = _.get(item, "riCheckItem.riCheckItemParam");
                    		var param = _.get(item, "checkParamResult");
                    		if(!params || !param) {
                    			return ''
							}
                    		if(item.checkResult === '1') {
                                return '<span style="color: blue;">' + param + params.unit + '</span>'
                            } else {
                                return '<span style="color: red;">' + param + params.unit + '</span>'
                            }
						}

                    },
                    width: "80px"
                },
                {
                    title: '现场情况描述',
                    fieldName: 'problem',
                    width: "150px"
                },
			]
        },
        showImg:false,
        showImage:true,
		checkAreas: null,
        checkedArea: null,
        routeAreas: null,
        checkedAreaIndex: 0,
		rdModel:{
			visible:false
		},
        images: null
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
			"recordDetail": recordDetail
        },
		computed: {
            checkResultText: function () {
                return LIB.getDataDic("checkResult", this.mainModel.vo.checkResult) || "不涉及";
            }
		},
		data:function(){
			return dataModel;
        },
		methods:{
            newVO : newVO,
            // 关闭预览
            getHide:function(){
                this.showImg=false
                this.showImage=true
            },
            // 查看签名
            doShowimg:function(){
             
                this.showImg=true
                this.showImage=false
                var _this = this;
                setTimeout(function () {
                    _this.$refs.imageViewer.view();
                }, 100);
            },
            doExportExcel: function () {
                var id = this.mainModel.vo.id;
                LIB.Modal.confirm({
                    title: '导出数据?',
                    onOk: function () {
                        window.open('/richeckrecord/' + id + '/exportExcel');
                    }
                });
            },
			afterInitData : function() {
				var _this = this;
				api.queryRiCheckRecordDetails({id: this.mainModel.vo.id}).then(function (res) {
					_this._convertData(_.get(res, "data.riCheckTable.riCheckAreaTpls"));
                });
                this.images = _.map(this.mainModel.vo.cloudFiles, function (file) {
                    return {
                        fileId: file.id
                    }
                });
             
                   
                
			},
            _convertCheckAreaArray: function (items) {
                var _this = this;
                if(!_.isArray(items)) {
                    return;
                }
                var splitLength = 6;

                var arr = [];
                _.each(items, function (item) {
                    if(item.orgId == _this.mainModel.vo.orgId) {
                        arr.push({
                            name: item.name
                        })
                    }
                });
                var length = arr.length;
                _.each(arr, function (item, index) {
                    item.total = length;
                    item.index = index + 1;
                    arr[index] = item;
                });

                arr = _.chunk(arr, splitLength);

                arr = _.forEach(arr, function (item, index) {
                    if(index % 2 !== 0) {
                        item.reverse();
                    }
                });

                this.routeAreas = arr;

            },
			_convertData: function(items) {
                var _this = this;
				if(!_.isArray(items)) {
                    this.checkAreas = [];
                    this.checkedArea = null;
				}
                var _getEquipmentStateName = function (state) {
                    var stateObj = {
                        "0": "在用",
                        "1": "备用",
                        "2": "维修"
                    };
                    if(!state) {
                        return '';
                    }
                    return '(' + stateObj[state] + ")"
                };
				this._convertCheckAreaArray(items);

				var res = [];
                _.each(items, function (item) {
                    if(item.orgId == _this.mainModel.vo.orgId){
                        var ret = {name: item.name, result0Num: 0, points:[]};
                        _.each(item.riCheckPointTpls, function (point) {
                            if(point.orgId == _this.mainModel.vo.orgId) {
                                ret.points.push({
                                    name: point.name + _getEquipmentStateName(point.equipmentState),
                                    checkItems: point.riCheckItemResultBeans
                                })
                            }
                        })

                        _.forEach(ret.points, function (point) {
                            var count = _.filter(point.checkItems, function (item) {
                                return _.get(item, "checkResult") === "0";
                            });
                            ret.result0Num += count.length;
                        });

                        res.push(ret);
                    }
                });

                this.checkAreas = res;
                this.checkedArea = res[0];
			},
			beforeInit : function() {
                this.checkAreas = null;
                this.checkedArea = null;
                this.checkedAreaIndex = 0;
                this.routes = null;
                this.mainModel.vo.cloudFiles = null;
                this.showImg=false
                this.showImage=true
			},
            doSelectArea: function (index) {
				this.checkedAreaIndex = index;
                this.checkedArea = this.checkAreas[index]
            },
            doShowDetailModal: function (item) {
                this.$broadcast("ev_record_detail",item.checkRecordDetailId, item);
                this.rdModel.visible = true;
            },
            /**
             *
             * @param gi groupIndex 6个为一组，组的序号，从0开始
             * @param item 每一个检查点
             * @return {Array}
             */
            calcClass: function (gi, item) {
                var splitLength = 6;

                var res = [];
                var _cls;

                // 1.长度为1时去掉线
                if(item.total === 1) {
                    res.push('line-zero');
                    return res;
                }
                // 2.第一个去掉左半边的线
                if (item.index === 1) {
                    res.push('half-right');
                    return res;
                }
                // 3.最后一项 根据行数判断去掉左半边还是右半边的线
                if (item.index === item.total) {
                    _cls = gi % 2 === 0 ? 'half-left' : 'half-right';
                    res.push(_cls);
                    return res;
                }
                // 4. 其他不是行首或者行尾的
                if(item.index % splitLength !== 0) {
                    return res;
                }
                // 5. 其他事行首或者行尾的需要加转折线
                var results = {
                    "0": 'odd-end', // 奇数行最后一个
                    "1": "even-end" // 偶数行最后一个
                };
                var key = '' + (gi % 2);
                if(item.index < item.total) {
                    res.push(results[key]);
                }
                return res;
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