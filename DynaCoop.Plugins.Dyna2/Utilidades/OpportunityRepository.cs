using DynaCoop.Plugins.Dyna2.Utilidades;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DynaCoop.Plugins.Dyna2.Repositorio
{
    public class OpportunityRepository
    {
        public static EntityReference VerificarEntidadesReferencia(KeyValuePair<string, object> value, IOrganizationService serviceDyna1, IOrganizationService serviceDyna2)
        {
            var entityReference = (EntityReference)value.Value;

            var createdEntityId = CriarEntidadeReferencia(entityReference, serviceDyna1, serviceDyna2);
            return new EntityReference(entityReference.LogicalName, createdEntityId);
        }

        public static Guid CriarEntidadeReferencia(EntityReference entityReference, IOrganizationService serviceDyna1, IOrganizationService serviceDyna2)
        {
            var entity = serviceDyna1.Retrieve(entityReference.LogicalName, entityReference.Id, new ColumnSet(Utils.getEntityColumns(entityReference.LogicalName)));

            var entityExists = VerificarEntidadeExiste(entity, serviceDyna2);

            if (entityExists == Guid.Empty)
            {
                //Verfica se dentro da entidade se tem alguma entidade de referencia para fazer o cadasro.
                var novaEntidade2 = new Entity(entityReference.LogicalName);

                foreach (var field in entity.Attributes)
                {
                    if (field.Value != null)
                    {
                        if (field.Value.GetType() == new EntityReference().GetType())
                        {
                            if (!Utils.CamposIgnorar().ToList().Contains(((EntityReference)field.Value).LogicalName) && field.Key != $"{((EntityReference)field.Value).LogicalName}id")
                                novaEntidade2[field.Key] = VerificarEntidadesReferencia(field, serviceDyna1, serviceDyna2);
                        }
                        else
                        {
                            novaEntidade2[field.Key] = field.Value;
                        }
                    }
                }

                var guid = serviceDyna2.Create(novaEntidade2);

                return guid;
            }

            return entityExists;
        }

        public static Guid VerificarEntidadeExiste(Entity entity, IOrganizationService service)
        {
            var query = new QueryExpression(entity.LogicalName);
            query.Criteria.AddCondition(Utils.RetornaCamposEntidade(entity.LogicalName), ConditionOperator.Equal, entity[Utils.RetornaCamposEntidade(entity.LogicalName)]);

            var result = service.RetrieveMultiple(query).Entities;

            if (result.Count > 0)
                return result[0].Id;

            return default;
        }
    }
}
