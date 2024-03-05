using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DynaCoop.Plugins.Dyna2.Repositorio;

namespace DynaCoop.Plugins.Dyna2.Utilidades
{
    internal class OpportunityManager
    {
        public string CriarIdentificador(IOrganizationService serviceDyna1, Entity oportunidade)
        {
            string newGuid;
            while (true)
            {
                newGuid = ToGenerateKey();
                QueryExpression queryExpression = new QueryExpression("opportunity");
                queryExpression.Criteria.AddCondition("new_identificador", ConditionOperator.Equal, newGuid);
                EntityCollection opportunityCollection = serviceDyna1.RetrieveMultiple(queryExpression);

                if (opportunityCollection.Entities.Count() == 0)
                    break;
            }

            var opp = new Entity("opportunity");
            opp.Id = oportunidade.Id;
            opp["new_identificador"] = newGuid;
            serviceDyna1.Update(opp);

            Trace.TraceInformation(newGuid);
            return newGuid;
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
                randomKey[i] = characters[random.Next(characters.Length - 1)];
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
                randomKey[i] = characters[random.Next(characters.Length - 1)];
            }

            return new string(randomKey);
        }
    }
}

