using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nancy;
using Bodite.Services;

namespace Bodite.Front.Modules
{
    public class ProductsModule : NancyModule
    {
        public ProductsModule(Products products) {
            Get[@"/categories/(?<catID>\d*)"] = p => View["ProductGrid", products.Get(p.catID)];
            



        }
    }
}
