define(function (require) {
    var api = require('../vuex/api')
    var template = require("text!./selectGroup.html");
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
                tableModel: LIB.Opts.extendDetailTableOpt({
                    url : "chemicalregister/list{/curPage}{/pageSize}",
                    filterColumn:['name'],
                    columns : [
                        _.extend( _.clone(LIB.tableMgr.column.cb),{fieldType:'radio'})  ,
                        {
                            //名称
                            title: "一般化学品名称",
                            fieldName: "name",
                           
                        },
                        {
                            title: "别名",
                            fieldName: "alias",
                            
                        },
                        {
                            title: "类别",
                            fieldName: "category",
                           
                        },
                        {
                            //CAS编码
                            title: "CAS编码",
                            fieldName: "ccode",
                           
                        },
                        {
                            //UN编号
                            title: "UN编号",
                            fieldName: "uncode",
                           
                        },]
                }),
                legalTypes: [],
                treeSelectData: []
            }
        },
        methods: {
            onDbClickCell: function (data) {
               
                    this.visible = false;
                    // this.resetTriggerFlag=!this.resetTriggerFlag;
                    this.$emit('do-save',[ data.entry.data]);
                
            },
            doSave: function () {
                if (this.mainModel.selectedDatas.length == 0) {
                    LIB.Msg.warning("请选择数据");
                    return
                }
                this.visible = false;
                // this.resetTriggerFlag=!this.resetTriggerFlag;
                this.$emit('do-save', this.mainModel.selectedDatas);
            }
        },


    }

    return component;
});