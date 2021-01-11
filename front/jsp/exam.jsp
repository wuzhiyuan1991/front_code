<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE HTML>
<html>
<head>
	<title>考试系统</title>
	<link rel="stylesheet" type="text/css" href="/static/css/red-matter.css">
	<link rel="stylesheet" type="text/css" href="/static/css/theme.css">
	<link rel="stylesheet" type="text/css" href="/static/css/reset.css">
	<link rel="stylesheet" type="text/css" href="/static/css/global.css">
	<link rel="stylesheet" type="text/css" href="/static/css/exam-style.css">
	<script type="text/javascript" src="/static/script/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="/static/script/webutils.js"></script>
	<script type="text/javascript" src="/static/script/exam.js"></script>
	<script type="text/javascript" src="/static/script/examJs.js"></script>
	<script>
		var maxtime =100;//最大时间每个页面要自己覆盖此值
		$(function(){
			quesCard();
			leftMenuScroll();
			$(".p-ques-list>ul>li").children(".is-options").children(".fl").children(".ans-edit").click(function(){
				var _this=$(this),
						_tBox=_this.parent().parent().next().children();
				if(_tBox.hasClass("undisa-text")){
					_this.html("完成编辑");
					_tBox.removeClass("undisa-text");
					_tBox.removeAttr("disabled");
				}else{
					_this.html("修改答案");
					_tBox.addClass("undisa-text");
					_tBox.attr("disabled","enabled");
				}
			});

			timer = setInterval("CountDown()",1000);

			//答题选项点击事件
			$('input:radio').click(function(){
				var numinder = $(this).parent().attr("numinder");
				if(numinder!=null){
					var numinder1 = numinder*1+1;
					$('#datikaCurrent'+numinder1+" a").click();
				}
			});

			if("${topicList.size()}">0){
				cookiesName = "test_time${paper.id}";
			}
			//设置时间
			if(getCookie(cookiesName)==null){
				maxtime =${paper.replyTime}; //按秒计算
			}else{
				maxtime=getCookie(cookiesName);
			}
			//单题模式初始化
			danti($("#checkboxdanti"));
		});
		function leftMenuScroll() {
			var lM = function() {
				var sTop = parseInt(document.documentElement.scrollTop || document.body.scrollTop, 10);
				if (sTop > 165) {
					$("#p-test-box").css("position" , "fixed");
				} else {
					$("#p-test-box").css("position" , "absolute");
				}
			};
			$(window).bind("scroll" , lM);
		}
		//答题卡点击
		function datikaAnchor(titleheiddenNum,num){
			//$(".titleHeiddenAndShow"+titleheiddenNum).click();
			$("html,body").animate({scrollTop: $(".datikaQstAnchor"+num).offset().top-50}, 50);

		}
		$(window).bind('unload',function(){
			var exp = new Date();
				exp.setTime(exp.getTime()+10000);
				document.cookie="passExercise${examNum}=" +escape("close")+ ";expires="+ exp.toGMTString() + ";path=/";
			return'您确定要离开此页面吗';
		});
		$(window).bind('beforeunload',function(){return'您确定要离开此页面吗';});
		var isRaterRequired = "${isRaterRequired}";
	</script>
	<style type="text/css">
		.global-nav-wrap {display: none;}
	</style>
</head>
<body>
<form id="addExerciseRecord">

	<input type="hidden" name="paperRecord.testTime" id="testTime" value="0"/>
	<input type="hidden" id="paperId" name="paperRecord.paperId" value="${paper.id }"/>
	<input type="hidden" name="paperRecord.paperName" value="${paper.name}" />
	<input type="hidden" id="token" name="token" value="${token }"/>
	<input type="hidden" id="examScheduleId" name="paperRecord.examScheduleId" value="${examScheduleId }"/>
	<c:set var="questionNumIndex" value="0" />
	<c:set var="numIndex" value="-1" />

	<div class="e-main">
		<section class="container">
			<div class="clearfix mt30">
				<div class="col18 fl pr">
					<div class="p-test-box" id="p-test-box">
						<c:if test="${not empty topicList}">
							<dl class="paper-test">
								<dt><em class="e-clock"></em><span id="timer"></span></dt>
								<dd><a href="javascript:void(0)" title=""  onclick="formSubmit(${examNum})">我要交卷</a></dd>
							</dl>
						</c:if>
						<!-- /答题卡 开始 -->
						<c:if test="${topicList!=null&&topicList.size()>0 }">
							<div class="mt20">
								<dl class="paper-test q-card-box q-card-wrap">
									<dt><a href="javascript:;"><span class="ques-card">答题卡</span><em class="q-card-icon icon16"></em></a></dt>
									<dd>
										<table class="ques-card-tab">
											<c:set var="daTiKaNumIndex" value="0" />
											<c:forEach items="${topicList }" varStatus="topicListindex" var="paperMiddle" >
												
													<c:forEach items="${paperMiddle.questions}" varStatus="qstMiddleIndex">
														<c:set var="daTiKaNumIndex" value="${daTiKaNumIndex+1}" />
														<c:if test="${(daTiKaNumIndex-1)%4==0}"><tr></c:if>
															<td id="datikaCurrent<c:out value="${daTiKaNumIndex}"/>"><a href="javascript:void(0)" onclick="datikaAnchor(${topicListindex.index },<c:out value="${daTiKaNumIndex}"/>)" title="第<c:out value="${daTiKaNumIndex}"/>题"><c:out value="${daTiKaNumIndex}"/></a></td>
														<c:if test="${daTiKaNumIndex%4==0 or (topicListindex.last and qstMiddleIndex.last and daTiKaNumIndex%4!=0)}"></tr></c:if>
													</c:forEach>
											</c:forEach>
										</table>
									</dd>
								</dl>
							</div>
						</c:if>
						<!-- /答题卡 结束 -->
					</div>
				</div>
				<div class="col82 fr">
					<div class="ml40">
						<div class="p-test-title">
							<span class="nextTitleAnchor">${paper.name}</span>
						</div>
						<ul class="ques-type mt20 clearfix">
							<c:forEach items="${topicList }" varStatus="index" var="paperMiddle">
								<li <c:if test="${index.first}">class="current"</c:if> >
									<a href="javascript:void(0)" class="titleHeiddenAndShow${index.index}" indexNum="${index.index }" title="${name }" titleValue="${paperMiddle.title}[&nbsp;每小题${topicList[index.index].score }分&nbsp;]" onclick="titleHeiddenAndShow('${paperMiddle.id }',this)" >
										${paperMiddle.name }
									</a>
								</li>
							</c:forEach>
							<c:if test="${isRaterRequired == '1'}">
							<li>
								<a href="javascript:void(0);" class="titleHeiddenAndShow999" indexNum="999" title="评估人" onclick="titleHeiddenAndShow(999, this)" >
									评估人
								</a>
							</li>
							</c:if>
						</ul>
							<div class="pt10 pb10 pr20">
								<h6 class="hLh30 of unFw ml15"><font class="c-333 fsize12" id="showTitleValue">
									<c:if test="${not empty topicList }">
										${topicList[0].title }[&nbsp;每小题${topicList[0].score }分&nbsp;]
									</c:if></font></h6>
							</div>
						<c:if test="${empty topicList}">
							<!-- /无数据提示 开始-->
							<section class="no-data-wrap">
								<em class="icon30 no-data-ico">&nbsp;</em> <span class="c-666 fsize14 ml10 vam">本试卷还没有上传试题，小编正在努力整理中 . . .</span>
							</section>
							<!-- /无数据提示 结束-->
						</c:if>
						<c:if test="${not empty topicList}">
							<div class="p-ques-list">
								<c:forEach items="${topicList}" varStatus="topicListindex" var="paperMiddle">
									<ul id="titleHidden${paperMiddle.id }" <c:if test="${!topicListindex.first }">style="display:none"</c:if> >
											<c:forEach items="${paperMiddle.questions }" var="qstMiddle">
												<c:set var="questionNumIndex" value="${questionNumIndex+1}" />
												<c:set var="numIndex" value="${numIndex+1}" />
												<input type="hidden" value="${qstMiddle.id }" name="recordList[${numIndex}].qstId"/>
												<input type="hidden" value="${paperMiddle.id }" name="recordList[${numIndex}].topicId"/>
												<input type="hidden" value="${paperMiddle.score }" name="recordList[${numIndex}].score"/>
												<input type="hidden" value="${qstMiddle.answer }" name="recordList[${numIndex}].answer"/>
												<!-- /试卷试题列表开始 -->
												<li class="datikaQstAnchor<c:out value="${questionNumIndex} p-q-item"/>">
													<div class=" p-ques-title">
														<tt><c:out value="${questionNumIndex}"/></tt>
														<span class="c-master fsize16 ml10">
															<c:if test="${qstMiddle.type==1}">（单选题）</c:if>
															<c:if test="${qstMiddle.type==2}">（多选题）</c:if>
															<c:if test="${qstMiddle.type==3}">（判断题）</c:if>
															<c:if test="${qstMiddle.type==4}">（不定项题）</c:if>
															<c:if test="${qstMiddle.type==5}">（主观题）</c:if>
														</span><span class="c-666 fsize16">${qstMiddle.content }</span>
													</div>
													<section class="t-p-options">
															<ol>
																<c:if test="${qstMiddle.type!=3	}">
																<c:forEach items="${qstMiddle.opts}" var="option">
																	<li><a href="javascript:void(0);">${option.opt }、${option.content }</a></li>
																</c:forEach>
																</c:if>
																<c:if test="${qstMiddle.type==3}">
																	<li><a href="javascript:void(0);">A、是</a></li>
																	<li><a href="javascript:void(0);">B、否</a></li>
																</c:if>
															</ol>
													</section>
													<section class="is-options clearfix">
															<div class="fl t-p-is-options">
																<input class="ml10" value="" type="hidden" name="recordList[${numIndex}].userAnswer"/>
																<c:forEach items="${qstMiddle.opts}" var="option">
																	<c:choose>
																		<c:when test="${qstMiddle.type==1||qstMiddle.type==3}">
																			<label for="<c:out value="${questionNumIndex}"/>_${option.opt}" numInder="<c:out value="${questionNumIndex}"/>">
																				<em class="icon18 o-radio">&nbsp;</em>
																				<input type="radio" name="recordList[${numIndex}].userAnswer" id="<c:out value="${questionNumIndex}"/>_${option.opt }" value="${option.opt }"/>
																				<span>${option.opt }</span>
																			</label>
																		</c:when>
																		<c:otherwise>
																			<label for="<c:out value="${questionNumIndex}"/>_${option.opt }" numInder="<c:out value="${questionNumIndex}"/>">
																				<em class="icon18 o-checkbox">&nbsp;</em>
																				<input type="checkbox" name="recordList[${numIndex}].userAnswer" id="<c:out value="${questionNumIndex}"/>_${option.opt }" value="${option.opt }"/>
																				<span>${option.opt}</span>
																			</label>
																		</c:otherwise>
																	</c:choose>

																</c:forEach>
															</div>
													</section>
													<div class="tac mt50">
														<a href="javascript:void(0)" class="submit-btn nextoneqst" onclick="nextqst(${numIndex+2})">下一题</a>
													</div>
												</li>
												<!-- /试卷试题列表结束 -->
											</c:forEach>
									</ul>
								</c:forEach>

								<%--评估人--%>
								<c:if test="${isRaterRequired == '1'}">
									<div style="display: none;"  id="titleHidden999">
										<div>
											<label for="">评估人：</label>
											<input type="text" name="raterName" oninput="onRaterNameInput()" style="height: 30px;width: 200px;padding: 0 10px;border: 1px solid #ccc;border-radius: 4px;">
											<span>（只能输入中、英文，最多50个字符）</span>
										</div>
										<div id="raterTip" style="padding-left: 50px;line-height: 30px;color: red;"></div>
									</div>
								</c:if>
							</div>
						</c:if>
					</div>
				</div>
			</div>
		</section>
	</div>
	<div class="exam-navbox">
		<nav class="global-nav">
			<ul class="clearfix" id="gn-ul">
				<li style="width:33%">
					<a href="javascript:;" title="首页" id="timer" class="bor-right" > <em class=" mr10 clock-icon vam"></em><span class="vam examTimerShow">01:12:23</span></a>
				</li>
				<li style="width:33%"> <a href="javascript:;" title="首页" id="learn-history" class="bor-right"> <em class="icon16 mr10 my-test-icon" ></em><span class="fsize16 c-333 vam">答题卡</span></a> </li>
				<li style="width:33%">
					<a href="javascript:;" title="首页" id="nav-box" > <em class="icon16 mr10 my-test-icon" ></em><span class="fsize16 c-333 vam">操作</span></a>
				</li>
			</ul>
		</nav>
		<div class="e-nav-bx-warp">
			<div class="e-nav-box">
				<div class="e-nav-wrap" id="wrapper">
					 <section class="scroller">
						<div></div>
						<div class="e-history-box e-qcard-wrap" >
							<div class="ex-top clearfix pb10"> <div class="fl"><span class="fsize14 c-666">答题卡</span></div> <div class="fr"><em class="icon16 dtClose dtClose1"></em></div> </div>
							<dl class="paper-test q-card-box">
								<dd>
									<table class="ques-card-tab">
										<c:set var="daTiKaNumIndex" value="0" />
										<c:forEach items="${topicList }" varStatus="topicListindex" var="paperMiddle" >
											<c:if test="${paperMiddle.type!=4 }">
												<c:forEach items="${paperMiddle.questions}" varStatus="qstMiddleIndex">
													<c:set var="daTiKaNumIndex" value="${daTiKaNumIndex+1}" />
													<c:if test="${(daTiKaNumIndex-1)%4==0}"><tr></c:if>
														<td id="datikaCurrentMobile<c:out value="${daTiKaNumIndex}"/>"><a href="javascript:void(0)" onclick="datikaAnchor(${topicListindex.index },<c:out value="${daTiKaNumIndex}"/>)" title="第<c:out value="${daTiKaNumIndex}"/>题"><c:out value="${daTiKaNumIndex}"/></a></td>
													<c:if test="${daTiKaNumIndex%4==0 or (topicListindex.last and qstMiddleIndex.last and daTiKaNumIndex%4!=0)}"></tr></c:if>
												</c:forEach>
											</c:if>
										</c:forEach>
									</table>
								</dd>
							</dl>
						</div>
						<div class="e-kc-box test-operation">
							<div class="ex-top clearfix pb10"> <div class="fl"><span class="fsize14 c-666">操作</span></div> <div class="fr"><em class="icon16 dtClose dtClose1"></em></div> </div>
							<dl class="paper-test">
								<dt><em class="e-clock"></em><span class="examTimerShow"></span></dt>
								<dd><a href="javascript:void(0)" title=""  onclick="formSubmit()">我要交卷</a></dd>
								<dd><a href="javascript:void(0)" onclick="timePause()" title="">暂停</a></dd>
								<dd><a href="javascript:void(0)" onclick="addPaperRecord(1);" title="">下次再做</a></dd>
								<dd><input type="checkbox" class="vam" onclick="danti(this)"> <a href="javascript:void(0)" title="" class="vam">单题模式</a></dd>
							</dl>
						</div>
					</section>
				</div>
			</div>
		</div>
	</div>
</form>
</body>
</html>