const APIURL = window.location.protocol+'//'+window.location.host+'/api';

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

document.addEventListener("DOMContentLoaded",()=>{
    sendHTTPRequest(APIURL+"/users",{},"GET",(data)=>{
        let stuff=$("#detallesUsuario").children();
        let datos=JSON.parse(data.data);
        $("#imaGen").attr("src",datos.image?datos.image:"https://i.pinimg.com/originals/d5/4f/79/d54f79b4d5eae0aa47639c960dd891d1.jpg");
        $(stuff[0]).html("Usuario: "+datos.name+" "+datos.lastname);
        $(stuff[1]).html("Correo: "+datos.email);
        $(stuff[2]).html("Fecha: "+datos.birthDay);
        $(stuff[3]).html("Sexo: "+datos.sexo);
        $("#updateUserModal").on("shown.bs.modal",()=>{
            let bd=datos.birthDay.split("-");
            let inputs=$(".form-control");
            inputs[0].value=datos.name;
            inputs[1].value=datos.lastname;
            inputs[2].value=datos.email;
            inputs[3].value=datos.password;
            inputs[4].value=inputs[3].value;
            inputs[5].value=datos.birthDay;//new Date(bd[0],bd[1],bd[2]);
            inputs[6].value=datos.image;
            $("#sex1").attr("checked",datos.sexo=="M");
            $("#sex2").attr("checked",datos.sexo=="H");
            $("#updateUserBtn").click(()=>{
                inputs=$(".form-control");
                let ususer={
                    name: inputs[0].value,
                    lastname: inputs[1].value,
                    email:inputs[2].value,
                    password:inputs[3].value,
                    birthDay:inputs[5].value,
                    sexo:$("#sex1").attr("checked")?"M":"H",
                    image:inputs[6].value,
                    _id:datos._id,
                    _rev:datos._rev
                }
                sendHTTPRequest(APIURL+"/users/"+datos.email,JSON.stringify(ususer),"PUT",(data)=>{
                    $("#updateUserModal").modal("hide");
                },(err)=>{
                    
                });
            });
        });
        $("#deleteBtn").click(()=>{
            sendHTTPRequest(APIURL+"/users/"+datos.email,"{}","DELETE",(data)=>{alert("Has sido eliminado.");},(err)=>{});
        });
    },(err)=>{

    });
})