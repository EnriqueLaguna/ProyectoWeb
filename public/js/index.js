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
        $("#loginres").html("<b class='text-success'>Bienvenido</b>");
    },(err)=>{
        $("#loginres").html("<b class='text-danger'>"+err+"</b>");
        console.log("Err")
    });
}

function createUser() {
    let u=document.querySelectorAll("#createUserForm");
    sendHTTPRequest(APIURL+'/users',JSON.stringify({
        name:u[0][0].value,
        lastname:u[0][1].value,
        email:u[0][2].value,
        password:u[0][3].value,
        birthDay:u[0][5].value,
        sexo:u[0][6].checked?"M":"H",
        image:u[0][8].value.length>0?u[0][8].value:undefined
    }),"POST",(data)=>{
        document.getElementById("responseMSG").innerHTML='<div class="text-success">Registrado exitosamente.</div>';
        $("#registrerModal").modal("hide");
    },(err)=>{
        document.getElementById("responseMSG").innerHTML='<div class="text-danger">'+err+'</div>';
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    let butts=$(".nav-item");
    for(let i=0;i<4;i++)
        $(butts[i]).click(()=>{
            if(i==0){
                //$("iframe").height("109vh");
                $("iframe").css("overflow-y","auto");
            }else{
                //$("iframe").height("94vh");
                $("iframe").css("overflow-y","hidden");
            }
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
    $("#createUserBtn").on("click",(e)=>{
        e.preventDefault();
        createUser();
    })
    $('#registrerModal').on('show.bs.modal', function (e) {
        let us=document.getElementById("createUserForm");
        us.addEventListener('change',(a)=>{
            let u=document.querySelectorAll("#createUserForm");
            document.getElementById("createUserBtn").disabled=!($(u[0][0]).is(":valid")&&$(u[0][1]).is(":valid")&&$(u[0][2]).is(":valid")&&$(u[0][3]).is(":valid")&&(u[0][4].value===u[0][3].value)&&$(u[0][5]).is(":valid")&&(u[0][8].value.length==0||$(u[0][8]).is(":valid")));
        });
    });
});