using DynaCoop.Plugins.Dyna1.Gerenciador;
using DynaCoop.Plugins.Dyna1.Utilidades;
using Microsoft.Xrm.Sdk;
using System;

namespace DynaCoop.Plugins.Dyna1
{
    public class ProdutoPlugin : PluginImplement
    {
        public override void ExecutePlugin(IServiceProvider serviceProvider)
        {
            try
            {
                if (Context.MessageName == "Create" &&
                    Context.InputParameters.Contains("Target") &&
                    Context.InputParameters["Target"] is Entity)
                {
                    GerenciadorProduto gerenciadorProduto = new GerenciadorProduto();
                    gerenciadorProduto.CopiarProduto(Service, (Entity)Context.InputParameters["Target"]);
                }
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException($"{ex.InnerException?.Message ?? ex.Message} | {ex.StackTrace}", ex);
            }
        }
    }
}
