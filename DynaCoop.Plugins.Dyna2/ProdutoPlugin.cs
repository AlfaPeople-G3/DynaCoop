using DynaCoop.Plugins.Dyna2.Utilidades;
using Microsoft.Xrm.Sdk;
using System;

namespace DynaCoop.Plugins.Dyna2
{
    public class ProdutoPlugin : PluginImplement
    {
        public override void ExecutePlugin(IServiceProvider serviceProvider)
        {
            if (Context.MessageName == "Create" &&
                Context.Stage == (int)EPluginStages.PreValidation &&
                Context.InputParameters.Contains("Target") &&
                    Context.InputParameters["Target"] is Entity)
            {
                var product = (Entity)Context.InputParameters["Target"]; // para converter e pegar a entidade

                if ((bool)product["new_bloquearcriacao"] == true)
                    throw new InvalidPluginExecutionException("Não é possivel criar produto no ambiente Dynamics 2, para criação de produtos utilize o ambiente Dynamics 1");
            }
        }
    }
}
