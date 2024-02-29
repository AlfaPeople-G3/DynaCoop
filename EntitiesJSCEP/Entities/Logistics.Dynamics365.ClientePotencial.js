if(typeof(Logistics) ==="undefined") Logistics = {};
if(typeof(Logistics.ClientePotencial) === "undefined") Logistics.ClientePotencial = {};


const formEndereco = {
    cep : "address1_postalcode",
    logradouro :"address2_line1",
    numero : "address2_line2",
    complemento: "address1_line3",
    bairro : "address1_line2",
    cidade:  "address1_city",
    estado : "address2_stateorprovince",
    
   

};
Logistics.ClientePotencial = {

    OnChangeCEP :  function(context){
        const formContext = context.getFormContext();
        let cep = formContext.getAttribute(formEndereco.cep).getValue();
        if(cep == null || cep == "undefined"){
            Logistics.Util.Alerta("Error","Preencha  CEP para localizar o Endereço",250,250);
            limparFormEndereco(context,Object.values(formEndereco));
        }
        else if(!validarCEP(cep)){
            Logistics.Util.Alerta("Error","CEP Inválido",250,250);
            limparFormEndereco(context,Object.values(formEndereco));
        }
        else{
            formContext.getAttribute(formEndereco.cep).setValue(cep.replace(/\D/g, ""));
            buscarCEP(cep)
            .then(function(cepData){
                formContext.getAttribute(formEndereco.logradouro).setValue(cepData.logradouro);
                formContext.getAttribute(formEndereco.bairro).setValue(cepData.bairro);
                formContext.getAttribute(formEndereco.cidade).setValue(cepData.localidade);
                formContext.getAttribute(formEndereco.estado).setValue(cepData.uf);
                formContext.getAttribute(formEndereco.estado).setValue(cepData.uf);
            })
            .catch(function(error){
                Logistics.Util.Alerta("Error",error,250,250);
                limparFormEndereco(context,Object.values(formEndereco));
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