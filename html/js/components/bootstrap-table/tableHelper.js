define(function(require) {	

	var dataDic = {};
	var defaultGlobalFilterValue = {};
	var cfg = {};
	var tableColumnSetting = {};
	
	var registerDataDic = function(data) {
		dataDic = data;
	}

	var registerCfg = function(param) {
		dataDic = param.dataDic || {};
		defaultGlobalFilterValue = param.defaultGlobalFilterValue || {};
		cfg["dataDic"] = dataDic;
		cfg["defaultGlobalFilterValue"] = defaultGlobalFilterValue;
	}


	var buildEmptyCustomColumnSetting = function(){ return {hiddenColumns : [], orderedColumns : []}};

	return {
		registerCfg : registerCfg,
		cfg : function(){ return cfg },
		queryColumnSetting : function(code) {
			var settingCache = tableColumnSetting[code];
			try {
				if(!settingCache) {
					settingCache = window.localStorage.getItem(code);
					settingCache = settingCache ? JSON.parse(settingCache) : buildEmptyCustomColumnSetting();
					tableColumnSetting[code] = settingCache; 
				} 
			}catch(e) {
				return buildEmptyCustomColumnSetting();
			}
			return settingCache;
		},
		saveColumnSetting : function(code, setting) {
			if(!code || !setting) {
				return;
			}
			tableColumnSetting[code] = setting;
			window.localStorage.setItem(code, JSON.stringify(setting));
		}
		//saveColumnSetting : function(code, column) {
		//	if(!code || !column) {
		//		return;
		//	}
		//	var settingCache = tableColumnSetting[code];
		//	if(!settingCache) {
		//		settingCache = tableColumnSetting[code] = [];
		//	}
		//
		//	var cInd = settingCache.indexOf(column.title);
		//	if(!column.visible) {
         //   	if(cInd == -1) {
         //   		settingCache.push(column.title);
         //   	}
         //   } else if(cInd != -1) {
         //   	settingCache.splice(cInd, 1);
         //   }
         //   window.localStorage.setItem(code, JSON.stringify(settingCache));
		//}
	}
    
});