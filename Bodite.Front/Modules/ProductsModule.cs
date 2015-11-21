using System;
using System.Collections.Generic;
using System.Linq;
using Nancy;
using Bodite.Services;
using Bodite.Front.ViewModel;

namespace Bodite.Front.Modules
{
    public class ProductsModule : NancyModule
    {
        public ProductsModule(Products products) {            

            Get[@"/"] = p => View[new HomePage() {
                                        Menu = new Menu() {
                                            Roots = new[] {
                                                new MenuItem() { Title = "Hello" },
                                                new MenuItem() { Title = "Jason" }
                                            }
                                        }}];

            Get[@"/categories/(?<catID>\d*)"] = p => View[new ProductGrid() {
                                                                Products = products.Get(p.catID)
                                                            }];
            



        }
    }
}
