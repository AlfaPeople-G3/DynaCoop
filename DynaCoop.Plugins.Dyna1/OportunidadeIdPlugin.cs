using DynaCoop.Plugins.Dyna1.Utilidades;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Linq;

namespace DynaCoop.Plugins
{
    public class OportunidadeIdPlugin : PluginImplement
    {
        public override void ExecutePlugin(IServiceProvider serviceProvider)
        {
            if (Context.MessageName == "Create")
            {
                Entity opporunity = (Entity)Context.InputParameters["Target"];

                OpportunityManager(Service, opporunity);

                throw new InvalidPluginExecutionException($"finalizou a validacao com sucesso. {opporunity["opportunityid"]}");
            }
        }

        public void OpportunityManager(IOrganizationService service, Entity opportunity)
        {
            if (opportunity.Contains("alf_identificador"))
            {   
                var newGuid = ToGenerateKey();

                while (true)
                {
                    QueryExpression queryExpression = new QueryExpression("opportunity");
                    queryExpression.Criteria.AddCondition("alf_identificador", ConditionOperator.Equal, newGuid);
                    EntityCollection opportunityCollection = service.RetrieveMultiple(queryExpression);

                    if (opportunityCollection.Entities.Count() == 0)
                        break;
                }

                opportunity["alf_identificador"] = newGuid;
            }
            else
            {
                throw new InvalidPluginExecutionException("Campo do id não encontrado.");
            }
        }

        public string ToGenerateKey()
        {
            string firstKey = ToGenerateRandomKeyNumber(5);
            string secondKey = ToGenerateRandomKeyAlphanumeric(4);

            return $"OPP-{firstKey}-{secondKey}";
        }

        private string ToGenerateRandomKeyAlphanumeric(int length)
        {
            Random random = new Random();

            const string characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            char[] randomKey = new char[length];

            for (int i = 0; i < length; i++)
            {
                randomKey[i] = characters[random.Next(characters.Length)];
            }

            return new string(randomKey);
        }

        private string ToGenerateRandomKeyNumber(int length)
        {
            Random random = new Random();

            const string characters = "0123456789";
            char[] randomKey = new char[length];

            for (int i = 0; i < length; i++)
            {
                randomKey[i] = characters[random.Next(characters.Length)];
            }

            return new string(randomKey);
        }
    }
}
