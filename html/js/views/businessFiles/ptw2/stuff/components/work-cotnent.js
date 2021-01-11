define(function (require) {
    var Vue = require("vue");
    var template = require("text!./work-content.html");
    var commonApi = require("../../api");
    var api=require("../vuex/api");
    _.extend(api,commonApi);
    var LIB=require("lib");
    return Vue.extend({
        template: template,
        props: {
            values: {
                type: Array,
                required: true,
            },
            type: {
                type: [String, Number],
                required: true,
            }
        },
        computed: {
            componentKey: function () {
                if (this.type == 6) {
                    return 'ppe';
                } else {
                    return 'baselist';
                }
            },
            currentPPEType:function(){
                return   this.ppeTypes[this.ppeTypeSelectedIndex];
            },
            isPPE:function(){
                return this.componentKey==='ppe';
            }
        },
        data: function () {
            return {
                ppeTypes: [],
                ppeTypeSelectedIndex: -1,
            }
        },
        watch:{
            'type': function() {
                // this.init();
            }
        },
        methods: {
            init: function () {
                var _this = this;
                this.$api = api;
                if (this.isPPE) {
                    this.values = [];
                    this.ppeTypes = [];
                    if(this.ppeTypes.length >0 ){
                        this.initPPETypeDetail(true);
                        return;
                    }
                    this.$api.getPPETypes().then(function (data) {
                        _this.ppeTypes = data;
                        // _this.ppeTypeSelectedIndex = 0;
                        _this.ppeTypeSelectedIndex = _this.getPpeIndex(_this.ppeTypes, _this.$route.query.ppeType);

                        _this.$nextTick(function () {
                            _this.initPPETypeDetail(true);
                        })

                    });
                }
            },
            getPpeIndex:function (arr, id) {
                var index = 0;
                arr.forEach(function (item, i) {
                    if(item.id == id){
                       index = i;
                    }
                });
                return parseInt(index);
            },
            gotoDic:function () {
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart="/ptw/catalog?type=2";
                window.open(router + routerPart);
            },

            //获取内容
            initPPETypeDetail: function (reload) {
                var _this=this;
                var detail = this.ppeTypes[this.ppeTypeSelectedIndex];
                if (!reload && detail.load) {
                    return
                }
                var pms = {
                    type: this.type,
                    'workCatalog.id': this.$parent.currentWorkCatalog.id,
                };
                if(detail){
                    pms.ppeCatalogId = detail.id;
                }
                api.getCatalogDetail(pms).then(function (data) {
                    if(detail){
                        Vue.set(detail, "values", data);
                        detail.load = true;
                    }
                    else{
                        _this.values = data;
                    }

                })
            },
            onSelectedPPE: function (index, item) {
                this.ppeTypeSelectedIndex = index;
                this.initPPETypeDetail();
            },
            doEdit:function (item, name, that) {
                var temp = _.extend({}, item);
                temp.name = name;
                if(temp.name.length>200){
                    LIB.Msg.error("名称长度不要超过200个字符");
                    return;
                }
                api.update(temp).then(function() {
                    item.name = name;
                    LIB.Msg.success("修改成功");
                    that.modalEdit.show = false;
                })
            },
            doAdd:function (item, that) {
                var _this = this;
                var parent = _this.$parent;
                var novali=item.some(function(data){
                   return  data.name.length>200;
                })
                if(novali){
                    LIB.Msg.error("单个名称长度不要超过200个字符");
                    return;
                }
                item.forEach(function (item) {
                    _.extend(item, {
                        type: parent.currentStuffType.id,
                        workCatalogId: parent.currentWorkCatalog.id
                    });
                    if(_this.isPPE){
                        item.ppeCatalogId = _this.currentPPEType.id;
                    }
                });
                api.createBatch(null, item).then(function (data) {
                    LIB.Msg.success("添加成功");
                    if(_this.type == 6){
                        _this.initPPETypeDetail(true);
                    }
                    _this.$dispatch('update_list');
                    that.modalAdd.show = false;
                });
            },
            doMoveUp:function (current) {
                var _this = this;
                api.order(_.extend(current, {
                    criteria: {intValue: {offset: -1}},
                    offset: -1,
                })).then(function(){
                    _this.initPPETypeDetail(true);
                    _this.$dispatch('update_list');
                });
            },
            doMoveDown:function (current) {
                var _this = this;
                api.order(_.extend(current, {
                    criteria: {intValue: {offset: 1}},
                    offset: 1,
                })).then(function(){
                    _this.initPPETypeDetail(true);
                    _this.$dispatch('update_list');
                });
            },
            del:function(item, index, that){
                var _this = this;
                api.removeSingle(null,item).then(function () {
                    // _this.ppeTypes[_this.ppeTypeSelectedIndex].splice(index, 0);
                    LIB.Msg.info("删除成功");
                    that.values.splice(index,1);
                    if(that.values.length===0){
                        that.selectedIndex=-1;
                    }
                    else if(that.values.length<that.selectedIndex+1){
                        that.selectedIndex=that.values.length-1;
                    }
                    _this.initPPETypeDetail(true);
                    _this.$dispatch('update_list');
                })
            },
            delAll:function (arr, that) {
                var _this = this;
                var parent = this.$parent;
                var pms = {
                    type: parent.currentStuffType.id,
                    workCatalogId: parent.currentWorkCatalog.id,
                };
                if(this.isPPE){
                    pms.ppeCatalogId = this.currentPPEType.id;
                }
                api.removeAll(pms).then(function(){
                    LIB.Msg.success("删除成功");
                    that.selectedIndex=-1;
                        // arr.splice(0);
                    _this.initPPETypeDetail(true);
                    _this.$dispatch('update_list');
                });
            }
        },

    })
});