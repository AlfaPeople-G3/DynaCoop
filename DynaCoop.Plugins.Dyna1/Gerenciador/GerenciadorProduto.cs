using DynaCoop.Plugins.Dyna1.Utilidades;
using DynaCoop.Plugins.Dyna1.Repositorio;
using Microsoft.Xrm.Sdk;

namespace DynaCoop.Plugins.Dyna1.Gerenciador
{
    public class GerenciadorProduto
    {
        public GerenciadorProduto() { }

        public void CopiarProduto(IOrganizationService serviceDyna1, Entity target)
        {
            IOrganizationService serviceDyna2 = ConexaoDyna2.GetService();
            Entity produto = ProdutoRepositorio.ValidarGrupoUnidade(serviceDyna1, serviceDyna2, target);
            produto = ProdutoRepositorio.ValidarUnidade(serviceDyna1, serviceDyna2, produto);
            produto = ProdutoRepositorio.ValidarAssunto(serviceDyna1, serviceDyna2, produto);
            produto["new_bloquearcriacao"] = false; // valor do Não
            serviceDyna2.Create(produto);
        }
    }
}
