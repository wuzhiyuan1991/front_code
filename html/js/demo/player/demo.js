define(function(require){
	var LIB = require("lib");
	var template = require("text!./demo.html");
	var player = require("components/player/vuePlayer");
	var dataModel = {
			currentVideoId:'ekvteffdqf',
			videoId:null
	}
	var opts = {
			template:template,
			components:{
				player:player
			},
			data : function(){
				return dataModel;
			},
			computed:{
				videoSrc:function(){
					return LIB.ctxPath("/file/play/" + this.currentVideoId);
				}
			},
			methods:{
				test:function(){
					this.currentVideoId = _.clone(this.videoId);
				}
			}
	}
	var demo = LIB.Vue.extend(opts);
	return demo;
});