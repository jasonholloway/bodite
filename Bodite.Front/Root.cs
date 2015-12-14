using Bodite.Services;
using Microsoft.Owin;
using MyCouch;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Bootstrappers.StructureMap;
using Nancy.Owin;
using Owin;
using StructureMap;
using System;
using Nancy.Conventions;

[assembly: OwinStartup(typeof(Bodite.Front.Root), "Init")]

namespace Bodite.Front
{
    public class Root
    {
        Nancy.ViewEngines.Razor.IRazorConfiguration c = null; //just here to pull in asm to downstream projects...


        public void Init(IAppBuilder app) {
            app.UseNancy(x => {
                x.Bootstrapper = new BoditeNancyBootstrapper();
            });
        }
                
    }




    class BoditeNancyBootstrapper : StructureMapNancyBootstrapper, IRootPathProvider
    {
        protected override void ApplicationStartup(IContainer container, IPipelines pipelines)
        {
            pipelines.OnError += (c, e) => { throw e; };
        }

        protected override void ConfigureConventions(NancyConventions nancyConventions) {
            nancyConventions.StaticContentsConventions.Clear();

            nancyConventions.MapStaticContent((_, dir) => {
#if DEBUG
                dir["/Scripts"] = @"C:\dev\csharp\bodite\Bodite.Front\Scripts";
                dir["/node_modules"] = @"C:\dev\csharp\bodite\Bodite.Front\node_modules";
                dir["/bower_modules"] = @"C:\dev\csharp\bodite\Bodite.Front\bower_modules";
#endif

                dir["/Content"] = @"C:\dev\csharp\bodite\Bodite.Front\Content";
            });
        }


        protected override void ConfigureApplicationContainer(IContainer existingContainer) 
        {
            existingContainer.Configure(x => {
                x.For<IMyCouchClient>().Use(() => new MyCouchClient("http://localhost.:5984", "bbapp", null));
                x.For<Products>().Use<Products>();
                x.For<CouchListener>().Use<CouchListener>();
                x.For<ProductSearch>().Use<ProductSearch>().Singleton();
            });
        }
        
        

        protected override IRootPathProvider RootPathProvider => this;

        public string GetRootPath() {
            return Environment.CurrentDirectory;
        }
    }


}
