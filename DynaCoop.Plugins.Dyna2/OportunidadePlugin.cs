using DynaCoop.Plugins.Dyna2.Utilidades;
using Microsoft.Xrm.Sdk;
using System;

namespace DynaCoop.Plugins.Dyna2
{
    public class OportunidadePlugin : PluginImplement
    {
        public override void ExecutePlugin(IServiceProvider serviceProvider)
        {
            if (Context.MessageName == "Update" &&
                Context.InputParameters.Contains("Target") &&
                    Context.InputParameters["Target"] is Entity)
            {
                var product = (Entity)Context.InputParameters["Target"]; // para converter e pegar a entidade

                if ((bool)product["new_integracao"])
                    throw new InvalidPluginExecutionException("Não é possivel editar Oportunidades criadas via integração.");
            }
        }
    }
}
