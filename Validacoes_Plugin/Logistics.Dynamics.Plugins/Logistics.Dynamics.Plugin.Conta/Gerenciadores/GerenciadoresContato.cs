using Logistics.Dynamics.Plugin.Conta.Repositorios;
using Microsoft.Xrm.Sdk;

namespace Logistics.Dynamics.Plugin.Conta.Gerenciadores
{
    public class GerenciadoresContato
    {
        private readonly IOrganizationService _organizationService;

        public GerenciadoresContato(IOrganizationService organizationService)
        {
            _organizationService = organizationService;
        }
        public bool CPFExiste(string cpf)
        {
            return RepositorioContato.BuscarCPFContato(cpf, _organizationService).Entities.Count > 0;
        }
    }
}
