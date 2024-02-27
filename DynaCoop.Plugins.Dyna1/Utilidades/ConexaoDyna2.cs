using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Tooling.Connector;

namespace DynaCoop.Plugins.Dyna1.Utilidades
{
    internal class ConexaoDyna2
    {
        public static IOrganizationService GetService()
        {
            string connectionString = @"AuthType=Office365;
                                      Url=https://org38937dd3.crm2.dynamics.com;
                                      Username=dneiva@AcademiadeTalentos24.onmicrosoft.com;
                                      Password=Neiva@231266";

            CrmServiceClient crmServiceClient = new CrmServiceClient(connectionString);
            return crmServiceClient.OrganizationWebProxyClient;
        }
    }
}
