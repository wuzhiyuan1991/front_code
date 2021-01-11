define(function (require) {
    return {
        props: {
            model: {//模板
                type: Object,
                required: true,
            },
            permitModel: {//作业票提交模板
                type: Object,
                required: true,
            }
        },
        methods:{
            doStuffChange:function (key) {
                var vales=this.permitModel.selWorkStuffs[key];
                this.permitModel.tempWorkStuffs[key]=this[key].filter(function (item) {
                        return vales.indexOf(item.id)>-1;
                })
            },
            showSelUser:function (type,multi,index, jIndex) {
                this.$parent.selectUserInit(type,multi,index, jIndex);
            },
            doRemoveUser:function (index,type) {
               var user= this.permitModel.selworkPersonnels[type].splice(index,1)[0];
               //作业人员需去掉的时候联动资格证人员
                if(["4","5"].indexOf(type)>-1&&this.isSignRequired4SpecialWorke){
                    this.certificateList.forEach(function(certor){
                      var index=  _.findIndex(certor.ptwWorkPersonnels,function(item){
                          return item.personId==user.personId;
                      });
                      if(index>-1){
                          certor.ptwWorkPersonnels.splice(index,1);
                      }
                    })
                }
            }
        },
        events:{
            'changeTpl':function(tplModel){
                var _this=this;
                _this.changeTpl&&_this.changeTpl(tplModel);

            }
        }
    }
})