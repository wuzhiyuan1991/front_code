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
    var initDataModel = function () {
        return {
            mainModel: {
                vo: newVO(),
                title: "安全措施",
                
            },
            addTableModel:LIB.Opts.extendMainTableOpt(
                {
                    url: "",
                    // selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        {
                            title: "开始时间",
                            // fieldName: "content",
                            
                           
                        },
                        {
                            title: "结束时间",
                            // fieldName: "content",
                           
                           
                        },
                        {
                            title: "工作任务",
                            // fieldName: "content",
                            filterType: "text",
                            width: 250
                        },
                        {
                            title: "状态",
                            // fieldName: "content",
                           width:60
                           
                        },
                        
                        // {
                        //     title : "",
                        //     fieldType : "tool",
                        //     toolType : "del"
                        // }

                    ],

                }
            ),
            TableModel:LIB.Opts.extendMainTableOpt(
                {
                    url: "",
                    // selectedDatas: [],
                    columns: [
                        // LIB.tableMgr.column.cb,
                        {
                            title: "开始时间",
                            // fieldName: "content",
                            
                           
                        },
                        {
                            title: "结束时间",
                            // fieldName: "content",
                           
                           
                        },
                        {
                            title: "工作任务",
                            // fieldName: "content",
                            filterType: "text",
                            width: 250
                        },
                        {
                            title: "状态",
                            // fieldName: "content",
                           width:60
                           
                        },
                        
                        {
                            title : "",
                            fieldType : "tool",
                            toolType : "del"
                        }

                    ],

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
              
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
          
        },
        computed: {
           
        },
        methods: {
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