define(function(require)  {

    var Vue = require("vue");

    var template = '<span :style="style"><svg class="o-doc-icon" aria-hidden="true"><use :xlink:href="icon"></use></svg></span>';

    var exts = {
        folder: "folder",
        doc: "file_word",
        docx: "file_word",
        pdf: "file_pdf",
        xlsx: "file_excel",
        xls: "file_excel",
        ppt: "file_ppt",
        pptx: "file_ppt",
        png: "file_img",
        jpg: "file_img",
        jpeg: "file_img",
        gif: "file_img",
        zip: "file_zip",
        rar: "file_zip",
        txt: "file_txt",
        mp3: "file_music",
        mp4: "file_video",
        ai: "file_ai",
        psd: "file_psd",
        bt: "file_bt",
        ext: "file_exe",
        html: "file_html",
        iso: "file_iso",
        code: "file_code"
    };

    var prefix = "#icon-";
    var opts = {
        template :  template,
        props: {
            size: {
                type: String,
                default: '16'
            },
            right: {
                type: String,
                default: '10'
            },
            ext: {
                type: String,
                default: ''
            }
        },
        data : function() {
            return {}
        },
        computed: {
            style: function () {
                return {
                    fontSize: this.size + 'px',
                    marginRight: this.right + 'px'
                }
            },
            icon: function () {
                return prefix + (exts[this.ext] || "file_cloud");
            }
        }
    };

    var component = Vue.extend(opts);
    Vue.component('file-icon', component);
});