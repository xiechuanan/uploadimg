//获取url参数
function getUrlParams(name, many, decode) {
    var r = window.location.search.substr(1).split('&'),
        ret = [],
        many = many ? many : false;
    for (var p in r) {
        var index = r[p].split('=');
        if (index[0] == name) {
            if (many) {
                decode ? ret.push(decodeURIComponent(index[1])) : ret.push(index[1]);
            } else {
                return decode ? decodeURIComponent(index[1]) : index[1];
            }
        }
    }
    return ret[0] ? ret : false;
}


$(document).ready(function() {
    var id_val      = getUrlParams('id_val');
    var aspectRatio = getUrlParams('aspectRatio');
    alert(aspectRatio);
    switch(aspectRatio)
    {
        case '1':
          aspectRatio = 16/9;
          break;
        case '2':
          aspectRatio = 4/3;
          break;
        case '3':
          aspectRatio = 1/1;
          break;
        case '4':
          aspectRatio = 2/3;
          break;
        case '5':
          aspectRatio = NaN;
          break;
        default:
          aspectRatio = 1/1;
    }
    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    'use strict';
    var console = window.console || {
        log: function() {}
    };
    var $image = $('#image');
    var $uploadimg = $('#uploadimg');
    var options = {
        viewMode: 2, // 初始化设置,设置模式
        aspectRatio: aspectRatio, // 设置裁剪比例 4/3,1/1,2/3,NaN 
        preview: '.img-preview' // 设置预览类
    };
    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();
    // Cropper
    $image.cropper(options); // 初始化配置

    // 方法
    $('.docs-buttons').on('click', '[data-method]', function() {
        var $this = $(this);
        var data = $this.data();
        var $target;
        var result;

        if ($this.prop('disabled') || $this.hasClass('disabled')) {
            return;
        }

        if ($image.data('cropper') && data.method) {
            data = $.extend({}, data); // Clone a new one

            if (typeof data.target !== 'undefined') {
                $target = $(data.target);

                if (typeof data.option === 'undefined') {
                    try {
                        data.option = JSON.parse($target.val());
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            }

            result = $image.cropper(data.method, data.option, data.secondOption);

            switch (data.method) {
                case 'getCroppedCanvas':
                    if ($image.attr('src') == '') {
                        alert("请选择图片文件。");
                        return;
                    }
                    if (result) {
                        $uploadimg.attr('href', result.toDataURL()); // base64
                        var base64Data = $uploadimg.attr('href');
                        // 处理ajax上传
                        ajaxUpload(base64Data);
                    }
                    break;
            }

            if ($.isPlainObject(result) && $target) {
                try {
                    $target.val(JSON.stringify(result));
                } catch (e) {
                    console.log(e.message);
                }
            }
        }
    });

    // ajax 上传图片
    function ajaxUpload(base64) {
        base64 = base64.replace(/\+/g, "%2B");
        $.ajax({
            type: "POST",
            url: "upload.php",
            data: "base64_url=" + base64,
            success: function(msg) {
                parent.$('#'+id_val).next().val(msg);
                parent.layer.msg('上传成功', {icon: 1});
                parent.layer.close(index);
            }
        });
    }

    // 键盘事件
    $(document.body).on('keydown', function(e) {

        if (!$image.data('cropper') || this.scrollTop > 300) {
            return;
        }

        switch (e.which) {
            case 37:
                e.preventDefault();
                $image.cropper('move', -1, 0);
                break;

            case 38:
                e.preventDefault();
                $image.cropper('move', 0, -1);
                break;

            case 39:
                e.preventDefault();
                $image.cropper('move', 1, 0);
                break;

            case 40:
                e.preventDefault();
                $image.cropper('move', 0, 1);
                break;
        }

    });


    // 选择图片
    var $inputImage = $('#inputImage');
    var URL = window.URL || window.webkitURL;
    var blobURL;

    if (URL) {
        $inputImage.change(function() {
            var files = this.files;
            var file;

            if (!$image.data('cropper')) {
                return;
            }

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function() {
                        // 当加载完成后撤销
                        URL.revokeObjectURL(blobURL);
                    }).cropper('reset').cropper('replace', blobURL);
                    $inputImage.val('');
                } else {
                    window.alert('请选择图片文件。');
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }

});
