define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var BASE = require('base');

    var initDataModel = function () {
        return {
            isShowDeps:false,
            moduleCode: "riskJudgmentEveryDay",
            //控制全部分类组件显示
            mainModel: {
                orgInfo:{},
                dateInfo:'',
                riskInfo:[],
                levelList:{list:[{name:"岗位",id:0},{name:"部门", id:1}], levelIndex:0}
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                // url: "riskjudgment/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.company,
                     LIB.tableMgr.column.disable,
                    {
                        //制定时间
                        title: "制定时间",
                        fieldName: "formulateDate",
                        filterType: "date"
                    },
                     LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.remark,
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riskjudgment/importExcel"
            },
            exportModel : {
                url: "/riskjudgment/exportExcel",
                withColumnCfgParam: true
            },
            levelList:[],  // 层级列表
            levelIndex:0,  // 层级序号
            unintList: [], //部门列表
            unintIndex:0, // 部门序号
            selectDate:'', // 日期
            users:[],  //人员
            userIndex:0, // 人员序号
            compId:'',  // 公司id
            taskDetail:{},
            groups:[],
            isFirst:0,
            company:'',
            isActiveBtn: false,
            endTime:null,
            companyName:"",
            companyTitle:'',
            companySelect:'',
            subordinateUnits:[] // 所有的研判  单位
        };
    };

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
    	template: tpl,
        data: initDataModel,
        components: {
            
        },
        methods: {
            doOrgCategoryChange:function (data) {
                this.compId = data.nodeId;
                this.companyTitle = data.nodeVal

                if(this.isFirst > 0){
                    this.doSearchTask();
                }
            },
            doChangeDate:function (data) {
                this.selectDate = data;
            },
            addDate:function(days){
                var d = this.selectDate;

                var d=new Date(this.selectDate);
                d.setDate(d.getDate()+days);
                var today = new Date( new Date().Format("yyyy-MM-dd"));
                if( today < (new Date(d)) && days >0){
                    LIB.Msg.info("该日期没有研判内容");
                    return;
                }
                this.selectDate = (new Date(d)).Format("yyyy-MM-dd");
                this.doSearchTask();
            },
            doSelectUser:function (index) {
                var _this =  this;
                _this.userIndex = index;
                _this.taskDetail = {};
                if(_this.users.length==0){
                    return;
                }
                api.quertRiskjudgmentDetail({riskJudgmentUnitId:_this.unintList[_this.unintIndex].id, date:_this.selectDate,userId:_this.users[_this.userIndex].id}).then(function(res){
                    _this.taskDetail = res.data;
                   _this.initGroup();
                    _this.initPromise();

                    _this.companyName = "";
                    // for(var i=_this.levelList.length-1; i>=_this.levelIndex; i--){
                    //     _this.companyName += _this.levelList[i].name;
                    // }
                    for(var i=0; i<_this.levelIndex; i++){
                        _this.companyName += _this.levelList[i].name;
                    }
                    _this.companyName += _this.unintList[_this.unintIndex].unitName;
                    _this.doGetSubs();

                })
            },

            initGroup:function () {

                  if(this.taskDetail.isComplete == 1){
                      var str = ''
                      for(var i=0; i<this.taskDetail.riskJudgmentRecordDetailVos.length; i++){
                          var obj = {};
                          obj = JSON.parse(this.taskDetail.riskJudgmentRecordDetailVos[i].riskTemplateConfig.content);
                          obj.content =  this.taskDetail.riskJudgmentRecordDetailVos[i].itemContent;

                          this.taskDetail.riskJudgmentRecordDetailVos[i].itemContent = "<div style='padding: 10px'>" + this.deel(obj) + "<div>";
                      }
                  }else{
                      var str = ''
                      if(!this.taskDetail.riskJudgmentRecordDetailVos) return;
                      for(var i=0; i<this.taskDetail.riskJudgmentRecordDetailVos.length; i++){
                          var obj = {};
                          obj = JSON.parse(this.taskDetail.riskJudgmentRecordDetailVos[i].itemContent);
                          this.taskDetail.riskJudgmentRecordDetailVos[i].itemContent = this.deel(obj);
                      }
                  }
            },
            initPromise:function () {
                if(this.taskDetail.isComplete == 1){
                    var obj = JSON.parse(this.taskDetail.riskTemplateConfig.content);
                    obj.content = this.taskDetail.promiseContent;
                    this.taskDetail.promiseContent = this.deel(obj);
                }else{
                    var obj = JSON.parse(this.taskDetail.promiseContent);
                    this.taskDetail.promiseContent = this.deel(obj);
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
                        var str = "<span  disabled style='padding-left:15px;padding-right:15px;'  class='"+textObj[item].class+"' >"+textObj[item].value+"</span>"
                        var order = '{input_'+item +"}";

                        // 如果是图片 fileId
                        if(textObj[item].fileId){
                            str = "<span  disabled   class='"+textObj[item].class+"' ><img src='"+this.getImageBaseUrl(textObj[item].fileId)+"' /></span>"
                        }

                        template = template.replace(order, str);
                    }
                    // 过滤select
                    if(template.indexOf("templateSelect_"+textObj[item].id)>-1){
                        var str = "" + textObj[item].value
                        var order = '{templateSelect_'+textObj[item].id+"}";
                        template = template.replace(order, str);
                    }

                    if(template.indexOf("templateCheck_"+textObj[item].id)>-1){
                        var str = "<p class='"+textObj[item].class+"'" + "name='mycheckBox' id='"+textObj[item].id+"'  style='display: inline;align-items: center'>";
                        for(var i=0; i<textObj[item].list.length;i++){
                            if(this.checkUserEdit(textObj[item].value,textObj[item].list[i]) >-1){
                                str+= textObj[item].list[i] + "<input disabled type='checkBox' value='"+textObj[item].list[i]+"' checked=true />";
                            }else{
                                str+= textObj[item].list[i] + "<input disabled type='checkBox' value='"+textObj[item].list[i]+"' />";
                            }
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

            doSelectUnint:function(val){
                this.unintIndex = val;
                this.users = this.unintList[val].users;
                if(this.unintList.length==0){
                    return;
                }
                this.doSelectUser(0);
            },



            doSelectLevelIndex:function (val) {
                var _this = this;
                _this.levelIndex = val;
                if(_this.levelList && _this.levelList.length>0){
                    api.queryRiskjudgmentTask({riskJudgmentLevelId:_this.levelList[_this.levelIndex].id, date:_this.selectDate}).then(function (res) {
                        _this.unintList = res.body;
                        _this.doSelectUnint(0);
                    })
                }
            },

            doGetSubs:function () {
                var _this = this;
                var selectUnit = _this.unintList[_this.unintIndex].unitName;
                var arr = [];
                arr.push(selectUnit)
                 _this.companySelect = ''
                for(var i= _this.levelIndex; i>=0; i--){
                    _.each(_this.subordinateUnits, function (item) {
                        var isExit = false;
                        _.each(item.subordinateUnits, function (itemNext) {
                            if(itemNext.name== selectUnit){

                                if(i == 0){
                                    _this.companySelect = itemNext.name;
                                }

                                isExit = true;
                            }
                        })
                        if(isExit){
                            selectUnit = item.name;
                            arr.push(selectUnit)
                        }
                    })
                }

                _this.companyName = '';

                var j=1;

                _this.companySelect = arr[_this.levelIndex]
                for(var i=_this.levelIndex-1; i>=0; i--,j++){
                    if(arr[i]){
                        _this.companyName += "("+ arr[i] +")" + _this.levelList[j].name + " ";
                    }

                }

            },

            doGetSearchLevel:function(){
                var _this = this;
                var arr =[];
                for(var i=0; i<_this.levelList.length; i++){
                    arr.push(_this.levelList[i].id);
                }
                var param ={
                    // "criteria.strsValue":{"id":arr}
                    "criteria.strsValue": JSON.stringify({"riskJudgmentLevelId": arr})
                };
                  api.queryRiskDetail(param).then(function (res) {
                      _this.subordinateUnits = res.data;
                      _this.doSelectLevelIndex(0);
                  })
            },


            doSearchTask:function () {
                var _this = this;

                _this.levelList = [];
                _this.unintList = [];
                _this.users = [];
                _this.taskDetail = {};

                api.queryRiskjudgment({compId:_this.compId, date:_this.selectDate}).then(function (res) {
                    if(res.data && res.data.length>0){
                        res.data.sort(function (a, b) {
                           if(a.orderNo > b.orderNo) return -1;
                        });
                        _this.levelList = res.data;
                        _this.doSelectLevelIndex(0);
                    }
                })
            },
        },
        events: {
        },
        ready:function () {
            var now = new Date();
            var beginDate = now.Format("yyyy-MM-dd");
            var _this = this;
            _this.selectDate = beginDate;
            _this.compId = LIB.user.compId;
            _this.endTime =  beginDate;
            api.queryRiskjudgment({compId: _this.compId, date:beginDate}).then(function (res) {
                if(res.data){
                    res.data.sort(function (a, b) {
                        if(a.orderNo > b.orderNo) return -1;
                    });
                    _this.levelList = res.data;
                    _this.doGetSearchLevel();

                    _this.isFirst = 1;
                }

            })
        },

        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
