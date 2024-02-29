if (typeof Logistics === "undefined") Logistics = {};
if (typeof Logistics.Ordem === "undefined") Logistics.Ordem = {};

const formEnderecoEntrega = {
    cep: "shipto_postalcode",
    logradouro: "shipto_line1",
    numero: "alf_n_entrega",
    bairro: "shipto_line2",
    cidade: "shipto_city",
    estado: "shipto_stateorprovince",
};
const formEnderecoCobranca = {
    cep: "billto_postalcode",
    logradouro: "billto_line1",
    numero: "billto_line2",
    bairro: "billto_line3",
    cidade: "billto_city",
    estado: "billto_stateorprovince",
};

Logistics.Ordem = {
    OnChangeEnvio: function (context) {
        const formContext = context.getFormContext();
        let optRemeter = formContext.getAttribute("alf_enviarpara").getValue();
        if (optRemeter == 748910000) {
            //Endere�o enttrega
            MostrarCamposEnderecoEntrega(context, Object.values(formEnderecoEntrega));
            AdicionarObrigatoriedadeCamposEnderecoEntrega(
                context,
                Object.values(formEnderecoEntrega)
            );
        } else if (optRemeter == 748910001) {

            OcultarCamposEnderecoEntrega(context, Object.values(formEnderecoEntrega));

            removerObrigatoriedadeCamposEnderecoEntrega(
                context,
                Object.values(formEnderecoEntrega)
            );
        }
    },
    OnChangeCEPCobranca: function (context) {
        const formContext = context.getFormContext();
        let cep = formContext.getAttribute(formEnderecoCobranca.cep).getValue();
        if (cep === null || cep === "undefined") {
            Logistics.Util.Alerta(
                "Error",
                "Preencha  CEP para localizar o Endereço",
                250,
                250
            );
            limparCamposEndereco(context, Object.values(formEnderecoCobranca));
        }
        else if (!validarCEP(cep)) {
        Logistics.Util.Alerta("Error", "CEP Inválido", 250, 250);
        limparFormEndereco(context,Object.values(formEnderecoCobranca));
            //desabilitarCampos(context, Object.values(formEnderecoCobranca));
        }
        else {
            formContext.getAttribute(formEnderecoCobranca.cep).setValue(cep.replace(/\D/g, ""));
            buscarCEP(cep)
                .then(function (cepData) {
                    if (cepData.localidade) {


                        formContext.getAttribute(formEnderecoCobranca.logradouro).setValue(cepData.logradouro);
                        formContext.getAttribute(formEnderecoCobranca.bairro).setValue(cepData.bairro);
                        formContext.getAttribute(formEnderecoCobranca.cidade).setValue(cepData.localidade);
                        formContext.getAttribute(formEnderecoCobranca.estado).setValue(cepData.uf);
                    } else if (cepData.erro) {
                        Logistics.Util.Alerta("Error", "CEP não encontrado", 250, 250);
                        //desabilitarCampos(context, Object.values(formEnderecoCobranca));
                        limparFormEndereco(context);
                    }
                })
                .catch(function (error) {
                    Logistics.Util.Alerta(
                        "Erro interno",
                        "N�o foi possevel se conectar ao servidor- digite os campos manualmente",
                        250,
                        250
                    );
                    habilitarCampos(context, Object.values(formEndereco));

                });
        }
    },
    OnChangeCEPEntrega: function (context) {
        const formContext = context.getFormContext();
        let cep = formContext.getAttribute(formEnderecoEntrega.cep).getValue();

        if (cep === null || cep === "undefined") {
            Logistics.Util.Alerta(
                "Error",
                "Preencha  CEP para localizar o Endereço",
                250,
                250
            );
            limparCamposEndereco(context, Object.values(formEnderecoEntrega));
        } else if (!validarCEP(cep)) {
            Logistics.Util.Alerta("Error", "CEP Inv�lido", 250, 250);
            Logistics.Util.LimpaCampos(context, ["address1_postalcode"]);
            limparFormEndereco(context);
            desabilitarCampos(context, Object.values(formEndereco));
        } else {
            formContext.getAttribute(formEnderecoEntrega.cep).setValue(cep.replace(/\D/g, ""));
            buscarCEP(cep)
                .then(function (cepData) {
                    if (cepData.localidade) {


                        formContext.getAttribute(formEnderecoEntrega.logradouro).setValue(cepData.logradouro);
                        formContext.getAttribute(formEnderecoEntrega.bairro).setValue(cepData.bairro);
                        formContext.getAttribute(formEnderecoEntrega.cidade).setValue(cepData.localidade);
                        formContext.getAttribute(formEnderecoEntrega.estado).setValue(cepData.uf);
                    } else if (cepData.erro) {
                        Logistics.Util.Alerta("Error", "CEP n�o encontrado", 250, 250);
                        desabilitarCampos(context, Object.values(formEndereco));
                        limparFormEndereco(context);
                    }
                })
                .catch(function (error) {
                    Logistics.Util.Alerta(
                        "Erro interno",
                        "N�o foi poss�vel se conectar ao servidor- digite os campos manualmente",
                        250,
                        250
                    );
                    habilitarCampos(context, Object.values(formEndereco));

                });
        }
    },


};

function limparCamposEndereco(context, campos) {
    const formContext = context.getFormContext();
    campos.forEach(function (campo) {
        formContext.getAttribute(campo).setValue(null);
    });

}
function removerObrigatoriedadeCamposEnderecoEntrega(context, campos) {
    let formContext = context.getFormContext();
    campos.forEach(function (campo) {
        formContext.getAttribute(campo).setRequiredLevel("none");
    });
}
function OcultarCamposEnderecoEntrega(context, campos) {
    const formContext = context.getFormContext();
    campos.forEach(function (campo) {
        formContext.getControl(campo).setVisible(false);
    });
}
function MostrarCamposEnderecoEntrega(context, campos) {
    let formContext = context.getFormContext();
    campos.forEach(function (campo) {
        formContext.getControl(campo).setVisible(true);
    });
}
function AdicionarObrigatoriedadeCamposEnderecoEntrega(context, campos) {
    let formContext = context.getFormContext();
    campos.forEach(function (campo) {
        formContext.getAttribute(campo).setRequiredLevel("required");
    });
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
    for(let i =0 ; i< campos.length; i++){
        formContext.getAttribute(campos[i]).setValue(null);
    
    }
  }
  function desabilitarCampos(context, campos) {
    const formContext = context.getFormContext();
    campos.forEach(function (campo) {
      formContext.getControl(campo).setDisabled(true);
    });
  }

