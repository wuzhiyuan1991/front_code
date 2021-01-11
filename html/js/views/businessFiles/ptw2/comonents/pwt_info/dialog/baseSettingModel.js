define(function(require){
    var LIB = require('lib');
    var formModel = require("./baseSettingFormModel");
    var drapTable = require("./drapTable");
    var api = require("./api");

    var checkDisTrue = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox"><span style="background: #ddd;margin-right:0" class="ivu-checkbox-inner"></span><input disabled type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkDisFalse = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox dis-none-after"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input disabled type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkTrue = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox ivu-checkbox-checked"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkFalse = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'

    function codeMap(obj, str) {
        var defArr = ['code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime'];
        var disArr = ['code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime','jsaMasterId', 'safetyEducator', 'supervisior']

        if(str == 'require'){
            if(disArr.indexOf(obj.code)>-1){
                return true;
            }else{
                return false;
            }
        }
        if(defArr.indexOf(obj.code)>-1){
            return true;
        }else{
            return false;
        }

    }

    //数据模型
    var tpl = require("text!./baseSettingModel.html");

    LIB.registerDataDic("iptw_catalog_is_signer_type", [
        ["1","是"],
        ["3","否"],
    ]);

    LIB.registerDataDic("iptw_catalog_enable_commitment", [
        ["0","否"],
        ["1","是"]
    ]);


    LIB.registerDataDic("iptw_catalog_is_inherent", [
        ["0","否"],
        ["1","是"]
    ]);

    LIB.registerDataDic("iptw_catalog_is_multiple", [
        ["0","否"],
        ["1","是"]
    ]);

    LIB.registerDataDic("iptw_catalog_signer_type", [
        ["1","作业申请"],
        ["2","作业批准"]
    ]);
    //初始化数据模型
    var newVO = function() {
        return {
            id : null,
            //编码
            code : null,
            //作业签发人
            name : null,
            //启用/禁用 0:启用,1:禁用
            disable : "0",
            //字典类型 1:作业类型,2:作业分级,3:个人防护设备,4:气体检测指标,5:签发人员,6:作业取消声明,7:作业完成声明
            type : 5,
            //承诺内容
            content : null,
            //应用承诺 0:否,1:是
            enableCommitment : '1',
            //作业固有角色 0:否,1:是
            isInherent : '0',
            //是否可复选签发人 0:否,1:是
            isMultiple : '1',
            //签发人类型 1:作业申请人,2:作业批准人,3:自定义会签角色
            signerType : '3',
        }
    };

    //Vue数据
    var dataModel = {
        modify:true,
        mainModel : {

            vo : newVO(),
            opType : 'create',
            isReadOnly : false,
            title:"添加",

            //验证规则
            //验证规则
            rules:{
                "code" : [LIB.formRuleMgr.length(255)],
                "name" : [LIB.formRuleMgr.require("作业签发人"),
                    LIB.formRuleMgr.length(50)
                ],
                "content" : [LIB.formRuleMgr.length(500)],
                "enableCommitment" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "signerType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
            },
        },
        formModel:{
            show:false
        },
        tableModel: LIB.Opts.extendMainTableOpt(
            {
                cure:'all',
                list:[],
                oldList:[],
                cureIndex:0,
                url: "ptwcardcolumnsetting/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [
                    {
                        //字段名称
                        title: "信息项名称",
                        fieldName: "oldName",
                    },
                    {
                        //字段名称
                        title: "新名称",
                        fieldName: "name",
                    },
                    {
                        //是否固化字段 0:否,1:是
                        title: "固有字段",
                        fieldName: "isInherent",
                        orderName: "isInherent",
                        filterName: "criteria.intsValue.isInherent",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("iptw_card_column_setting_is_inherent"),
                        render: function (data) {
                            if(data.isInherent == '1' ){
                                return checkDisTrue;
                            }else{
                                return checkDisFalse;
                            }
                        },
                        width:"70px"
                    },
                    {
                        //字段原名称
                        title: "启用",
                        fieldName: "disable",
                        render:function (data) {
                            if(data.disable == '0'){
                                if(data.isInherent == '1' && codeMap(data)){
                                    return checkDisTrue;
                                }
                                return checkTrue;
                            }else{
                                if(data.isInherent == '1' && codeMap(data)){
                                    return checkDisFalse;
                                }
                                return checkFalse;
                            }
                        },
                        event:true,
                        width:"50px"
                    },
                    {
                        //数据类型 1:文本,2:文本(多行),3:整数,4:小数,5:日期时间,6:日期时间(区间),7:人员,8:承包商,9:人员或承包商
                        title: "数据类型",
                        fieldName: "dataType",
                        orderName: "dataType",
                        filterName: "criteria.intsValue.dataType",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("iptw_card_column_setting_data_type"),
                        render: function (data) {
                            return LIB.getDataDic("iptw_card_column_setting_data_type", data.dataType);
                        },
                        width:"120px"
                    },
                    {
                        //是否必填项 0:否,1:是
                        title: "必填项",
                        fieldName: "isRequired",
                        render: function (data) {
                            if(data.isRequired == '1'){
                                if(data.isInherent == '1' && codeMap(data, 'require')){
                                    return checkDisTrue;
                                }
                                return checkTrue;
                            }else{
                                if(data.isInherent == '1' && codeMap(data, 'require')){
                                    return checkDisFalse;
                                }
                                return checkFalse;
                            }
                        },
                        width:"56px",
                        event:true
                    },
                ]
            }
        ),

    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components:{
          "formModel":formModel,
            "drapTable": drapTable
        },
        computed:{
            tableTools: function () {
                if(this.tableModel.cure == 'all')
                    return ['del', 'update', 'move'];
                else if(this.tableModel.cure == 'inherent') return ['update'];
                else return ['update', 'del']
            },
        },
        watch:{
            visible:function (val) {
                val && this.beforeInit();
            }
        },
        props:{
            visible:{
                type:Boolean,
                default: false
            },
            model:{
                type:Object,
                default: null
            }
        },
        data:function(){
            return dataModel;
        },
        methods:{
            getDelIndex: function (item) {
                function isObjectValueEqual(a, b) {
                    var aProps = Object.getOwnPropertyNames(a);
                    var bProps = Object.getOwnPropertyNames(b);

                    if (aProps.length != bProps.length) {
                        return false;
                    }

                    for (var i = 0; i < aProps.length; i++) {
                        var propName = aProps[i];
                        var propA = a[propName];
                        var propB = b[propName];
                        if ( propA !== propB) {
                            return false;
                        }
                    }
                    return true;
                }

                var index = null;
                for(var i=0; i<this.tableModel.oldList.length; i++){
                      var obj = this.tableModel.oldList[i];
                      if(isObjectValueEqual(item, obj)){
                          index = i;
                      }
                }
                return index;
            },
            doDeleteItem: function (item, index) {
                var _this = this;
                if(item.isInherent == '1') return LIB.Msg.error("固有字段不能删除");
                var num = this.getDelIndex(item);
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        _this.tableModel.oldList.splice(num, 1);
                        _this.getCureList(_this.tableModel.cure);
                        LIB.Msg.info("删除成功");
                    }
                });
            },
            doItemMove:function (item) {
                var _this = this;
                var offset = parseInt(item.offset);
                var list = this.tableModel.list;

                if(item.listIndex + item.offset <0 || item.listIndex + item.offset>=list.length){
                    return ;
                }
                var temp = list[item.listIndex];
                list[item.listIndex] = list[item.listIndex + offset];
                list[item.listIndex + offset] = temp;
                this.tableModel.list = null;
                this.$nextTick(function () {
                    _this.tableModel.list = list;
                    // _this.$set("tableModel.list", list);
                });
            },
            doUpdateItem:function (item, index) {
                this.$refs.formModel.init(item, 'update', index-1);
                this.formModel.show = true;
            },
            doUpdateDetail:function (item, index) {
                var list = this.tableModel.list;
                list[index] = _.extend(list[index], item);
                // this.tableModel.list = [];
                // this.tableModel.list = list;
                this.formModel.show = false;
                LIB.Msg.info("保存成功");
            },
            onRowClicked:function (row, e, index, num) {
                if(row.isInherent == '1' && codeMap(row)) return ;
                var _this = this;
                var list = this.tableModel.list;
                if(index == 3){
                    list[num].disable=='0'?list[num].disable='1':list[num].disable='0'
                }
                if(index == 5){
                    if(row.isInherent == '1' && codeMap(row, 'require')) return ;
                    list[num].isRequired=='0'?list[num].isRequired='1':list[num].isRequired='0'
                }
                this.tableModel.list = [];
                this.$nextTick(function () {
                    _this.tableModel.list = [].concat(list);
                    LIB.Msg.info("保存成功");
                })
            },
            doShowBaseSettingFormModel:function () {
                this.formModel.show = true;
                this.$refs.formModel.init(null, 'add');
            },
            newVO : newVO,
            beforeInit:function () {
                this.mainModel.vo = this.newVO();
            },
            init: function (jsonStr) {
                this.queryColumnSettings(jsonStr);
            },
            doSaveDetail:function (item) {
                this.formModel.show = false;
                var obj = _.clone(item);
                this.tableModel.oldList.push(obj);
                this.getCureList(this.tableModel.cure);
            },
            doSave:function () {
                this.$emit("do-save", this.tableModel.oldList);
            },
            queryColumnSettings: function (jsonStr) {
                var _this = this;
                _this.tableModel.list = [];
                _this.tableModel.oldList = [];
                if(jsonStr.length>5){
                    _this.tableModel.oldList = JSON.parse(jsonStr);
                    _this.getCureList('all');
                }
                else {
                    api.queryDefaultSetting().then(function (res) {
                        _this.tableModel.oldList = res.body;
                        _this.getCureList('all');
                    })
                }
            },

            getCureList: function (str) {
                this.tableModel.cure = str;
                if(str == 'all'){
                    this.tableModel.list = this.tableModel.oldList;
                }else if(str == 'inherent'){
                    this.tableModel.list = _.filter(this.tableModel.oldList,function (item) {
                        return item.isInherent == '1';
                    })
                }else{
                    this.tableModel.list = _.filter(this.tableModel.oldList,function (item) {
                        return item.isInherent != '1';
                    })
                }
            },
            drapEnd: function (list) {
                this.tableModel.oldList = list;
                this.getCureList('all');
                LIB.Msg.info("移动成功");
            }

        }
    });

    return detail;
});