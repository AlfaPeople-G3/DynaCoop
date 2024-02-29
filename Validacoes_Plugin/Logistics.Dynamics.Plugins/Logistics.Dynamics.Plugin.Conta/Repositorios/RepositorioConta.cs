using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk;

namespace Logistics.Dynamics.Plugin.Conta.Repositorios
{
    public static class RepositorioConta
    {
        public static EntityCollection BuscarCNPJConta(string cnpj, IOrganizationService service)
        {
            QueryExpression query = new QueryExpression("account")
            {
                ColumnSet = new ColumnSet(false),
                Criteria = new FilterExpression
                {
                    Conditions =
                    {
                        new ConditionExpression
                        {
                            AttributeName = "alf_cnpj",
                            Operator = ConditionOperator.Equal,
                            Values = {cnpj}
                        }
                    }
                }
            };
            return service.RetrieveMultiple(query);

        }
    }
}
