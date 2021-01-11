define(function(require) {

    var LIB = require('lib');
    var actions = require("app/vuex/actions");
    var mixin = {

        data: function() {
            return {
                filterConditions: []
            }
        },
        computed: {
            tableCode: function() {
                return this.moduleCode ? this.moduleCode + "_Table" : null;
            }
        },
        methods: {
            //添加table的过滤条件到条件显示列表
            doAddDisplayFilterValue: function(data) {
                var _this = this;
                /**
                 *  data的数据结构
                	{
                		//条件 标题
                		displayTitle 
                		//条件内容
                		displayValue 
                		//条件 后台搜索的 属性
                		columnFilterName 
                		//条件 后台搜索的 值
                		columnFilterValue 
                	}
                 **/
                //如果存在，则先删除, 删除需要倒序，防止下标错误
                for (var i = _this.filterConditions.length - 1; i >= 0; i--) {
                    var fc = _this.filterConditions[i];
                    if (fc["columnFilterName"] && fc["columnFilterName"] == data.columnFilterName) {
                        _this.filterConditions.splice(i, 1);
                    }
                }
                if (!_.isEmpty(data.displayValue)) {
                    _this.filterConditions.push(data);
                }
            },
            //从条件显示列表删除条件时需要刷新table数据
            doCondtionGroupItemRemoveAction: function(data) {
                this.$refs.mainTable.$emit("do_query_by_filter", { type: "remove", value: data.item });
                //清空全局搜索的数据
                if (this.validGlobalSearchData() && this.searchData.value.filterName == data.item.columnFilterName) {
                    this.updateGlobalSearchData({ code: this.searchData.code });
                }
            },
            //通过组织结构过滤当前table的数据
            doOrgCategoryChange: function(obj) {
                //obj.categoryType
                var data = {};
                //条件 标题
                data.displayTitle = "";
                //条件 内容
                data.displayValue = "";
                //条件 后台搜索的 属性
                data.columnFilterName = "orgId";
                //条件 后台搜索的 值
                if (obj.categoryType == "org" && obj.topNodeId == obj.nodeId) {
                    //如果是根据当前最大组织机构过滤时,则不传参数,后台默认处理
                    data.columnFilterValue = null;
                } else {
                    data.columnFilterValue = obj.nodeId;
                }

                this.emitMainTableEvent("do_query_by_filter", { type: "save", value: data });
            },
            _getExportURL: function () {
                var queryStr = LIB.urlEncode(this.$refs.mainTable.getCriteria());
                if (!this.exportModel.withColumnCfgParam) {
                    return this.exportModel.url + queryStr.replace("&", "?");
                }
                var originColumns =  _.get(this.tableModel, "columns");
                var columns = window.localStorage.getItem("tb_code_" + this.moduleCode);
                var ret = [];

                if (columns) {
                    columns = JSON.parse(columns);
                    columns = _.filter(columns, function (col) {
                        return col.visible;
                    });
                    var _colsObj = _.indexBy(originColumns, 'title');
                    _.forEach(columns, function (col) {
                        var title = col.title;
                        var obj = _colsObj[title];
                        if (!title || title === "cb" || title === "radio") {
                            return;
                        }
                        if (!_.isPlainObject(obj) || obj.fieldType === 'tool') {
                            return;
                        }
                        ret.push({
                            title: col.title,
                            field: obj.fieldName,
                            dataDicKey: obj.dataDicKey
                        })
                    });
                } else {
                    ret = _.filter(originColumns, function (c) {
                        return c.title && c.title !== "cb" && c.title !== "radio" && c.fieldType !== 'tool';
                    })
                    ret = _.map(ret, function (column) {
                        return {
                            title: column.title,
                            field: column.fieldName,
                            dataDicKey: column.dataDicKey
                        }
                    });
                }
                //var columnStr = JSON.stringify({_config: JSON.stringify(ret)});
                //var str = encodeURIComponent(columnStr);
                //queryStr = queryStr + '&criteria.strValue=' + str;

                var criteria = this.$refs.mainTable.getCriteria();
                if(!!criteria) {
                    var strValue = !!criteria['criteria.strValue'] ? JSON.parse(criteria['criteria.strValue']) : {};
                    _.extend(strValue , {_config: JSON.stringify(ret)});
                    var str = encodeURIComponent(JSON.stringify(strValue));
                    delete criteria['criteria.strValue'];
                    queryStr = LIB.urlEncode(criteria) + '&criteria.strValue=' + str;
                }
                return this.exportModel.url + queryStr.replace("&", "?")
            },
            //根据当前的搜索条件导出数据到Excel
            doExportExcel: function() {
                var _this = this;
                LIB.Modal.confirm({
                    title: '导出数据?',
                    onOk: function() {
                        window.open(_this._getExportURL());
                    }
                });
            },
            //导入成功提示,并刷新table
            doSuccessUpload: function(data) {
                if (data.rs.content.length > 0) {
                    LIB.Msg.warning("导入表格式不对" + "(" + data.rs.content[0] + ")");
                } else {
                    LIB.Msg.info("上传成功");
                }
                this.refreshMainTable();
            },
            //新增方法,滑出新增页面
            doAdd: function() {
                this.$broadcast('ev_dtReload', "create");
                this.detailModel.show = true;
            },

            //默认点击列为Code时,显示该列的详情
            doTableCellClick: function(data) {
                if (!!this.showDetail && data.cell.fieldName == "code") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            },
            //修改方法,滑出编辑页面
            doUpdate: function() {
                if (this.beforeDoUpdate() === false) {
                    return;
                }
                var rows = this.tableModel.selectedDatas;
                if (!_.isEmpty(rows)) {
                    this.showDetail(rows[0], { opType: "update" });
                }
            },
            beforeDoUpdate: function() {

            },
            //复制方法,滑出编辑页面
            doAdd4Copy: function() {
                var rows = this.tableModel.selectedDatas;
                if (!_.isEmpty(rows)) {
                    this.showDetail(rows[0], { opType: "update", action: "copy" });
                }
            },
            //显示详情面板
            showDetail: function(row, opts) {
                var opType = (opts && opts.opType) ? opts.opType : "view";
                //this.$broadcast('ev_dtReload', "view", row.id);
                this.$broadcast('ev_dtReload', opType, row.id, row, opts);
                this.detailModel.show = true;
            },
            doConfirmCallback: function () {
                var _this = this;
                var params = Array.prototype.slice.call(arguments);
                var fn = params.shift();
                if (!_.isFunction(this[fn])) {
                    return;
                }
                var title = params.shift() || '删除当前数据?';
                LIB.Modal.confirm({
                    title: title,
                    onOk: function() {
                        _this[fn].apply(_this, params);
                    }
                });
            },
            //删除table的数据
            doDelete: function() {

                //当beforeDoDelete方法明确返回false时,不继续执行doDelete方法, 返回undefine和true都会执行后续方法
                if (this.beforeDoDelete() == false) {
                    return;
                }

                var allowMulti = !!this.tableModel.allowMultiDelete;
                var _this = this;
                // var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
                //     return row.id
                // });
                if (!allowMulti && this.tableModel.selectedDatas.length > 1) {
                    LIB.Msg.warning("一次只能删除一条数据");
                    return;
                }
                var _vo = this.tableModel.selectedDatas[0];
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        _this.$api.remove(null, _vo).then(function() {
                            _this.afterDoDelete(_vo);
                            _this.emitMainTableEvent("do_update_row_data", {
                                opType: "remove",
                                value: _this.tableModel.selectedDatas
                            });
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
            doEnableDisable: function(dataCallback, handler) {
                var _this = this;
                var rows = _this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量操作");
                    return
                }
                var data = rows[0];
                var disable = (data.disable == "0")?"1":"0";
                var param = _.extend({disable:disable}, _.pick(data, "id","orgId"));
                if(this.$api.updateDisable) {
                    this.$api.updateDisable(null,  param).then(function (res) {
                        _this.refreshMainTable();
                        LIB.Msg.info((disable == "0")?"启用成功":"停用成功");
                    });
                } else {
                    this.$api.update(null,  param).then(function (res) {
                        _this.refreshMainTable();
                        LIB.Msg.info((disable == "0")?"启用成功":"停用成功");
                    });
                }

            },
            /**
             * 
             */
            beforeDoDelete: function() {

            },
            /**
             * 
             */
            afterDoDelete: function() {

            },

            //--------------------------------------------------------------------------------------------------------------------------------------------------
            //刷新table数据,保持当前页
            refreshMainTableData: function() {
                LIB.Msg.info("刷新成功!");
                this.$refs.mainTable && this.$refs.mainTable.doRefresh();
            },
            //刷新table数据,回到第一页
            refreshMainTable: function() {
                this.emitMainTableEvent("do_query_by_filter");
            },
            //刷新table数据Event
            emitMainTableEvent: function(eventType, param) {
                return this.$refs.mainTable && this.$refs.mainTable.$emit(eventType, param);
            },
            //全局搜索
            doGlobalKeyWordSearch: function() {
                if (this.validGlobalSearchData()) {
                    var searchValue = this.searchData.value;
                    var data = {};
                    //条件 标题
                    data.displayTitle = searchValue.displayName || "";
                    //条件 内容
                    data.displayValue = searchValue.filterValue;
                    //条件 后台搜索的 属性
                    data.columnFilterName = searchValue.filterName;
                    //条件 后台搜索的 值
                    data.columnFilterValue = searchValue.filterValue;

                    this.emitMainTableEvent("do_query_by_filter", { type: "save", value: data });

                    this.doAddDisplayFilterValue(data);
                }
            },
            //验证全局搜索是否有效
            validGlobalSearchData: function() {
                return this.moduleCode && this.moduleCode == this.searchData.code && this.searchData.value;
            },

            //-------------------------------------------------------------------------------------------------------------------------------------------
            //详情页面创建成功后的事件回调处理
            doDetailCreate: function() {
                //更新数据
                this.refreshMainTable();
                this.afterDoDetailCreate && this.afterDoDetailCreate();
                //this.detailModel.show = false;
            },
            //详情页面删除成功后的事件回调处理
            doDetailDelete: function() {
                //更新数据
                this.refreshMainTable();
                this.detailModel.show = false;
                this.afterDoDetailDelete && this.afterDoDetailDelete();
            },
            //详情页面更新成功后的事件回调处理
            doDetailUpdate: function() {
                this.refreshMainTable();
                this.afterDoDetailUpdate && this.afterDoDetailUpdate();
            },
            //点击详情页面关闭按钮的事件回调处理
            doDetailClose: function() {
                this.detailModel.show = false;
            },
            doHideAside: function() {
                LIB.asideMgr.hideAll();
            }
        },

        events: {
            "ev_dtCreate": function(data) {
                this.doDetailCreate();
            },
            "ev_dtDelete": function() {
                this.doDetailDelete();
            },
            "ev_dtUpdate": function() {
                this.doDetailUpdate();
            },
            "ev_dtClose": function() {
                this.doDetailClose();
            }
        },

        init:function () {
        },
        created: function () {
            if(this.$api) {
                this.__auth__ = this.$api.__auth__;
            }
            // 用户数据权限小于全集团时, 主列表默认不显示所属公司,  具体的页面需求， 重写具体页面的 created 方法
            if (_.isArray(_.get(this.tableModel, "columns"))) {
                var index = -1;
                var companyColumn = _.find(this.tableModel.columns, function (item, i) {
                    index = i;
                    return item.fieldName === "compId"
                });
                if(companyColumn) {
                    companyColumn = _.cloneDeep(companyColumn);
                    // 10本部门，20本部门及下属部门，30本公司，40本公司及下属公司，50全集团
                    companyColumn.visible = (LIB.userEx.orgDataLevel > '30');
                    this.tableModel.columns.splice(index, 1, companyColumn);
                }
            }

        },
        ready: function() {
            this.filterConditions = [];
            if (this.$refs.mainTable) {
                this.$refs.mainTable.$on("on-click-poptip-filter-ok", this.doAddDisplayFilterValue);
                this.$refs.mainTable.$on("on-header-click", this.doHideAside);
            }
            if (this.$refs.condtionGroup) {
                this.$refs.condtionGroup.values = this.filterConditions;
                this.$refs.condtionGroup.$on("on-remove-item", this.doCondtionGroupItemRemoveAction);
            }
            if (this.$refs.categorySelector) {
                    this.$refs.categorySelector.$on("on-org-change", this.doOrgCategoryChange);
            }

            if (this.validGlobalSearchData()) {
                this.doGlobalKeyWordSearch();
            }


            // 判断url, 打开详情页面
            if (this.$route.query.method === 'detail') {
                if(this.$route.query.code) {
                    var codeColumn = this.tableModel.columns.filter(function (item) {
                        return item.fieldName === "code";
                    });
                    // 兼容隐患总表
                    var titleColumn = this.tableModel.columns.filter(function (item) {
                        return item.fieldName === "title";
                    });
                    // 兼容一票两卡
                    var attr1Column = this.tableModel.columns.filter(function (item) {
                        return item.fieldName === "attr1";
                    });
                    if(codeColumn.length === 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, codeColumn[0], this.$route.query.code);
                    } else if(titleColumn.length === 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, titleColumn[0], this.$route.query.code);
                    } else if(attr1Column.length === 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, attr1Column[0], this.$route.query.code);
                    }
                }
                this.showDetail({id: this.$route.query.id});
                this.clearGoToInfoData();
            }
            if(this.$route.query.method === 'select') {
                if(this.$route.query.code) {
                    var codeColumn = this.tableModel.columns.filter(function (item) {
                        return item.fieldName === "code";
                    });
                    // 兼容隐患总表
                    var titleColumn = this.tableModel.columns.filter(function (item) {
                        return item.fieldName === "title";
                    });
                    // 兼容一票两卡
                    var attr1Column = this.tableModel.columns.filter(function (item) {
                        return item.fieldName === "attr1";
                    });
                    if(codeColumn.length === 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, codeColumn[0], this.$route.query.code);
                    } else if(titleColumn.length === 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, titleColumn[0], this.$route.query.code);
                    } else if(attr1Column.length === 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, attr1Column[0], this.$route.query.code);
                    }
                }
                this.$nextTick(function () {
                    this.tableModel.selectedDatas.push(
                        {
                            id:this.$route.query.id
                        }
                    );
                });
                this.clearGoToInfoData();
            }
            if(this.$route.query.method === 'doAdd') {
                this.doAdd();
                this.clearGoToInfoData();
            }
        },
        destroyed: function() {
            //清空全局搜索的数据
            if (this.validGlobalSearchData()) {
                this.updateGlobalSearchData({ code: this.searchData.code });
            }
        },
        vuex: {
            getters: {
                searchData: function(store) {
                    return store.search.keyWordSearchData;
                },
                infoData: function(store) {
                    return store.search.goToInfoData;
                }
            },
            actions: {
                updateGlobalSearchData: function(store, data) {
                    store.dispatch("UPDATE_SEARCH_VAL", data);
                },
                clearGoToInfoData: actions.clearGoToInfoData
            }
        },
        route: {
            //因为router使用了keeplive, 所以需要每次激活二级路由的时候重新刷新table
            activate: function(transition) {

                !this.initData ? this.refreshMainTable() : this.initData();

                // if (this.infoData.opt.path) {
                //     this.showDetail(this.infoData.vo);
                //     this.clearGoToInfoData();
                // }
                transition.next();
                //恢复由keep-alive 导致的 页面表现形式和绑定只不一样的情况
                this.$nextTick(function () {
                    if($(".slideright-transition.aside.right:visible").length>0){
                        this.detailModel.show=true;
                    }
                })
            },
            deactivate:function (transition) {
                /*下面代码是修复路哟来回跳的问题*/
                //todo  这里存在一个问题，明明show为false, 但是页面缓存 的时候是true, 回退推来，页面会先出出来，show=false,需要在激活钩子里面回复
                if(this.detailModel&&this.detailModel.show){
                    this.detailModel.show=false;
                }
                this.$nextTick(function () {
                    transition.next();
                })
            }
        },
        watch: {
            searchData: function(val) {
                var _searchData = val;
                if (this.validGlobalSearchData()) {
                    this.doGlobalKeyWordSearch();
                }
            }
        }
    };

    return mixin;
});
