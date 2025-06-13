const formulario = document.getElementById("formCadExportacao");

formulario.onsubmit=calcularValorExportacao;

if(localStorage.getItem("idExportacao")==null){
    localStorage.setItem("idExportacao",0);
}

function calcularValorExportacao(evento){
    if(formulario.checkValidity()){
    const pais = document.getElementById("pais").value;
    const data = document.getElementById("data").value;
    const mercadoria = document.getElementById("mercadoria").value;
    const quantidade = document.getElementById("quantidade").value;
    const valorMercadoria = document.getElementById("valorMercadoria").value;
    const id=localStorage.getItem("id");
    var flag=false;
    var idnoLocalStorage;
    for(var i=1;i<=parseInt(id) && !flag;i++){
        if(JSON.parse(localStorage.getItem(i)).pais==pais && JSON.parse(localStorage.getItem(i)).mercadoria==mercadoria){
            idnoLocalStorage=i;
            flag=true;
        }
    }
    if(flag){
        const dados = JSON.parse(localStorage.getItem(idnoLocalStorage));
        const valorExportacao = parseFloat(quantidade)*parseFloat(valorMercadoria)*(1+(parseFloat(dados.tarifa)/100));
        var idExportacao = localStorage.getItem("idExportacao");
        idExportacao=parseInt(idExportacao)+1;
        const exportacao = {
            pais:pais,
            data:data,
            mercadoria:mercadoria,
            quantidade:quantidade,
            valorMercadoria:valorMercadoria,
            valorExportacao:valorExportacao
        }
        localStorage.setItem("Exportacao"+idExportacao,JSON.stringify(exportacao));
        localStorage.setItem("idExportacao",idExportacao);
        mostrarTabela(); 
    } else {
        alert("Pais ou mercadoria não cadastrada")
    }
    } else {
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); 
    evento.stopPropagation();
    mostrarTabela();
}

function mostrarTabela(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML="";
    const id = localStorage.getItem("idExportacao");
    if(id=="0"){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há exportações cadastradas</p>";
    }else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";
        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>País</th>
                <th>Data da Exportação</th>
                <th>Mercadoria</th>
                <th>Quantidade</th>
                <th>Valor da Mercadoria</th>
                <th>Valor da Exportação</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=1; i <= parseInt(id); i++){
            const linha = document.createElement('tr');
            linha.id=i;
            const dados=JSON.parse(localStorage.getItem("Exportacao"+i));
            linha.innerHTML=`
                <td>${dados.pais}</td>
                <td>${dados.data}</td>
                <td>${dados.mercadoria}</td>
                <td>${dados.quantidade}</td>
                <td>${dados.valorMercadoria}U$</td>
                <td>${parseFloat(dados.valorExportacao).toFixed(2)}U$</td>
                <td><button type="button" class="btn btn-danger" onclick="excluir('${i}')"><i class="bi bi-trash"></i></button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluir(i){
    localStorage.removeItem("Exportacao"+i);
    var id = localStorage.getItem("idExportacao");
    id=parseInt(id)-1;
    localStorage.setItem("idExportacao",id);
    mostrarTabela();
}

mostrarTabela();