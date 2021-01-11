define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("views/businessFiles/complianceManager/laws/vuex/api");
    var sapi = require("views/businessFiles/complianceManager/standard/vuex/api");
    var rapi = require("views/businessFiles/complianceManager/regulation/vuex/api");
    //vue数据
    var newVO = function () {
        return {
            id: null,
            name: null,
            parentId: '',
            code: null,
            insertPointObjId: null,
            orderNo: null,
            type: null
        };
    };

    var rules = {
        name: [
            { required: true, message: '请输入名称' },
            LIB.formRuleMgr.length(200, 1)
        ],
        parentId: [LIB.formRuleMgr.allowStrEmpty]
    };

    //vue数据 配置url地址 拉取数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            isTopLevel: false,
            opType: 'create'
        },
        contentData: [],
        revise: null,
        reviseList: [],
        legalTypes: [],
        treeSelectData: [],
    };
    var vm = LIB.VueEx.extend({
        template: require("text!./lawDialog.html"),

        computed: {

        },
        data: function () {
            return dataModel;
        },
        watch: {
            revise: function (nval, oval) {

                if (oval !== null && nval) {
                    this.selectRevise(nval)
                }
            },

        },

        methods: {
            detailImg: function (file) {

                return LIB.convertFilePath(LIB.convertFileData(file))
            },

            doTreeNodeClick: function (val) {
                var id = val.data.id
                var height = 0
                var that = this
                $('.getScroll').each(function (index, item) {

                    if (that.legalTypes[index].id == id) {
                        return false
                    }
                    height += $(item).height()
                })
                $('#selectScroll').scrollTop(height)
            },
            selectRevise: function (val) {

                this.initDatas(val)
                LIB.Msg.success("切换成功");
            },
            initDatas: function (lawId) {

                var that = this
                var queryrevise =null 
                var queryChapters =null
                LIB.globalLoader.show()
                if (that.$route.query.standardId) {
                    queryrevise = this.$api.querystandardrevise
                    queryChapters = this.$api.querystandardChapters
                }else if (that.$route.query.lawsId) {
                    queryrevise = this.$api.querylawsrevise
                    queryChapters = this.$api.queryLawsChapters
                }else if(that.$route.query.regulationId){
                    queryrevise = this.$api.queryregulationrevise
                    queryChapters = this.$api.queryregulationChapters
                }
                queryrevise({ 'discernId': this.$route.query.discernId }).then(function (res) {
                    that.reviseList = res.data

                    if (that.reviseList.length > 0) {
                        var data = _.filter(that.reviseList, function (item) {
                            if (that.$route.query.standardId) {
                                return item.standardId == lawId
                            }else if (that.$route.query.lawsId) {
                                return item.lawsId == lawId
                            }else if(that.$route.query.regulationId){
                                return item.regulationId == lawId
                            }
                            
                        })
                        if (data.length > 0) {
                            if (that.$route.query.standardId) {
                                that.revise = data[0].standardId
                            }else if (that.$route.query.lawsId) {
                                that.revise = data[0].lawsId
                            }else if(that.$route.query.regulationId){
                                that.revise = data[0].regulationId
                            }
                            
                        }


                    }

                })
                queryChapters({ 'id': lawId, "criteria.orderValue.fieldName": "orderNo", "criteria.orderValue.orderType": 0 }).then(function (res) {
                    that.legalTypes = res.data.list;

                    var newLegal = _.filter(that.legalTypes, function (item) {
                        return !item.hasOwnProperty('parentId')
                    })
                    var Legal = _.filter(that.legalTypes, function (item) {
                        return item.hasOwnProperty('parentId')
                    })
                    var parentId = {}
                    _.each(Legal, function (item) {
                        if (!parentId.hasOwnProperty(item.parentId)) {
                            parentId[item.parentId] = []
                        }
                        parentId[item.parentId].push(item)
                    })

                    var order = function () {


                        for (var index = 0; index < newLegal.length; index++) {
                            _.each(Object.keys(parentId), function (key) {
                                if (newLegal[index].id == key) {
                                    for (var j = parentId[key].length - 1; j >= 0; j--) {
                                        newLegal.splice(index + 1, 0, parentId[key][j])
                                    }
                                    index += parentId[key].length
                                    delete parentId[key]
                                }
                            })

                        }
                        if (newLegal.length !== that.legalTypes.length) {
                            order()
                        }
                    }
                    order()
                    that.legalTypes = newLegal
                    that.contentData=[]
                    var param = null 
                    if (that.$route.query.standardId) {
                        param  ={ standardId: lawId }    
                        
                    }else if (that.$route.query.lawsId) {
                        param = { lawsId: lawId }
                        
                    }else if(that.$route.query.regulationId){
                        param = { regulationId: lawId }
                    }
                    
                    that.$api.queryContent(param).then(function (res) {
                        var contentData = res.data
                        for (var i = 0; i < that.legalTypes.length; i++) {
                            var param = []
                            for (var j = 0; j < contentData.length; j++) {
                                var charpt = ''
                                if (that.$route.query.standardId) {
                                    
                                    charpt = contentData[j].standardChapterId
                                }else if (that.$route.query.lawsId) {
                                    charpt = contentData[j].lawsChapterId
                                    
                                }else if(that.$route.query.regulationId){
                                    charpt = contentData[j].regulationChapterId
                                }
                                if ( charpt == that.legalTypes[i].id) {
                                    contentData[j].id = that.legalTypes[i].id
                                    contentData[j].parentId = that.legalTypes[i].parentId
                                    contentData[j].name = that.legalTypes[i].name
                                    param.push(JSON.parse(JSON.stringify(contentData[j])))
                                }

                            }
                            if (param.length==0) {
                                param.push({name:that.legalTypes[i].name,id : that.legalTypes[i].id,parentId : that.legalTypes[i].parentId})
                            }
                           _.each(param,function(item){
                           item.cloudFiles =  _.sortBy(item.cloudFiles, function(o) { return parseInt(o.orderNo)  });
                           }) 
                          
                            that.contentData.push(param)
                        }
                        that.$nextTick(function () {
                            var height = 0
                            var observerConfig = {
                                root: document.getElementById('selectScroll'),
                                rootMargin: '5px',
                                threshold: [0],
                              }
                            var observer = new IntersectionObserver(function(changes)  {
                                // changes: 目标元素集合
                                changes.forEach(function(change) {
                                  // intersectionRatio
                                  
                                  if (change.intersectionRatio  > 0 && change.intersectionRatio <= 1) {
                                    var img = change.target
                                    img.src = img.dataset.src
                                    observer.unobserve(img)
                                  }
                                })
                              },observerConfig)
                              
                            $('.getScroll').each(function (index, item) {
                                    var $imgs =   $(item).find("img")
                                    _.each($imgs,function($img){
                                        observer.observe($img)
                                    })
                                })
                            if (that.$route.query.chapterId) {
                            $('.getScroll').each(function (index, item) {

                                if (that.legalTypes[index].id == that.$route.query.chapterId) {
                                    that.treeSelectData = that.legalTypes.slice(index, index + 1);
                                    return false
                                }
                                height += $(item).height()
                            })
                            $('#selectScroll').scrollTop(height)}
                        })
                    })

                    that.$nextTick(function () {
                        LIB.globalLoader.hide()
                        if (that.legalTypes) {

                            that.treeSelectData = that.legalTypes.slice(0, 1);

                        }
                      
                    })

                })
            }
        },
        init: function () {
            if (this.$route.query.lawsId) {
                this.$api = api
            }else if(this.$route.query.standardId){
                this.$api = sapi
            }else if(this.$route.query.regulationId){
                this.$api =rapi
            }
            
        },
        ready: function () {
            if (this.$route.query.lawsId) {
                this.initDatas(this.$route.query.lawsId)
            }else if(this.$route.query.standardId){
                this.initDatas(this.$route.query.standardId)
            }else if(this.$route.query.regulationId){
                this.initDatas(this.$route.query.regulationId)
            }

        },
        events: {

        }
    });

    return vm;
});