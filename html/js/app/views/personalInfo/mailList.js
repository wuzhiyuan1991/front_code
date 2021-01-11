/**
 * Created by yyt on 2017/6/16.
 */
define(function (require) {
    var LIB = require('lib');
    var api = null;
    ////右侧滑出详细页
    var tpl = require("text!./mailList.html");
    var scrolloutside = require("components/directives/scrolloutside");
    //右侧滑出详细页
    //var tpl = require("text!./detail.html");
    //初始化数据模型
    var newVO = function () {
        return {
            id:null,
            orgId:null,
            compId:null,
            mobile:null,
            email:null,
            name:null,
            faceid:null,
            posNames:"",
            roleName:""
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            detailShow:false,
            showTabs: false
        },
        tabsList:[],
        //用来定位
        scrollTop:null,
        //控制model 显示
        homeInfo:null,
        //
        hideFlag:false,
        scrollDisable:false,
        //公司name
        compName:null,
        deptName:null,
        //滚动加载数据的页码
        loadIndex:2,
        hidePopTipTrigger:0,
        //
        parentId:null,
        //滚动距离
        itemScrollTop:0,
        //头像
        headerFaceUrl:null,
        searchDatas:null
    };
//Vue组件
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
        components: {
        },
        data: function () {
            return dataModel;
        },
        watch:{
          parentId:function(val,nVal){
              var _this = this;
              if(nVal){
              var resource = _this.$resource("user/posHseList/{currentPage}/{pageSize}");
              var baseParam = {
                  currentPage:1,
                  pageSize:20,
                  compId:_this.parentId
              };
              resource.get(baseParam).then(function(res){
                  _this.tabsList = res.data.list;
                })
              }
          },
        },
        methods: {
            //关闭
            doClose: function () {
                this.$dispatch("ev_detailShutDown");
            },
            //点击ico查询操作
            doIconClickSearch:function(val){
                this.doSearch(val)
            },
            //回车的时候 做查询
            doEnterSearch:function(val){
                this.doSearch(val)
            },
            doSearch:function(val){
                var _this = this
                var resource = _this.$resource("user/posHseList/{currentPage}/{pageSize}");
                var baseParam = {
                    currentPage: 1,
                    pageSize:20,
                    compId:_this.parentId,
                    'criteria.strValue':JSON.stringify({'addressBookKeyword':val})
                }
                resource.get(baseParam).then(function(res){
                    _this.tabsList = res.data.list;
                    _this.hideFlag = true;
                });
             },
            doDetailInfo:function(event,data){
                var _this = this;
                var _vo = _this.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                _this.scrollTop = event.currentTarget.offsetTop - _this.itemScrollTop;
                // todo 450为弹出元素的高度 判断要让scrollTop 一直显示在窗口中
                if(_this.scrollTop + 450 > this.$el.clientHeight){
                    var height = _this.scrollTop + 450 - this.$el.clientHeight;
                    _this.scrollTop =  _this.scrollTop - height;
                }
                _.deepExtend(_vo, data);
                _this.compName = LIB.getDataDic('org', _this.mainModel.vo.compId)['compName'];
                _this.deptName = LIB.getDataDic('org', _this.mainModel.vo.orgId)['deptName'];
                //_this.headerFaceUrl = LIB.convertPicPath(data.faceid);
                //岗位 角色
                if(data.positionList){
                    data.positionList.forEach(function (e) {
                        if(e.postType == 0 && e.name){
                            _this.mainModel.vo.posNames += (e.name + ",");
                        }else{
                            _this.mainModel.vo.roleName += (e.name + ",");
                        }
                    });
                    _this.mainModel.vo.posNames = _this.mainModel.vo.posNames.substr(0, _this.mainModel.vo.posNames.length - 1);
                    _this.mainModel.vo.roleName = _this.mainModel.vo.roleName.substr(0, _this.mainModel.vo.roleName.length - 1);
                }
                this.homeInfo = !this.homeInfo;
            },
            //加载
            loadMore :function(data) {
                var _this = this;
                this.homeInfo = false;
                this.itemScrollTop = data.scrollTop;
                if(data.clientHeight + data.scrollTop >= data.scrollHeight - 50){
                    //防止为了重复请求
                    if (!this.scrollDisable) {
                        this.scrollDisable = true;
                        var resource = _this.$resource("user/posHseList/{currentPage}/{pageSize}");
                        var baseParam = {
                            currentPage: _this.loadIndex,
                            pageSize:20,
                            compId:_this.parentId
                        };
                        resource.get(baseParam).then(function(res){
                            var  list = res.data.list;
                            //isLastPage 如果为ture 就说明就是最后一页 不加载数据
                            if(res.body.isLastPage){
                                return;
                            }
                            //暂时解决办法6101
                            if(list[0].id == _this.tabsList[0].id){
                                return;
                            }
                            _.each(list,function(item){
                                _this.tabsList.push(item);
                            })
                            _this.loadIndex++;
                            _this.scrollDisable = false;
                        })
                    }
                }

            }
        },
        events: {
            "ev_detailMailListReload":function(){
                var _this = this;
                _this.hideFlag = false;
                _this.homeInfo = false;
                var _vo = dataModel.mainModel.vo;
                _this.searchDatas = null;
                //清空数据
                _.extend(_vo, newVO());
                this.parentId = LIB.user.compId;
                var resource = _this.$resource("user/posHseList/{currentPage}/{pageSize}");
                var baseParam = {
                    currentPage: 1,
                    pageSize:20,
                    compId:_this.parentId
                }
                resource.get(baseParam).then(function(res){
                    _this.tabsList = res.data.list;
                    _this.hideFlag = true;
                });
                _this.headerFaceUrl = LIB.convertPicPath;
            },
        },
        ready : function() {
            var _this = this;
            require(["./vuex/api"], function(data) {
                api = data;
            });
        }
    });

    return detail;
})