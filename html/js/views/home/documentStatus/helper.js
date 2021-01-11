define(function () {

    var getFileIconHtml = function (ext) {
        var extensions = {
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

        var icon =  prefix + (extensions[ext] || "file_cloud");

        return '<span style="font-size: 18px;margin-right: 5px;"><svg class="o-doc-icon" aria-hidden="true"><use xlink:href="' + icon + '"></use></svg></span>'
    };

    return {
        getFileIconHtml: getFileIconHtml
    };
});