define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var sidebarDefaultState = false;
    var requestParams = null; // 缓存请求参数， 防止请求过快
    var requestUrl = null; // 缓存请求参数， 防止请求过快

    var initDataModel = function() {
        return {
            tout:'', // 定时器
            bgPositionStyle:'',
            getSearchList:_.debounce(function (_this, baseParam, callBack) {
                var resource = _this.$resource(_this.url),
                    startHTTPTime = Date.now(),
                    timer = null;
                if(_.isEqual(requestParams, baseParam) && _this.url === requestUrl) {
                    return;
                }
                requestParams = baseParam;
                requestUrl = _this.url;

                resource.get(baseParam).then( function (res) {
                    requestParams = null;
                    requestUrl = null;
                    _this.searchList = res.data;
                    callBack && callBack();
                })
            },1000),

            searchList:[],
            isFirst:0
        }
    };

    // var buildGroupData = function (itemsObj,rootNodes) {
    //     function spread(nodes) {
    //         nodes.forEach(function (node) {
    //             if(itemsObj[node.id] !== undefined){
    //                 node.children = itemsObj[node.id];
    //                 spread(itemsObj[node.id])
    //             }
    //         })
    //     }
    //     spread(rootNodes);
    //     return rootNodes;
    // }
    var opts = {
        template: template,
        name: "inputSearch",
        props: {
            isShowSearchList:{
                default:false
            },
            isText:{
                type:Boolean,
                default:true
            },
            // 输入域的内容
            inputVal:{
                default:null
            },
            // 后端返回数据的显示的  key 值
            displayName:{
                default:'name'
            },
            // 接口 url
            url:{
                default:'pool/problems'
            },
            // 请求接口关键字 key
            keyword:{
                default:'keyword'
            },
            disabled: {
                type: Boolean,
                default: false
            },
        },
        data: initDataModel,
        methods: {
            openBg:function () {
                this.isShowSearchList = !this.isShowSearchList;
                // console.log(this.$refs.searchInputDiv.offsetTop )
                // var div = this.$refs.searchInputDiv;
                var div = document.getElementById("searchListBgId");
                var bgPositionStyle = '';
                bgPositionStyle = 'width:' + div.offsetWidth + "px;"
                this.bgPositionStyle = bgPositionStyle;
                console.log(this.bgPositionStyle)
            },
            // 输入框失去焦点
            doBlur:function () {
              var _this = this;
                this.isFirst = 0;
              if(this.tout){
                  clearTimeout(this.tout);
              }
              this.tout = setTimeout(function () {
                  _this.isShowSearchList = false;
                  this.searchList = [];
              },200);
            },
            // 输入框获取焦点
            doFocus:function () {
                this.isFirst = 1;
                if(this.tout){
                    clearTimeout(this.tout);
                }
                if(this.inputVal && this.inputVal.length>1){
                    this.isShowSearchList = true;
                }else{
                    this.isShowSearchList = false;
                }
            },
            selectItem:function (item) {
                var _this = this;
                if(this.tout){
                    clearTimeout(this.tout);
                }
                if(_.isString(item))
                    this.inputVal = item;
                else if(_.isObject(item)){
                    this.inputVal = item[this.displayName];
                }
                this.$nextTick(function () {
                    _this.isShowSearchList = false;
                });
            },
            getName:function (item) {
                if(_.isString(item))
                    return item;
                else if(_.isObject(item)){
                    return item[this.displayName];
                }
            },
            handleScroll:function () {debugger
                this.isShowSearchList = false;
                this.doBlur();
            },

        },
        watch: {
            atype:function (val) {
              console.log("建拉蒂案例的风景", val);
            },
            inputVal:function (val) {
                if(val && val.length>1){
                    if(this.isFirst != 0){
                        this.isShowSearchList = true;
                    }

                    var div = document.getElementById("searchListBgId");
                    var bgPositionStyle = '';
                    bgPositionStyle = 'width:' + div.offsetWidth + "px;";
                    if(this.bgPositionStyle.indexOf(div.offsetWidth)<0) this.bgPositionStyle = bgPositionStyle;

                    var param = {};
                    param[this.keyWord] = this.inputVal;
                    this.getSearchList(this, {keyword:this.inputVal})

                }else{
                    this.isShowSearchList = false;
                    this.searchList = [];
                }
            }
        },
        created: function() {

        },
        events:{
            // "on-form-blur":function (val) {
            //     console.log("hahahah")
            //     // this.isShowSearchList = false;
            // }
        }
    };
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('input-search', component);

    return component;
})
