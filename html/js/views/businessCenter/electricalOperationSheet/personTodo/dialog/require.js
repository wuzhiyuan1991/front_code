define(function (require) {

    var LIB = require('lib');
    var tpl = require("text!./require.html");
    
    var api = require("../vuex/api");
    var newVO = function () {
		return {
			id: null,
			//编码
			code: null,
			//禁用标识 0未禁用，1已禁用
			disable: "0",
			//公司id
			compId: null,
			//部门id
			orgId: null,
			//工作内容
			content: null,
			//备注
			remark: null,
			//状态 0:待完成,1:已完成
			status: '0',
			user: { id: "", username: "" },
			executeUserId: null
		}
	};
    function  getNewTime (obj) {
        if(obj){
            return (new Date(obj)).Format("yyyy-MM-dd hh:mm");
        } else {
            return "";
        }
    }
    var initDataModel = function () {
        return {
            mainModel: {
                vo: newVO(),
                title: "安全措施",
                
            },
            thirdTableModel:(
                {
                    url: "ewcardtpl/list{/curPage}{/pageSize}?type=1",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "序号",
                            fieldType: "sequence",
                            width: 70,
                        },
                        {
                            title: '编码',
                            fieldName: "code",
                            width: 220,
                            orderName: "code",
                            fieldType: "link",
                            renderClass: 'textarea',
                        },
                        _.extend(_.clone(LIB.tableMgr.column.company),{width:150,filterType:null}) ,
                        _.extend(_.clone(LIB.tableMgr.column.dept),{width:150,filterType:null}) ,
                        {
                            title: "工作任务",
                            fieldName: "attr1",
                            width: 180
                        },
                        {
                            //状态 0:待提交,1:待签发,2:待移交,3:待核对,4:待开工,5:作业中,6:待关闭,7:已关闭
                            title: "状态",
                            fieldName: "status",
                            render: function (data) {
                                return LIB.getDataDic("iew_work_card_status", data.status);
                            },
                            width:90
                        },
                        {
                            title: "结束时间",
                            fieldName: "realEndTime",
                            width: 140,
                            render: function (data) {
                                // return LIB.formatYMD(data.realEndTime)
                                return getNewTime(data.realEndTime)
                            }
                        },
                        {
                            title: "开始时间",
                            fieldName: "realStartTime",
                            width: 140,
                            render: function (data) {
                                // return LIB.formatYMD(data.realStartTime)
                                return getNewTime(data.realStartTime)

                            }
                        },
                    ]
                }
            ),
            TableModel:LIB.Opts.extendMainTableOpt(
                {
                    url: "ewcardtpl/list{/curPage}{/pageSize}?type=1",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "序号",
                            fieldType: "sequence",
                            width: 70,
                        },
                        {
                            title: '编码',
                            fieldName: "code",
                            width: 150,
                            orderName: "code",
                            fieldType: "link",
                        },
                        {
                            title: "工作的变、配电站名称及设备名称",
                            fieldName: "substation",
                            width: 250
                        },
                        {
                            title: "工作任务 - 工作地点及设备双重名称",
                            fieldName: "place",
                            width: 280
                        },
                        {
                            title: "工作任务 - 工作内容",
                            fieldName: "content",
                            width: 180
                        },
                        _.extend(_.clone(LIB.tableMgr.column.company),{width:150,filterType:null}) ,
                        _.extend(_.clone(LIB.tableMgr.column.dept),{width:150,filterType:null}) ,
                    ]
                }
            ),
            next:null,
            userSelectModel:{
                show:false,
            },
            select:{
                show:false,
            },
            rules: {
                "name": LIB.formRuleMgr.require("内容"),
            },
            list: []
        };
    }

    var opts = {
        template: tpl,
        data: function () {
            var data = initDataModel();
            return data;
        },
       
        watch: {
            visible: function (val) {
                if(val){
                    if(this.vo && this.vo.ewWorkCards && this.vo.ewWorkCards.length>0){
                        this.list = this.vo.ewWorkCards;
                    }else{
                        this.list = [];
                    }
                }
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            vo: {
                type: Object,
                default: null
            }
        },
        computed: {
           
        },
        methods: {
            onClickCell: function (data) {
              if(data.cell.colId == '1'){
                  var router = LIB.ctxPath("/html/main.html#!");
                  var routerPart = "/electricalOperation/businessCenter/record?method=detail&id=" + data.entry.data.id+'&code='+data.entry.data.code;

                  window.open(router + routerPart);
              }
            },
            // doMoveStepItems : function(item) {
                //         var _this = this;
                //         var data = item.entry.data;
                //         var param = {
                //             id : data.id
                //         };
                //         _.set(param, "criteria.intValue.offset", item.offset);
                //         api.moveOpStdStepItems({id : data.stepId}, param).then(function() {
                //             _this._getItems();
                //             LIB.Msg.success("移动成功");
                //             _this._checkModifier();
                //         });
                //     },
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
    
});