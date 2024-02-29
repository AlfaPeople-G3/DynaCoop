if(typeof(Logistics) ==="undefined") Logistics = {};
if(typeof(Logistics.Conta) === "undefined") Logistics.Conta = {};


const formEndereco = {
    cep : "address1_postalcode",
    logradouro :"address1_line2",
    numero : "address2_line1",
    bairro: "address1_line3",
    cidade: "address1_city",
    uf : "address1_stateorprovince",
    ddd : "alf_ddd",
};

Logistics.Conta = {
    OnChangeCEP: function (context) {
        const formContext = context.getFormContext();
        let cep = formContext.getAttribute("address1_postalcode").getValue();
        
        if (cep === null || cep === "undefined") {
          Logistics.Util.Alerta(
            "Error",
            "Preencha  CEP para localizar o Endereço",
            250,
            250
          );
          //limparFormEndereco(context);
        } else if (!validarCEP(cep)) {
          Logistics.Util.Alerta("Error", "CEP Inválido", 250, 250);
          Logistics.Util.LimpaCampos(context, ["address1_postalcode"]);
           limparFormEndereco(context, Object.values(formEndereco));
        //   desabilitarCampos(context, Object.values(formEndereco));
        } else {
          formContext.getAttribute(formEndereco.cep).setValue(cep.replace(/\D/g, ""));
           buscarCEP(cep)
            .then(function (cepData) {
              if (cepData.localidade) {
              
               preencherCamposCEP(context,cepData);
                
              } else if (cepData.erro) {
                Logistics.Util.Alerta("Error", "CEP não encontrado", 250, 250);
                // desabilitarCampos(context, Object.values(formEndereco));
                // limparFormEndereco(context);
              }
            })
            .catch(function (error) {
              Logistics.Util.Alerta(
                "Erro interno",
                "Não foi possível se conectar ao servidor- digite os campos manualmente",
                250,
                250
              );
              habilitarCampos(context, Object.values(formEndereco));
    
            });
        }
      },
    OnNomeContaChanged: function(context){
        let nomeConta = context.getFormContext().getAttribute("name").getValue();
        if(nomeConta == null){
            Logistics.Util.Alerta("Error","Preencha o campo nome da conta", 250,250);
        }
        else{
           
            context.getFormContext().getAttribute("name").setValue(this.TextCamelCase(nomeConta)); 
        }

    },
   

    
    TextCamelCase : function(text){
      
            return text.replace(/\b\w/g, function(match){
                return match.toUpperCase();
            });
        
    },
    OnChangeCNPJ : function(context){
        const cnpj = context.getFormContext().getAttribute("alf_cnpj").getValue();
        if(cnpj == null){
            Logistics.Util.Alerta("Error","Preencha o campo CNPJ", 250,250);
        }
        else{
            if(this.ValidarCNPJ(cnpj)){
                context.getFormContext().getAttribute("alf_cnpj").setValue(this.formatarCNPJ(cnpj));
            }
            else{
                Logistics.Util.LimpaCampos(context, ["alf_cnpj"]);
                Logistics.Util.Alerta("Erro no CNPJ","CNPJ Inválido", 250,250);
            }
        }
       
    } ,
    ValidarCNPJ : function(cnpj){
        cnpj = cnpj.replace(/\D/g, '');

        if (cnpj.length !== 14) return false;
    
        // Verificação de dígitos verificadores
        var tamanho = cnpj.length - 2;
        var numeros = cnpj.substring(0, tamanho);
        var digitos = cnpj.substring(tamanho);
        var soma = 0;
        var pos = tamanho - 7;
    
        for (var i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
    
        var resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) return false;
    
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
    
        for (var i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
    
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(1)) return false;
    
        return true;
    },
    formatarCNPJ : function(cnpj){
        cnpj = cnpj.replace(/\D/g, '');

        // Insere os pontos e traço no CNPJ
        cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
        cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
        cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
    
        return cnpj;

    },
  
}
function limparFormEndereco (context,formEndereco) {
    const formContext = context.getFormContext();
    for(let i =0 ; i < formEndereco.length; i++){
      formContext.getAttribute(formEndereco[i]).setValue(null);
    }
   }
function buscarCEP(cep) {
    return new Promise(function (resolve, reject) {
      var req = new XMLHttpRequest();
      req.open("GET", "https://viacep.com.br/ws/" + cep + "/json/", true);
      req.setRequestHeader("Accept", "application/json");
      req.onreadystatechange = function () {
        if (this.readyState === 4) {
          req.onreadystatechange = null;
          if (this.status === 200) {
            var cepData = JSON.parse(this.response);
            resolve(cepData);
          } else {
            var error = JSON.parse(this.response).error;
            reject(error);
          }
        }
      };
      req.send();
    });
  }
   
  function validarCEP(cep) {
    var regex = /^[0-9]{8}$/;
  
    var numerosDoCEP = cep.replace(/\D/g, "");
  
    if (regex.test(numerosDoCEP)) {
      return true;
    } else {
      return false;
    }
  }
  function preencherCamposCEP(context,response){
    const formContext = context.getFormContext();
    formContext.getAttribute(formEndereco.logradouro).setValue(response.logradouro);
    formContext.getAttribute(formEndereco.bairro).setValue(response.bairro);
    formContext.getAttribute(formEndereco.cidade).setValue(response.localidade);
    formContext.getAttribute(formEndereco.uf).setValue(response.uf);
    formContext.getAttribute(formEndereco.ddd).setValue(response.ddd);
  }
