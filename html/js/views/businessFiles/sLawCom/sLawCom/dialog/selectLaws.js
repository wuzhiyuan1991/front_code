define(function (require) {
    var api = require('../vuex/api')
    var template = require("text!./selectLaws.html");
    var LIB = require('lib');
    var component = {
        template: template,
        props: {

            visible: {
                type: Boolean,
                default: false
            },


        },
        data: function () {
            return {
                tableModel: {
                    url: "irllegalregulation/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    isSingleCheck: true,
                    columns: [
                     _.extend( _.clone(LIB.tableMgr.column.cb),{fieldType:'radio'})  ,
                        {
                            title: "分类",
                            fieldName: "irlLegalRegulationType.name",
                            orderName: "irlLegalRegulationType.name",

                        },
                        {
                            title: "名称",
                            fieldName: "name",
                            width: 200,

                            'renderClass': "textarea",
                        },
                        {
                            //编号
                            title: "编号",
                            fieldName: "identifier",

                        },


                    ],
                    defaultFilterValue: {
                        "criteria.orderValue": {
                            fieldName: "orderNo",
                            orderType: "0"
                        }
                    }
                },
                legalTypes: [],
                treeSelectData: []
            }
        },
        watch: {
            visible: function (val) {
                val && this.initData();
            },

            treeSelectData: function (val) {
                if (val.length > 0) {
                    this.$refs.table.doQuery({ 'irlLegalRegulationType.id': val[0].id })

                } else {
                    this.$refs.table.doClearData()

                }
            }

        },
        methods: {
            initData: function () {
                var _this = this
                api.queryLegalTypes().then(function (res) {
                    if (res.data.length > 0) {
                        _this.legalTypes = res.data;
                        _this.treeSelectData = [res.data[0]]
                    } else {
                        _this.legalTypes = []
                    }
                });

            },
            doTreeNodeClick: function () {

            },
            onDbClickCell: function (data) {
                
                this.visible = false;
                // this.resetTriggerFlag=!this.resetTriggerFlag;
                this.$emit('do-save', data.entry.data);

            },
            doSave: function () {
                if (this.mainModel.selectedDatas.length == 0) {
                    LIB.Msg.warning("请选择数据");
                    return
                }
                this.visible = false;
                // this.resetTriggerFlag=!this.resetTriggerFlag;
                this.$emit('do-save', this.mainModel.selectedDatas[0]);
            }
        },


    }

    return component;
});