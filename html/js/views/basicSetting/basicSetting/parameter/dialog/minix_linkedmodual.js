define(function () {
    //需要html 格式正确， 可参考任意一 html
    return {
        data:function () {
            return {
                contentHeight:undefined,
                leftMenuItemHeight:undefined,
                viewMode:"web",
                selLinked:{//联动模块 对象
                    type:"web",
                    contentHeight:0,//可视化窗体高度
                    modualsHeight:[],//这个模块的高度
                    currentModual:0,
                    scrollMin:0,
                    scrollMax:0,
                    modualsZoneMax:[],
                },
                selLinkedApp:{//联动模块 对象
                    type:"app",
                    contentHeight:0,//可视化窗体高度
                    modualsHeight:[],//这个模块的高度
                    currentModual:0,
                    scrollMin:0,
                    modualsZoneMax:[],
                }
            }
        },
        watch:{
            // 'selLinked.scrollMin':function (val) {
            //     console.log(val);
            // },
            // 'selLinked.scrollMax':function (val) {
            //     console.log(val);
            // }
        },
        methods: {
            selModual: function (item, index,nosetScroll) {
                //nosetScroll :有值 true|通过滚动条激活，false|通过添加左侧栏激活 ， prev|向上滚，next|向下滚
                index = index || 0;
                var type = this.viewMode;
                var list = type === "web" ? this.webAuthList : this.appAuthList;
                var selLinked = type === "web" ? this.selLinked : this.selLinkedApp;
                if(index>=selLinked.modualsHeight.length){return }
                var max=selLinked.modualsZoneMax[index];
                var min = max - selLinked.modualsHeight[index];

                $("#" + type + "-sel #linkedsel" + item.id).addClass("selected");//[0].scrollIntoView();
                selLinked.scrollMax = max;
                selLinked.scrollMin = min;
                selLinked.currentModual = index;
                var actualmin = min <= selLinked.otherheight ? 0 : min;
                //$("#" + type + "-sel .menu-sel-right").scrollTop(actualmin);
                if(!nosetScroll){
                    $(".root#" + type+item.id)[0].scrollIntoView();
                }//
                this._activeModual(item,index,nosetScroll);
            },
            _activeModual: function (item,index,nosetScroll) {
                var type = this.viewMode;
                $("#" + type + "-sel [id^=linkedsel].selected").removeClass("selected");
                var selected=$("#" + type + "-sel #linkedsel" + item.id).addClass("selected");
                if(nosetScroll){
                    if(this._needScrollIntoView(index)){
                        var direction=nosetScroll==="prev";
                        selected[0].scrollIntoView(direction);
                    }
                }

            },
            _linkedModualInit: function (selLinked) {
                var type = this.viewMode;
                var list = type === "web" ? this.webAuthList : this.appAuthList;
                this._activeModual(list[0]);
                selLinked.currentModual = 0;//当选选中的第几个模块
                selLinked.scrollMin = selLinked.otherheight;
                selLinked.scrollMax = selLinked.otherheight + selLinked.modualsHeight[0];
                $("#" + type + "-sel .menu-sel-right").scrollTop(0);
                this.leftMenuItemHeight=$("#" + type+"-sel .menu-sel-item").outerHeight();
            },
            _computedHeight: function (selLinked) {
                //计算高度，启动监听
                var _this = this;
                this.$nextTick(function () {
                    setTimeout(function () {
                            var pre = selLinked.type;
                            _this.contentHeight=selLinked.contentHeight = $("#" + pre + "-sel.menu-sel-box").outerHeight();
                            selLinked.otherheight = $("#" + pre + "-sel .sel-selall").outerHeight() + 10;
                            var eles = $("#" + pre + "-sel .root[id^=" + pre + "]");
                            var tempMax=selLinked.otherheight;
                            eles.each(function (index, item) {
                                selLinked.modualsHeight[index] = item.offsetHeight;
                                tempMax+=item.offsetHeight-2;
                                selLinked.modualsZoneMax[index]=tempMax;
                            });
                            _this._linkedModualInit(selLinked);
                            _this._enableListener(selLinked);
                    })
                });

            },
            _recomputeItemHeight: function (item, index) {

                var _this = this;
                var pre = this.viewMode;
                if(pre="app")return;
                var dom = $("#" + pre + "-sel .root#" + pre + item.id);
                var oldH = dom.outerHeight();
                var selLinked = pre === "web" ? this.selLinked : this.selLinkedApp;
                this.$nextTick(function () {
                    setTimeout(function () {
                        selLinked.modualsHeight[index] = dom.height();
                        if (index <= selLinked.currentModual) {
                            var add = oldH - dom.height();
                            selLinked.scrollMin += add;
                            selLinked.scrollMax += add;
                        }
                        var tempMax=selLinked.otherheight;
                        selLinked.modualsHeight.forEach(function (index, item) {
                        tempMax+=item.offsetHeight;
                        selLinked.modualsZoneMax[index]=tempMax;
                    });
                })
                });
            },
            _enableListener: function (selLinked) {

                var _this = this;
                var type = selLinked.type;
                var list = type === "web" ? this.webAuthList : this.appAuthList;
                $("#" + type + "-sel .menu-sel-right").off("scroll");
                var listener = function (event) {
                        var top = $(this).scrollTop();
                        var sellink = selLinked;
                        var i=undefined;
                        if (top > sellink.scrollMax) {//向下滚
                            var i=_this._getOffsetNum(top,"next");
                            if(sellink.currentModual===list.length-1)return;
                            _this.selModual(list[i], i,"next");
                        } else if (top < sellink.scrollMin) {//向上滚
                            var i=_this._getOffsetNum(top,"prev");
                            if(sellink.currentModual===0)return;
                            _this.selModual(list[i], i,"prev");


                        }
                };
                //var throttle = _.throttle(listener, 50, true);
                $("#" + type + "-sel .menu-sel-right").on("scroll",listener);
            },

            //计算左侧是否需要自动滚到到最底部
            _needScrollIntoView:function (index) {
                //index:当前显示的模块的index
                var type=this.viewMode;
                var box=$("#"+type+"-sel");
                var scroolTop=box.find(".menu-sel-left").scrollTop();
                var no_shang=(scroolTop/this.leftMenuItemHeight)^0;
                var no_yushu=scroolTop%this.leftMenuItemHeight; //计算不可见区域的个数
                var minIndex=no_shang+(no_yushu?1:0);
                var yes_shang= ((this.contentHeight-no_yushu)/this.leftMenuItemHeight^0);
                var maxIndex=minIndex+yes_shang-1;
                return !(index>=minIndex&&index<=maxIndex)
            },
            //根据scrollTop计算出需要移动那一个模块下面
            _getOffsetNum:function (top,direction) {
                var type = this.viewMode;
                var list = type === "web" ? this.webAuthList : this.appAuthList;
                var selLinked = type === "web" ? this.selLinked : this.selLinkedApp;
                var i=list.length-1;
                for (;i>=0;i--){
                    if(top>selLinked.modualsZoneMax[i]){
                        break;
                    }
                }
                if(i===this.currentModual){
                      console.log("相同哦，不需要");
                }
                return i+1;

            }
        }
    }
})