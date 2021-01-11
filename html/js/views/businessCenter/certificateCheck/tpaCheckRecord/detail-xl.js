define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    //查看不合格检查项弹框页面
    var viewDetailComponent = require("./dialog/viewDetail");
    var checklistSelectModal = require("componentsEx/userSelect/checkListSelectModal");
    //初始化数据模型
    var newVO = function() {
        return {
            id :null,
            orgId:null,
            compId:null,
            checkDate:null,
            checkSource:null,
            checkResultDetail:null,
            checkResult:"1",
            checkerId : null,
            checkObjectId: null,
            checkTableId:null,
            checkPlanId:null,
            checkUser :{
                "username" : null,
                "name" : null
            },
            checkObject:{},
            checkRecordDetailVoList:[],
            tpaCheckTable:{},
            tpaCheckPlan:{
                name : null
            },
            tpaCheckTask:{
                num : null,
                startDate : null,
                endDate : null
            },
            behaviorCommList:[],
            detailList : [],
            startDate:null,
            endDate:null,
            type : null
        }
    };
    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            userDetail:null,
            selectedUser:[],
            selectedList:[],
            selectedPlan:[],
            selectedObject:[],
            selectedCheckItem:{},
            checkRecordDetail:{},
            checkDetailList : [],
            groupOrderNo : null,
            groupName : null,
            checkplanSelectFilterValue : {disable:1},
            checkTableFilterValue : {"disable":0,"criteria.strValue.selectWithExistCheckItem":"true","type":0},
        },
        isReadOnly:true,//是否只读
        itemColumns:[
            {
                title:"检查项",
                fieldName:"name",
                width:"70%"
            }, {
                title : "类型",
                fieldName : "type",
                fieldType : "custom",
                render: function(data){
                    return LIB.getDataDic("pool_type",[data.type]);
                },
                width:"15%"
            }, {
                title: "结果",
                fieldType: "custom",
                width:'15%',
                render: function (data) {
                    if (data.checkResult == 1) {
                        return "<a style='color:black;'>合格</a>";
                    } else if (data.checkResult == 0) {
                        return "<a style='color:red;'>不合格</a>";
                    }else if (data.checkResult == 2) {
                        return "不涉及";
                    }else {
                        return "<a style='color:red;'>选择</a>";
                    }
                },
                tipRender : function (data) {
                    if (data.checkResult == 1) {
                        return "合格";
                    } else if (data.checkResult == 0) {
                        return "不合格";
                    }else if (data.checkResult == 2) {
                        return "不涉及";
                    }else {
                        return "选择";
                    }
                }
            }
        ],
        viewDetailModel : {
            //控制编辑组件显示
            title : "详情",
            //显示编辑弹框
            show : false,
            id: null
        },
        detailModel : {
            //控制编辑组件显示
            title : "新增",
            //显示编辑弹框
            show : false,
            //编辑模式操作类型
            type : "create",
            id: null
        },
        //控制检查表
        showModal : false,
        //验证规则
        rules:{
            "checkUser.username":[{ required: true, message: '请选择检查人名称'}],
            "tpaCheckTable.name":[{ required: true, message: '请选择检查表'}],
            checkDate:[{ required: true, message: '请选择检查时间'}],
            "checkObject.name":[{ required: true, message: '请选择受检对象'}],
        },
        exportModel : {
            url: "/tpacheckrecord/exportExcel",
            singleUrl : "/tpacheckrecord/{id}/exportExcel"
        }
    };

    //Vue组件
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        template: tpl,
        components : {
            "viewdetailcomponent":viewDetailComponent,
            "checklistSelectModal":checklistSelectModal
        },
        data:function(){
            return dataModel;
        },
        methods:{
            convertPicPath:LIB.convertPicPath,
            viewDetail:function(obj){
                _vo = obj.entry.data;
                if(_vo.checkResult == 0 || _vo.checkResult == 1){
                    this.viewDetailModel.show = true;
                    this.viewDetailModel.title = _vo.name;
                    this.viewDetailModel.id = null;
                    this.$broadcast('ev_viewDetailReload', _vo);
                }
            }
        },
        events : {
            //edit框数据加载
            "ev_detailReload" : function(pageType,nVal,row){//debugger
                // this.$refs.ruleform.resetFields();
                var _vo = dataModel.mainModel.vo;

                //清空数据
                _.extend(_vo,newVO());
                dataModel.mainModel.vo.tpaCheckTable.type = row.type;
                dataModel.mainModel.vo.type = row.type;
                this.isReadOnly = true;
                api.get({id:nVal}).then(function(res){
                    //初始化数据
                    _.deepExtend(_vo, res.data);
                    _vo.type = res.data.type;
                    _vo.tpaCheckTable = res.data.tpaCheckTable;
                    _vo.checkObject = res.data.checkObject;
                    _vo.checkUser = res.data.checkUser;//debugger
                    _vo.checkRecordDetailVoList = res.data.checkRecordDetailVoList;
                    _vo.checkResultDetail = _vo.checkResultDetail+"(总数/不合格数)";

                });
            },
            //detail框点击关闭后事件处理
            "ev_viewDetailColsed" : function(){
                this.viewDetailModel.show = false;
            },
        },
        ready:function(){
            this.$api = api;
            // console.log(LIB.setting.dataDic.checkTable_type);
            // LIB.setting.dataDic.checkTable_type
        }
    });
    return detail;
});