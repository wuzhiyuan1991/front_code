define(function(require){
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./preview.html");
    var myImageView = require('./myImageView')
    var newVO = function () {
        return {
            id : null,
            //唯一标识
            code : null,
            //所属公司id
            compId : LIB.user.compId,
            //所属部门id
            orgId : null,
            //类型 1:一类,2:二类,3:三类
            type : null,
            //禁用标识 0:启用,1:禁用
            disable : "0",
            //工作内容
            content : null,
            //未拆除或未拉开的接地线编号
            groundLeadNumber : null,
            //未拆除或未拉开的接地线组数
            groundLeadQuantity : null,
            //未拆除或未拉开的接地刀闸数量
            groundSwitchQuantity : null,
            //通知站场人员方式 1:线下,2:线上
            noticeMode : null,
            //通知时间
            noticeTime : null,
            //工作地点及设备双重名称
            place : null,
            //计划结束时间
            planEndTime : null,
            //计划开始时间
            planStartTime : null,
            //实际结束时间
            realEndTime : null,
            //实际开始时间
            realStartTime : null,
            //备注
            remarks : null,
            //是否需要断电 0:否,1:是
            requireOutage : null,
            //签发意见
            signOpinion : null,
            //签发结果 0:未签发,1:通过,2:不通过
            signResult : null,
            //签发时间
            signTime : null,
            //状态 0:待提交,1:待签发,2:待移交,3:待核对,4:待开工,5:作业中,6:待关闭,7:已关闭
            status : '0',
            //工作的变、配电站名称
            substation : null,
            //班组
            workTeam : null,
            //工作负责人
            user : {id:LIB.user.id, name: LIB.user.name},
            //电气票模板
            ewCardTpl : {id:'', name:''},
            //工作票延期
            ewWorkDelays : [],
            //待办
            ewWorkTodos : [],
            //开工时间记录
            ewWorkRecords : [],
            //安全措施/工作条件/操作项目
            ewCardItems : [],
            //工作负责人变动
            ewPrincipalChanges : [],
            //工作人员变动
            ewWorkerChanges : [],
            //人脸签名
            ewFaceSignatures : [],
            //附件
            cloudFiles : [],
            //工作班成员
            ewWorkers : [],
            ewWorkers1: [],
            ewWorkers2: [],
            //电气票
            ewWorkCards : [],
        }
    };

    //Vue数据
    var dataModel = {
        vo: newVO(),
        tableLists: {
            firstLists: [],
            secondLists: [],
            thirdLists: [],
            forthLists: [],
            fifthLists: [],
            sixthLists: [],
            seventhLists: [],
            eighthLists: []
        },
        cloudFiles: [],
        fileList:[],
        items: null,
        craftsProcesses:[],
        level: 0,
        imgStyle: "height:24px;max-width: 140px;object-fit: contain;", //transform: scale(1.2)
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
        mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth],
        template: tpl,
        components:{
            myImageView:myImageView
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
                default: ''
            }
        },
        data: function(){
            return dataModel;
        },
        watch: {
            visible: function (val) {
                if(val && this.id) {
                    this._init();
                }
            }
        },
        computed: {
            getTitle: function () {
                if(this.vo.type == '1') return '电气第一种操作票';
                if(this.vo.type == '2') return '电气第二种操作票';
                if(this.vo.type == '3') return '变电所倒闸操作票';
            },
            getWorks: function () {
                var str = '';
                if(this.vo && this.vo.ewWorkers){
                    str = _.pluck(this.vo.ewWorkers,'name').join('，')
                }
                return str;
            },
            orgName: function () {
                return this.getDataDic('org', this.vo.orgId)['deptName'];
            },
            showEquipment:function () {
                var _this = this;
                var _vo = _this.vo;
                if (_vo && _vo.specialityType === '3') {
                    return true;
                }
                return false;
            },
            itemAllRow: function () {
                var num = 10;
                if(this.vo.ewCardItems) num+=this.vo.ewCardItems.length;
                return num;
            },
            ewWorkDelaysList: function () {
                var arr = [];
                for(var i=0; i < this.vo.ewWorkDelays.length; i+=2){
                    var temp  = [].push(this.vo.ewWorkDelays[i]);
                    if(this.vo.ewWorkDelays[i+1]){
                        temp.push(this.vo.ewWorkDelays[i+1]);
                    }
                    arr.push(temp);
                }
                return arr;
            }
        },
        methods:{
            getDateInfo: function(val, type){
                if(!val) return '';
                var date = new Date(val);
                if(type  == 'month') return date.getMonth()+1;
                if(type  == 'day') return date.getDate();
                if(type  == 'hours') return date.getHours();
                if(type  == 'minutes') return date.getMinutes();
            },
            getDateTime: function (arr) {
                if(arr && arr.length>0){
                    return this.getNewTime(arr[0].createDate())
                }
                return '';
            },
            getItemFileLists: function (data, type) {
                var arr = [];
                if(arr.length == 0 && data.cloudFiles && data.cloudFiles.length>0) {
                    arr = _.filter(data.cloudFiles, function (item) {
                        return item.dataType == type;
                    }) || [];
                }
                if(arr.length == 0 && data.ewFaceSignatures && data.ewFaceSignatures.length>0){
                    arr = _.filter(data.ewFaceSignatures, function (item) {
                        return item.dataType == type;
                    });
                }
                return arr;
            },
            getFileLists: function (data, type) {
                var arr = [];
                arr = _.filter(data, function (item) {
                    return item.dataType == type;
                }) || [];
                if(arr.length == 0 && this.vo.ewFaceSignatures && this.vo.ewFaceSignatures.length>0){
                    arr = _.filter(this.vo.ewFaceSignatures, function (item) {
                        return item.dataType == type;
                    });
                }
                return arr;
            },
            getNewTime: function (obj) {
                if(obj){
                    return (new Date(obj)).Format("yyyy-MM-dd hh:mm");
                } else {
                    return "";
                }
            },
            doClose: function () {
                this.visible = false;
            },
            doPrint: function () {
                window.print();
            },
            _init: function () {
                this._getVO();
            },
            deelList: function () {
                var _this = this;
                var res = {data: {list : this.vo.ewCardItems}};
                _this.tableLists.firstLists = _.filter(res.data.list,function (item) {
                    return item.type == '1'
                });
                _this.tableLists.secondLists = _.filter(res.data.list,function (item) {
                    return item.type == '2'
                });
                _this.tableLists.thirdLists = _.filter(res.data.list,function (item) {
                    return item.type == '3'
                });
                _this.tableLists.forthLists = _.filter(res.data.list,function (item) {
                    return item.type == '4'
                });
                _this.tableLists.fifthLists = _.filter(res.data.list,function (item) {
                    return item.type == '5'
                });
                _this.tableLists.sixthLists = _.filter(res.data.list,function (item) {
                    return item.type == '6'
                });
                _this.tableLists.seventhLists = _.filter(res.data.list,function (item) {
                    return item.type == '7'
                });
                _this.tableLists.eighthLists = _.filter(res.data.list,function (item) {
                    return item.type == '8'
                });
            },
            getFileList: function () {
                var _this = this;
                api.listFile({recordId: this.vo.id}).then(function (res) {
                    _this.cloudFiles = res.data;
                    _this.fileList = res.data;
                })
            },
            _getVO: function () {
                var _this = this;
                api.get({id: this.id}).then(function (res) {
                    _this.vo = res.data;
                    _this.getFileList()
                    _this.deelList()
                })
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