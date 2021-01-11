define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./coursefilter.html");

    var newVO = function () {
        return {
            course: null,
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            // rList: [],
            // rLength: 0,
            // roleLength: 0,
            // selectedDatas: []
        },
        authList:[],
        orgId:null,
    };

    //声明detail组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                var _this = this;
                var _vo  = this.mainModel.vo;
                _this.authList = [];
                var courseData = _vo.courses;
                _.each(courseData,function(itemFirst) {
                    if (itemFirst.subjectList) {
                        _.each(itemFirst.subjectList, function (itemThird) {
                            if (itemThird.courses) {
                                _.each(itemThird.courses, function (item) {
                                   if(item.isChecked){
                                       _this.authList.push(item.id);
                                      }
                                })
                            }
                        })
                    }
                })

                var callback = function (res) {
                    _this.$emit("do-courses-finshed",res.data);
                    LIB.Msg.info("保存成功");
                };
                //如果orgid存在 跟已经选了课程
                if(_this.orgId && _this.authList.length > 0){
                    api.list({"criteria.strsValue":JSON.stringify({courseIds:_this.authList}),orgId:_this.orgId}).then(callback);
                }else if(!_this.orgId && _this.authList.length > 0){
                    api.list({"criteria.strsValue":JSON.stringify({courseIds:_this.authList})}).then(callback);
                }else if(_this.orgId  && _this.authList.length ==0){
                    api.list({orgId:_this.orgId}).then(callback);
                }else{
                    api.list().then(callback);
                }

            },
            /**
             * 菜单的展开收起
             */
            doChangeModule : function(first){
                // add = !add;
                first.add = !first.add;
            },

            toggle : function(allData,type,data){
                var _this = this;
                if(type==0){
                    allData.allChecked = !allData.allChecked;
                    if(allData.courses){
                        _.each(allData.courses,function(item){
                            item.isChecked = allData.allChecked;
                        });
                    }
                }else if(type==1){
                    var num =0;
                    allData.isChecked = !allData.isChecked;
                    _.each(data.courses,function(i){
                        if(i.isChecked){
                            num++
                        }
                    });
                    if( num == data.courses.length){
                        data.allChecked = true;
                    } else {
                        data.allChecked = false;
                    }
                }
            },
            doEmptied:function(){
                var _this = this;
                _.each(_this.mainModel.vo.courses,function(itemFirst) {
                    if (itemFirst.subjectList) {
                        _.each(itemFirst.subjectList, function (itemThird) {
                            itemThird.allChecked = false;
                            if (itemThird.courses) {
                                _.each(itemThird.courses, function (item) {
                                    item.isChecked = false;
                                })
                            }
                        })
                    }
                })
            },
        },
        events: {
            //edit框数据加载
            "ev_courseReload": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;
                var _this = this;

                // 两次组织机构id相同 则返回；不同清空authList
                if (this.orgId === nVal) {
                    return;
                } else {
                    this.authList = [];
                    this.orgId = nVal;
                }
                //清空数据
                _.extend(_vo, newVO());
                var callback= function(res){
                    var courseData = res.data.categoryCourseList;
                    _.each(courseData,function(itemFirst) {
                        if (itemFirst.subjectList) {
                            _.each(itemFirst.subjectList, function (itemThird) {
                                itemThird.allChecked = true;
                                itemThird.add = true;
                                var num = 0;
                                if (itemThird.courses) {
                                    _.each(itemThird.courses, function (item) {
                                        //选中之前 已经保存的数据
                                        if(_this.authList.length > 0){
                                            _.each(_this.authList,function(auth){
                                                if(auth === item.id){
                                                    item.isChecked = true;
                                                    num++;
                                                    return false
                                                }else{
                                                    item.isChecked = false;
                                                }
                                            })
                                        }else{
                                            item.isChecked = false;
                                            // num++;
                                        }
                                    })
                                }
                                //判断是否全选
                                if(num === itemThird.courses.length){
                                    itemThird.allChecked =  true;
                                } else {
                                    itemThird.allChecked = false;
                                }
                            })
                        }
                    })
                    _this.$set("mainModel.vo.courses", courseData);
                }
                //api.list({orgId:nVal}).then(callback);
                if(nVal){
                    api.list({orgId:nVal,disable:0}).then(callback);
                }else{
                    api.list({disable:0}).then(callback);
                }
            }
        }
    });

    return detail;
});