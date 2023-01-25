class Despesa{
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == null || this[i] == ''){
                return false
            }
        }
        return true
    }
}

class BD {
    constructor(){
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id',0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(valor){
        let id = this.getProximoId()
        localStorage.setItem(id,JSON.stringify(valor))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        let despesas = Array()
        let id = localStorage.getItem('id')
        for(let i = 1; i<=id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))
            if(despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa){
        let despesasFiltradas = new Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(p => p.ano == despesa.ano)
        }

        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(p => p.mes == despesa.mes)
        }

        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(p => p.dia == despesa.dia)
        }

        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(p => p.tipo == despesa.tipo)
        }

        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(p => p.descricao == despesa.descricao)
        }

        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(p => p.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }

}

let bd = new BD

function cadastrarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    if(despesa.validarDados()){
        bd.gravar(despesa)
        document.getElementById('h5-modal').innerHTML = 'Sucesso'
        document.getElementById('h5-modal').className = 'text-success'
        document.getElementById('div-modal').innerHTML = 'Dados gravados com sucesso'
        document.getElementById('btn-modal').textContent = 'Ok'
        document.getElementById('btn-modal').className = 'btn btn-success'
        $('#modal').modal('show')
        document.getElementById('ano').value = ''
        document.getElementById('mes').value = ''
        document.getElementById('dia').value = ''
        document.getElementById('tipo').value = ''
        document.getElementById('descricao').value = ''
        document.getElementById('valor').value = ''
    }else{
        document.getElementById('h5-modal').innerHTML = 'Erro na Gravação'
        document.getElementById('h5-modal').className = 'text-danger'
        document.getElementById('div-modal').innerHTML = 'Ainda existem campos não preenchidos na aplicação'
        document.getElementById('btn-modal').textContent = 'Preencher campos vazios'
        document.getElementById('btn-modal').className = 'btn btn-danger'
        $('#modal').modal('show')
    }
    
}


function carregaListaDespesas(despesas = Array()){
    
    if(despesas.length == 0){
        despesas = bd.recuperarTodosRegistros()
    }
    
    
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(p){
        let linha = listaDespesas.insertRow()
        linha.insertCell(0).innerHTML = `${p.dia}/${p.mes}/${p.ano}`
        linha.insertCell(1).innerHTML = p.tipo
        linha.insertCell(2).innerHTML = p.descricao
        linha.insertCell(3).innerHTML = p.valor

        let btn = document.createElement('button')
        btn.className = 'btn btn-outline-danger'
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
        btn.id = 'id_despesa_'+p.id
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_','')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}



function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = Array()
    despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas)

}