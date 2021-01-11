define(function (require) {
    var LIB = require('lib');
    var api = require("./api");

    var formModel = require("./baseSettingFormModel");
    var drapTable = require("./drapTable");
    var previewSetting = require("./previewSetting");

    var checkDisTrue = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox"><span style="background: #ddd;margin-right:0" class="ivu-checkbox-inner"></span><input disabled type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkDisFalse = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox dis-none-after"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input disabled type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkTrue = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox ivu-checkbox-checked"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkFalse = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'

    function codeMap(obj, str) {
        var defArr = ['code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime', 'createBy'];
        var disArr = ['code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime', 'createBy', 'jsaMasterId', 'safetyEducator', 'supervisior', 'mainEquipment', 'specialWorker', 'operatingType'];

        if (str == 'require') {
            if (disArr.indexOf(obj.code) > -1) {
                return true;
            } else {
                return false;
            }
        }
        if (defArr.indexOf(obj.code) > -1) {
            return true;
        } else {
            return false;
        }
    }
    function dataType10() {
        return {
            id: null,
            //编码
            code: null,
            //字段名称
            name: '作业票编码',
            //是否必填项 0:否,1:是
            isRequired: '0',
            //数据类型 1:文本,2:文本(多行),3:整数,4:小数,5:日期时间,6:日期时间(区间),7:人员,8:承包商,9:人员或承包商
            dataType: '100',
            //是否固化字段 0:否,1:是
            isInherent: '0',
            //字段原名称
            oldName: null,
            //启用/禁用 0:启用,1:禁用
            disable: "0",
            //作业票模板
            ptwCardTpl: { id: '', name: '' },
            value: null   //值
        }
    }
    //数据模型
    var tpl = require("text!./baseSettingModel.html");

    LIB.registerDataDic("iptw_catalog_is_signer_type", [
        ["1", "是"],
        ["3", "否"],
    ]);

    LIB.registerDataDic("iptw_catalog_enable_commitment", [
        ["0", "否"],
        ["1", "是"]
    ]);


    LIB.registerDataDic("iptw_catalog_is_inherent", [
        ["0", "否"],
        ["1", "是"]
    ]);

    LIB.registerDataDic("iptw_catalog_is_multiple", [
        ["0", "否"],
        ["1", "是"]
    ]);

    LIB.registerDataDic("iptw_catalog_signer_type", [
        ["1", "作业申请"],
        ["2", "作业批准"]
    ]);
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //编码
            code: null,
            //作业签发人
            name: null,
            //启用/禁用 0:启用,1:禁用
            disable: "0",
            //字典类型 1:作业类型,2:作业分级,3:个人防护设备,4:气体检测指标,5:签发人员,6:作业取消声明,7:作业完成声明
            type: 5,
            //承诺内容
            content: null,
            //应用承诺 0:否,1:是
            enableCommitment: '1',
            //作业固有角色 0:否,1:是
            isInherent: '0',
            //是否可复选签发人 0:否,1:是
            isMultiple: '1',
            //签发人类型 1:作业申请人,2:作业批准人,3:自定义会签角色
            signerType: '3',
        }
    };

    //Vue数据
    var dataModel = {
        modify: true,
        isAll: false,
        mainModel: {
            vo: newVO(),
            opType: 'create',
            isReadOnly: false,
            title: "添加",

            //验证规则
            //验证规则
            rules: {
                "code": [LIB.formRuleMgr.length(255)],
                "name": [LIB.formRuleMgr.require("作业签发人"),
                LIB.formRuleMgr.length(50)
                ],
                "content": [LIB.formRuleMgr.length(500)],
                "enableCommitment": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "signerType": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
            },
        },
        formModel: {
            show: false
        },
        tableModel: LIB.Opts.extendMainTableOpt(
            {
                cure: 'all',
                list: [],
                oldList: [],
                cureIndex: 0,
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
                            if (data.isInherent == '1') {
                                // return checkDisTrue;
                                return '<div style="text-align: center;"><i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>是</div>'
                            } else {
                                // return checkDisFalse;
                                return '<div style="text-align: center;"><i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>否</div>'
                            }
                        },
                        width: "70px"
                    },
                    {
                        //字段原名称
                        title: "启用",
                        fieldName: "disable",
                        render: function (data) {
                            if (data.disable == '0') {
                                if (data.isInherent == '1' && codeMap(data)) {
                                    return checkDisTrue;
                                }
                                return checkTrue;
                            } else {
                                if (data.isInherent == '1' && codeMap(data)) {
                                    return checkDisFalse;
                                }
                                return checkFalse;
                            }
                        },
                        event: true,
                        width: "50px"
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
                        width: "120px"
                    },
                    {
                        //是否必填项 0:否,1:是
                        title: "必填项",
                        fieldName: "isRequired",
                        render: function (data) {
                            if (data.isRequired == '1') {
                                if (data.isInherent == '1' && codeMap(data, 'require')) {
                                    return checkDisTrue;
                                }
                                return checkTrue;
                            } else {
                                if (data.isInherent == '1' && codeMap(data, 'require')) {
                                    return checkDisFalse;
                                }
                                return checkFalse;
                            }
                        },
                        width: "56px",
                        event: true
                    },
                ]
            }
        ),

    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components: {
            "formModel": formModel,
            "drapTable": drapTable,
            "previewSetting": previewSetting
        },
        computed: {
            tableTools: function () {
                return ['del', 'update', 'move'];
            }
        },
        watch: {
            visible: function (val) {
                val && this.beforeInit();
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            model: {
                type: Object,
                default: null
            }
        },
        data: function () {
            return dataModel;
        },
        methods: {
            doSavePreviewSetting: function () {

            },
            gotoPreviewSetting: function (val) {
                this.$refs.previewSetting.init(this.tableModel.oldList);
            },
            selectAll: function (val) {
                _.each(this.tableModel.oldList, function (item) {
                    if (item.isInherent == '1' && !codeMap(item)) {
                        item.disable = val;
                        if (!codeMap(item)) {
                            item.isRequired = item.disable == '0' ? '1' : '0';
                        }
                    }
                });
                this.isAll = !this.isAll;
                this.getCureList(this.tableModel.cure);
                // this.$set("tableModel.oldList", this.tableModel.oldList);
            },
            getAllStatus: function () {
                this.isAll = true;
                var _this = this;
                _.each(this.tableModel.oldList, function (item) {
                    if (item.disable == '1') _this.isAll = false;
                });
            },
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
                        if (propA !== propB) {
                            return false;
                        }
                    }
                    return true;
                }

                var index = null;
                for (var i = 0; i < this.tableModel.oldList.length; i++) {
                    var obj = this.tableModel.oldList[i];
                    if (isObjectValueEqual(item, obj)) {
                        index = i;
                    }
                }
                return index;
            },
            doDeleteItem: function (item, index) {
                var _this = this;
                if (item.isInherent == '1') return LIB.Msg.error("固有字段不能删除");
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
            doItemMove: function (item) {
                var _this = this;
                var offset = parseInt(item.offset);
                var list = this.tableModel.list;
                if (item.listIndex + item.offset < 0 || item.listIndex + item.offset >= list.length) {
                    return;
                }
                var temp = list[item.listIndex];
                list[item.listIndex] = list[item.listIndex + offset];
                list[item.listIndex + offset] = temp;
                $('tbody .layout-table-tr').removeClass('isDragEnd')
                if (offset>0) {
                    $('tbody .layout-table-tr').eq(item.listIndex + offset-1).addClass('isDragEnd')
                }else{
                    $('tbody .layout-table-tr').eq(item.listIndex + offset+1).addClass('isDragEnd')
                }
                


                this.tableModel.list = null;
                _this.diffArray(_this.tableModel.oldList, list, _this.tableModel.cure)
                this.$nextTick(function () {
                    _this.tableModel.list = list;
                });
            },
            diffArray: function (oldList, list, str) {
                var k = 0
                if (str == 'all') {
                    oldList = list;
                } else if (str == 'inherent') {
                    for (var index = 0; index < list.length; index++) {

                        for (var j = k; j < oldList.length; j++) {
                            if (oldList[j].isInherent == '1') {
                                oldList[j] = list[index]
                                k = j + 1
                                break
                            }
                        }
                    }
                } else if (str == 'disable') {
                    for (var index = 0; index < list.length; index++) {
                        for (var j = k; j < oldList.length; j++) {
                            if (oldList[j].disable != '1') {
                                oldList[j] = list[index]
                                k = j + 1
                                break
                            }
                        }
                    }
                } else {
                    for (var index = 0; index < list.length; index++) {
                        for (var j = k; j < oldList.length; j++) {
                            if (oldList[j].isInherent != '1') {
                                oldList[j] = list[index]
                                k = j + 1
                                break
                            }
                        }
                    }
                }
                this.$set('tableModel.oldList',oldList)
                // this.tableModel.oldList = oldList
            },
            doUpdateItem: function (item, index) {
                this.$refs.formModel.init(item, 'update', index - 1);
                this.formModel.show = true;
            },
            doUpdateDetail: function (item, index) {
                var list = this.tableModel.list;
                list[index] = _.extend(list[index], item);
                // this.tableModel.list = [];
                // this.tableModel.list = list;
                this.formModel.show = false;
                LIB.Msg.info("保存成功");
            },
            onTrClick:function(index){
                $('tbody .layout-table-tr').removeClass('isDragEnd')
                $('tbody .layout-table-tr').eq(index).addClass('isDragEnd')
            },
            onRowClicked: function (row, e, index, num) {
                if (row.isInherent == '1' && codeMap(row)) return;
                var _this = this;
                var list = this.tableModel.list;
                if (index == 3) {
                    list[num].disable == '0' ? list[num].disable = '1' : list[num].disable = '0';
                    if (codeMap(row, 'require')) {
                        list[num].isRequired = list[num].disable == '0' ? '1' : '0';
                    }
                    if (list[num].disable != 0) {
                        list[num].isRequired = '0'
                    }
                }
                if (index == 5) {
                    if (row.disable != '0') return;
                    if (row.isInherent == '1' && codeMap(row, 'require')) return;
                    list[num].isRequired == '0' ? list[num].isRequired = '1' : list[num].isRequired = '0'
                }
                this.tableModel.list = [];
                this.$nextTick(function () {
                    _this.tableModel.list = [].concat(list);
                    _this.getAllStatus();
                    LIB.Msg.info("保存成功");
                });
                this.getCureList(this.tableModel.cure);
            },
            doShowBaseSettingFormModel: function () {
                this.formModel.show = true;
                this.$refs.formModel.init(null, 'add');
            },
            newVO: newVO,
            beforeInit: function () {
                this.mainModel.vo = this.newVO();
            },
            init: function (jsonStr) {
                this.queryColumnSettings(jsonStr);
            },
            doSaveDetail: function (item) {
                this.formModel.show = false;
                var obj = _.clone(item);
                this.tableModel.oldList.push(obj);
                this.getCureList(this.tableModel.cure);
            },
            sortByKey: function (arr, key) {
                var temp = null;
                for (var i = 0; i < arr.length - 1; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (parseInt(arr[i].config.y) > parseInt(arr[j].config.y)) {
                            temp = arr[i];
                            arr[i] = arr[j];
                            arr[j] = temp;
                        }
                    }
                }
                for (var i = 0; i < arr.length; i++) {
                    if (i == arr.length - 1) {
                        arr[i].config.rowspan = 5 - arr[i].config.y;
                    } else {
                        arr[i].config.rowspan = arr[i + 1].config.y - arr[i].config.y - 1;
                    }
                }
            },
            calculateColspan: function (arr) {
                for (var i = 0; i < 15; i++) {
                    var tempArr = _.filter(arr, function (item) {
                        return item.config && item.config.x == i && item.disable == '0';
                    });
                    if (tempArr && tempArr.length > 0) {
                        this.sortByKey(tempArr);
                    }
                }
            },
            doSave: function () {
                this.calculateColspan(this.tableModel.oldList);
                this.$emit("do-save", this.tableModel.oldList);
            },
            queryColumnSettings: function (jsonStr) {
                var _this = this;
                _this.tableModel.list = [];
                _this.tableModel.oldList = [];
                if (jsonStr.length > 5) {
                    _this.tableModel.oldList = JSON.parse(jsonStr);
                    // if(!_.find(_this.tableModel.oldList, 'dataType', 100)){
                    //     _this.tableModel.oldList.push(dataType10());
                    // }
                    _this.getCureList('all');
                }
                else {
                    api.queryDefaultSetting().then(function (res) {
                        _this.tableModel.oldList = res.body;
                        // if(!_.find(_this.tableModel.oldList, 'dataType', 100)){
                        //     _this.tableModel.oldList.push(dataType10());
                        // }
                        _this.getCureList('all');
                    })
                }
            },

            getCureList: function (str) {
                this.tableModel.cure = str;
                if (str == 'all') {
                    this.tableModel.list = _.filter(this.tableModel.oldList, function (item) {
                        return item.dataType != '100';
                    });
                } else if (str == 'inherent') {
                    this.tableModel.list = _.filter(this.tableModel.oldList, function (item) {
                        return item.isInherent == '1' && item.dataType != '100';
                    })
                } else if (str == 'disable') {
                    this.tableModel.list = _.filter(this.tableModel.oldList, function (item) {
                        return item.disable == '0' && item.dataType != '100';
                    })
                } else {
                    this.tableModel.list = _.filter(this.tableModel.oldList, function (item) {
                        return item.isInherent != '1' && item.dataType != '100';
                    })
                }
                this.getAllStatus();
            },
            drapEnd: function (list) {
                this.diffArray(this.tableModel.oldList, list, this.tableModel.cure)
                this.tableModel.list=list
                // this.tableModel.oldList = list;
                // this.getCureList('all');
                LIB.Msg.info("移动成功");
            }

        },
      
    });

    return detail;
});