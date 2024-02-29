if (typeof (DynaCoop2) == "undefined") { DynaCoop2 = {} }
if (typeof (DynaCoop2.Opportunity) == "undefined") { DynaCoop2.Opportunity = {} }

var formContext;

DynaCoop2.Opportunity = {

    OnLoad: executionContext => {
        formContext = executionContext.getFormContext();

        let eIntegrado = formContext.getAttribute("new_integracao").getValue();

        if (eIntegrado) {
            //Percorre todos o campos da tela para desabilitar.
            formContext.data.entity.attributes.forEach(function (attr) {
                attr.controls.forEach(function (c) {
                    c.setDisabled(true);
                });
            });
        }
    }
}