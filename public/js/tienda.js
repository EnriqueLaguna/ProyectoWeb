const APIURL = window.location.protocol+'//'+window.location.host+'/api';
let PAGES = {
    current : 0,
    currentIndex:0,
};

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

function tradeToHTML(trade){
    return `
        <div class="justify-content-center" style="width: 64%;margin-left: 18%;">
            <div id="Trade" class="row">
                <div style="width: 10%;text-align: center;margin-top: 1%;margin-bottom: 1%;">
                    <img src='${APIURL+'/items?name='+trade.NombreItem}'>
                </div>
                <div style="width: 10%;margin-left: 1%;text-align: center;margin-top: 1%;margin-bottom: 1%;">
                    <img src="/images/arrow.jpg"> 
                </div>
                <div style="width: 10%;margin-left: 1%;text-align: center;margin-top: 1%;margin-bottom: 1%;">
                    <img src="./images/eme.png"> 
                    <div style="background-color: darkorange;width: 50%;margin-left: auto;margin-right: auto;">${trade.Precio}</div>
                </div>
                <div style="width: 40%;margin-left: 1%;text-align: center;margin-top: 1%;margin-bottom: 1%;">
                    <button id="tradeComprar" data-trade='${trade._id}' onclick="buyTrade(this)" type="button" class="btn btn-success">Comprar a ${trade.NombreUsuario}</button>
                </div>
                <div style="width: 26%;margin-left: 1%;text-align: right;margin-top: 1%;margin-bottom: 1%;">
                    <div class="mr-4">
                        <button type="button" class="btn btn-info" style="margin-right: 5%;" data-toggle="modal" data-tarada='${JSON.stringify(trade)}' data-target="#createTradeModal"><i class="fas fa-edit"></i></button>
                    </div>
                    <div class="mr-4 mt-1">
                        <button type="button" class="btn btn-danger" style="margin-right: 5%;" data-toggle="modal" data-trade='${trade._id}' data-target="#eraseTradeModal"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>
            `;
}

function tradeListToHTML(trades){
    document.getElementById("lasWeas").innerHTML =  trades.map(tradeToHTML).join('');
}

function buyTrade(ele){
    let mail=ele.getAttribute('data-trade');
    let url=`${APIURL}/trades?id=${mail}`;
    sendHTTPRequest(url,"{}","DELETE",(data)=>{
        alert("Has comprado el intercambio de "+$(ele).html().split("Comprar a ").pop());
        getTradesPage(PAGES.current);
    },(err)=>{
        alert(err);
    });
}

function deleteTrade(ele){
    let mail=ele.getAttribute('data-trade');
    let url=`${APIURL}/trades?id=${mail}`;
    $(".btn-danger").off();
    $(".btn-danger").on('click',function(a){
        sendHTTPRequest(url,"{}","DELETE",(data)=>{
            alert("Intercambio eliminado");
            getTradesPage(PAGES.current);
        },(err)=>{
            alert(err);
        })
    });
}

function getTradesPage(page,filter){
    let url = APIURL+"/trades?page="+page+"&limit=5"+(filter?`${filter}`:'');
    sendHTTPRequest(url,"{}","GET",(data)=>{
        let json=JSON.parse(data.data);
        tradeListToHTML(json.trades);
        let pages={page:json.page,tp:json.totalPages};
        let paging=$(".page-link");
        for(let i=1;i<4;i++){
            paging[i].innerHTML=PAGES.current-1+i;
            let c=parseInt(paging[i].innerHTML);
            if(c<=0||c>pages.tp)
                $(paging[i]).hide();
            else
                $(paging[i]).show();
        }
        paging=$(".page-item");
        if(PAGES.current>0&&PAGES.current+1<pages.tp){
            $(paging[0]).toggleClass("disabled",false);
            $(paging[4]).toggleClass("disabled",false);
        }else{
            $(paging[0]).toggleClass("disabled",PAGES.current<=0);
            $(paging[4]).toggleClass("disabled",PAGES.current>=pages.tp-1);
        }
    },(err)=>{
        alert("Inicie sesión para continuar.");
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    getTradesPage(0);

    $("#serchserch").click((e)=>{
        if($(e.target).hasClass("page-link")){
            let awa=parseInt(e.target.innerHTML);
            PAGES.current=(isNaN(awa)?PAGES.current+(e.target.innerHTML.includes("Pre")?-1:1):awa-1);
            getTradesPage(PAGES.current);
        }
    });

    $('#eraseTradeModal').on('show.bs.modal', function (e) {
        deleteTrade(e.relatedTarget);
    });

    $("#createTradeModal").on("shown.bs.modal",(e)=>{
        let inputs=$(".form-control");
        document.getElementById("responseMSG").innerHTML="";
        if(e.relatedTarget.hasAttribute('data-tarada')){
            $("#exampleModalLabel").html("Editar intercambio");
            $("#createTradeBtn").html("Editar intercambio");
            let datos=JSON.parse(e.relatedTarget.getAttribute('data-tarada'));
            inputs[0].value=datos.NombreUsuario;
            inputs[1].value=datos.NombreItem;
            inputs[2].value=datos.Precio;
            $("#createTradeBtn").click(()=>{
                inputs=$(".form-control");
                let trade={
                    NombreUsuario: inputs[0].value,
                    NombreItem: inputs[1].value,
                    Precio:inputs[2].value,
                    Fecha:Date.now(),
                    _id:datos._id,
                    _rev:datos._rev
                }
                sendHTTPRequest(APIURL+"/trades?id="+datos._id,JSON.stringify(trade),"PUT",(data)=>{
                    $("#createTradeModal").modal("hide");
                    getTradesPage(PAGES.current);
                },(err)=>{
                    alert(err);
                });
            });
        }else{
            $("#exampleModalLabel").html("Crear intercambio");
            $("#createTradeBtn").html("Crear intercambio");
            inputs[0].value="";
            inputs[1].value="";
            inputs[2].value="";
            $("#createTradeBtn").on("click",()=>{
                sendHTTPRequest(APIURL+'/trades',JSON.stringify({
                    NombreUsuario: inputs[0].value,
                    NombreItem: inputs[1].value,
                    Precio:inputs[2].value,
                    Fecha:Date.now()
                }),"POST",(data)=>{
                    document.getElementById("responseMSG").innerHTML='<div class="text-success">Registrado exitosamente.</div>';
                    $("#createTradeModal").modal("hide");
                    getTradesPage(PAGES.current);
                },(err)=>{
                    document.getElementById("responseMSG").innerHTML='<div class="text-danger">'+err+'</div>';
                });
            });
        }
    });
});
