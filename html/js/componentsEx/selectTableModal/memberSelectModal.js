define(function(require) {
    var LIB = require('lib');
    var template = require("text!./memberSelectModal.html");

    var rebuildOrgName = function(id, type, name) {

        var spliteChar = " / ";

        var curOrgName = name || '';

        //if(type == 'comp') {
        //	return LIB.getDataDic("org", id)["compName"];
        //} else if(type == 'dept') {
        //	return LIB.getDataDic("org", id)["deptName"];
        //}

        //var orgFieldName = type == "comp" ? "compName" :"deptName";
        //使用公司简称csn(company short name)代替compName
        var orgFieldName = type == "comp" ? "csn" : "deptName";

        if (BASE.setting.orgMap[id]) {

            if (curOrgName != '') {
                var orgName = LIB.getDataDic("org", id)[orgFieldName]

                //如果渲染的组织结构是部门, 通过DataDic获取的值为undefine，则表示父级是公司了，则当前是顶级部门, 直接返回即可
                if (orgName != undefined) {
                    curOrgName = orgName + spliteChar + curOrgName;
                } else {
                    return curOrgName;
                }
            } else {
                curOrgName = LIB.getDataDic("org", id)[orgFieldName];
            }

            var parentId = BASE.setting.orgMap[id]["parentId"];

            //不存在父级组织机构了,则表示是顶级组织机构
            if (!!parentId) {

                //部门的 id==parentId 时表示是顶级部门
                if (id == parentId) {
                    return curOrgName;
                }
                curOrgName = rebuildOrgName(parentId, type, curOrgName);
            }
        }
        return curOrgName;
    };


    var initDataModel = function() {
        return {
            isSupperAdmin:false,
            orgList: [], // 人员选择左侧弹框公司列表源数据
            subOrgList: [], // 中间递归用到
            filterTreeType: null,
            mainModel: {
                model: {
                    type: [Array, Object],
                    default: ''
                },
                title: '选择人员'
            },
            treeModel: {
                data: [],
                selectedData: [],
                keyword: '',
                filterData: {id: ''},
                showLoading: false,
            },
            tableModel: {
                // url: "user/posHseList{/curPage}{/pageSize}?disable=0",
                url: "user/list{/curPage}{/pageSize}?disable=0",
                selectedDatas: [],
                keyword: '',
                columns: [{
                    title: "",
                    fieldName: "id",
                    fieldType: "cb"
                }, {
                    title: "员工姓名",
                    fieldName: "username",
                    width: 120
                },

                    (function () {
                        var org = _.omit(LIB.tableMgr.column.company, "filterType");
                        org.width = 160;
                        return org;
                    })(),
                    (function () {
                        var org = _.omit(LIB.tableMgr.column.dept, "filterType");
                        org.width = 160;
                        return org;
                    })(),

                    // _.omit(LIB.tableMgr.column.dept, "filterType"),
                    {
                        title: "岗位",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.positionList) {
                                var posNames = "";
                                data.positionList.forEach(function (e) {
                                    if (e.postType == 0 && e.name) {
                                        posNames += (e.name + "/");
                                    }
                                });
                                posNames = posNames.substr(0, posNames.length - 1);
                                return posNames;

                            }
                        },
                        width: 160
                    },

                    {
                        title: "安全角色",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.positionList) {
                                var roleNames = "";
                                data.positionList.forEach(function (e) {
                                    if (e.postType == 1 && e.name) {
                                        roleNames += (e.name + ",");
                                    }
                                });
                                roleNames = roleNames.substr(0, roleNames.length - 1);
                                return roleNames;

                            }
                        },
                        width: 160
                    }
                ],
                defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}}
            },
            concatTableModel: {
                list:[],
                url: "contractoremp/list{/curPage}{/pageSize}?disable=0&type=1",
                selectedDatas: [],
                keyword: '',
                columns: [
                    LIB.tableMgr.ksColumn.cb,
                    {
                        //姓名
                        title: "姓名",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                        width:70
                    },
                    // {
                    //     //年龄
                    //     title: "年龄",
                    //     fieldName: "userDetail.age",
                    //     keywordFilterName: "criteria.strValue.keyWordValue_age",
                    //     width:60
                    // },
                    {
                        title: "承包商",
                        fieldName: "contractor.deptName",
                        keywordFilterName: "criteria.strValue.keyWordValue_contractor_dept_name",
                    }]  ,
                isCacheSelectedData: true
            },
            leftTableModel: {
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
                    LIB.tableMgr.ksColumn.cb,
                    {
                        //姓名
                        title: "承包商",
                        fieldName: "deptName",
                    },
                ],
                defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" } }
            },
        }
    };

    // var buildGroupData = function (itemsObj,rootNodes) {
    //     function spread(nodes) {
    //         nodes.forEach(function (node) {
    //             if(itemsObj[node.id] !== undefined){
    //                 node.children = itemsObj[node.id];
    //                 spread(itemsObj[node.id])
    //             }
    //         })
    //     }
    //     spread(rootNodes);
    //     return rootNodes;
    // }
    var opts = {
        template: template,
        name: "memberSelectModal",
        props: {
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
            isShowConcator: {
                type:Boolean,
                default: true
            },
            isConcatLogin: {
                type:Boolean,
                default:false
            },
            defaultSelect:{
                type:String,
                default:0
            },
            showOnlyType: {
                type:Number,
                default:-1
            }
        },
        data: initDataModel,
        methods: {
            doTreeNodeClick: function(obj) {

                var params = null;
                this.treeModel.filterData.id = '';
                this.filterTreeType = null;

                if(obj && obj.data){
                    if (obj.data.id === this.treeModel.filterData.id) return;
                    this.treeModel.filterData.id = obj.data.id;
                    this.filterTreeType = obj.data.type;
                }

                // if (this.filterTreeType == "1") {
                //     params = [{
                //         type: 'save',
                //         value: {
                //             columnFilterName: 'compId',
                //             columnFilterValue: this.treeModel.filterData.id
                //         }
                //     }, {
                //         type: 'save',
                //         value: {
                //             columnFilterName: 'criteria.strValue',
                //             columnFilterValue: { keyWordValue: this.tableModel.keyword }
                //         }
                //     }];
                // } else {
                    params = [{
                        type: 'save',
                        value: {
                            columnFilterName: 'orgId',
                            columnFilterValue: this.treeModel.filterData.id
                        }
                    }, {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: { keyWordValue: this.tableModel.keyword }
                        }
                    }];
                // }
                var tableFilterDatas = [];
                var filterData = this.filterData;
                if(filterData) {
                    for(key in filterData) {
                        if((key == 'orgId' || key == 'compId') && !!this.treeModel.filterData.id) continue; //前面已经把这两个参数设置了
                        var value = filterData[key];
                        if(value != undefined && value != null && value.toString().trim() != "" ) {
                            var tableFilterData = {
                                type :　"save",
                                value : {
                                    columnFilterName : key,
                                    columnFilterValue : value
                                }
                            };
                            tableFilterDatas.push(tableFilterData);
                        }
                    }
                }
                params = params.concat(tableFilterDatas);

                this.$refs.table.doCleanRefresh(params);
            },
            onDbClickCell: function(data) {
                if(this.isSingleSelect) {
                    this.$emit('do-save', [data.entry.data]);
                    this.visible = false;
                }
            },
            doSave: function() {
                if (this.tableModel.selectedDatas.length === 0 && this.searchTreeleft != 3) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                if (this.concatTableModel.selectedDatas.length===0 && this.searchTreeleft == 3) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.visible = false;
                if(this.isSingleSelect) {
                    if(this.searchTreeleft != 3)
                        this.$emit('do-save', this.tableModel.selectedDatas);
                    else this.$emit('do-save', this.concatTableModel.selectedDatas);
                }else {
                    if(this.searchTreeleft != 3)
                        this.$emit('do-save', this.tableModel.selectedDatas);
                    else this.$emit('do-save', this.concatTableModel.selectedDatas);
                }
            },
            doFilterLeft: function(val) {
                if(this.searchTreeleft == '3'){
                    this.doFilterConcator();
                    return ;
                }
                this.treeModel.keyword = val;

            },

            doFilterConcator: function () {
                var params = [
                    {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: { keyWordValue: this.leftTableModel.keyword }
                        }
                    }];
                this.$refs.leftTable.doCleanRefresh(params);
            },

            //
            doFilterConcatorMember: function () {
                var _this = this;
                var ids =  _.pluck(this.leftTableModel.selectedDatas, "id");

                var params = [
                    {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            // columnFilterValue: {keyWordValue: this.keyword2?this.keyword2:''}
                            columnFilterValue: {
                                'keyWordValue_join_': 'or',
                                'keyWordValue_user_detail_age': this.tableModel.keyword?this.tableModel.keyword:'',
                                'keyWordValue_name':  this.tableModel.keyword?this.tableModel.keyword:'',
                                'keyWordValue_contractor_dept_name':  this.tableModel.keyword?this.tableModel.keyword:'',
                                'keyWordValue':  this.tableModel.keyword?this.tableModel.keyword:'',
                            }
                        }
                    }
                ];

                if(LIB.user.compId != '9999999999'){
                    params.push({
                        type: 'save',
                        value: {
                            columnFilterName: 'compId',
                            // columnFilterValue: {keyWordValue: this.keyword2?this.keyword2:''}
                            columnFilterValue:LIB.user.compId
                        }
                    })
                }

                if(ids && ids.length > 0){
                    params.push({
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strsValue',
                            columnFilterValue: {contractorId: _.pluck(this.leftTableModel.selectedDatas, "id")||[]}
                        }
                    })
                }

                for(var key in this.filterData){
                    if(this.searchTreeleft==2 && (key == 'compId' || key=='orgId')) continue;
                    var obj = _.find(params, function (item) {
                        return item.value.columnFilterName == key;
                    });
                    if(obj){
                        obj.value.columnFilterValue = _this.filterData[key];
                    }else{
                        params.push({
                            type: 'save',
                            value: {
                                columnFilterName: key,
                                columnFilterValue: _this.filterData[key]
                            }
                        });
                    }
                }

                this.$refs.concatTable.doCleanRefresh(params);
            },

            doFilterRight: function() {
                var _this = this;
                if(this.searchTreeleft == '3'){
                    this.doFilterConcatorMember();
                    return ;
                }
                var params = null;
                if (this.filterTreeType == "1") {
                    params = [
                        {
                        type: 'save',
                        value: {
                            columnFilterName: 'compId',
                            columnFilterValue: this.searchTreeleft=='2'?'':this.treeModel.filterData.id
                        }
                    },
                        {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: { keyWordValue: this.tableModel.keyword }
                        }
                    }];
                } else {
                    params = [{
                        type: 'save',
                        value: {
                            columnFilterName: 'orgId',
                            columnFilterValue: this.searchTreeleft=='2'?'':this.treeModel.filterData.id
                        }
                    },
                        {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: { keyWordValue: this.tableModel.keyword }
                        }
                    }];
                }

                for(var key in this.filterData){
                    if(this.searchTreeleft==2 && (key == 'compId' || key=='orgId')) continue;
                    var obj = _.find(params, function (item) {
                        return item.value.columnFilterName == key;
                    });
                    if(obj){
                        obj.value.columnFilterValue = _this.filterData[key];
                    }else{
                        params.push({
                            type: 'save',
                            value: {
                                columnFilterName: key,
                                columnFilterValue: _this.filterData[key]
                            }
                        });
                    }
                }

                this.$refs.table.doCleanRefresh(params);
            },

            getSubList:function (id) {
                var arr = [];
                var temp = [];
                arr = _.filter(this.orgList,function (item) {
                   return item.parentId == id;
               });
                temp = [].concat(arr);
               if(arr && arr.length>0){
                   for(var i=0; i<arr.length; i++){
                       temp = temp.concat(this.getSubList(arr[i].id))
                   }
               }
               return temp;
            },

            //查询出公司下面的所有部门
            buildAllDeptByParentId: function (parentId, result, type) {
                var _this = this;
                var resultTmp = _.filter(this.orgList, function (data) {
                    return data.parentId === parentId && data.type == type;
                });
                if (!_.isEmpty(resultTmp)) {
                    _.each(resultTmp, function (_item) {
                        _this.buildAllDeptByParentId(_item.id, resultTmp);
                    });
                    _.each(resultTmp, function (_tmpItem) {
                        result.push(_tmpItem);
                    })
                }
            },
            buildAllComptByParentId: function (id, result) {
                var _this = this;
                deel(id);
                function deel(parentId) {
                    var resultTmp = _.filter(_this.orgList, function (data) {
                        return data.parentId == parentId ;
                    });
                    if (!_.isEmpty(resultTmp)) {
                        _.each(resultTmp, function (_resultTmp) {
                            if(!_.find(result, function (resultItem) {
                                    return resultItem.id == _resultTmp.id;
                                })){
                                result.push(_resultTmp);
                            }
                        });
                        _.each(resultTmp, function (_item) {
                            deel(_item.id);
                        });
                    }
                }
            },

            changeOrg:function (val) {
                var _this = this;
                if(val == 3){
                    this.searchTreeleft = 3;
                    this.doFilterRight();
                    // this.$refs.leftTable.doCleanRefresh(params);
                    return ;
                }

                var orgList = [];
                this.treeModel.selectedData = []; // 初始化数据
                this.tableModel.keyword = '';
                this.searchTreeleft = parseInt(val);


                if(val == 0){
                    var obj = _.find(this.orgList,function (item) {
                        return item.id == ((_this.filterData && _this.filterData.orgId) || LIB.user.orgId);
                    });
                    if(obj) orgList.push(obj);
                    this.buildAllDeptByParentId((_this.filterData && _this.filterData.orgId) || LIB.user.orgId, orgList, 2);
                }else if(val == 1){
                    var obj = _.find(this.orgList,function (item) {
                        return item.id == ((_this.filterData && _this.filterData.compId) || LIB.user.compId);
                    });
                    if(obj) orgList.push(obj);
                    this.buildAllComptByParentId((_this.filterData && _this.filterData.compId) || LIB.user.compId, orgList, 1);
                }

                var list = [];
                // for(var i=0; i<orgList.length; i++){
                //     var subarr = this.getSubList(orgList[i].id)
                //     list = list.concat(subarr);
                // }
                // orgList = orgList.concat(list);
                if(val == 2){

                    if(_this.filterData && _this.filterData.compId){
                        orgList = _.filter(this.orgList,function (item) {
                            return  item.id == _this.filterData.compId;
                            // item.id == LIB.user.compId;
                        })
                    } else {
                        orgList = this.orgList;
                    }
                }
                this.treeModel.data = [];
                // 增加树加载提示
                if (orgList > 300) {
                    this.treeModel.showLoading = true;
                    var _this = this;
                    //延迟防止卡顿
                    var intervalId = setTimeout(function() {
                        _this.treeModel.data = _.sortBy(orgList, "type");
                        clearTimeout(intervalId);
                        _this.treeModel.showLoading = false;
                    }, 300);
                } else {
                    this.treeModel.data = _.sortBy(orgList, "type");
                }
                if(val == 2){
                    return this.searchAll();
                }
                this.doTreeNodeClick({data:orgList[0]});
            },

            searchAll:function () {
                var _this = this;
                var params = [
                    {
                    type: 'save',
                    value: {
                        columnFilterName: 'orgId',
                        columnFilterValue: ''
                    }
                }, {
                    type: 'save',
                    value: {
                        columnFilterName: 'criteria.strValue',
                        columnFilterValue: { keyWordValue: '' }
                    }
                },
                 {
                     type: 'save',
                     value: {
                         columnFilterName: 'compId',
                         columnFilterValue: ''
                     }
                 }, {
                     type: 'save',
                     value: {
                         columnFilterName: 'criteria.strValue',
                         columnFilterValue: { keyWordValue: '' }
                     }
                 }
                ];

                for(var key in this.filterData){
                    // if(this.searchTreeleft==2 && (key == 'compId' || key=='orgId')) continue;
                    var obj = _.find(params, function (item) {
                        return item.value.columnFilterName == key;
                    });
                    if(obj && !obj.value.columnFilterValue){
                        obj.value.columnFilterValue = _this.filterData[key];
                    }else{
                        params.push({
                            type: 'save',
                            value: {
                                columnFilterName: key,
                                columnFilterValue: _this.filterData[key]
                            }
                        });
                    }
                }

                this.$refs.table.doCleanRefresh(params);
            },


            init: function() {
                var _this = this;
                this.concatTableModel.selectedDatas.splice(0);
                this.concatTableModel.list.splice(0);

                var isNeedRefreshData = false;
                if (this.orgListVersion != window.allClassificationOrgListVersion) {
                    this.orgListVersion = window.allClassificationOrgListVersion;
                    isNeedRefreshData = true;
                } else if (_.isEmpty(this.treeModel.data)) {
                    isNeedRefreshData = true;
                }
                if (isNeedRefreshData) {
                    var orgList = _.filter(LIB.setting.orgList, function (item) {
                        return item.disable !== '1'
                    });

                    this.orgList = _.cloneDeep(orgList)

                    //触发treeModel.data数据变化的事件， 必需先设置为空数据组
                    this.treeModel.data = [];
                    // 增加树加载提示
                    if (orgList > 300) {
                        this.treeModel.showLoading = true;
                        var _this = this;
                        //延迟防止卡顿
                        var intervalId = setTimeout(function() {
                            _this.treeModel.data = _.sortBy(orgList, "type");
                            clearTimeout(intervalId);
                            _this.treeModel.showLoading = false;
                        }, 300);
                    } else {
                        this.treeModel.data = _.sortBy(orgList, "type");
                    }
                } else {
                    if(this.$els.mtree){
                        // 还原树组件状态
                        this.$nextTick(function() {
                            (_this.$els.mtree && _this.$els.mtree.scrollTop) && (_this.$els.mtree.scrollTop = 0);
                        });
                    }
                    this.treeModel.selectedData = [];
                }
                this.searchTreeleft = 0;

                if(LIB && LIB.user && LIB.user.type == '1'){
                    this.isConcatLogin = true;
                    // this.searchTreeleft = 3;
                    // setTimeout(function () {
                    //     _this.changeOrg(3);
                    // },200);
                    this.changeOrg(1);
                    return ;
                }
                if(this.showOnlyType!=-1){
                    this.changeOrg(this.showOnlyType);
                    return ;
                }

                this.changeOrg(0);
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    // this.queryCompanyData();
                    this.init();
                    // this.$refs.table.doCleanRefresh([]);
                } else {
                    this.treeModel.keyword = "";
                    this.tableModel.keyword = "";
                }
            },
            "leftTableModel.selectedDatas": function (val) {
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
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('user-member-select-modal', component);

    return opts;
})
