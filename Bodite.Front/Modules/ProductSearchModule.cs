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
    public class ProductSearchModule : NancyModule
    {
        public ProductSearchModule(Lazy<ProductSearch> search) {
            
            Get[@"/search/productidsbyname/lv/{term}"] = p => Response.AsJson(search.Value.GetProductIDs((string)p.term));
                                   

        }
    }
}
