$(function() {
	vP(); // 放器高度动态赋值
	sB(studyPercent); // 学习进度动画
	//treeMenu(); // 课程树
	ocFun(); // 开关灯效果
	cardChange("#p-h-r-title>li", "#p-h-r-cont>section", "current"); // 菜单选项卡
	browserRedirect(); // 右侧不同设备下显隐
});

$(window).resize(function() {
	if(checkIsMobile()) {// 移动端环境下效果
	}else{
		vP();
	}
});

// 学习进度动画
var sB = function(num) { // num : 进度百分比数值
	var ik = 0, timer = null, lnb = $(".lev-num-bar"), lnm = $(".lev-num");
	lnb.css("width", 0);
	lnb.parent().attr("title", "已学习：" + num + "%");
	if (num > 0) {
		timer = setInterval(function() {
			if (ik < num) {
				lnb.css("width", ++ik + "%");
				lnm.children("big").text("已学习：" + ik + "%");
			} else {
				clearInterval(timer);
			}
		}, 30);
	}
};
// 播放器高度动态赋值
var vP = function() {
	var wH = parseInt(document.documentElement.clientHeight, 10);
	//$("#p-h-box").css("height", wH - 108);
	// $("#p-h-r-cont").css("height", wH - 213);
	// $(".p-h-video").css("height", wH - 180);
};
// 右侧菜单区域显示与隐藏
var rmFun = function() {
	$("#o-c-btn").click(function() {
		var _this = $(this);
		if (!_this.hasClass("open-o-c")) {
			$(".p-h-r-ele").animate({
				"right" : "-415px"
			}, 500);
			$("#p-h-box").animate({
				"padding-right" : "0",
				"margin-right" : "-15px"
			}, 500);
			_this.animate({
				"left" : "-30px"
			}, 500).addClass("open-o-c");
			_this.children("a").attr("title", "显示");
		} else {
			$(".p-h-r-ele").animate({
				"right" : "0"
			}, 500);
			$("#p-h-box").animate({
				"padding-right" : "400px",
				"margin-right" : "0"
			}, 500);
			_this.css("left", "0").removeClass("open-o-c");
			_this.children("a").attr("title", "展开");
		}
	})
};
// 开关灯效果
var ocFun = function() {
	var bMask = $('<div class="bMask"></div>');
	bMask.css({
		"opacity" : "0.8"
	});
	$(".dpBtn").click(function() {
		var _this = $(this);
		if (!_this.hasClass("dpOpen")) {
			$("body").prepend(bMask);
			_this.addClass("dpOpen");
			_this.children("a").text("开灯").attr("title", "开灯");
		} else {
			bMask.remove();
			_this.removeClass("dpOpen");
			_this.children("a").text("关灯").attr("title", "关灯");
		}
	})
};
// 移动端显示
function browserRedirect() {
	if(checkIsMobile()){   // 移动端环境下效果
		$(".p-h-box").css("padding-right", "320");
		$(".p-h-r-ele").css("width", "320");
		$(".p-h-r-ele").animate({
			"right" : "-320px"
		}, 500);
		$("#p-h-box").animate({
			"padding-right" : "0",
			"margin-right" : "-15px"
		}, 500);
		$("#o-c-btn").animate({
			"left" : "-15px"
		}, 500).addClass("open-o-c");
		$("#o-c-btn").children("a").attr("title", "显示");
		var wH = parseInt(document.documentElement.clientHeight, 10);
		//$("#p-h-box").css("height", wH - 258);
		// $("#p-h-r-cont").css("height", wH - 363);
		// $(".p-h-video").css("height", wH - 330);

		$("#o-c-btn").click(function() {
			var _this = $(this);
			if (!_this.hasClass("open-o-c")) {
				$(".p-h-r-ele").animate({
					"right" : "-320px"
				}, 500);
				$("#p-h-box").animate({
					"padding-right" : "0",
					"margin-right" : "-15px"
				}, 500);
				_this.animate({
					"left" : "-15px"
				}, 500).addClass("open-o-c");
				_this.children("a").attr("title", "显示");
			} else {
				$(".p-h-r-ele").animate({
					"right" : "-15px"
				}, 500);
				$("#p-h-box").animate({
					"padding-right" : "0",
					"margin-right" : "-15px"
				}, 500);
				_this.css("left", "0").removeClass("open-o-c");
				_this.children("a").attr("title", "展开");
			}
		})


	}else { // 非移动端环境下效果
		rmFun();
	}
}
/**
 * 收藏课程
 * @param courseId
 *            课程ID
 */
function favorites(courseId,obj) {
	$.ajax({
		url : baselocation + '/front/createfavorites/' + courseId,
		type : 'post',
		dataType : 'json',
		success : function(result) {
			if (result.success == false) {
				dialog('提示', result.message, 1);
			} else {
				$(obj).html("已收藏").attr("title","已收藏").parent().addClass("sc-end");
				dialog('提示', result.message, 0);
			}
		}
	});
}
