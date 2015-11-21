using Microsoft.Owin;
using Owin;
using Nancy.Owin;
using Nancy.Bootstrappers.StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StructureMap;
using Nancy;
using Bodite.Services;

[assembly: OwinStartup(typeof(Bodite.Front.Root), "Init")]

namespace Bodite.Front
{
    public class Root
    {
        public void Init(IAppBuilder app) {            
            app.UseNancy(x => {
                x.Bootstrapper = new BoditeNancyBootstrapper();
            });
        }
    }




    class BoditeNancyBootstrapper : StructureMapNancyBootstrapper
    {
        protected override void ConfigureApplicationContainer(IContainer existingContainer) 
        {
            existingContainer.Configure(x => {
                x.For<Products>().Use<Products>();
                
            });

            base.ConfigureApplicationContainer(existingContainer);
        }

        protected override void ConfigureRequestContainer(IContainer container, NancyContext context) {
            base.ConfigureRequestContainer(container, context);
        }
    }


}
