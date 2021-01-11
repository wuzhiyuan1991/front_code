/**
 * Created by yyt on 2017/6/16.
 */
define(function (require) {
    var LIB = require('lib');
    //右侧滑出详细页
    var tpl = require("text!./schedule.html");
    var api = null;
    var addFileModal = require("app/views/personalInfo/addFileModal");
    //初始化数据模型
    var newVO = function () {
        return {
            id:null,
            compId:null,

        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
        },
        addFileModal: {
            show: false,
            title:"目录管理"
        },
        //面包屑导航
        tempTopCategory:{title:"全部"},
        tempNodeCategory:[],
        url:"/material/upload",
        //文件数据
        nodeData:[],

        parentId:null,
        pictures: {
            params: {
                "parent.id": null,
                compId:null
            },
            filters: {
                max_file_size: '25mb',
                mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
            },
        },
        //滚动控制器
        scrollDisable: false,
        //滚动加载数据的页码
        loadIndex:2,
        //选择框
        checked:false,
        //选中的文件
        selectedDatas:[],
        //全选
        checkedAll:false,
        searchDatas:null,
        //获取文件name 去刷新相对应的首页模块
        fileName:null
    };
    //初始化上传组件RecordId参数
    var initUploadorParentId = function(parentId,compId){
        dataModel.pictures.params['parent.id'] = parentId;
        dataModel.pictures.params.compId = compId;
    }
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
            'add-file-modal':addFileModal
        },
        data: function () {
            return dataModel;
        },
        computed:{
            //判断是否包含文件
            textInfo:function(){
                var _this = this;
                var flag = false;
                _.each(_this.nodeData,function(item){
                    if(item.type==2){
                        flag = true;
                        return false;
                    }
                })
                return flag?true:false
            },
     },
        watch:{
          "mainModel.vo.compId":function(val){
                  if(this.parentId){
                      this.doNodeLoading(this.parentId);
                  }else{
                      this.doLoading();
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
                this.doSearch(this.parentId,val)
            },
            //回车的时候 做查询
            doEnterSearch:function(val){
                this.doSearch(this.parentId,val)
            },
            doSearch:function(id,val){
                var _this = this;
                if(id){
                    var resource = _this.$resource("/material/list/{currentPage}/{pageSize}"+"?name="+ val);
                    var baseParam = {
                        currentPage: 1,
                        pageSize:20,
                        "parent.id":id,
                        "criteria.orderValue.fieldName":"sort",
                        "criteria.orderValue.orderType":"0"
                    }
                    resource.get(baseParam).then(function(res){
                        var data = res.data.list;
                        _.each(data,function(item){
                            if(item.type == 2 && !item.checked){
                                item.checked = false
                            }
                        })
                        _this.$set("nodeData",data);
                    });
                }else{
                    var resource = _this.$resource("/material/list/{currentPage}/{pageSize}"+"?name="+ val);
                    var baseParam = {
                        currentPage: 1,
                        pageSize:20,
                        "criteria.orderValue.fieldName":"sort",
                        "criteria.orderValue.orderType":"0"
                    }
                    resource.get(baseParam).then(function(data){
                        _this.nodeData = data.data.list;

                    });
                }
            },
            //关闭弹层刷新界面
            doFileFinshed:function(){
                this.addFileModal.show = false;
                if(this.parentId){
                    this.doNodeLoading(this.parentId);
                }else{
                    this.doLoading();
                }
            },
            doClose:function(){
                this.doFileFinshed();
            },
            //新建文件目录或者修改
            doAddFile:function(){
                this.addFileModal.show = true;
                //this.parentId 为点击获取到的id值
                this.$broadcast('ev_editFileReload',this.parentId,this.mainModel.vo.compId,this.nodeData);
            },
            //上传文件成功回调
            doUpload:function(){
                this.doNodeLoading(this.parentId);
                this.$dispatch('ev_fileReload',this.fileName);
            },
            //点击文件夹
            doNode:function(data){
                var _this = this;
                if(data.type==1){
                    this.parentId = data.id;
                    //获取文件名称
                    if(data.name=="公告通知"||data.name=="公司制度"){
                        this.fileName = data.name;
                    }
                    initUploadorParentId(this.parentId,this.mainModel.vo.compId);
                    this.tempNodeCategory.push(data);
                    this.doNodeLoading(this.parentId);
                }
            },
            //如果点击面包屑导航的为全部
            showCategoryNode:function(){
                this.tempNodeCategory = [];
                this.parentId =null;
                this.doLoading();
            },
            //点击的为其他面包屑子导航
            showCrumbs:function(data){
                var arr = [];
                _.each(this.tempNodeCategory,function(item){
                    if(item.id==data.id){
                        arr.push(item);
                       return false;
                    }
                    arr.push(item);
                })
                this.doNodeLoading(data.id);
                this.tempNodeCategory = arr;
            },
            //滚动加载
            loadMore :function(data) {
                var _this = this;
                if(data.clientHeight + data.scrollTop >= data.scrollHeight - 50){
                    //防止为了重复请求
                    if (!this.scrollDisable) {
                        this.scrollDisable = true;
                        var resource = _this.$resource("/material/list/{currentPage}/{pageSize}");
                        var baseParam = {
                            currentPage: _this.loadIndex,
                            pageSize:20,
                            "criteria.orderValue.fieldName":"sort",
                            "criteria.orderValue.orderType":"0",
                            compId:_this.mainModel.vo.compId
                        };
                        resource.get(baseParam).then(function(res){
                            var  list = res.data.list;
                            //isLastPage 如果为ture 就说明就是最后一页 不加载数据
                            if(res.body.isLastPage){
                                return;
                            }
                            _.each(list,function(item){
                                _this.nodeData.push(item);
                            })
                            _this.loadIndex++;
                            _this.scrollDisable = false;
                        })
                    }
                }
            },
            //加载父节点数据
            doLoading:function(){
                var _this = this ;
                var resource = _this.$resource("/material/list/{currentPage}/{pageSize}");
                var baseParam = {
                    currentPage: 1,
                    pageSize:20,
                    "criteria.orderValue.fieldName":"sort",
                    "criteria.orderValue.orderType":"0",
                    compId:_this.mainModel.vo.compId
                }
                resource.get(baseParam).then(function(res){
                    _this.nodeData = res.data.list;
                    _this.selectedDatas = [];

                });
            },
            //加载子节点
            doNodeLoading:function(id){
                var _this = this;
                var resource = _this.$resource("/material/list/{currentPage}/{pageSize}");
                var baseParam = {
                    currentPage: 1,
                    pageSize:20,
                    "parent.id":id,
                    "criteria.orderValue.fieldName":"sort",
                    "criteria.orderValue.orderType":"0",
                    compId:_this.mainModel.vo.compId
                }
                resource.get(baseParam).then(function(res){
                    var data = res.data.list;
                    _this.selectedDatas = [];
                    _.each(data,function(item){
                        if(item.type == 2 && !item.checked){
                            item.checked = false
                        }
                    })
                    _this.$set("nodeData",data);
                });
            },
            //chebox选中时候
            toggle:function(data){
                var _this = this;
                data.checked = !data.checked;
                if(data.checked){
                    //选中状态
                    if(_this.selectedDatas.length>0){
                        var cachedSelectedIds = _.map(_this.selectedDatas,function(item){
                            return item.id;
                        })
                        var curSelectedIndex = cachedSelectedIds.indexOf(data.id);
                        if(curSelectedIndex == -1){
                            _this.selectedDatas.push(data);
                        }
                    }else{
                        _this.selectedDatas.push(data);
                    }
                }else{
                    //去掉勾选状态
                    if(_this.selectedDatas.length==1){
                        _this.selectedDatas = [];
                    }else{
                        _.each(_this.selectedDatas,function(item,index){
                            if(data.id==item.id){
                                _this.selectedDatas.splice(index,1);
                                return false
                            }
                        })
                    }
                }
            },
            //删除单个
            doDelete:function(data){
                var _this = this;
                api.delFile(null,data).then(function(res){
                    if(_this.parentId){
                        _this.doNodeLoading(_this.parentId);
                    }else{
                        _this.doLoading();
                    }
                    LIB.Msg.info("删除成功");
                    _this.$dispatch('ev_fileReload',_this.fileName);
                })
            },
            //下载单个
            doDown:function(data){
            	window.open("/file/down/"+data.cloudFileId);
            },
            //chebox全选
            doCheckAll:function(){
                var _this = this;
                _this.checkedAll = !_this.checkedAll;
                var arr = [];
                _.each(_this.nodeData,function(item){
                    item.checked = _this.checkedAll;
                    if(item.type==2){
                        arr.push(item);
                    }
                })
                if(_this.checkedAll){
                    _this.selectedDatas = arr;
                }else{
                    _this.selectedDatas = [];
                }
            },
            //多个删除
            doAllDel:function(){
            	if(this.selectedDatas && this.selectedDatas.length > 0) {
            		var data = _.map(this.selectedDatas,function(material){
            			return {id:material.id,orgId:material.orgId,type:material.type};
            		});
            		api.delBatch(null,data).then(function(res){
                        LIB.Msg.info("删除成功");
                        _this.$dispatch('ev_fileReload',_this.fileName);
                    })
            	}else{
            		 LIB.Msg.warning("请选择要删除的文件");
            	}
            	
            },
            //多个下载
            doAllDown:function(){
            	if(this.selectedDatas && this.selectedDatas.length > 0) {
            		var idArr = _.map(this.selectedDatas,function(material){
            			return material.cloudFileId;
            		});
            		var ids = idArr.join(",");
            		window.open("/file/down/ids?ids="+ids);
            	}else{
            		 LIB.Msg.warning("请选择要下载的文件");
            	}
            	
            },
        },
        events: {
            "ev_detailScheduleReload": function () {
                this.tempNodeCategory  = [];
                var _vo = dataModel.mainModel.vo;
                this.searchDatas = null;
                //清空数据
                _.extend(_vo, newVO());
                //点击获取的文件id
                this.parentId = null;
                this.mainModel.vo.compId = LIB.user.compId;
                this.doLoading();
            }
        },
        ready: function () {
            var _this = this;
            require(["./vuex/api"], function (data) {
                api = data;
            });
        },
    });

    return detail;
})