using DynaCoop.Plugins.Dyna1.Utilidades;
using DynaCoop.Plugins.Dyna1.Repositorio;
using Microsoft.Xrm.Sdk;
using System.Linq;
using Microsoft.Xrm.Sdk.Query;
using System.Diagnostics;
using System;

namespace DynaCoop.Plugins.Dyna1.Gerenciador
{
    internal class GerenciadorOportunidade
    {
        public Entity CopiarOportuniade(IOrganizationService serviceDyna1, IOrganizationService serviceDyna2, Entity oportunidade)
        {
            var oportunidade2 = new Entity("opportunity");

            foreach (var field in oportunidade.Attributes)
            {
                if (field.Value != null)
                {
                    if (field.Value.GetType() == new EntityReference().GetType())
                    {
                        if (!Utils.CamposIgnorar().ToList().Contains(((EntityReference)field.Value).LogicalName) &&
                            field.Key != $"{((EntityReference)field.Value).LogicalName}id")
                        {                           
                            oportunidade2[field.Key] = OportunidadeRepositorio.VerificarEntidadesReferencia(field, serviceDyna1, serviceDyna2);
                        }
                    }
                    else
                    {
                        oportunidade2[field.Key] = field.Value;
                    }
                }
            }

            oportunidade2["new_integracao"] = true;

            return oportunidade2;
        }

        public string CriarIdentificador(IOrganizationService serviceDyna1, Entity oportunidade)
        {
            string newGuid;
            while (true)
            {
                newGuid = ToGenerateKey();
                QueryExpression queryExpression = new QueryExpression("opportunity");
                queryExpression.Criteria.AddCondition("alf_identificador", ConditionOperator.Equal, newGuid);
                EntityCollection opportunityCollection = serviceDyna1.RetrieveMultiple(queryExpression);

                if (opportunityCollection.Entities.Count() == 0)
                    break;
            }

            var opp = new Entity("opportunity");
            opp.Id = oportunidade.Id;
            opp["alf_identificador"] = newGuid;
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
