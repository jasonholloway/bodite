using Bodite.Model;
using MyCouch;
using MyCouch.Requests;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Bodite.Services
{   

    public class Products
    {
        Func<IMyCouchClient> _fnCouch;
        
        public Products(Func<IMyCouchClient> fnCouch) {
            _fnCouch = fnCouch;
        }
        

        public IEnumerable<Product> Get(params int[] categoryIDs)
        {
            using(var couch = _fnCouch()) {
                var query = new QueryViewRequest("bbapp", "products_by_category")
                                    .Configure(q => q.Keys(categoryIDs));
                
                var resp = couch.Views.QueryAsync<Product>(query).Result;
                return resp.Rows.Select(r => r.Value);
            }
        } 


        public IEnumerable<Product> GetAll() {
            using(var couch = _fnCouch()) {
                var query = new QueryViewRequest("bbapp", "all_products");

                var resp = couch.Views.QueryAsync<Product>(query).Result;

                return resp.Rows.Select(r => r.Value);
            }
        }


        public IEnumerable<Product> GetAllOnlyNames() {
            using(var couch = _fnCouch()) {
                var query = new QueryViewRequest("bbapp", "all_product_names");

                var resp = couch.Views.QueryAsync<Product>(query).Result;

                return resp.Rows.Select(r => r.Value);
            }
        }



    }
}
