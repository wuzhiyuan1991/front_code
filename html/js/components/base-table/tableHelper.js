define(function(require) {

    var dataDic = {};
    var defaultGlobalFilterValue = {};
    var cfg = {};
    var tableColumnSetting = {};

    var registerDataDic = function(data) {
        dataDic = data;
    };

    var getScrollbarWidth = function() {
        var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>');
        $('body').append(div);
        var w1 = $('div', div).innerWidth();
        div.css('overflow-y', 'auto');
        var w2 = $('div', div).innerWidth();
        $(div).remove();
        return (w1 - w2);
    }

    var registerCfg = function(param) {
        dataDic = param.dataDic || {};
        defaultGlobalFilterValue = param.defaultGlobalFilterValue || {};
        cfg["dataDic"] = dataDic;
        cfg["defaultGlobalFilterValue"] = defaultGlobalFilterValue;
    };

    var regFn;
    var registerJump = function(func){
        regFn = func;
    };
    var emitJump = function (params) {
        regFn && regFn(params);
    };
    var sidebarState = false;
    var setSidebarState = function (state) {
        sidebarState = state
    };
    var getSidebarState = function () {
        return sidebarState;
    };
    var buildEmptyCustomColumnSetting = function() { return { hiddenColumns: [], orderedColumns: [] } };
    var isIE = function () {
        if(!!window.ActiveXObject || "ActiveXObject" in window) {
            return true;
        }
        return false;
    };
    var sequenceColumn = {
        title: " ",
        fieldName: "id",
        fieldType: "sequence",
        width: 50,
        visible : true,
        fixed: true
    };
    return {
        sequenceColumn: sequenceColumn,
        registerCfg: registerCfg,
        isIE: isIE,
        emitJump: emitJump,
        registerJump: registerJump,
        setSidebarState: setSidebarState,
        getSidebarState: getSidebarState,
        getScrollbarWidth: getScrollbarWidth,
        cfg: function() { return cfg },
        queryColumnSetting: function(code) {
            var settingCache = tableColumnSetting[code];
            try {
                if (!settingCache) {
                    settingCache = window.localStorage.getItem(code);
                    settingCache = settingCache ? JSON.parse(settingCache) : buildEmptyCustomColumnSetting();
                    tableColumnSetting[code] = settingCache;
                }
            } catch (e) {
                return buildEmptyCustomColumnSetting();
            }
            return settingCache;
        },
        saveColumnSetting: function(code, setting) {
            if (!code || !setting || _.endsWith(code, '_memory_')) {
                return;
            }
            tableColumnSetting[code] = setting;
            window.localStorage.setItem(code, JSON.stringify(setting));
        }
    }

});