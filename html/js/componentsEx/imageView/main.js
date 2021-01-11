define(function (require) {

    var LIB = require('lib');
    var Viewer = require("libs/viewer");

    var template = require("text!./main.html");

    var opts = {
        template: template,
        props: {
            newView: {
                type: Boolean,
                default:false
            },
            imageStyle:{
                type:String,
                default:''
            },
            images: {
                type: Array,
                default: function () {
                    return []
                }
            },
            showClose : {
                type : Boolean,
                default : true
            }
        },
        data: function () {
            return {
                files: []
            }
        },
        watch: {
            images: function (nVal) {
                if(_.isArray(nVal) && this.viewer) {
                    this.normalize();
                    this.$nextTick(function () {
                        this.viewer.update();
                        this.updateNum++;
                    })
                }
            }
        },
        methods: {
            // _distroyImg:function(){
            //     debugger
            //     console.log('111');
            //    var  _this=this
            // },
           
            normalize: function () {
                try {
                    var images = this.images;
                    this.files = _.map(images, function (image) {
                        var fileId=image.fileId||image.id;
                        return {
                            fileId:fileId,//直接显示图片id
                            fileExt: image.fileExt,
                            fullSrc: image.attr5 === '5' || image.attr5 == 'OSS' ? image.fullSrc || image.ctxPath : '',
                            attr5: image.attr5
                        }
                    })
                }
                catch (e) {
                    
                }
            },
            calcImageURL: function (image) {
                return LIB.convertImagePath(image, 'scale');
            },
            doClose : function(id, index) {
                this.$emit("on-close", id, index, this.images);
            },
            show: function () {
                this.viewer.show()
            },
            view: function (index) {
                this.viewer.view(index)
            },
            getHide:function(id, index){
                this.$emit("on-hide", id, index, this.images);
            },
        },
        created: function () {
            this.updateNum = 0;
        },
        ready: function () {
            this.imageBox = this.$els.imageBox;
            this.viewer = new Viewer(this.imageBox, {
                navbar: false,
                transition: false,
                zoomRatio: 0.2,
                minZoomRatio: 0.3,
                maxZoomRatio: 5,
                fullscreen: false,
                url: function(image) {
                    var src = image.dataset.src || image.src.replace("scale", "watermark");
                    return src;
                }
            });

            if(this.updateNum === 0 && _.isArray(this.images)) {
                if(this.images.length > 0 && this.images.length != this.files.length) {
                    this.normalize();
                }
                this.$nextTick(function () {
                    this.viewer.update();
                });

            }
            // this.imageBox.addEventListener("hide", this._distroyImg);
        },
        // beforeDestory:function(){
        //     this.imageBox.removeEventListener("hide",this._distroyImg);
        // }
    };

    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('image-view', component);
});