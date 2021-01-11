define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'techarticle/disable'},
		queryArticleReplies : {method: 'GET', url: 'techarticle/articlereplies/list/{pageNo}/{pageSize}'},
		saveArticleReply : {method: 'POST', url: 'techarticle/{id}/articlereply'},
		removeArticleReplies : _.extend({method: 'DELETE', url: 'techarticle/{id}/articlereplies'}, apiCfg.delCfg),
		updateArticleReply : {method: 'PUT', url: 'techarticle/{id}/articlereply'},
        //普通列表查看
        selectList: {method: 'GET', url: 'techarticle/list/{currentPage}/{pageSize}'},
        //根据个人回复查询文章列表
        selectListByReply: {method: 'GET', url: 'techarticle/listbyreply/{currentPage}/{pageSize}'},
        //查看个人发表的文章列表
        selectListByCurUser: {method: 'GET', url: 'techarticle/listbycuruser/{currentPage}/{pageSize}'},
        //根据id查看文章
        selectAndCountById: {method: 'GET', url: 'techarticle/articleview/{id}'},
        //根据id更新帖子,上传一个TechArtcle对象
        updateById: {method: 'PUT', url: 'techarticle'},
        //显示关键词
        getkeyword:{method: 'GET', url: 'techkeyword/getkeyword'},
        //将草稿发布帖子
        publishArticle:{method: 'GET', url: 'techarticle/publishArticle/{id}'},
        //为帖子添加回复,这个id是当前帖子id
        saveArticleReply:{method: 'POST', url: 'techarticle//{id}/articlereply'},
        //新增一个帖子
        create:{method: 'POST', url: 'techarticle'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("techarticle"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        // 'delete': '_YYYYYYY003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});