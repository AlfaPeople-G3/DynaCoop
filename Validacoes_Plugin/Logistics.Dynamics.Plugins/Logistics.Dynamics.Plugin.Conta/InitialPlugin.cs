using Logistics.Dynamics.Plugin.Conta.Gerenciadores;
using Microsoft.Xrm.Sdk;
using System;

namespace Logistics.Dynamics.Plugin.Conta
{
    public class InitialPlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
            ITracingService trace = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            if (context.MessageName.ToLower() == "create" && context.PrimaryEntityName.ToLower() == "account")
            {
                Entity conta = context.InputParameters["Target"] as Entity;
                if (conta.Attributes.Contains("alf_cnpj")
                    && conta.GetAttributeValue<string>("alf_cnpj") != string.Empty)
                {
                    trace.Trace("Tem algo cnpj");
                    GerenciadoresConta gc = new GerenciadoresConta(service);
                    string cnpj = conta.GetAttributeValue<string>("alf_cnpj");
                    if (gc.CNPJExiste(cnpj))
                    {
                        throw new InvalidPluginExecutionException("CNPJ Já esta cadastrado: " + cnpj);
                    }

                }
                else
                {
                    throw new InvalidPluginExecutionException("CNPJ é obrigatório");
                }
            }
            else if (context.MessageName.ToLower() == "create" && context.PrimaryEntityName.ToLower() == "contact")
            {
               
                Entity contato = context.InputParameters["Target"] as Entity;
                if (contato.Attributes.Contains("alf_cpf") && contato.GetAttributeValue<string>("alf_cpf") != string.Empty)
                {
                  

                    GerenciadoresContato gc = new GerenciadoresContato(service);
                    string cpf = contato.GetAttributeValue<string>("alf_cpf");
                    if (gc.CPFExiste(cpf))
                    {
                       
                        throw new InvalidPluginExecutionException("Já existe cadastro com esse CPF " + cpf);

                    }
                   
                }
            }
        }
    }
}
