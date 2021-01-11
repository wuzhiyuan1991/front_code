define(function (require) {

    var LIB = require('lib');
    var tpl = require("text!./myImageView.html");

    var opts = {
        template: tpl,
        mixins : [LIB.VueMixin.dataDic],

        data: function () {
           return {}
        },
        props: {
          images: {
              type: Array,
              default: []
          }
        },
        computed: {
            imgStyle:function () {
                return "height:20px;width:auto;"
            },
            getName: function () {
                if(_.filter(this.images, function (item) {
                        return item.signature
                    }).length == 0){
                    return null;
                }
                var str = _.pluck(this.images, 'signature').join('，');
                return str;
            }
        },
        name:'my-image-view'
    };
    var component = LIB.Vue.extend(opts);
    return component;
});