/**
 * 报表EChart基础mixin类型
 */
define(function(require){
    var LIB = require("lib");

    var mixin = {
        props:{
            showHeader:{
                type:Boolean,
                'default':true
            },
            dataLimit:{
                type: Number,
                default:10
            },
            qryParam:{
                type:Object,
                required:true
            },
            echartStyle:{
                type:Object,
                'default':null
            },
            method:String,
            isSelf:{
                type: Boolean,
                default:false
            }
        },
        data:function(){
            return {
                rptData:null,
                //更多Model属性
                moreModel:{
                    show:false,
                    scroll:false,
                    columns:[],
                    data:[]
                },
                //撰取Model属性
                drillModel:{
                    show:false,
                    title:"明细",
                    groups:null,
                    //导出excel服务地址
                    exportDataUrl:null,
                    table:{
                        //数据请求地址
                        url:null,
                        //请求参数
                        qryParam:null,
                        //对应表格字段
                        columns:null,
                        //筛选过滤字段
                        filterColumns:null
                    }
                }
            }
        },
        watch:{
            qryParam : {
                //深度监听
                deep: true,
                //立即以表达式的当前值触发回调
                immediate: true,
                handler: function (val, oldVal) {
                    this.showChart();
                }
            }
        },
        methods:{
            /**
             * 转换id数组参数为使用","拼接的字符串
             * @param ranges
             * @returns {string}
             */
            getIdsRange:function(ranges){
                var array = _.map(ranges,function(r){return r.key;});
                return array.join(",");
            },
            changeMethod:function(val){
                this.method = val;
                this.$emit("change-method", val);
                this.doQry();
            },
            getData:function(){
                var _this = this;
                var param = this.buildParam();
                return {
                    then:function(callback){
                        var api = _this.apiMap[_this.apiKey];
                        if(api == null){
							LIB.Msg.error("未定义此类纬度统计接口");
							return;
						}
                        _this.$nextTick(function(){
                            var echarts = _this.$refs.echarts;
                            if(echarts){
                                echarts.showLoading();
                                echarts.clear();
                            }
                        });
                        api(param).then(function(res){
                            _this.rptData = res.data;

                            if(_this.isSelf) {
                                if(_.isArray(_this.rptData) && (_this.apiKey=='dep-org' || _this.apiKey=='frw-org')) {
                                    _this.rptData = _this.rptData.slice(0,_this.dataLimit);
                                }
                            }

							if(typeof callback == "function"){
                                callback.call(_this,_this.rptData);
                            }
                            var echarts = _this.$refs.echarts;
                            if(echarts){
                                echarts.hideLoading();
                            }
						});
                    }
                }
            },
            doExportData:function(){
                var url = this.drillModel.exportDataUrl+LIB.urlEncode(this.$refs.rptDetailsTable.getCriteria()).replace("&", "?");

                if(this.qryParam.containRandomData) {
                    url += "&containRandomData=1";
                }
                if(this.qryParam.containResignedData && this.qryParam.containResignedData === '1') {
                    url += "&containResignedData=1";
                }
                window.open(url);
            },
            showMore:function(){
                this.buildTableData();
                this.moreModel.show = true;
            },
            doExportRptData:function(){
                window.open(this.getRptDataExportUrl()+LIB.urlEncode(this.buildParam()).replace("&", "?"));
            }
        }
    }
    return mixin;
});