using DynaCoop.Plugins.Dyna1.Utilidades;
using DynaCoop.Plugins.Dyna1.Repositorio;
using Microsoft.Xrm.Sdk;
using System.Linq;

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
    }
}
