using System;
using System.Collections.Generic;
using System.Linq;
using Nancy;
using Bodite.Services;
using Bodite.Front.ViewModel;
using Bodite.Model;
using Nancy.Responses.Negotiation;

namespace Bodite.Front.Modules
{
    public class DataModule : NancyModule
    {
        public DataModule() {
            
            Get[@"/data/products"] = p => 200;

            Get[@"/data/products/{id}"] = p => Response.AsJson(new Product() { ID = p.id });
            





        }
    }
}
