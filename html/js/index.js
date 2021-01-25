var baseReqUrl = "js";
require.config({
  baseUrl: baseReqUrl,
  urlArgs: "ver=" + Math.round(99899 * Math.random()),
  waitSeconds: 0,
  shim: {
    jquery: ["lodash"],
    lodash: {
      exports: "_"
    },
    underscoreDeepExtend: {
      deps: ["lodash"] //, "css!../css/basic.css"]//,"css!../css/bootstrap.css", "css!../css/basic.css"]
    },
    bootstrap: {
      deps: ["jquery"] //, "css!../css/basic.css"]//,"css!../css/bootstrap.css", "css!../css/basic.css"]
    },
    "bootstrap-table": {
      deps: ["jquery"] //,"css!./libs/bootstrap/css/bootstrap-table.min.css"]
    },
    "jquery-migrate": {
      deps: ["jquery"]
    },
    "bootstrap-table-zh-CN": {
      deps: ["jquery"]
    },
    base: {
      deps: ["jquery"]
    },
    vueRouter: {
      deps: ["vue"]
    },
    vueResource: {
      deps: ["vue"]
    },
    pluploadHelper: ["plupload"],
    "app/app": ["base"],
    mousewheel: {
      deps: ["jquery"]
    }
    //"mCustomScrollbar": {
    //	deps: ["jquery", "mousewheel"]
    //}
  },

  map: {
    "*": {
      css: "libs/css.min"
    }
  },

  paths: {
    async: "libs/require.async",
    jquery: "libs/jquery/jquery-1.9.1.min",
    lodash: "libs/lodash/3.10.1/lodash.min",
    underscoreDeepExtend: "libs/underscore-deep-extend.min",
    text: "libs/text.min",
    jscolor: "libs/jscolor-2.0.4/jscolor.min",
    bootstrap: "libs/bootstrap/bootstrap.min",
    pluploadHelper: "tools/pluploadHelper.min",
    "jquery-migrate": "libs/jquery/jquery-migrate-1.1.0.min",
    css: "libs/css.min",
    plupload: "libs/plupload-2.1.9/js/plupload.full.min",
    vue: "libs/vue/vue.min",
    vueResource: "libs/vue/vue-resource.min",
    vueX: "libs/vue/vuex.min",
    vueRouter: "libs/vue/vue-router.min",
    charts: "libs/echarts.common.min",
    popper: "libs/popper.min", //iview ui组件依赖
    apiCfg: "app/vue-resource/apiConfig",
    base64: "libs/base64",
    sewisePlayer: "libs/sewise-player/sewise.player.min",
    artTempalte: "libs/template/template-native",
    //"mCustomScrollbar": "libs/jquery.mCustomScrollbar.min",
    mousewheel: "libs/jquery.mousewheel.min",
    iconfont: "libs/iconfont",
    chart2: "libs/echarts.min2",
    graphEditor: "libs/editor/graphEditor",
    popper1: "libs/editor/popper"
  }
});
// 引入模块
require([
  "jquery",
  "app/app",
  "text",
  "lodash",
  "base",
  "const",
  "lang/i18n_cn",
  "lang/i18n_en",
  "lang/dataDic_cn",
  "lang/dataDic_en",
  "bootstrap",
  "popper",
  "underscoreDeepExtend",
  "mousewheel",
  "vue",
  "vueRouter",
  "artTempalte",
  "apiCfg",
  "iconfont",
  "chart2",
  "graphEditor",
  "popper1"
], function(
  $,
  app,
  TEXT,
  LODASH,
  BASE,
  CONST,
  i18nCN,
  i18nEN,
  dataDicCN,
  dataDicEN,
  BJS,
  popper,
  underscoreDeepExtend,
  mousewheel,
  vue,
  vueRouter,
  artTempalte,
  apiCfg,
  iconfont,
  chart2,
  graphEditor,
  popper1
) {
  //解决jquery加载太慢问题
  require["jquery-migrate"];
  _.mixin({ deepExtend: underscoreDeepExtend(_) });
});
