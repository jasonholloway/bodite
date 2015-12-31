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
using System.Collections.Generic;
using System.Linq;
using Nancy.TinyIoc;
using Nancy.Authentication.Token;
using Nancy.Routing;
using Nancy.Authentication.Basic;
using Bodite.Front.Modules;
using Bodite.Front.Services;
using System.IO;
using IdentityServer3.Core.Configuration;
using IdentityServer3.Core.Models;
using IdentityServer3.Core.Services.InMemory;
using System.Security.Claims;
using System.Threading.Tasks;

[assembly: OwinStartup(typeof(Bodite.Front.Root), "Init")]

namespace Bodite.Front
{   

    public class Root
    {
        Nancy.ViewEngines.Razor.IRazorConfiguration c = null; //here to pull asm into downstream projects...
        
        public void Init(IAppBuilder app) 
        {
            app.UseIdentityServer(new IdentityServerOptions() {
                Factory = new IdentityServerServiceFactory()                                
                                .UseInMemoryClients(Auth.Clients)
                                .UseInMemoryUsers(new List<InMemoryUser>())
                                .UseInMemoryScopes(Auth.Scopes),

                EnableWelcomePage = true
            });
            
            app.UseNancy(x => {
                x.Bootstrapper = new BoditeNancyBootstrapper2();
            });

        }
                
    }
       


    internal class BoditeNancyBootstrapper : StructureMapNancyBootstrapper, IRootPathProvider, INancyBootstrapper
    {
        protected override void ApplicationStartup(IContainer container, IPipelines pipelines)
        {
            pipelines.OnError += (c, e) => { throw e; };
            TokenAuthentication.Enable(pipelines, new TokenAuthenticationConfiguration(container.GetInstance<ITokenizer>()));
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
                x.For<ITokenizer>().Use(_ => new Tokenizer());                
            });
        }



        protected override void ConfigureRequestContainer(IContainer container, NancyContext context) {
            //base.ConfigureRequestContainer(container, context);
        }


        protected override IRootPathProvider RootPathProvider => this;

        public string GetRootPath() {
            return Environment.CurrentDirectory;
        }
    }



    internal class BoditeNancyBootstrapper2 : DefaultNancyBootstrapper, IRootPathProvider
    {
        public BoditeNancyBootstrapper2() {
            
        }

        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines) 
        {
            pipelines.OnError += (c, e) => { throw e; };
            TokenAuthentication.Enable(pipelines, new TokenAuthenticationConfiguration(container.Resolve<ITokenizer>()));
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
                

        protected override void ConfigureApplicationContainer(TinyIoCContainer x) {
            x.Register<NancyEngine>();
            x.Register<DefaultRouteResolver>();
            x.Register<DefaultRequestDispatcher>();

            x.Register<AuthModule>();
            
            x.Register<IUserValidator, UserValidator>();
            x.Register<ITokenizer, Tokenizer>();
            
            x.Register<IMyCouchClient>((c, p) => new MyCouchClient("http://localhost.:5984", "bbapp", null));
            x.Register<Products, Products>();
            x.Register<CouchListener, CouchListener>();
            x.Register<ProductSearch, ProductSearch>().AsSingleton();
            x.Register<ITokenizer>((c, p) => new Tokenizer());
        }
               


        protected override IRootPathProvider RootPathProvider => this;

        public string GetRootPath() {
            return Path.Combine(Environment.CurrentDirectory); //, "Views");
        }
               

    }




}
