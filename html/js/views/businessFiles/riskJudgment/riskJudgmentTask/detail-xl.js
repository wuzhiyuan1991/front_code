define(function(require){
	var LIB = require('lib');
    var BASE = require('base');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var riskJudgmentTaskInfo = require("componentsEx/showRiskTaskDetail/main");
    var columns = [
        {
            title: '人员',
            render: function (data) {
                return data.name;
            },
            width: "150px"
        },
        {
            title: '部门',
            render: function (data) {
                return _.pluck(data.users, "username").join("，")
            },
            width: "150px"
        },
        {
            title: '岗位',
            render: function (data) {
                return _.pluck(data.subordinateUnits, "name").join("，")
            },
            width: "150px"
        },
        {
            title: '完成时间',
            render: function (data) {
                return _.pluck(data.subordinateUnits, "name").join("，")
            },
            width: "150px"
        },
        {
            title: '风险数',
            render: function (data) {
                return _.pluck(data.subordinateUnits, "name").join("，")
            },
            width: "150px"
        },
        {
            title: '考核状态',
            render: function (data) {
                return _.pluck(data.subordinateUnits, "name").join("，")
            },
            width: "150px"
        },

    ]

	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//
			compId : null,
			//
			orgId : null,
			//完成时间
			completeDate : null,
			//1:未完成,2:已完成
			isComplete : null,
			//研判层级名
			levelName : null,
			//额定完成时间
			ratedCompleteDate : null,
			//风险数
			riskNum : null,
			//下属Ids
			subordinateIds : null,
			//下级数量
			subordinateNum : null,
			//研判单位名称
			unitName : null,
			//负责人
			user : {id:'', name:''},
            riskJudgmentUnitId:null,
            riskJudgmentLevelId:null
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
				"code" : [LIB.formRuleMgr.length(100)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"completeDate" : [LIB.formRuleMgr.allowStrEmpty],
				"isComplete" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"levelName" : [LIB.formRuleMgr.length(100)],
				"ratedCompleteDate" : [LIB.formRuleMgr.allowStrEmpty],
				"riskNum" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"subordinateIds" : [LIB.formRuleMgr.length(1000)],
				"subordinateNum" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"unitName" : [LIB.formRuleMgr.length(100)],
				"user.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
            docVo:{
			    id:'',
                orginalName:''
            }
		},
		tableModel : {
            show : false,
            title :'详情',
            underlingTableModel: {
                url: "riskjudgmenttask/underling/list/{curPage}/{pageSize}",
                columns: [{
                    title: "人员",
                    fieldName: "user.name"
                },{
                    title:"部门",
                    fieldName:"levelName"
                }, {
                    title:"岗位",
                    // fieldName:"unitName",
                    render: function (data) {
                        if(data &&  data.user && data.user.positions && data.user.positions){
                            return  _.pluck(_.each(data.user.positions, function(item){
                                return item.postType == 0
                            }),"name").join("，")

                        }
                        else{
                            return ''
                        }
                    },
                },
                    {
                    title:"完成时间",
                    fieldName:'completeDate'
                },
                    {
                        title:"任务考核状态",
                        fieldName:'isComplete',
                        render:function (data) {
                            var isComplete = data.isComplete;
                            if (isComplete) {
                                if (isComplete === '1') {
                                    return "未办";
                                } else if (isComplete === '2') {
                                    return'<a style="color:#33a6ff;">已办</a>';
                                }
                            }
                            return "未办";
                        },
                        type:'cb',
                    },
                ],
                filterColumns:["user.username"],
                qryParam: {}
            },
		},

		formModel : {
		},
		cardModel : {
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
            riskJudgmentTaskInfoModel:{
			    visible: false
            }
		},
        activeTabId: '1',
        tabs: [
            {
                id: '1',
                name: "明细内容"
            },
            {
                id: '2',
                name: '下属上报'
            }
        ],
        groups:[],
        riskJudgmentLevelList:[],
        orderStatus:[{id:0, name:"全部"}, {id:1,name:"已办"}, {id:2,name:"未办"}],

        orderStatusIndex:0,
        checkedUserIndex:0,
        currentTaskList:[],
        oldTaskList:[],
        ids:[],
        oldList:[], //用于保存旧数据
        promiseObj:{},
        promiseContent:'', //研判承诺


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
		components : {
			// "userSelectModal":userSelectModal,
            "riskJudgmentTaskInfo":riskJudgmentTaskInfo
			
        },
		data:function(){
			return dataModel;
		},


		methods:{
			newVO : newVO,
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
				}
			},
            doTabClick: function (id) {
                this.activeTabId = id;

                if(this.activeTabId == 2){
                	this._getUserList();
				}
            },

            showDetailInfo:function (val) {
                if(val.entry.data.isComplete==2){
                    this.selectModel.riskJudgmentTaskInfoModel.visible = true;
                    this.$refs.detailInfo.doRefleshInfo(val.entry.data.id);
                }
            },

            getImageBaseUrl:function (fileId) {
                return BASE.SwConfig.url + "/file/image/" + fileId + "/" + "scale"
            },

            deel : function(textObj) {
                var template = textObj.content;
                if(template == '') return '';
                for(var item in textObj){
                    if(item == "content") continue;
                    // 过滤input
                    if(template.indexOf("{input_"+textObj[item].id+"}")>-1){
                        var textVal = textObj[item].value?textObj[item].value:'';

                        var str = "<span  disabled   class='"+textObj[item].class+"' >"+textVal+"</span>"
                        var order = '{input_'+item +"}";

                        if( textObj[item].class == "inputOperator" && textObj[item].fileId){
                            // 如果是图片 fileId
                            str = "<label  disabled   class='"+textObj[item].class+"' ><img src='"+this.getImageBaseUrl(textObj[item].fileId)+"' /></label>"
                        }
                        template = template.replace(order, str);
                    }
                    // 过滤select
                    if(template.indexOf("templateSelect_"+textObj[item].id)>-1){
                        // var str = "<select  disabled value='"+textObj[item].value+"' id='"+textObj[item].id+"' name='";
                        // str+= textObj[item].name+"' class='"+textObj[item].class+"' >"
                        // str+= "<option>"+textObj[item].value+"</option>";
                        // for(var i=0; i<textObj[item].list.length; i++){
                        //     if(textObj[item].value == textObj[item].list[i]){
                        //         continue;
                        //     }
                        //     str+= "<option>"+textObj[item].list[i]+"</option>"
                        // }
                        // str+="</select>"
                        var str = "" + textObj[item].value
                        var order = '{templateSelect_'+textObj[item].id+"}";
                        template = template.replace(order, str);
                    }
                    // 过滤多选框
                    // if(template.indexOf("templateCheck_"+textObj[item].id)>-1){
                    //     var str = "<p class='"+textObj[item].class+"'" + "name='mycheckBox' id='"+textObj[item].id+"'  style='display:inline-block;'>";
                    //     for(var i=0; i<textObj[item].list.length;i++){
                    //         str+= textObj[item].list[i] + "<input  disabled type='checkBox' value='"+textObj[item].list[i]+"' />";
                    //         // var order = 'templateSelect_'+textObj[item].id;
                    //     }
                    //     str+="</p>";
                    //     var order = '{templateCheck_'+textObj[item].id+"}";
                    //     template = template.replace(order, str);
                    // }
                    if(template.indexOf("templateCheck_"+textObj[item].id)>-1){

                        var str = "<p class='"+textObj[item].class+"'" + "name='mycheckBox' id='"+textObj[item].id+"'  style='display: inline-flex;align-items: center'>";
                        for(var i=0; i<textObj[item].list.length;i++){
                            str+="<span>"
                            if(this.checkUserEdit(textObj[item].value,textObj[item].list[i]) >-1){
                                str+= textObj[item].list[i] + "<input disabled type='checkBox' value='"+textObj[item].list[i]+"' checked=true />";
                            }else{
                                str+= textObj[item].list[i] + "<input disabled type='checkBox' value='"+textObj[item].list[i]+"' />";

                            }
                            str+="</span>"
                            // var order = 'templateSelect_'+textObj[item].id;
                        }
                        str+="</p>";
                        var order = '{templateCheck_'+textObj[item].id+"}";
                        template = template.replace(order, str);
                    }
                }
                return template;
            },

            checkUserEdit:function  (arg1, arg2) {
                var a = -1;
                for(var i=0; i<arg1.length; i++){
                    if(arg1[i] == arg2){
                        a = 1;
                    }
                }
                return a;
            },

            initGroup: function(valArr){
                var arr = valArr;
                this.groups = [];
                for(var i=0; i<arr.length; i++){
                    var obj = {name: '', content:' ', textObj:null};
                    var o ={};
                    obj.name = arr[i].groupName;

                    if(arr[i]){
                        var label = arr[i].allExclude;
                        if(label == 1)
                            obj.name += '（不涉及）';
                        else if(label == 0)
                            obj.name += '（涉及）';
                        else  obj.name += '';
                    }
                    obj.allExclude =  label;
                    obj.id = arr[i].id;
                    if(arr[i].itemContent) o.content = arr[i].itemContent;
                    else o.content = '';
                    if(valArr[i].riskTemplateConfig && arr[i].riskTemplateConfig.content!=''){
                        var temp = JSON.parse(arr[i].riskTemplateConfig.content);
                        for(var item in temp){
                            o[item] = temp[item];
                        }
                    }
                    obj.content = this.deel(o)
                    obj.textObj = o;
                    this.groups.push(obj);
                }
            },


            doSelectDepartment:function(index){
                var _this = this;
                this.checkedUserIndex =  index;
                if(this.mainModel.vo.subordinateIds){
                    this.ids = this.mainModel.vo.subordinateIds.split(",");
                }

                var param = {};

                if(this.checkedUserIndex != 0){
                    param = {
                        "criteria.strsValue": JSON.stringify({userId: [this.riskJudgmentLevelList[this.checkedUserIndex].userDetail.userId]})
                    };
                } else {
                    param = {
                        "criteria.strsValue": null
                    };
                }
                if(this.orderStatusIndex != 0){
                    param.isComplete = this.orderStatusIndex == 1 ? 2 : 1;
                }
                if(this.orderStatusIndex == 0){
                    param.isComplete = '';
                }
                param.id = this.mainModel.vo.id;
                param.riskJudgmentUnitId = this.mainModel.vo.riskJudgmentUnitId;
                this.tableModel.underlingTableModel.qryParam =  param;

                // this.getTaskLists()
                var arr = []
                for(var key in param){
                    var value = param[key]
                    var tableFilterData = {
                        type :　"save",
                        value : {
                            columnFilterName : key,
                            columnFilterValue : value
                        }
                    };
                    arr.push(tableFilterData)
                }
                this.$refs.rptDetailsTable.doCleanRefresh(arr);
            },

            getTaskLists:function () {
                var _this = this;
                this.ids = [];

                if(this.mainModel.vo.subordinateIds){
                    this.ids =  this.mainModel.vo.subordinateIds.split(',');
                }
                var param = {
                    "criteria.strsValue": JSON.stringify({userId: this.ids}),
                    riskJudgmentUnitId:this.mainModel.vo.riskJudgmentUnitId,
                };

                if(this.checkedUserIndex != 0){
                    param = {
                        "criteria":{"strsValue": JSON.stringify({userId: this.checkedUserIndex==1?this.ids[0]:this.ids[1]})}
                    };
                }
                if(this.orderStatusIndex != 0){
                    param.isComplete = this.checkedUserIndex==1?2:1;
                }

                this.tableModel.underlingTableModel.qryParam = param;

                api.riskjudgmenttaskUnderling(param).then(function (res) {
                    _this.currentTaskList = res.body.list;
                    _this.oldTaskList = res.body.list;
                })
            },


            doSelectComplete: function(index){
                this.orderStatusIndex = index;
                this.doSelectDepartment(this.checkedUserIndex);
            },

            _getUserList: function () {
                var _this = this;
                _this.riskJudgmentLevelList = [];
                _this.ids = [];
                if(this.mainModel.vo.subordinateIds){
                    this.ids =  this.mainModel.vo.subordinateIds.split(',');
                }

                if (this.ids && this.ids.length > 0) {
                    var param = {
                        "criteria.strsValue": JSON.stringify({userIds: this.ids})
                    };
                    api.riskjudgmenttaskUserList(param).then(function (res) {

                        _this.riskJudgmentLevelList = [{name: '全部'}].concat(res.data);
                    });
                }

                var qryParam = this.tableModel.underlingTableModel.qryParam;
                qryParam.id = this.mainModel.vo.id;
                qryParam.riskJudgmentUnitId = this.mainModel.vo.riskJudgmentUnitId;
                var arr = [];
                for(var key in qryParam){
                    var value = qryParam[key]
                    var tableFilterData = {
                        type :　"save",
                        value : {
                            columnFilterName : key,
                            columnFilterValue : value
                        }
                    };
                    arr.push(tableFilterData)
                }
                this.$refs.rptDetailsTable.doCleanRefresh(arr);
            },
            beforeInit: function () {
                this.groups = null;
                this.activeTabId = '1';
                this.checkedUserIndex = 0;
                this.orderStatusIndex = 0;
                this.mainModel.docVo = {id:null, orginalName:null};
            },

            // 初始化承诺
            initPromise:function (val) {
                if(this.mainModel.vo.isComplete == 1){
                    this.promiseObj  = JSON.parse(this.mainModel.vo.riskTemplateConfig.content);
                    this.promiseObj.content = this.mainModel.vo.promiseContent;
                    this.promiseContent = this.deel(this.promiseObj );
                }else{
                    if(!val.promiseContent) return;
                    this.promiseObj = JSON.parse(val.promiseContent);
                    this.promiseContent = this.deel(this.promiseObj);
                }
            },

			// =================  生命周期  ==============
            afterInitData: function () {
                var _this = this;
                // this.queryRiskjudgmentGroup();
                this.activeTabId ="1";
                this.checkedUserIndex=0;
                this.orderStatusIndex = 0;

                if(this.mainModel.vo.isComplete == 2){
                    api.riskjudgmenttaskCompany({"id":this.mainModel.vo.id}).then(function (res) {
                        var  content = res.content;
                        _this.initPromise(res.data);
                        // 过滤
                        var arr = res.data.riskJudgmentRecordDetails;
                        for(var i=0 ; i<arr.length; i++) {
                            var itemcontent = JSON.parse(arr[i].itemContent);
                            arr[i].riskTemplateConfig.content = arr[i].itemContent;
                            arr[i].itemContent = itemcontent.content;
                            arr[i].itemContent = itemcontent.content;
                        }
                        _this.oldList = res.data;
                        _this.initGroup(arr);

                    })
                } else {

                    api.riskjudgmenttaskdetail({"riskJudgmentTaskId": this.mainModel.vo.id}).then(function (res) {
                        _this.oldList = res.data;
                        _this.initGroup(res.body);
                        _this.initPromise();
                    });
                }
                var fileId = this.mainModel.vo.riskJudgmentTempleteId;
                if(!_.isEmpty(fileId)) {
                    var resource = this.$resource("file/list?recordId="+fileId);
                    resource.get({}).then(function(res){
                        var data = res.data;
                        _this.mainModel.docVo = [];
                        if(data.length && data.length > 0) {
                            // data = data[0];
                            // _this.mainModel.docVo.id = data.id;
                            // _this.mainModel.docVo.orginalName = data.orginalName;
                            _this.mainModel.docVo = data;
                        }
                    });
                }
            },

		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        },

	});

	return detail;
});