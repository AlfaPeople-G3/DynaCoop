if (typeof Logistics === "undefined") Logistics = {};
if (typeof Logistics.Contato === "undefined") Logistics.Contato = {};

const formEndereco = {
  logradouro: "address2_line1",
  numero: "address1_line2",
  bairro: "address2_line3",
  localidade: "address1_city",
  uf: "address3_line3",
  ddd: "alf_ddd",
  ibge: "alf_codigo_ibge",
  complemento: "alf_complemento",
};
Logistics.Contato = {
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
      limparFormEndereco(context);
    } else if (!validarCEP(cep)) {
      Logistics.Util.Alerta("Error", "CEP Inválido", 250, 250);
      Logistics.Util.LimpaCampos(context, ["address1_postalcode"]);
      limparFormEndereco(context);
      desabilitarCampos(context, Object.values(formEndereco));
    } else {
      formContext.getAttribute("address1_postalcode").setValue(cep.replace(/\D/g, ""));
      buscarCEP(cep)
        .then(function (cepData) {
          if (cepData.localidade) {
            atribuiDadosApiFormEndereco(cepData, context);
            habilitarCampos(context, [
              formEndereco.logradouro,
              formEndereco.bairro,
            ]);
          } else if (cepData.erro) {
            Logistics.Util.Alerta("Error", "CEP não encontrado", 250, 250);
            desabilitarCampos(context, Object.values(formEndereco));
            limparFormEndereco(context);
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
  OnChangeCPF: function (context) {
    let cpf = context.getFormContext().getAttribute("alf_cpf").getValue();
    if (cpf == null) {
      Logistics.Util.Alerta("Error", "Preencha o campo CPF", 250, 250);
    } else {
      if (validarCPF(cpf)) {
        cpf = formatarCPF(cpf);
        context.getFormContext().getAttribute("alf_cpf").setValue(cpf);
      } else {
        Logistics.Util.Alerta("Error", "CPF Inválido", 250, 250);
        context.getFormContext().getAttribute("alf_cpf").setValue(null);
      }
    }
  },
};
function limparFormEndereco(context) {
  const formContext = context.getFormContext();
  formContext.getAttribute(formEndereco.logradouro).setValue(null);
  formContext.getAttribute(formEndereco.bairro).setValue(null);
  formContext.getAttribute(formEndereco.localidade).setValue(null);
  formContext.getAttribute(formEndereco.uf).setValue(null);
  formContext.getAttribute(formEndereco.ibge).setValue(null);
  formContext.getAttribute(formEndereco.ddd).setValue(null);
  formContext.getAttribute(formEndereco.complemento).setValue(null);
  formContext.getAttribute(formEndereco.numero).setValue(null);
}
function habilitarCampos(context, campos) {
  const formContext = context.getFormContext();
  for (let i = 0; i < campos.length; i++) {
    formContext.getControl(campos[i]).setDisabled(false);
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

function atribuiDadosApiFormEndereco(response, context) {
  const formContext = context.getFormContext();
  formContext
    .getAttribute(formEndereco.logradouro)
    .setValue(response.logradouro);
  formContext.getAttribute(formEndereco.bairro).setValue(response.bairro);
  formContext
    .getAttribute(formEndereco.localidade)
    .setValue(response.localidade);
  formContext.getAttribute(formEndereco.uf).setValue(response.uf);
  formContext.getAttribute(formEndereco.ibge).setValue(response.ibge);
  formContext.getAttribute(formEndereco.ddd).setValue(response.ddd);
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
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;

  if (
    parseInt(cpf.charAt(9)) !== digitoVerificador1 ||
    parseInt(cpf.charAt(10)) !== digitoVerificador2
  ) {
    return false;
  }

  return true;
}

function formatarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, "");

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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
