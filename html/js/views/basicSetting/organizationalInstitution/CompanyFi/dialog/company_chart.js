define(function (require) {
    var LIB = require("lib");
    var echarts = require("chart2");
    var template=require("text!./company_chart.html")
    return LIB.Vue.extend({
        template: template,
        data: function () {
            return {
                show: false,
                treeData:null,
                orginData:null,
                hasDeptTreeData:null,
                noDeptTreeData:null,
                charts:null,
                roots:null,
                height: 750,
                width:1000,
        }
        },
        methods: {
            init:function(data){
                function  removeDisable(arr) {
                    var removeIndexs=[];
                    for (var i=0;i<arr.length;i++){
                        if(arr[i].disable!=0){
                            removeIndexs.push(i);
                        }
                        else if(arr[i].children&&arr[i].children.length>1){
                            removeDisable(arr[i].children);
                        }
                    }
                    removeIndexs.forEach(function (item) {
                        arr.splice(item,1);
                    })
                }
                var _this=this;
                var  tempData=JSON.parse(JSON.stringify(data)) ;
                removeDisable(tempData);
                this.treeData=JSON.parse(JSON.stringify(tempData)) ;
                this.orginData=JSON.parse(JSON.stringify(tempData)) ;
                this.show=true;
                this.$nextTick(function () {
                    _this.charts= echarts.init(_this.$els.chartbox);
                    _this.charts.on("click",function (pms) {
                        console.log(pms);
                    });
                    this.setOption();
                })

            },
            toggleDept:function(b){
                if(b){
                    this.treeData=this.orginData;
                }
                else{
                    function  removeDept(arr) {
                        var removeIndexs=[];
                        for (var i=0;i<arr.length;i++){
                            if(arr[i].type!=1){
                                removeIndexs.push(i);
                            }
                            else if(arr[i].children&&arr[i].children.length>1){
                                removeDept(arr[i].children);
                            }
                        }
                        removeIndexs.forEach(function (item) {
                            arr.splice(item,1);
                        })
                    }
                    var data=JSON.parse(JSON.stringify(this.orginData)) ;
                    removeDept(data);
                    this.treeData=data;
                }
                this.setOption();
            },
            doChangeSize:function(){
             if(this.height==this.originHeight&&this.width==this.originWidth){
                 return ;
             }
             else{
                 this.charts.setOption({
                     height:this.height,
                     width:this.width,
                 })
             }
            },
            init1: function (roots,nocompnay) {
                //只有第一次的时候需要加全部参数
                var _this=this;
                this.roots=roots;
                this.show=true;
                this.$nextTick(function () {
                    _this.charts= echarts.init(_this.$els.chartbox);
                    _this.charts.on("click",function (pms) {
                        console.log(pms);
                    });
                    _this.showDept(roots,nocompnay);
                })
            },
            toggleDept1:function(b){
                if(b){this.showDept()}
                else{
                    this.noDept(this.roots);
                }
            },
            noDept1:function (roots,nocompnay) {
                if(!this.noDeptTreeData){
                    this.noDeptTreeData=LIB.company.getTree(true,roots,nocompnay);
                }
                var data=this.noDeptTreeData;
                data[0].children=data[0].children.slice(0,10);
                this.treeData=data;
                this.setOption();
            },
            setOption:function () {
                var option = {
                    //backgroundColor: '#02246d',
                    type: 'tree',
                    symbol:'rect',
                    symbolSize:[140,16],
                    label: {
                        position:"inside",
                        formatter:'{box|{b}}',
                        rich:{
                            box:{  color: 'black',
                                height:18,
                                backgroundColor:'gray',
                                width:150,
                                align:'center',
                                verticalAlign:'middle',
                            }
                        }
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750,
                    left:0,
                    series: [
                        {
                            type: 'tree',
                            data: this.treeData,
                            expandAndCollapse:true,
                        }
                    ]
                };
                this.charts.setOption(option);
            }
        },
        ready: function () {

        }
    })
});