define(function(require){
	var Vue = require("vue");
	var template = require("text!./vuePlayer.html");
	var playerUrlBuilder = function(videoSrc){
		var playerUrl = "";
		var jsSrc = "js/libs/sewise-player/sewise.player.min.js";
		playerUrl += jsSrc;
		playerUrl += "?server=vod";
		playerUrl += "&type=mp4";
		playerUrl += "&lang=zh_CN";
		playerUrl += "&skin=vodWhite";
		playerUrl += "&autostart=false";
		playerUrl += "&topbardisplay=disable";
		playerUrl += "&claritybutton=enable";
		playerUrl += "&controlbardisplay=enable";
		playerUrl += "&logo=images/menu/saiweiLogo.png";
		playerUrl += "&videourl="+videoSrc;
		return playerUrl;
	}
	var opts = {
			template:template,
			props:{
				videoSrc:{
					type:String,
					required:true
				}
			},
			data:function(){
				return {
					player:null
				};
			},
			computed:{
				playerUrl:function(){
					return this.playerSrc;
				}
			},
			watch:{
				videoSrc:function(){
					this.player = this.buildPlayerUrl();
				}
			},
			methods:{
				buildPlayerUrl:function(){
					this.clearPlayer();
					var player = document.createElement("script");
					player.type = "text/javascript"; 
					this.$el.appendChild(player);
					player.src = playerUrlBuilder(this.videoSrc);
					return player;
				},
				clearPlayer:function(){
					if(this.player){
						this.$el.innerHTML = "";
						this.player = null;
					}
				}
			},
			ready:function(){
				if(!this.player){
					this.player = this.buildPlayerUrl();
				}
			}
	};
	var component = Vue.extend(opts);
	return component;
});