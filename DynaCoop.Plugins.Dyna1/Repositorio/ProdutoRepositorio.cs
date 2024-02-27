using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Linq;

namespace DynaCoop.Plugins.Repositorio
{
    public class ProdutoRepositorio
    {
        public static Entity ValidarGrupoUnidade(IOrganizationService serviceDyna1, IOrganizationService serviceDyna2, Entity produto)
        {
            Entity productReturn = produto;
            if (productReturn.Contains("defaultuomscheduleid"))
            {
                //Busca a entidade Grupo Unidade no ambiente Dynamics 1
                Guid idGrupoUnidade = productReturn.GetAttributeValue<EntityReference>("defaultuomscheduleid").Id;

                QueryExpression queryGrupoUnidade = new QueryExpression("uomschedule");
                queryGrupoUnidade.ColumnSet.AddColumns("name", "baseuomname");
                queryGrupoUnidade.Criteria.AddCondition("name", ConditionOperator.NotEqual, "Unidade Padrão");
                queryGrupoUnidade.Criteria.AddCondition("uomscheduleid", ConditionOperator.Equal, idGrupoUnidade);
                EntityCollection grupoUnid = serviceDyna1.RetrieveMultiple(queryGrupoUnidade);

                if (grupoUnid.Entities.Count > 0)
                {
                    Entity entidadeGrupo = grupoUnid.Entities.FirstOrDefault();
                    string nomeGrupoUnid = entidadeGrupo.GetAttributeValue<string>("name");

                    //Verifica pelo nome se o Grupo Unidade existe no ambiente Dynamics 2
                    EntityCollection gruposPorNome = ChamaQuery(serviceDyna2, "uomschedule", nomeGrupoUnid);
                    if (gruposPorNome.Entities.Count > 0)
                    {
                        Guid idGrupoPorNome = gruposPorNome.Entities.FirstOrDefault().Id;
                        productReturn["defaultuomscheduleid"] = new EntityReference("uomschedule", idGrupoPorNome);
                    }
                    else
                    {
                        Guid idNovoGrupo = serviceDyna2.Create(entidadeGrupo);
                        productReturn["defaultuomscheduleid"] = new EntityReference("uomschedule", idNovoGrupo);
                    }
                }
                else
                {
                    EntityCollection grupoPadrao = ChamaQuery(serviceDyna2, "uomschedule", "Unidade Padrão");
                    productReturn["defaultuomscheduleid"] = new EntityReference("uomschedule", grupoPadrao.Entities.FirstOrDefault().Id);
                }
            }
            return productReturn;
        }

        public static Entity ValidarUnidade(IOrganizationService serviceDyna1, IOrganizationService serviceDyna2, Entity produto)
        {
            Entity productReturn = produto;
            if (productReturn.Contains("defaultuomid"))
            {
                //Busca a entidade Unidade no ambiente Dynamics 1
                Guid idUnidade = productReturn.GetAttributeValue<EntityReference>("defaultuomid").Id;

                QueryExpression queryUnidade = new QueryExpression("uom");
                queryUnidade.ColumnSet.AddColumns("uomscheduleid", "quantity", "name");
                queryUnidade.Criteria.AddCondition("name", ConditionOperator.NotEqual, "Unidade Principal");
                queryUnidade.Criteria.AddCondition("uomid", ConditionOperator.Equal, idUnidade);
                EntityCollection unidades = serviceDyna1.RetrieveMultiple(queryUnidade);

                if (unidades.Entities.Count > 0)
                {
                    Entity entidadeUnidade = unidades.Entities.FirstOrDefault();
                    string nomeUnid = entidadeUnidade.GetAttributeValue<string>("name");

                    //Verifica pelo nome se a Unidade existe no ambiente Dynamics 2
                    EntityCollection unidPorNome = ChamaQuery(serviceDyna2, "uom", nomeUnid);
                    if (unidPorNome.Entities.Count > 0)
                    {
                        Guid idUnidPorNome = unidPorNome.Entities.FirstOrDefault().Id;
                        productReturn["defaultuomid"] = new EntityReference("uom", idUnidPorNome);
                    }
                    else
                    {
                        Guid idGrupo = productReturn.GetAttributeValue<EntityReference>("defaultuomscheduleid").Id;
                        entidadeUnidade["uomscheduleid"] = new EntityReference("uomschedule", idGrupo);
                        Guid idNovaUnidade = serviceDyna2.Create(entidadeUnidade);
                        productReturn["defaultuomid"] = new EntityReference("uom", idNovaUnidade);
                    }
                }
                else
                {
                    EntityCollection unidadePadrao = ChamaQuery(serviceDyna2, "uom", "Unidade Principal");
                    productReturn["defaultuomid"] = new EntityReference("uom", unidadePadrao.Entities.FirstOrDefault().Id);
                }
            }
            return productReturn;
        }

        public static Entity ValidarAssunto(IOrganizationService serviceDyna1, IOrganizationService serviceDyna2, Entity product)
        {
            Entity productReturn = product;
            if (productReturn.Contains("subjectid"))
            {
                //Busca a entidade Assunto no ambiente Dynamics 1
                Guid idAssunto = productReturn.GetAttributeValue<EntityReference>("subjectid").Id;

                QueryExpression queryAssunto = new QueryExpression("subject");
                queryAssunto.ColumnSet.AddColumns("title", "description");
                queryAssunto.Criteria.AddCondition("title", ConditionOperator.NotEqual, "Assunto Padrão");
                queryAssunto.Criteria.AddCondition("subjectid", ConditionOperator.Equal, idAssunto);
                EntityCollection assuntoDyna1 = serviceDyna1.RetrieveMultiple(queryAssunto);

                if (assuntoDyna1.Entities.Count > 0)
                {
                    //Verifica pelo titulo se o assunto existe no ambiente Dynamics 2
                    Entity assunto = assuntoDyna1.Entities.FirstOrDefault();

                    EntityCollection assuntoDyna2 = ChamaQuery(serviceDyna2, "subject", assunto.GetAttributeValue<string>("title"), "title");

                    if (assuntoDyna2.Entities.Count > 0)
                    {
                        Guid id = assuntoDyna2.Entities.FirstOrDefault().Id;
                        productReturn["subjectid"] = new EntityReference("subject", id);
                    }
                    else
                    {
                        Guid id = serviceDyna2.Create(assunto);
                        productReturn["subjectid"] = new EntityReference("subject", id);
                    }
                }
                else
                {
                    EntityCollection assuntoPadrao = ChamaQuery(serviceDyna2, "subject", "Assunto Padrão", "title");
                    productReturn["subjectid"] = new EntityReference("subject", assuntoPadrao.Entities.FirstOrDefault().Id);
                }
            }
            return productReturn;
        }

        public static EntityCollection ChamaQuery(IOrganizationService service, string entidade, string valor, string coluna = "name")
        {
            QueryExpression query = new QueryExpression(entidade);
            query.Criteria.AddCondition(coluna, ConditionOperator.Equal, valor);
            return service.RetrieveMultiple(query);
        }
    }
}
