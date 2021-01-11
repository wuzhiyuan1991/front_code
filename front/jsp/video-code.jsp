<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8"%>
<script src='/static/script/polyvplayer.min.js'></script>
<div id='videoPlayer' style="width: 100%; height: 100%"></div>
<script>

	var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

	function generateMixed(n) {
		var res = "";
		for (var i = 0; i < n; i++) {
			var id = Math.ceil(Math.random() * 35);
			res += chars[id];
		}
		return res;
	}
	var playsafe = ''
	$.ajax({
		url: '/polyv/token',
		type: 'get',
		data: { 'vid': '${videourl}' },
		async: false,
		success: function (result) {
			playsafe = result

		},
		error: function (error) {


		}
	})
	if (playsafe == '') {
		alert('请将播放器切换为flash版本，H5暂时不可用')
	}

	var playerOpt = {
		'width': '100%',
		'height': '100%',
		'vid': '${videourl}',
		'playsafe': playsafe,
		'code': generateMixed(10),
		// 'flashvars':{'ban_history_time':'off','history_video_duration':0,"ban_seek_by_limit_time" : '${banSeekByLimitTime}'}
		'forceH5': true,
		'flash': false,
		'hideSwitchPlayer':true
	};

	//如果手机浏览，需要增加callback参数， 参考 http://dev.polyv.net/2015/04/jsgn0032/
	if (checkIsMobile()) {
		playerOpt.callBack = "polyvObject";
	}
	var player = polyvObject('#videoPlayer').videoPlayer(playerOpt);

	//播放器接口，详情请见 http://dev.polyv.net/2014/09/bf0002/
	function s2j_onPlayOver() {
		$("#videoPlay").html(videoPlayHtml);
		var exp = new Date();
		exp.setTime(exp.getTime() + 2 * 60 * 60 * 1000)
		document.cookie = "videoOver${videoOrder}" + "=" + escape("true") + ";expires=" + exp.toGMTString() + ";path=/";
	}
</script>