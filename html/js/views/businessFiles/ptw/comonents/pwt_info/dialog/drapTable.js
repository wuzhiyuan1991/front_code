/*
* 轻量级的表格组件，用于显示数据，不应拓展太多功能
*
* columns {Array<Object>}: {
*     title: {String} 表头显示文字，不应该为空,
*     fieldName: {String} 表格中显示的文字， 使用_.get()取值
*     render: {Function} 用于复杂数据的自定义显示，参数:
*     width: {String} 单元格宽度，110px/20%/auto
*     event: {Boolean} 单元格是否绑定了 点击 事件，不设置不会向上抛出事件
* }
*
* tools {Array<String>}: ['del', 'update', 'move'] 配置表格行最后一列显示操作按钮, 可根据需要配置
*/
define(function (require) {

    var Vue = require("vue");

    var template = require("text!./drapTable.html");

    var opt = {
        template: template,
        props: {
            columns: {
                type: Array
            },
            values: {
                type: Array
            },
            showPage: { // 是否显示分页
                type: Boolean,
                default: false
            },
            showSequence: { // 是否显示序号列
                type: Boolean,
                default: true
            },
            showSequenceName:{
                default:"序号"
            },
            tools: {
                type: Array,
                default: function () {
                    return []
                }
            },
            pageSizeOpts: {
                type: Array,
                default: function () {
                    return [10, 20, 50]
                }
            },
            fixTitle:{
                type: Boolean,
                default: false
            },
            isShowPageBox:{
                type: Boolean,
                default: true
            },
            draping:{
                type: Boolean,
                default: false
            }
        },
        computed: {
            getStye: function () {
                if(this.fixTitle){
                    return "overflow-y:scroll;max-height:500px;position: relative;"
                }
            },
            toolColumnStyle: function () {

                return 'width:90px;'

                var width = 21 * this.tools.length + 6;

                // move 配置有两个按钮
                if (this.tools.indexOf('move') > -1) {
                    width += 21;
                }
                return {
                    width: width + 'px'
                }
            },
            showTools: function () {
                return this.tools.length;
            },
            // filteredValues: function () {
            //     var start = (this.pageObj.curPage - 1) * this.pageObj.pageSize;
            //     return this.values.slice(start, start + this.pageObj.pageSize)
            // },
            showPageBox: function () {
                return this.isShowPageBox && (this.showPage || this.values.length > 10);
            }
        },
        data: function () {
            return {
                pageObj: {
                    curPage: 1,
                    totalSize: 0,
                    pageSize: 10
                },
                filteredValues:[]
            }
        },
        watch: {
            "values": function (val) {
                if (_.isArray(val)) {
                    this._setPageObj();
                    var start = (this.pageObj.curPage - 1) * this.pageObj.pageSize;
                    this.filteredValues = this.values.slice(start, start + this.pageObj.pageSize)
                } else {
                    this.pageObj.totalSize = 0;
                    this.pageObj.curPage = 1;
                }
            },
            // "list": function () {
            //     var start = (this.pageObj.curPage - 1) * this.pageObj.pageSize;
            //     return  this.values.slice(start, start + this.pageObj.pageSize)
            // }
        },
        methods: {
            onTrClick:function(index){
                this.$emit('on-tr-click',index)
            },
            calculateSequenceNumber: function (i) {
                return (this.pageObj.curPage - 1) * this.pageObj.pageSize + i + 1;
            },
            _setPageObj: function () {
                this.pageObj.totalSize = this.values.length;
                this.pageObj.curPage = 1;
                this.pageObj.pageSize = this.pageSizeOpts[0];
            },
            showTool: function (type) {
                return this.tools.indexOf(type) > -1;
            },
            renderTdText: function (item, column) {
                if (_.isFunction(column.render)) {
                    return column.render(item)
                }
                if (column.fieldName) {
                    return _.get(item, column.fieldName)
                }
                return '';
            },
            doUpdate: function (item, index) {
                this.$emit('on-update', item, index);
            },
            doDelete: function (item, i) {

                this.$emit('on-delete', item, this.calculateSequenceNumber(i-1))
            },
            doMove: function (offset, item, index, listIndex) {
                var obj = {
                    offset: offset,
                    index: index,
                    item: item,
                    listIndex:listIndex-1,
                    items: this.values
                };
                this.$emit('on-move', obj)
            },
            doPageChanged: function (page) {
                this.pageObj.curPage = page;
            },
            onBodyClick: function (e) {
                var target = e.target;

                if(target.tagName.toUpperCase() !== 'TD') {
                    target = target.closest('td');
                }
                if(!target) return ;
                var dataset = target.dataset;
                var index = dataset.index;
                var num = dataset.num;

                if(_.isUndefined(index) || _.isUndefined(num)) {
                    return;
                }

                index = Number(index);
                if(this.columns[index].event) {
                    num = Number(num);
                    var item = this.filteredValues[num];
                    this.$emit("on-click", item, e, index, num)
                }
            },
            doDragEnd: function (i,j,k) {
                $('tbody .layout-table-tr').removeClass('isDragEnd')
                $('tbody .layout-table-tr').eq(i).addClass('isDragEnd')
                this.$emit('drap-end', this.filteredValues)
            }
        },
        ready: function () {
            if(_.isArray(this.values)) {
                this._setPageObj();
            }
            var _this = this
           

        }
    };
    var component = Vue.extend(opt);
    Vue.component('drap-table', component);

    return component;
});
