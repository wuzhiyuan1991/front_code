define(function (require) {
    var LIB = require('lib');
    var template = require("text!./table.html");
    var actions = require("app/vuex/actions");

    var component = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: template,
        props: {
            state:{
                type: Number,
                default: 1
            },
            columns: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            values: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            url: {
                type: String,
                default: ''
            },
            routeUrl: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            },
            showMore: {
                type: Boolean,
                default: true
            }
        },
        data: function () {
            return {
                showLoading: false
            }
        },
        watch: {
            'values': function () {
                this.showLoading = false;
            }
        },
        methods: {
            //doShowMore:function(url){
            //    var routerPart = url + "?method=work";
            //    window.open('/html/main.html#!' + routerPart);
            //},
            doClick: function (row, column) {
                var poolMap = {
                    '0': 'BC_HG_RG',
                    '1': 'BC_HG_AG',
                    '11': 'BC_HG_AG',
                    '2': 'BC_HG_RF',
                    '3': 'BC_HG_VF'
                };
                var opt = {
                    method: 'select'
                };
                if(!column.pathCode) {
                    return;
                }
                if(column.pathCode === 'BC_HG_T') {
                    opt.path = LIB.PathCode[poolMap[row.status]];
                } else {
                    opt.path = LIB.PathCode[column.pathCode];
                }
                var param = {
                    id: row.id,
                    code: row.code
                }
                if (this.state==2) {
                     param['checktaskIsBegin']=1
                    }
              
              
              
                if(column.pathCode === 'BC_HG_T') {
                    param.code = row.title;
                }

                if(column.pathCode === 'BF_JsE_OsC' || column.pathCode === 'BF_JsE_OmC' || column.pathCode === 'BF_JsE_OeC') {
                    param.code = row.attr1;
                    opt.method = "detail"
                }

                if(column.pathCode === 'BC_HD_IT_INSPECTION' || column.pathCode === 'BC_HD_IT_JOB' ) {
                    var router = LIB.ctxPath("/html/main.html#!");
                    var routerPart= opt.path + "&method=select&id="+row.id+"&code="+row.code;
                    window.open(router+routerPart);
                } else {
                    this.setGoToInfoData({
                        opt: opt,
                        vo: param
                    });
                }
            },
            renderText: function (row, column) {
                var fieldValue = '';
                if(typeof column.render === 'function') {
                    fieldValue = column.render(row);
                } else {
                    fieldValue = _.propertyOf(row)(column.fieldName);
                }
                // var dataDicValue = this.dataDic[column.fieldName];
                //
                // //判断数据字典中的值是否存在， 优先使用数据字典中的值,未来通过参数决定是否默认使用数据字典的值
                // if (dataDicValue && dataDicValue[row.data[column.fieldName]]) {
                //     return dataDicValue[fieldValue];
                // }
                return fieldValue;
            },
            doRefresh: function () {
                this.showLoading = true;
                this.$emit("on-refresh", this.type)
            }
        },
        vuex: {
            actions: {
                setGoToInfoData: actions.updateGoToInfoData
            }
        }
    });
    return component;
});
