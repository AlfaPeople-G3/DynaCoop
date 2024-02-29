using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;

namespace Logistics.Dynamics.Plugin.Conta.Repositorios
{
    public static class RepositorioContato
    {
        public static EntityCollection BuscarCPFContato(string cpf, IOrganizationService organizationService)
        {
            QueryExpression query = new QueryExpression("contact")
            {
                ColumnSet = new ColumnSet(false),
                Criteria = new FilterExpression
                {
                    Conditions =
                    {
                        new ConditionExpression
                        {
                            AttributeName = "alf_cpf",
                            Operator = ConditionOperator.Equal,
                            Values = { cpf}
                        }
                    }
                }
            };
            try
            {
                return organizationService.RetrieveMultiple(query);
            }
            catch(Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message);
            }
           
        }
    }
}
