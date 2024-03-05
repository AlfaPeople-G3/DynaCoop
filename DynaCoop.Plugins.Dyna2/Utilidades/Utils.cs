namespace DynaCoop.Plugins.Dyna2.Utilidades
{
    public class Utils
    {
        public static string[] CamposIgnorar()
        {
            return new string[] { "systemuser", "organization", "team", "businessunit", "msdyn_predictivescore", "createdon", "createdby", "modifiedon", "modifiedby", "ownerid" };
        }

        public static string RetornaCamposEntidade(string logicalName)
        {
            switch (logicalName)
            {
                case "contact":
                    return "fullname";

                case "transactioncurrency":
                    return "currencycode";

                default:
                    return "name";
            }
        }

        public static string[] getEntityColumns(string entityName)
        {
            switch (entityName)
            {
                case "account":
                    return new string[] { "name", "telephone1", "fax", "websiteurl", "parentaccountid", "tickersymbol", "address1_line1", "defaultpricelevelid" };

                case "pricelevel":
                    return new string[] { "name", "begindate", "enddate", "transactioncurrencyid" };

                case "uom":
                    return new string[] { "name", "uomscheduleid", "quantity", "baseuom" };

                case "uomschedule":
                    return new string[] { "name", "description", "baseuomname" };

                case "contact":
                    return new string[] { "fullname", "firstname", "lastname", "jobtitle", "parentcustomerid", "emailaddress1", "telephone1", "mobilephone",
                                          "fax", "preferredcontactmethodcode", "address1_stateorprovince", "address1_city", "address1_country",
                                          "address1_postalcode", "address1_line1" };

                case "transactioncurrency":
                    return new string[] { "currencyname", "currencycode", "currencyprecision", "currencysymbol", "exchangerate" };

                case "opportunity":
                    return new string[] { "name", "parentcontactid", "parentaccountid", "purchasetimeframe", "transactioncurrencyid", "budgetamount",
                                          "purchaseprocess", "description", "msdyn_forecastcategory", "currentsituation", "customerneed", "proposedsolution" };

                default:
                    return new string[] { "name" };
            }
        }
    }
}
