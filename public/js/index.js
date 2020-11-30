const doms=["home","tienda","items","abouts","usuarios"];
const APIURL = window.location.protocol+'//'+window.location.host+'/api';

let logged=false;
let butt;

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, authToken) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, urlAPI);
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (authToken)
        xhr.setRequestHeader('x-auth-user', authToken);
    xhr.send(data);
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201)
            cbError(xhr.status + ': ' + xhr.statusText);
        else
            cbOK({status: xhr.status,data: xhr.responseText});
    };
}

function login() {
    sendHTTPRequest(APIURL+'/login',JSON.stringify({email:document.getElementById("userInputLogin").value,password:document.getElementById("passwordInputLogin").value}),"POST",(data)=>{
        logged=true;
        $(butt).children().attr("data-toggle",(logged?"":"modal"));
        $("#loginModal").modal("hide");
    },(err)=>{
        console.log("Err")
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    let butts=$(".nav-item");
    for(let i=0;i<4;i++)
        $(butts[i]).click(()=>{
            if(i==0)
                $("iframe").height("109vh");
            else
                $("iframe").height("93.125vh");
            for(let b of butts)
                $(b).children().removeClass("active");
            $(butts[i]).children().addClass("active");
            $("iframe").attr("src",doms[i]+".html");
        });
    $("#passwordInputLogin").on("keypress",(e)=>{
        if(e.keyCode===13)login();
    });
    $('#loginBtn').on('click', login);
    butt=butts[4];
    $(butts[4]).on("click",(e)=>{
        $("iframe").height("93.125vh");
        if(logged){
            $("iframe").attr("src",doms[4]+".html");
            for(let b of butts)
                $(b).children().removeClass("active");
            $(butts[4]).children().addClass("active");
        }
    });
});