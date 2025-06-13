const formulario = document.getElementById("formCadMercadoria");

if(localStorage.getItem("id")===null){
    localStorage.setItem("id","0");
}

formulario.onsubmit=calcularAliquota;

function calcularAliquota(evento){
    if(formulario.checkValidity()){
        const nome = document.getElementById("pais").value;
        const mercadoria = document.getElementById("mercadoria").value;
        const exportacao = document.getElementById("exportacoes").value;
        const importacao = document.getElementById("importacoes").value;
        const aliquota = (parseFloat(exportacao)-parseFloat(importacao))/parseFloat(importacao);
        var tarifa = aliquota/2;
        if(tarifa>=0){
            tarifa=10;
        } else {
            tarifa=(-1)*100*tarifa;
        }
        pais = {
            pais:nome,
            mercadoria:mercadoria,
            tarifa:tarifa
        }
        var flag=false;
        var id = localStorage.getItem("id");
        for(var i=1; i <= parseInt(id) && !flag;i++){
            if(JSON.parse(localStorage.getItem(i)).pais==nome || JSON.parse(localStorage.getItem(i)).mercadoria==mercadoria)
                flag=true;
        }
        if(!flag){
            id=parseInt(id)+1;
            localStorage.setItem(id,JSON.stringify(pais));
            localStorage.setItem("id",id);
        } else {
            alert("País ou mercadoria já cadastrada")
        }
        formulario.reset();
        mostrarTabela();
    } else {
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); 
    evento.stopPropagation();
}

function mostrarTabela(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML="";
    const id = localStorage.getItem("id");
    if(id=="0"){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há paises e mercadorias cadastradas</p>";
    }else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";
        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>País</th>
                <th>Mercadoria</th>
                <th>Tarifa</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=1; i <= parseInt(id); i++){
            const linha = document.createElement('tr');
            linha.id=i;
            const dados=JSON.parse(localStorage.getItem(i));
            linha.innerHTML=`
                <td>${dados.pais}</td>
                <td>${dados.mercadoria}</td>
                <td>${parseFloat(dados.tarifa).toFixed(2)}%</td>
                <td><button type="button" class="btn btn-danger" onclick="excluir('${i}')"><i class="bi bi-trash"></i></button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluir(i){
    localStorage.removeItem(i);
    var id = localStorage.getItem("id");
    id=parseInt(id)-1;
    localStorage.setItem("id",id);
    mostrarTabela();
}

mostrarTabela();