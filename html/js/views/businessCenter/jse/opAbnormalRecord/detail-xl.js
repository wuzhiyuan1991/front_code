define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
    var viewDetailComponent = require("./dialog/viewDetail");

    var principalTypes = {
        '1': '检修作业人员',
        '2': '检修负责人',
        '3': '监护人'
    };
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//唯一标识
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : null,
			//作业开始时间
			startTime : null,
			//所属部门id
			orgId : null,
			//作业结束时间
			endTime : null,
			//记录类型 1:操作票作业记录,2:维检修作业记录
			type : null,
			//作业全部设备号
			equipNos : null,
			//所属公司id
			compId : null,
			//操作地点
			site : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//卡票
			opCard : {id:'', name:'', attr1: '', content: '',specialityType:''},
			//维检修作业明细
			opMaintRecordDetails : [],
			//操作票作业明细
			opStdRecordDetails : [],
			//负责人
			principals : [],
			//监护人
			supervisors : [],
			//操作人
			operators : [],
            equipName: null,
            signStartTime: null,
            signEndTime: null
		}
	};

    var mColumns = [
        {
            title: "序号",
            fieldName: "num",
            width: 60
        },
        {
            title: "操作内容",
            fieldName: "content",
            keywordFilterName: "criteria.strValue.keyWordValue_content",
            renderClass: 'textarea-autoheight'
        },
        {
            title: "负责人",
            width: 250,
            fieldType: 'custom',
            render: function (data) {
                var types = _.map(data.opMaintStepItemPrinTypes, function (item) {
                    return item.principalType;
                });
                return _.map(types, function (item) {
                    return principalTypes[item]
                }).join('、');
            }
        },
        {
            title: "操作确认",
            width: 100,
            fieldType: 'custom',
            showTip: false,
            render: function (data) {
                if (data.attr1 !== '1') {
                    return  '<span style="color: red;">不涉及</span>'
                }
                var icon = '<i class="ivu-icon ivu-icon-ios-checkmark-outline" style="font-size:22px; color: orange;margin-right: 5px;" ></i>';
                var result = '';
                _.forEach(data.opMaintStepItemPrinTypes, function () {
                    result += icon;
                });
                return result;
            }
        },
        {
            title: "",
            width: 60,
            fieldType: 'custom',
            showTip: false,
            render: function (data) {
                if (data.isFile === '1') {
                    return '<i class="ivu-icon ivu-icon-image" style="font-size:20px; color: #0075d3;cursor: pointer;" ></i>'
                }
                return ''
            }
        }
    ];
    var sColumns = [
        {
            title : "操作内容",
            fieldName : "content",
            keywordFilterName: "criteria.strValue.keyWordValue_content",
            renderClass: 'textarea-autoheight'
        },
        {
            title : "风险及控制措施",
            fieldName : "risk",
            keywordFilterName: "criteria.strValue.keyWordValue_risk",
            renderClass: 'textarea-autoheight'
        },
        // {
        //     title : "控制措施",
        //     fieldName : "ctrlMethod",
        //     keywordFilterName: "criteria.strValue.keyWordValue_ctrl_method",
        //     renderClass: 'textarea-autoheight'
        // },
        {
            title: "操作人",
            width: 90,
            fieldType: 'custom',
            render: function (data) {
                if (data.isOpConfirmed !== '1') {
                    return  '<span style="color: red;">不涉及</span>'
                }
                return '<i class="ivu-icon ivu-icon-ios-checkmark-outline" style="font-size:22px; color: orange;" ></i>'
            }
        },
        {
            title: "监护人",
            width: 90,
            showTip: false,
            fieldType: 'custom',
            render: function (data) {
                if (data.isOpConfirmed !== '1') {
                    return  '<span style="color: red;">不涉及</span>'
                }
                return '<i class="ivu-icon ivu-icon-ios-checkmark-outline" style="font-size:22px; color: orange;" ></i>'
            }
        },
        {
            title: "",
            width: 60,
            fieldType: 'custom',
            showTip: false,
            render: function (data) {
                if (data.isFile === '1') {
                    return '<i class="ivu-icon ivu-icon-image" style="font-size:20px; color: #0075d3;cursor: pointer;" ></i>'
                }
                return ''
            }
        }
    ];
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:""
		},
		groups: null,
        equipments: [],
        equipmentIndex: 0,
        columns: null,
        cardModel : {
            stepCardModel : {
                showContent : true
            }
        },
        viewDetailModel: {
            //控制编辑组件显示
            title: "操作详情",
            //显示编辑弹框
            show: false,
            id: null
        },
        //无需附件上传请删除此段代码
		/*
		fileModel:{
			default : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					}
				},
				data : []
			}
		}
		*/
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
        components: {
            "view-detail-component": viewDetailComponent
        },
		data:function(){
			return dataModel;
		},
        computed: {
            cardTitle: function () {
                return this.mainModel.vo.type === '1' ? '操作明细' : '工序明细';
            }
        },
		methods:{
			newVO : newVO,
            doPreview: function () {
                this.$emit("on-preview", this.mainModel.vo.id, this.mainModel.vo.type)
            },
            doChangeEquipment: function (index) {
                this.equipmentIndex = index;
                this._convertMData();
            },
            _convertMData: function () {

                // 组按orderNo排序
                var _groups = _.sortBy(this._groups, function (group) {
                    return parseInt(group.orderNo);
                });

                var equipNo = this.equipments[this.equipmentIndex];
                var items = _.filter(this._items, function (item) {
                    return item.equipNo === equipNo
                });
                // 项按stepId分组
                var _items = _.groupBy(items, "stepId");

                // 项按orderNo排序, 并将项添加到对应的组中
                _.forEach(_groups, function (group, i) {
                    var gi = _.sortBy(_items[group.id], function (item) {
                        return parseInt(item.orderNo);
                    });
                    gi = _.map(gi, function (item, j) {
                        return {
                            content: item.content,
                            orderNo: item.orderNo,
                            id: item.id,
                            detailId: item.detailId,
                            cardId: item.cardId,
                            num: i + _.padLeft(j + 1, 2, '0'),
                            stepId: item.stepId,
                            isFile: item.isFile,
                            opMaintStepItemPrinTypes: item.opMaintStepItemPrinTypes,
                            attr1: item.isOpConfirmed
                        }
                    });
                    group.items = gi;
                });

                this.groups = _groups;
            },
            _convertSData: function (groups, items) {
                // 组按orderNo排序
                var _groups = _.sortBy(groups, function (group) {
                    return parseInt(group.orderNo);
                });
                // 项按stepId分组
                var _items = _.groupBy(items, "stepId");
                // 项按orderNo排序, 并将项添加到对应的组中
                _.forEach(_groups, function (group) {
                    group.items = _.sortBy(_items[group.id], function (item) {
                        return parseInt(item.orderNo);
                    });
                });

                this.groups = _groups;
            },
            doClickCell: function (data) {
                var target = data.event.target;
                if (!target.classList.contains("ivu-icon-image")) {
                    return;
                }
                var id = data.entry.data.detailId;
                var content = data.entry.data.content;
                this.$broadcast('ev_viewDetailReload', id, content);
                this.viewDetailModel.show = true;
            },
			afterInitData : function() {
				var _this = this;
				var vo = this.mainModel.vo;
				vo.equipNos = vo.equipNos ? vo.equipNos.replace(/[\["\]]/g, "") : "";
				if (vo.type === '1') {
					this.columns = sColumns;
                    api.querySRecord({id: this.mainModel.vo.id}).then(function (res) {
                        var groups = res.data.step;
                        var items = res.data.item;
                        _this._convertSData(groups, items);
                    })
				} else if (vo.type === '2') {
                    this.columns = mColumns;
                    api.queryMRecord({id: this.mainModel.vo.id}).then(function (res) {
                        _this._groups = res.data.step;
                        _this._items = res.data.item;
                        _this.equipments = res.data.equip;
                        _this._convertMData();
                    });
				}

			},
			beforeInit : function() {
                this.equipments = [];
                this.equipmentIndex = 0;
			},

		},
		events : {
            "ev_viewDetailClose": function () {
                this.viewDetailModel.show = false;
            }
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});