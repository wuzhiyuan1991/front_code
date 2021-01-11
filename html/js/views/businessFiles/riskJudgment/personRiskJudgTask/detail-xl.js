define(function(require){
	var LIB = require('lib');
	var BASE = require('base');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var riskJudgmentTaskInfo = require("componentsEx/showRiskTaskDetail/main");

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
                    render: function (data) {
                        if(data &&  data.user && data.user.positions){
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
                        type:'cb'
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
        checkDataModel: {
            visible: false,
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

        isAction:false,
        oldList:[],
        promiseObj:{},
        promiseContent:'', //研判承诺
        asignFile:''

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
			"userSelectModal":userSelectModal,
            "riskJudgmentTaskInfo":riskJudgmentTaskInfo
        },
		data:function(){
			return dataModel;
		},
        props:{

        },
		methods:{
			newVO : newVO,

            showDetailInfo:function (val) {
                if(val.entry.data.isComplete==2){
                    this.selectModel.riskJudgmentTaskInfoModel.visible = true;
                    this.$refs.detailInfo.doRefleshInfo(val.entry.data.id);
                }
            },

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

            doSave:function () {
			    var _this = this;
			    var obj = {
                    compId : this.mainModel.vo.compId,
                    judgmentTaskId: this.mainModel.vo.id,
                    riskJudgmentLevelId:  this.mainModel.vo.riskJudgmentLevelId,
                    riskJudgmentUnitId: this.mainModel.vo.riskJudgmentUnitId,
                    userId:this.mainModel.vo.userId,
                    lastTemplateConId:this.mainModel.vo.lastTemplateConId,

                }
			    var eles = document.getElementsByName("myContent");
			    var list= []
                for(var i=0; i<eles.length-1; i++){
                    var textObj = {};
                    var temp = this.toMyAttemplate(eles[i].innerHTML,i);
                    textObj.allExclude = this.groups[i].allExclude==1?1:0;
                    textObj.itemContent = JSON.stringify(temp);
                    list.push(textObj);
                    // this.oldList[i].itemContent = JSON.stringify(temp);
                }
                // 校验是否填写完整 1表示启动过滤掉整租排除
                if(!this.checkEditInfo(list, 1)){
                    LIB.Msg.info("信息未填写完整");
                    return;
                }
                var promiseTemp = this.toMyAttemplate(eles[i].innerHTML,i);
                promiseTemp.itemContent = JSON.stringify(promiseTemp);

                // 校验是否填写完整
                if(!this.checkEditInfo([promiseTemp])){
                    LIB.Msg.info("信息未填写完整");
                    return;
                }

                for(var i=0; i<list.length; i++){
                    this.oldList[i].allExclude = 3;
                    if(this.groups[i].allExclude || this.groups[i].allExclude==0){
                        this.oldList[i].allExclude = this.groups[i].allExclude;
                    }
                    this.oldList[i].itemContent = list[i].itemContent;
                }

                obj.promiseContent = promiseTemp.itemContent;
                obj.riskJudgmentRecordDetails =   this.oldList;
                api.submitRiskInfo(obj).then(function () {
                    // _this.$dispatch("ev_selectItemFinshed", dataModel);
                    // _this.mainModel.isReadOnly = true;
                    _this.$dispatch("ev_dtUpdate");
                    _this.mainModel.vo.isComplete = '2';
                    _this.afterInitData();

                })
            },

            // 判断填写内容是否为空
            checkEditInfo:function (arr, isOut) {
                var isTrue = true;
                var groups = [];
                for(var i=0; i<arr.length; i++){
                    groups[i] = {};
                    // 排除项不校验
                    if(isOut == 1 && this.groups[i].allExclude == 1){
                        continue
                    }
                    groups[i].textObj =  JSON.parse(arr[i].itemContent);
                    if(groups[i].textObj){
                        for(var item in groups[i].textObj){
                            if(item == "content" || item == 'allExclude'){
                                continue;
                            }
                            if(groups[i].textObj[item].value && groups[i].textObj[item].value.length>0 && groups[i].textObj[item].value!=' '&&groups[i].textObj[item].value!=''){
                                continue;
                            }else{

                                isTrue = false;
                            }
                        }
                    }
                }
                return isTrue;
            },
// val = 1, 就是排除整租不能编辑
            deel : function(textObj, val) {
                var template = textObj.content;
                if(template == '') return '';
                for(var item in textObj){
                    if(item == "content") continue;
                    if(!item) continue;
                    // 过滤input
                    if(template.indexOf("{input_"+textObj[item].id+"}")>-1){
                        if(this.isAction && val!=1){
                           var now = new Date();
                            // 判断是否 日期 操作人员签名
                            if(textObj[item].class == "input_date" ){
                                var str = "<span placeholder='请输入' style='border-color:red;text-align: right; '  value='"+textObj[item].value+"' id='"+textObj[item].id+"' name='"+textObj[item].name+"' class='"+textObj[item].class+"' >" +
                                    now.getFullYear() + " 年"+ (parseInt(now.getMonth())+1) + ' 月' + now.getDate() + " 日"+
                                    "</span>";
                            }else if( textObj[item].class == "inputOperator"){
                                var str = "<span placeholder='请输入' style='border-color:red;text-align: right;'  value='"+textObj[item].value+"' id='"+textObj[item].id+"' name='"+textObj[item].name+"' class='"+textObj[item].class+"' >" +
                                    "" + LIB.user.name+
                                    "</span>";
                            }else{
                                var str = "<span contenteditable placeholder='请输入' style='border-color:red;display:inline !important; '  value='"+textObj[item].value+"' id='"+textObj[item].id+"' name='"+textObj[item].name+"' class='"+textObj[item].class+"' ></span>";
                            }

                        }else{
                            if(textObj[item].class == "input_date" ){
                                var str = "<span placeholder='请输入'  value='"+textObj[item].value+"' id='"+textObj[item].id+"' name='"+textObj[item].name+"' class='"+textObj[item].class+"' >" +
                                    textObj[item].value+
                                    "</span>";
                            }else if( textObj[item].class == "inputOperator"){
                                var str = "<span placeholder='请输入'  value='"+textObj[item].value+"' id='"+textObj[item].id+"' name='"+textObj[item].name+"' class='"+textObj[item].class+"' >" +
                                    textObj[item].value +
                                    "</span>";

                                // 如果是图片 fileId
                                if(textObj[item].fileId){
                                    str = "<label  disabled   class='"+textObj[item].class+"' ><img src='"+this.getImageBaseUrl(textObj[item].fileId)+"' /></label>"
                                }
                            }else{
                                var textVal = textObj[item].value?textObj[item].value:'';

                                var str = "<label  disabled   class='"+textObj[item].class+"' >"+textVal+"</label>"
                            }
                        }
                        var order = '{input_'+item +"}";
                        template = template.replace(order, str);
                    }
                    // 过滤select
                    if(template.indexOf("templateSelect_"+textObj[item].id)>-1){
                        if(this.isAction){
                            var str = "<select value='"+textObj[item].value+"' id='"+textObj[item].id+"' name='";
                        }else{
                            var str = "<select value='"+textObj[item].value+"' id='"+textObj[item].id+"' name='";
                        }
                        str+= textObj[item].name+"' class='"+textObj[item].class+"' >"
                        str+= "<option>"+textObj[item].value+"</option>";
                        for(var i=0; i<textObj[item].list.length; i++){
                            if(textObj[item].value == textObj[item].list[i]) {
                                continue;
                            }
                            str+= "<option>"+textObj[item].list[i]+"</option>"
                        }
                        str+="</select>"
                        var order = '{templateSelect_'+textObj[item].id+"}";
                        template = template.replace(order, str);
                    }
                    // 过滤多选框
                    if(template.indexOf("templateCheck_"+textObj[item].id)>-1){
                        if(this.isAction && val!=1){
                            var str = "<p class='"+textObj[item].class+"'" + "name='mycheckBox' id='"+textObj[item].id+"'  style='display:inline-block;border-bottom:1px solid red;'>";
                        }else{
                            var str = "<p class='"+textObj[item].class+"'" + "name='mycheckBox' id='"+textObj[item].id+"'  style='display:inline-block;'>";
                        }
                        for(var i=0; i<textObj[item].list.length;i++){
                            if(this.checkUserEdit(textObj[item].value,textObj[item].list[i]) >-1){
                                if(this.isAction && val!=1){
                                    str+= textObj[item].list[i] + "<input checked=true type='checkBox' value='"+textObj[item].list[i]+"' />";
                                }else{
                                    str+= textObj[item].list[i] + "<input checked=true disabled type='checkBox' value='"+textObj[item].list[i]+"' />";
                                }
                            }else{
                                if(this.isAction && val!=1){
                                    str+= textObj[item].list[i] + "<input  type='checkBox' value='"+textObj[item].list[i]+"' />";
                                }else{
                                    str+= textObj[item].list[i] + "<input  type='checkBox' value='"+textObj[item].list[i]+"' disabled />";
                                }
                            }

                            // var order = 'templateSelect_'+textObj[item].id;
                        }
                        str+="</p>";
                        var order = '{templateCheck_'+textObj[item].id+"}";
                        template = template.replace(order, str);
                    }
                }

                return template;
            },

            getImageBaseUrl:function (fileId) {
                return BASE.SwConfig.url + "/file/image/" + fileId + "/" + "scale"
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
            // 涉及不涉及勾选
            filterBySelect:function (val) {
                val.allExclude = val.allExclude==0?1:0;
            },

            initGroup: function(valArr){
                var arr = valArr;
                this.groups = [];
                for(var i=0; i<arr.length; i++){
                    var obj = {name: '', content:' ', textObj:null};
                    var o ={};
                    obj.name = arr[i].groupName;
                    obj.allExclude = 3;
                    if(this.mainModel.vo.isComplete == 2 && arr[i].allExclude){
                        obj.allExclude = arr[i].allExclude
                        if(obj.allExclude!=3){
                            obj.name += obj.allExclude==1?'（不涉及）':'（涉及）'
                        }
                    }
                    if(arr[i].allExclude==1 && this.mainModel.vo.isComplete == 1){
                        obj.allExclude = 0;
                    }
                    obj.id = arr[i].id;
                    if(arr[i].itemContent) o.content = arr[i].itemContent;
                    else o.content = '';
                    if(valArr[i].riskTemplateConfig && arr[i].riskTemplateConfig.content!=''){
                        var temp = JSON.parse(arr[i].riskTemplateConfig.content);
                        for(var item in temp){
                            o[item] = temp[item];
                        }
                    }

                    // obj.content = this.deel(o, arr[i].allExclude)
                    obj.content = this.deel(o)

                    obj.textObj = o;
                    this.groups.push(obj);
                    this.$nextTick(function () {
                        $('[name="myInput"]').unbind('keyup').bind('keyup', function(){
                            if($(this).html().length>0){
                                $(this).css("border-color","blue");
                            }else{
                                $(this).css("border-color","red");
                            }
                        });
                        $("[type='checkBox']").unbind('click').bind('click', function () {
                            $(this).parent().css("border-color", "red")
                            var childs = $(this).parent().find("[type='checkBox']");
                            for(var i=0;i<childs.length; i++){
                                if($(childs[i]).is(':checked')){
                                    $(this).parent().css("border-color", "blue")
                                }
                            }

                        })
                    })
                    function textWidth(val) {
                        if(val !='' && val.length>0){
//                             var str = "Visit W3School";
//                             var patt1 = new RegExp("[^\x00-\xff]");
//                             var result = val.match(patt1)
//                             return ((result.length) * 12 + (val.length-result.length) *6 + 36) + "px";
                                return ((val.length + 2) *12) +"px"
                         }
                        return ''
                    }
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
                }else{
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
                if(this.mainModel.vo.subordinateIds){
                    this.ids =  this.mainModel.vo.subordinateIds.split(',');
                }
                if(this.ids.length ==0){
                    this.$refs.rptDetailsTable.doCleanRefresh();
                    return;
                }
                var param = {
                    "criteria.strsValue": JSON.stringify({userIds: this.ids})
                };
                api.riskjudgmenttaskUserList(param).then(function (res) {
                    _this.riskJudgmentLevelList =[{name:'全部'}].concat(res.data) ;
                });

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
            },
            doExecute:function () {
			    var _this = this;
                api.checkData({"id": this.mainModel.vo.id}).then(function (res) {
                    if (res.data) {
                        _this.checkDataModel.visible = true;
                    } else {
                        _this.isAction = true;
                        _this.initGroup(_this.oldList);
                        _this.initPromise();
                    }
                });
            },
            doDefine:function() {
			    var _this = this;
                this.checkDataModel.visible = false;
                _this.$dispatch("ev_dtDelete");
            },
            doCancel:function () {
                this.isAction = false;
                this.initGroup(this.oldList);
            },

            toMyAttemplate: function (str, indexk){
                if(str && str=='') return {content:''};

                var textObj={};
                var template = str;
                // 去除div符号
                while(template.indexOf("<div>")>-1 || template.indexOf("</div>")>-1){
                    template = template.replace("<div>", "");
                    template = template.replace("</div>", "");
                }
                var index = 0;
                // 过滤下拉框
                while(template.indexOf("<select")>-1){
                    var iEle =  document.getElementsByName("myContent")[indexk].getElementsByTagName("select");
                    var opt = iEle[index].getElementsByTagName("option");
                    var obj = {};
                    obj.list = [];
                    for(var i=0; i<opt.length; i++){
                        obj.list.push(opt[i].innerHTML);
                    }
                    obj.class = iEle[index].className;
                    obj.id = iEle[index].id;
                    obj.value = iEle[index].value;
                    obj.name = iEle[index].name;
                    template = template.replace(/<select.+?\/select>/, "{templateSelect_"+iEle[index].id+"}");
                    textObj[obj.id] = obj;
                    index++;

                }

                // 过滤多选框
                index=0;
                while(template.indexOf("mycheckBox")>-1){
                    var obj = {};
                    var iEle = document.getElementsByName("myContent")[indexk].getElementsByTagName("p");
                    var opt = iEle[index].getElementsByTagName("input");
                    obj.list = [];
                    obj.value = [];
                    for(var i=0; i<opt.length; i++){
                        obj.list.push(opt[i].value);
                        if(opt[i].checked == true){
                            obj.value.push(opt[i].value);
                        }
                    }
                    obj.class = iEle[index].className;
                    obj.id = iEle[index].id;
                    obj.name = iEle[index].name;
                    template = template.replace(/<p .+?mycheckBox.+?\/p>/, "{templateCheck_"+iEle[index].id+"}");
                    textObj[obj.id] = obj;
                    index++;
                }

                // 过滤输入框
                index=0;
                while( template.indexOf("<span")>=0 && template.indexOf("mycheckBox")<0){
                    var obj ={};
                    // var iEle = $(document.getElementsByName("myContent")[indexk]).find('input[name="myInput"]');
                    var iEle = $(document.getElementsByName("myContent")[indexk]).find('span[name="myInput"]');
                    obj.class = iEle[index].className;
                    obj.id = iEle[index].id;
                    obj.value = iEle[index].innerHTML;
                    obj.name = iEle[index].name;
                    template = template.replace(/<span.+?>.+?<\/span>/, "{input_"+iEle[index].id+"}");
                    textObj[obj.id] = obj;
                    index++;
                }
                textObj.content = template;
                return textObj;
            },
            // 初始化承诺
            initPromise:function (val) {
                if(this.mainModel.vo.isComplete == 1){
                    this.promiseObj  = JSON.parse(this.mainModel.vo.riskTemplateConfig.content);
                    this.promiseObj.content = this.mainModel.vo.promiseContent;
                    this.promiseContent = this.deel(this.promiseObj );
                }else{
                    this.promiseObj = JSON.parse(val.promiseContent);
                    this.promiseContent = this.deel(this.promiseObj);
                }
            },

            // =================  生命周期  ==============
            afterInitData: function () {
                var _this = this;

                this.isAction = false;

                // this.queryRiskjudgmentGroup();
                this.activeTabId ="1";
                this.checkedUserIndex=0;
                this.orderStatusIndex = 0;

                // 获取文件列表
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

                // isComplete == 2 完成
                if(this.mainModel.vo.isComplete == 2){
                    _this.getSignPic();
                    api.riskjudgmenttaskCompany({"id":this.mainModel.vo.id}).then(function (res) {
                        _this.initPromise(res.data);
                        // 过滤
                        var arr = res.data.riskJudgmentRecordDetails;
                        for(var i=0 ; i<arr.length; i++) {
                            var itemcontent = JSON.parse(arr[i].itemContent);
                            arr[i].riskTemplateConfig.content = arr[i].itemContent;
                            arr[i].itemContent = itemcontent.content;
                            arr[i].itemContent = itemcontent.content;
                        }
                        this.oldList = res.data;

                        _this.initGroup(arr);

                    });
                    return ;
                }
                api.riskjudgmenttaskdetail({"riskJudgmentTaskId": this.mainModel.vo.id}).then(function (res) {
                    _this.oldList = res.data;
                    _this.initPromise();

                    // // 测试用
                    // console.log(res.data)
                    // res.data[0].allExclude = 1;

                    _this.initGroup(res.data);
                });
            },

            getSignPic:function () {
                var fileId = this.mainModel.vo.id;
                if(!_.isEmpty(fileId)) {
                    var resource = this.$resource("file/list?recordId="+fileId + '&FileType=FXYP&DateType=FXYP5');
                    resource.get({}).then(function(res){

                    });
                }
            },

		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});