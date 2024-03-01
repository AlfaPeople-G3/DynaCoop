if(typeof(Logistics) ==="undefined") Logistics = {};
if(typeof(Logistics.Fatura) === "undefined") Logistics.Fatura = {};


const formEnderecoCobranca = {
    cep : "billto_postalcode",
    logradouro :"billto_line1",
    numero : "billto_line2",
    bairro : "billto_line3",
    cidade:  "billto_city",
    estado : "billto_stateorprovince",
    pais : "billto_country"

};
const formEnderecoEntrega = {
    cep : "shipto_postalcode",
    logradouro :"shipto_line1",
    numero : "shipto_line2",
    complemento: "afp_complemento",
    bairro : "shipto_line3",
    cidade:  "shipto_city",
    estado : "shipto_stateorprovince",
    pais : "shipto_country"


};

Logistics.Fatura = {


    OnChangeRemeter : function(context){
        const formContext = context.getFormContext();
        let remeter = formContext.getAttribute("afp_enviarpara").getValue();

        //Endereço de cobrança
        if(remeter == 747150000){
            alert("Endereço Cobrança");
        } 
        else if(remeter ==747150001){
            alert("Definir local");
        }
        else if(remeter == 747150002){
            alert("retirar no local");
        }
       
    },
    OnChangeCepEntrega: function(context){
        const formContext = context.getFormContext();
        let cep = formContext.getAttribute(formEnderecoEntrega.cep).getValue();
        if(cep == null || cep == "undefined"){
            Logistics.Util.Alerta("Error","Preencha  CEP para localizar o Endereço",250,250);
            limparFormEndereco(context,Object.values(formEnderecoEntrega));
        }
        else if(!validarCEP(cep)){
            Logistics.Util.Alerta("Error","CEP Inválido",250,250);
            //limparFormEndereco(context,Object.values(formEnderecoEntrega));
        }
        else{
            formContext.getAttribute(formEnderecoEntrega.cep).setValue(cep.replace(/\D/g, ""));
            buscarCEP(cep)
            .then(function(cepData){
                if(cepData.localidade){
                   formContext.getAttribute(formEnderecoEntrega.logradouro).setValue(cepData.logradouro);  
                     formContext.getAttribute(formEnderecoEntrega.bairro).setValue(cepData.bairro);
                        formContext.getAttribute(formEnderecoEntrega.cidade).setValue(cepData.localidade);
                        formContext.getAttribute(formEnderecoEntrega.estado).setValue(cepData.uf);
                        //formContext.getAttribute(formEnderecoEntrega.pais).setValue("BR");
                }
                else if(cepData.erro){
                    Logistics.Util.Alerta("Error","CEP não encontrado",250,250);
                    limparFormEndereco(context,Object.values(formEnderecoEntrega));
                }
            })
            .catch(function(error){
                Logistics.Util.Alerta("Erro interno","Não foi possível se conectar ao servidor- digite os campos manualmente",250,250);
                habilitarCampos(context,Object.values(formEnderecoEntrega));
            });
        }
    },
    OnChangeCepCobranca: function(context){

        const formContext = context.getFormContext();
        let cep = formContext.getAttribute(formEnderecoCobranca.cep).getValue();

        if(cep == null || cep == "undefined"){
            Logistics.Util.Alerta("Error","Preencha  CEP para localizar o Endereço",250,250);
            limparFormEndereco(context,Object.values(formEnderecoCobranca));

        }
        else if(!validarCEP(cep)){
            Logistics.Util.Alerta("Error","CEP Inválido",250,250);
            formContext.getAttribute(formEnderecoCobranca.cep).setValue(null);
            formContext.getAttribute(formEnderecoCobranca.logradouro).setValue(null);
            formContext.getAttribute(formEnderecoCobranca.bairro).setValue(null);
            formContext.getAttribute(formEnderecoCobranca.cidade).setValue(null);
            formContext.getAttribute(formEnderecoCobranca.estado).setValue(null);
           // formContext.getAttribute(formEnderecoCobranca.pais).setValue(null);
        }
        else{
            formContext.getAttribute(formEnderecoCobranca.cep).setValue(cep.replace(/\D/g, ""));
            buscarCEP(cep)
            .then(function(cepData){
                if(cepData.localidade){
                   formContext.getAttribute(formEnderecoCobranca.logradouro).setValue(cepData.logradouro);  
                     formContext.getAttribute(formEnderecoCobranca.bairro).setValue(cepData.bairro);
                        formContext.getAttribute(formEnderecoCobranca.cidade).setValue(cepData.localidade);
                        formContext.getAttribute(formEnderecoCobranca.estado).setValue(cepData.uf);
                        //formContext.getAttribute(formEnderecoCobranca.pais).setValue("BR");
                }
                else if(cepData.erro){
                    Logistics.Util.Alerta("Error","CEP não encontrado",250,250);
                    limparFormEndereco(context,Object.values(formEnderecoCobranca));
                }
            })
            .catch(function(error){
                Logistics.Util.Alerta("Erro interno","Não foi possível se conectar ao servidor- digite os campos manualmente",250,250);
                habilitarCampos(context,Object.values(formEnderecoCobranca));
            });
        }
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
function limparFormEndereco(context,campos) {
    let formContext = context.getFormContext();
    campos.forEach(function (campo) {
        formContext.getAttribute(campo).setValue(null);
    });
  }
  function desabilitarCampos(context, campos) {
    const formContext = context.getFormContext();
    campos.forEach(function (campo) {
      formContext.getControl(campo).setDisabled(true);
    });
  }

  function habilitarCampos(context,campos){
    const formContext = context.getFormContext();
    campos.forEach(function(campo){
      formContext.getControl(campo).setDisabled(false);
    });
  }
