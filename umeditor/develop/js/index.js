/*
 *author lina
 *date 17/6/21
 */

var editorCtr = $("#myEditor");
editorCtr.css({
    height:"385px"
});

$(".edui-container").on("click",".edui-toolbar .edui-btn-image",function(){
    var imgUpBox = $("#edui-dialog-image");
    imgUpBox.css({
        width:"500px",
        height:"400px"
    }).css({
        marginLeft:"0px"
    });
    $(".edui-modal-body").css({
        width:"500px",
        height:"320px"
    });
    $(".edui-image-content").css({
        height:"250px"
    });
    $(".edui-image-JimgSearch").css({
        height:"250px"
    });
    $(".edui-image-wrapper").css({
        height:"277px"
    });
    $(".edui-image-searchRes").css({
        height:"202px"
    });
    $(".edui-image-searchTxt").css({
        width:"360px"
    });
});
$(".edui-container").on("click",".edui-toolbar .edui-btn-video",function(){
    $("#edui-dialog-video").css({
        width:"500px"
    }).css({
        marginLeft:"0px"
    });
    $(".edui-dialog-video-body").css({
        width:"496px"
    }).css({
        height:"366px"
    }).css({
        overflow:"hidden"
    });
    $("#eduiVideoUrl").css({
        width:"377px"
    });
    $(".edui-video-wrapper").css({
        width:"487px"
    });
    $("#eduiVideoPreview").css({
        width:"332px"
    }).css({
        height:"270px"
    });
    $(".eduiVideoTabBodys").css({
        height:"325px"
    });
    $("#eduiVideoPanel").css({
        height:"330px"
    });
    $("#eduiVideoInfo").find("fieldset:last-child").css({
        marginBottom:"5px"
    });
    $(".edui-video-wrapper").css({
        marginBottom:"0px"
    }).css({
        height:"340px"
    });
    $("#eduiVideoTab").css({
        height:"340px"
    });
});
$(".edui-container").on("click",".edui-toolbar .edui-btn-emotion",function(){
    $(".edui-popup-emotion").css({
        left:"0px"
    });
    $(".edui-popup-caret").css({
        left:"320px"
    });
});

function getCookie(cookie_name){
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);   //索引的长度
  
    // 如果找到了索引，就代表cookie存在，
    // 反之，就说明不存在。
    if (cookie_pos != -1){
        // 把cookie_pos放在值的开始，只要给值加1即可。
        cookie_pos += cookie_name.length + 1;     
        var cookie_end = allcookies.indexOf(";", cookie_pos);
  
        if (cookie_end == -1)
        {
            cookie_end = allcookies.length;
        }
  
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));  
        return value;      
    }else{
    	return null;
    }
    
}
// 调用函数
var infocookie = getCookie("infocookie");
if(infocookie){
	infocookie = eval('('+infocookie+')');  //json转对象
	editorCtr.html(infocookie.editor);
}

var matchStr = [
    "acar",
    "cheok",
    "192.168.100.142",
    "192.168.100.34",
    "192.168.100.37",
    "192.168.100.177",
    "192.168.100.187",
    "192.168.100.87",
    "192.168.100.83",
    "192.168.100.162",
    "picChanged"
]
function clearImage(){
    var imgs = editorCtr.find("img");
    for(var i=0;i<imgs.length;i++){
        var img = imgs[i];
        var src = img.src;
        
        var isOut = true; //是否为外网图片,默认是外网的
        for(var j=0;j<matchStr.length;j++){
            var result = src.match(matchStr[j]);
            if(result){  //内网图片
                isOut = false; 
                break;
            }
        }

        if(isOut){
            src = "picChanged";
            img.src = src;
        }
    }
}

var cImg = setInterval(clearImage, 2000);
