define(function(require) {
    var LIB = require('lib');
    var template = require("text!./baseTwoSideSelectModal.html");

    var opts = {
        template: template,
        name: "base-two-side-select-modal",
        props: {
            leftSignal:{
                type:Boolean,
                default:false
            },
            emptyAll: {
                type: Boolean,
                default: false
            },
            visible: {
                type: Boolean,
                default: false
            },
            singleSelect: {
                type: Boolean,
                default:false
            },
            searchTreeleft:{
                default:0
            },
            filterData: {
                type:Object
            },
            keyword1:{
                type:String,
                default: ''
            },
            keyword2:{
                type:String,
                default: ''
            }
        },
        methods: {
            onDbClickCell: function(data) {
                if(this.isSingleSelect) {
                    this.$emit('do-save', [data.entry.data]);
                    this.visible = false;
                }
            },
            doSave: function() {
                if (this.tableModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.visible = false;
                if(this.isSingleSelect) {
                    this.$emit('do-save', this.tableModel.selectedDatas);
                }else {
                    this.$emit('do-save', this.tableModel.selectedDatas);
                }
            },
            doFilterLeft: function(val) {
                var params = [
                {
                    type: 'save',
                    value: {
                        columnFilterName: 'criteria.strValue',
                        columnFilterValue: {keyWordValue: this.keyword1}
                    }
                }];
                this.$refs.leftTable.doCleanRefresh(params);
            },

            deelDoFilterRightData: function () {
                var params = [];
                if(this.leftTableModel && this.leftTableModel.contentKeyWord && this.leftTableModel.selectedDatas.length>0){
                    var leftSelectDatas = this.leftTableModel.selectedDatas;
                    _.each(this.leftTableModel.contentKeyWord, function (item) {
                          if(item.contentType == 'array'){
                            var obj = {};
                            var arr = _.pluck(leftSelectDatas, item.contentKey);
                            obj[item.contentTypeName] = [];
                            if(arr && arr.length > 0) obj[item.contentTypeName] = arr;
                            var temp = {
                                columnFilterName: 'criteria.strsValue',
                                columnFilterValue: obj
                            };
                            params.push({
                                type: 'save',
                                value: temp
                            })
                        }
                    })
                }
                params.push( {
                    type: 'save',
                    value: {
                        columnFilterName: 'criteria.strValue',
                        columnFilterValue: {keyWordValue: this.keyword2?this.keyword2:''}
                    }
                });
                return params;
            },

            doFilterRight: function() {
                var params = this.deelDoFilterRightData();
                this.$refs.table.doCleanRefresh(params);
            },

            getConcatList: function () {
                var _this = this;
                var resource = this.$resource("contractor/list/1/10000?disable=0");
                resource.get().then(function(res){
                    if(res.data){
                        _this.leftList = res.data.list;
                        if(_this.leftList.length>0){
                            var obj = _this.leftList[0];
                            _this.doFilterRight(obj)
                        }

                    }
                })
            },

            init: function() {
                // debugger
                if(this.leftTableModel){
                    this.$refs.leftTable.cleanAllStatus();
                    this.$refs.leftTable.doClearData();
                    this.$refs.leftTable.doQuery();
                }


                this.$refs.table.cleanAllStatus();
                this.$refs.table.doClearData();
                this.$refs.table.doQuery();

                // this.getConcatList();
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    this.init();
                } else {
                    // this.treeModel.keyword = "";
                    // this.tableModel.keyword = "";
                }
            },
            "leftTableModel.selectedDatas": function () {
                this.doFilterRight();
            }
        },
        created: function() {
            this.orgListVersion = 1;
            if(this.isSingleSelect) {
                this.isCacheSelectedData = false;
            } else {
                this.isCacheSelectedData = true;
            }
        }
    };


    return opts;
})
