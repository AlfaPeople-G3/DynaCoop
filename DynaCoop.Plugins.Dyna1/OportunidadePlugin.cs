using DynaCoop.Plugins.Dyna1.Utilidades;
using DynaCoop.Plugins.Dyna1.Gerenciador;
using Microsoft.Xrm.Sdk;
using System;

namespace DynaCoop.Plugins.Dyna1
{
    public class OportunidadePlugin : PluginImplement
    {
        public override void ExecutePlugin(IServiceProvider serviceProvider)
        {
            try 
            { 
                if (Context.MessageName == "Create")
                {
                    IOrganizationService serviceDyna2 = ConexaoDyna2.GetService();

                    var opportunity = (Entity)Context.InputParameters["Target"];
                    var gerenciador = new GerenciadorOportunidade();

                    var oportunidade2 = gerenciador.CopiarOportuniade(Service, serviceDyna2, opportunity);

                    serviceDyna2.Create(oportunidade2);
                }
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException($"{ex.InnerException?.Message ?? ex.Message} | {ex.StackTrace}", ex);
            }
        }
    }
}
