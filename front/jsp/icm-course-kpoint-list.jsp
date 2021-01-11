<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<script type="text/javascript" src="/static/script/icm-course-kpoint-list.js"></script>
<c:if test="${not empty kpointList }">
	<menu id="lh-menu" class="lh-menu">
		<ul>
			<c:set var="folderIndex" value="1"/>
			<c:forEach items="${kpointList }" var="parentKpoint" varStatus="index">
				<c:if test="${parentKpoint.kpointType==0 }"><!-- 章 -->
					<li class="lh-menu-stair">
						<a href="javascript: void(0)" title="${parentKpoint.name }" class="l-m-stitle">
							<span class="fr"><em class="icon14 m-tree-icon">&nbsp;</em></span>
							<em class="lh-menu-i-1 icon24 mr5"><font>${folderIndex }</font></em>${parentKpoint.name }
						</a>
						<ol class="lh-menu-ol">
							<c:forEach items="${parentKpoint.kpointList}" var="sonKpoint">
								<li class="lh-menu-second ml30 kpoint-item kp-${sonKpoint.id}" >
									<div title="" class="l-m-sbox">
										<span class="fr">
												<em class="lh-p-icon icon14 ml5" >&nbsp;</em>
										</span>
										<a  id="kpoint${ sonKpoint.id }"
											data-filetype="${sonKpoint.fileType}"
											data-cloudfileid="${sonKpoint.cloudFile.id}"
											data-cloudfilename="${sonKpoint.cloudFile.orginalName}"
											data-ctxpath="${sonKpoint.cloudFile.ctxPath}"
											data-parentname="${parentKpoint.name }"
											data-kpointname="${sonKpoint.name }"
											href="javascript:void(0)" class="max-width-140 fl disIb txtOf p-v-title "
											onclick="onCatalogItemClick('${sonKpoint.id }',this,'${sonKpoint.name }')"
										>
											<em class="lh-menu-i-2 mr5" >&nbsp;</em>
											${sonKpoint.name }
										</a>
										<div class="clear"></div>
									</div>
								</li>
							</c:forEach>
						</ol>
					</li>
					<c:set var="folderIndex" value="${folderIndex+1 }"/>
				</c:if>
				<c:if test="${parentKpoint.kpointType==1 }"><!-- 节 -->
					<li class="lh-menu-stair">
						<ul class="lh-menu-ol no-parent-node">
							<li class="lh-menu-second">
								<a title="" id="kpoint${ parentKpoint.id }"    onclick="onCatalogItemClick('${parentKpoint.id }',this,'${parentKpoint.name }')" class="l-m-stitle" href="javascript:void(0)">
									<span class="fr">
										<em class="lh-p-icon icon14 ml5">&nbsp;</em>
									</span>
									<em class="lh-menu-i-2 mr5">&nbsp;</em>${parentKpoint.name }
								</a>
							</li>
						</ul>
					</li>
				</c:if>
			</c:forEach>
		</ul>
	</menu>
</c:if>
<!-- /无数据提示 开始-->
<c:if test="${empty kpointList}">
	<section class="no-data-wrap">
		<em class="icon30 no-data-ico">&nbsp;</em> <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
	</section>
</c:if>
<input type="hidden" id="playFromType" value="${playFromType}"/>
<input type="hidden" id="courseId" value="${courseId}"/>
