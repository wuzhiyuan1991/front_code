define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./preview.html");

    //Vue数据
    var dataModel = {
        vo: null,
        items: null,
        type: 1
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	 el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     _XXX    			//内部方法
     doXXX 				//事件响应方法
     beforeInit 		//初始化之前回调
     afterInit			//初始化之后回调
     afterInitData		//请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave		//请求 新增/更新 接口后回调
     beforeDoDelete		//请求 删除 接口前回调
     afterDoDelete		//请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            previewData: {
                type: Object,
                default: {}
            }
        },
        data: function () {
            return dataModel;
        },
        watch: {
            visible: function (val) {
                var _this =this
                if (val ) {
                    api.queryPreview({id:this.previewData.pecapplication.id}).then(function(res){
                        _this.vo=res.data
                    })
                }
            },
         
        },
        computed: {
            code:function(){
                var date = new Date()
               
               return date.getFullYear()+'-'+this.previewData.pecapplication.id+'-'+LIB.getDataDic('org', this.previewData.pecapplication.orgId)['deptName']+'-'+LIB.tableMgr.rebuildOrgName(this.previewData.pecapplication.compId, 'comp')
            },
            user1:function(){
                if ( this.vo) {
                    if (this.vo.pecAuditRecords.length>0&&this.vo.status>1) {
                        return  this.vo.pecAuditRecords[0]
                    }
                   

                }
               return null

            },
            user2:function(){
                if ( this.vo) {
                    
                    if(this.vo.bizType==2&&this.vo.bizType==2){
                        return null
                    }else{
                        if (this.vo.auditStatus==3&&this.vo.pecAuditRecords.length>2) {
                          var arr =  this.vo.pecAuditRecords.slice(2,this.vo.pecAuditRecords.length)
                          var user =''
                              _.each(arr,function(item){
                                  user+=item.user.name+','
                              })
                         return   {
                             name:user.substring(0,user.length-1),
                             auditTime: this.vo.pecAuditRecords[this.vo.pecAuditRecords.length-1].auditTime
                         }
                        
                        }else if (this.vo.auditStatus>3) {
                            var arr =  this.vo.pecAuditRecords.slice(2,this.vo.pecAuditRecords.length-1)
                          var user =''
                              _.each(arr,function(item){
                                  user+=item.user.name+','
                              })
                         return   {
                             name:user.substring(0,user.length-1),
                             auditTime: this.vo.pecAuditRecords[this.vo.pecAuditRecords.length-2].auditTime
                         }
                        }else{
                            return null
                        }
                    }
                    
                   

                }
               return null

            },
            user3:function(){
                if ( this.vo) {
                    if (this.vo.bizType==2) {
                        return  null
                    }
                    if (this.vo.pecAuditRecords.length >1&&this.vo.status>1){
                        return  this.vo.pecAuditRecords[1]
                    }
                   

                }
               return null

            },
            user4:function(){
                if ( this.vo) {

                    if (this.vo.bizType!=2&&this.vo.level==2&&this.vo.status>2){
                        return  this.vo.pecAuditRecords[this.vo.pecAuditRecords.length-1]
                    }else  if (this.vo.bizType==2&&this.vo.level==1&&this.vo.status>2){
                        return  this.vo.pecAuditRecords[1]
                    }
                   

                }
               return null

            },
            safeList:function(){
               
                return _.filter(this.previewData.pecapplication.pecCheckItems,function(item){return item.type == 1 })
            },
            airList:function(){
               
                return _.filter(this.previewData.pecapplication.pecCheckItems,function(item){return item.type == 2 })
            },
            waterList:function(){
               
                return _.filter(this.previewData.pecapplication.pecCheckItems,function(item){return item.type == 3 })
            },
            thingList:function(){
               
                return _.filter(this.previewData.pecapplication.pecCheckItems,function(item){return item.type == 4 })
            },
            otherList:function(){
               
                return _.filter(this.previewData.pecapplication.pecCheckItems,function(item){return item.type == 5 })
            },
        },
        methods: {
            timestampToTime: function (timestamp) {
                if (!timestamp) {
                    return
                }
                var date =new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                
                    Y = date.getFullYear() +'年';
                
                    M = (date.getMonth() +1 <10 ?'0' + (date.getMonth() +1) : date.getMonth() +1) +'月';
                
                    D = date.getDate() +'日';
                
                    h = date.getHours() +':';
                
                    m = date.getMinutes() +':';
                
                    s = date.getSeconds();
                
                    return Y +M +D;//时分秒可以根据自己的需求加上
                
                },
                
            doClose: function () {
                this.visible = false;
            },
            doPrint: function () {
                window.print();
            },

        },
        events: {
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});