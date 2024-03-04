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
                var opportunity = (Entity)Context.InputParameters["Target"]; // para converter e pegar a entidade

                if ((bool)opportunity["new_integracao"])
                    throw new InvalidPluginExecutionException("Não é possivel editar Oportunidades criadas via integração.");
            }
            else
            {
                throw new InvalidPluginExecutionException($"Ação:{Context.MessageName}");

            }
        }
    }
}
