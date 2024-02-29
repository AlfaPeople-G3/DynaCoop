if (typeof Logistics === "undefined") Logistics = {};
if (typeof Logistics.Util === "undefined") Logistics.Util = {};

Logistics.Util = {
  Alerta: function (titulo, descricao, larguraContainer, alturaContainer) {
    let confText = {
      confirmButtonLabel: "OK",
      title: titulo,
      text: descricao,
    };
    let confView = {
      height: larguraContainer,
      width: alturaContainer,
    };
    Xrm.Navigation.openAlertDialog(confText, confView);
  },
  LimpaCampos: function (context, campos) {
    let formContext = context.getFormContext();
    campos.forEach(function (campo) {
      formContext.getAttribute(campo).setValue(null);
    });
  },
  HabilitaCampos: function (context, campos) {
    let formContext = context.getFormContext();
    campos.forEach(function (campo) {
      formContext.getControl(campo).setDisabled(false);
    });
  },
  DesabilitaCampos: function (context, campos) {
    let formContext = context.getFormContext();
    campos.forEach(function (campo) {
      formContext.getControl(campo).setDisabled(true);
    });
  },
 OcultarCampo : function (context, campo){
  const formContext =context.getFormContext();
  formContext.getControl(campo).setVisible(false);
  
 },
  MostrarCampos: function (context, campos) {
    let formContext = context.getFormContext();
    campos.forEach(function (campo) {
      formContext.getControl(campo).setVisible(true);
    });
  },
 
};
