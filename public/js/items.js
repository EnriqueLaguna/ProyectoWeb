const APIURL = window.location.protocol+'//'+window.location.host+'/api';
let PAGES = {
    current : 0,
    currentIndex:0,
};
let PAGE_FILTER  = '';

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

function itemToHTML(item){
    return `
        <ul class="list-unstyled">
            <li class="media my-4">
            <img src="${item.ItemImage}" class="align-self-center mr-3" alt="...">
            <div class="media-body">
                <h4 class="mt-0 mb-1">${item.ItemName}</h4>
                <div class="media mt-4">
                <h5 class="mt-0">${item.Receta?'Receta:':'Sin receta'}</h5>
                <a class="mr-3" href="#">
                    <img src="${item.Receta}" style="visibility:${item.Receta?'visible':'hidden'};" class="mr-3" alt="Receta">
                </a>
                <h5 class="ml-2" style="visibility:${item.Durabilidad<0?'hidden':'visible'};">Durabilidad: ${item.Durabilidad}</h5>
                <div class="ml-4" style="text-align: right;width: 100%;">
                    <div class="mr-4">
                    <button type="button" class="btn btn-primary" id="btnActualizar" data-item='${JSON.stringify(item)}' data-toggle="modal" data-target="#updateItemModal"><i class="fas fa-edit"></i></button>
                    </div>
                    <div class="mr-4 mt-1">
                    <button type="button" class="btn btn-primary" id="btnBorrar" data-item="${item._id}" data-toggle="modal" data-target="#deleteItem"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                </div>
                <p><b>Descipción: </b>${item.Descripcion}</p>
            </div>
            </li>
        </ul>
            `;
}

function itemListToHTML(items){
    document.getElementById("lasWeas").innerHTML =  items.map(itemToHTML).join('');
}

function deleteItem(ele){
    let mail=ele.getAttribute('data-item');
    let url=`${APIURL}/items?id=${mail}`;
    $(".btn-danger").off();
    $(".btn-danger").on('click',function(a){
        sendHTTPRequest(url,"{}","DELETE",(data)=>{
            alert("Usuario eliminado");
            getItemsPage(PAGES.current,PAGE_FILTER);
        },(err)=>{
            alert(err);
        })
    });
}

function getItemsPage(page,filter){
    let url = APIURL+"/items?page="+page+"&limit=5"+(filter?`${filter}`:'');
    sendHTTPRequest(url,"{}","GET",(data)=>{
        let json=JSON.parse(data.data);
        itemListToHTML(json.items);
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

function createItem() {
    let i=document.querySelectorAll("#createItemForm");
    sendHTTPRequest(APIURL+'/items',JSON.stringify({
        ItemName:i[0][0].value,
        ItemImage:i[0][1].value,
        Receta:i[0][2].value,
        Descripcion:i[0][3].value,
        Durabilidad:i[0][4].value
    }),"POST",(data)=>{
        document.getElementById("responseMSG").innerHTML='<div class="text-success">Registrado exitosamente.</div>';
        $("#createItemModal").modal("hide");
        getItemsPage(PAGES.current,PAGE_FILTER);
    },(err)=>{
        document.getElementById("responseMSG").innerHTML='<div class="text-danger">'+err+'</div>';
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    getItemsPage(0,PAGE_FILTER);

    $("#serchserch").click((e)=>{
        if($(e.target).hasClass("page-link")){
            let awa=parseInt(e.target.innerHTML);
            PAGES.current=(isNaN(awa)?PAGES.current+(e.target.innerHTML.includes("Pre")?-1:1):awa-1);
            getItemsPage(PAGES.current,PAGE_FILTER);
        }
    });
    
    $("#createItemBtn").on("click",createItem);

    $("#serchBtn").click((e)=>{
        e.preventDefault();
        PAGE_FILTER=`&name=${document.getElementById('serch').value}`;
        getItemsPage(PAGES.current=0,PAGE_FILTER);
    })

    $('#deleteItem').on('show.bs.modal', function (e) {
        deleteItem(e.relatedTarget);
    });

    $("#createItemModal").on("shown.bs.modal",(e)=>{
        let datos=$("#createItemForm").children();
        for(let a of datos){
            $(a).children(1).val("");
        }
    });

    $("#updateItemModal").on("shown.bs.modal",(e)=>{
        let datos=JSON.parse(e.relatedTarget.getAttribute('data-item'));
        let inputs=$(".form-control");
        inputs[5].value=datos.ItemName;
        inputs[6].value=datos.ItemImage;
        inputs[7].value=datos.Receta;
        inputs[8].value=datos.Descripcion;
        inputs[9].value=datos.Durabilidad;
        $("#updateItemBtn").click(()=>{
            inputs=$(".form-control");
            let item={
                ItemName: inputs[5].value,
                ItemImage: inputs[6].value,
                Receta:inputs[7].value,
                Descripcion:inputs[8].value,
                Durabilidad:inputs[9].value,
                _id:datos._id,
                _rev:datos._rev
            }
            sendHTTPRequest(APIURL+"/items?id="+datos._id,JSON.stringify(item),"PUT",(data)=>{
                $("#updateItemModal").modal("hide");
                getItemsPage(PAGES.current,PAGE_FILTER);
            },(err)=>{
                alert(err);
            });
        });
    });
});
