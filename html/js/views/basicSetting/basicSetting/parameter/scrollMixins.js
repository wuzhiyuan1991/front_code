/*
锚点双向监听 封装，混合可用，
1.必须等到内容加载完成调用 initScroll方法（pms） pms 参数看考 scrollModel
2.当某个项的高度边框变化时必须调用 _recomputeItemHeight 重新计算
 */
define(function (require) {
    return {
        data:function(){
            return {
                scrollModel:{
                    //下面的参数需要初始化
                    target:"",//scroll height 滚动区域高度
                    rightSelector:"",//右边容器的选择器
                    rightItemSelector:"",//右边内容的item 选择器
                    leftSelector:"",//
                    leftItemSelector:"",//左边
                    leftItemHeight:60,
                    activeClass:"active",
                    correctHeight:0,//有时候两个模块之间有空白，代码逻辑上应该是上一个，但是试图逻辑是下一个， 需要此参数来纠正
                    otherheight:0,//其他影响的高度
                    //上面的参数需要初始化
                    isNotEventToItem:false,//不需要滚动监听来跳转到某个项 (1.点击左边，和内部高度改变时，导致触发了滚动事件 )
                    itemLen:0,//有多少个项目
                    contentHeight:0,//可视化窗体高度
                    modualsHeight:[],//每个模块的高度
                    currentModual:-1,//当选选中的第几个模块
                    scrollMin:0,//当前最小scroll 往上滚动，超过这个最小值prev
                    scrollMax:0,//单签最大scroll 往下滚动，超过这个最大值next
                    modualsZoneMax:[],//每个模块对应的最大scrollTop， _getOffsetNum 根据scrollTop计算出需要移动那一个模块下面通过
                },
            }
        },
        methods:{
            initScroll:function(pms){
                _.extend(this.scrollModel,pms);
                this._computedHeight(this.scrollModel);
            },
            selModual: function (index,nosetScroll) {
                var scroll=this.scrollModel;
                if(index==scroll.currentModual){
                    $(scroll.target).find(scroll.rightSelector+" "+scroll.rightItemSelector).eq(index)[0].scrollIntoView();
                }
                //nosetScroll :有值 true|通过滚动条激活，false|通过添加左侧栏激活 ， prev|向上滚，next|向下滚
                index = index || 0;
                if(index>=scroll.modualsHeight.length){return }
                var max=scroll.modualsZoneMax[index];
                var min = max - scroll.modualsHeight[index];
                scroll.scrollMax = max;
                scroll.scrollMin = min;
                scroll.currentModual = index;
                if(!nosetScroll){
                  $(scroll.target).find(scroll.rightSelector+" "+scroll.rightItemSelector).eq(index)[0].scrollIntoView();
                }//
                this._activeModual(index,nosetScroll);
            },
            //nosetScroll 表示右边不需要设置滚动条  表示此时是在滚动右边
            _activeModual: function (index,nosetScroll) {

                var scroll=this.scrollModel;
                scroll.isNotEventToItem=!nosetScroll;
                $(scroll.target).find(scroll.leftSelector+" "+scroll.leftItemSelector+"."+scroll.activeClass).removeClass(scroll.activeClass);
                var selected=$(scroll.target).find(scroll.leftSelector+" "+scroll.leftItemSelector).eq(index).addClass(scroll.activeClass);
                if(nosetScroll){//这里是修复左边的显示区域
                    var leftNeedScrollView=this._needScrollIntoView(index,nosetScroll);
                    if(leftNeedScrollView){
                        var direction=nosetScroll==="prev";
                        selected[0].scrollIntoView(direction);
                    }
                }

            },
            //计算高度，启动监听
            _computedHeight: function (scroll) {
                var _this = this;
                this.$nextTick(function () {
                    setTimeout(function () {
                        scroll.contentHeight =$(scroll.target).outerHeight();
                        var eles =$(scroll.target).find(scroll.rightItemSelector);
                        var tempMax=scroll.otherheight+scroll.correctHeight;
                        eles.each(function (index, item) {
                            scroll.modualsHeight[index] = item.offsetHeight;
                            tempMax+=item.offsetHeight;
                            scroll.modualsZoneMax[index]=tempMax;
                        });
                        scroll.itemLen=eles.length;
                        if(!scroll.leftItemHeight){
                            scroll.leftItemHeight=$(scroll.leftSelector).find(scroll.leftItemSelector).outerHeight();
                        }
                        _this.selModual(0);
                        _this._enableListener(scroll);
                    })
                });

            },
            //监听某一项的高度改变时必须调用此方法
            recomputeItemHeight: function (index) {
                var scroll=this.scrollModel;
                scroll.isNotEventToItem=true;//因为这里高度改变了，会有可能会触发滚动条改变
                        var dom = $(scroll.target).find(scroll.rightSelector+" "+scroll.rightItemSelector).eq(index);
                        var oldH = dom.outerHeight();
                        this.$nextTick(function () {
                            scroll.isNotEventToItem=false;
                            setTimeout(function () {
                                scroll.modualsHeight[index] = dom.outerHeight();
                                if (index <= scroll.currentModual) {
                                    var add = dom.height()- oldH;
                                    scroll.scrollMin += add;
                                    scroll.scrollMax += add;
                                }
                                var tempMax=scroll.otherheight;
                                scroll.modualsHeight.forEach(function (item,index) {
                                    tempMax+=item;
                                    scroll.modualsZoneMax[index]=tempMax;
                                });
                                console.log(scroll.modualsZoneMax);
                            },200)
                });
            },
            _enableListener: function (scroll) {
                 var _this = this;
                $(scroll.target).find(scroll.rightSelector).off("scroll");
                var listener = function (event) {
                    if(scroll.isNotEventToItem){
                        scroll.isNotEventToItem=false;
                        return;
                    }
                    var top = $(this).scrollTop();
                    var sellink = scroll;
                    // var isNext=(top-(scroll.oldTop||0))>0;
                    // scroll.oldTop=top;
                    // console.log(top,isNext,sellink);
                    if (top >sellink.scrollMax) {//向下滚
                        var i=_this._getOffsetNum(top,"next");
                        // console.log(i,"next");
                        if(sellink.currentModual===scroll.itemLen-1)return;
                        _this.selModual(i,"next");
                    } else if (top < sellink.scrollMin) {//向上滚
                         var i=_this._getOffsetNum(top,"prev");
                        // console.log(i,"prev");
                        if(sellink.currentModual===0)return;
                        _this.selModual(i,"prev");
                    }
                };
                //var throttle = _.throttle(listener, 50, true);
                $(scroll.target).find(scroll.rightSelector).on("scroll",listener);
            },
            //计算左侧是否需要自动滚到到最底部
            _needScrollIntoView:function (index) {
                //index:当前显示的模块的index
                var scroll=this.scrollModel;
                var box=$(scroll.target);
                var scroolTop=box.find(scroll.leftSelector).scrollTop();
                var no_shang=(scroolTop/scroll.leftItemHeight)^0;//求商
                var no_yushu=scroolTop%scroll.leftItemHeight; //计算不可见区域的个数 求余数
                var minIndex=no_shang+(no_yushu?1:0);
                var noyushuHeight=no_yushu===0?0:scroll.leftItemHeight-no_yushu;
                var yes_shang= ((scroll.contentHeight-noyushuHeight)/scroll.leftItemHeight^0)-1;
                var maxIndex=minIndex+yes_shang;
                // console.log("xxx",minIndex,maxIndex,index);
                return !(index>=minIndex&&index<=maxIndex)
            },
            //根据scrollTop计算出需要移动那一个模块下面
            _getOffsetNum:function (top,direction) {
                var scroll=this.scrollModel;
                var i=scroll.itemLen-1;
                for (;i>=0;i--){
                    if(top>scroll.modualsZoneMax[i]){
                        break;
                    }
                }
                if(i+1===this.currentModual){
                    console.log("相同哦，不需要");
                }
                return i+1;

            }
        },
    }
})