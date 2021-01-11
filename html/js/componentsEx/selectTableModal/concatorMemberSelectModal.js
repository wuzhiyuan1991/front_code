define(function(require) {
    var LIB = require('lib');
    var baseTwoSideSelectModal = require("./baseTwoSideSelectModal");

    var initDataModel = function() {
        return {
            leftList: [],
            mainModel: {
                model: {
                    type: [Array, Object],
                    default: ''
                },
                title: '选择人员'
            },

            leftTableModel: {
                isSingleCheck:true,
                url: "contractor/list{/curPage}{/pageSize}?disable=0",
                selectedDatas: [],
                keyword: '',
                contentKeyWord:[
                    {
                        contentType:"array",
                        contentTypeName: 'contractorId',
                        contentKey: 'id',
                    }
                ],
                columns: [
                    // LIB.tableMgr.ksColumn.cb,
                    (function () {
                        var obj = LIB.tableMgr.ksColumn.cb;
                        obj = _.clone(obj);
                        obj.width = 50;
                        return obj;
                    })(),
                    {
                        //姓名
                        title: "承包商",
                        fieldName: "deptName",
                        width:200
                    },

                ],
                defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" } }
            },
            tableModel: {
                url: "contractoremp/list{/curPage}{/pageSize}?disable=0",
                selectedDatas: [],
                keyword: '',
                columns: [
                    (function () {
                        var obj = LIB.tableMgr.ksColumn.cb;
                        obj = _.clone(obj);
                        obj.width = 50;
                        return obj;
                    })(),
                    {
                        //姓名
                        title: "姓名",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                        width:100
                    },
                    {
                        //年龄
                        title: "年龄",
                        fieldName: "userDetail.age",
                        keywordFilterName: "criteria.strValue.keyWordValue_age",
                        width:70
                    },
                    {
                        title: "承包商",
                        fieldName: "contractor.deptName",
                        keywordFilterName: "criteria.strValue.keyWordValue_contractor_dept_name",
                    },
                    (function () {
                        var obj = LIB.tableMgr.column.company;
                        obj = _.clone(obj);
                        obj.width = 180;
                        delete obj.filterType;
                        return obj;
                    })(),
//					{
//						//证书
//						title: "证书",
//						fieldName: "certificate",
//						keywordFilterName: "criteria.strValue.keyWordValue_certificate"
//					},
//					{
//						//证书编号
//						title: "证书编号",
//						fieldName: "certificateNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_certificateNo"
//					},
//					{
//						//身份证号
//						title: "身份证号",
//						fieldName: "idNumber",
//						keywordFilterName: "criteria.strValue.keyWordValue_idNumber"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark"
//					},
//					{
//						//性别
//						title: "性别",
//						fieldName: "sex",
//						keywordFilterName: "criteria.strValue.keyWordValue_sex"
//					},
//					{
//						//联系电话
//						title: "联系电话",
//						fieldName: "telephone",
//						keywordFilterName: "criteria.strValue.keyWordValue_telephone"
//					},
//					{
//						//工种
//						title: "工种",
//						fieldName: "workType",
//						keywordFilterName: "criteria.strValue.keyWordValue_workType"
//					},
//					 LIB.tableMgr.ksColumn.modifyDate,
////					 LIB.tableMgr.ksColumn.createDate,
//
                ],
                defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" },'criteria.strValue.keyWordValue_join_': 'or' }
            },
            isCacheSelectedData: true
        }
    };
    var opts = {
        mixins:[baseTwoSideSelectModal],
        name: "concator-member-select-modal",
        data: initDataModel,
        methods: {
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
                params.push({
                    type: 'save',
                    value: {
                        columnFilterName: 'criteria.strValue',
                        // columnFilterValue: {keyWordValue: this.keyword2?this.keyword2:''}
                        columnFilterValue: {
                            'keyWordValue_join_': 'or',
                            'keyWordValue_code': this.keyword2?this.keyword2:'',
                            'keyWordValue_comp': this.keyword2?this.keyword2:'',
                            'keyWordValue_org': this.keyword2?this.keyword2:'',
                            'keyWordValue_name': this.keyword2?this.keyword2:'',
                            'keyWordValue_contractor_dept_name': this.keyword2?this.keyword2:'',
                            'keyWordValue': this.keyword2?this.keyword2:''
                        }
                    }
                });
                return params;
            },

            doFilterRight: function() {
                var params = this.deelDoFilterRightData();
                this.$refs.table.doCleanRefresh(params);
            },
        },
    };
    var component = LIB.Vue.extend(opts);
    return component;
})
