using Logistics.Dynamics.Plugin.Conta.Repositorios;
using Microsoft.Xrm.Sdk;

namespace Logistics.Dynamics.Plugin.Conta.Gerenciadores
{
    public class GerenciadoresConta
    {
        private readonly IOrganizationService _organizationService;

        public GerenciadoresConta(IOrganizationService organizationService)
        {
            _organizationService = organizationService;
        }

        public bool CNPJExiste(string cnpj)
        {
            return RepositorioConta.BuscarCNPJConta(cnpj, _organizationService).Entities.Count > 0;
        }
    }
}
