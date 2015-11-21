using Bodite.Model;
using Lucene.Net.Analysis;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.QueryParsers;
using Lucene.Net.Search;
using Lucene.Net.Store;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Bodite.Services
{
    public class ProductSearch
    {
        const int _maxFieldLength = 32000;

        Directory _dir = new RAMDirectory();
        Analyzer _analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30);


        public ProductSearch(Products products, CouchListener listener) 
        {
            var allProducts = products.GetAllOnlyNames();
            AddProducts(allProducts);
            
            listener.ProductAdded.Subscribe(p => AddProduct(p));
            listener.ProductChanged.Subscribe(p => { });
        }
        
                


        IndexWriter GetIndexWriter() {
            return new IndexWriter(_dir, _analyzer, IndexWriter.MaxFieldLength.UNLIMITED);
        }






        void AddProduct(IndexWriter writer, Product prod) 
        {
            if(string.IsNullOrEmpty(prod.ID)) {
                throw new InvalidOperationException("Can't index product without ID!");
            }
            
            var doc = new Document();

            doc.Add(new Field("Name.LV", prod.Name.LV, Field.Store.YES, Field.Index.ANALYZED));
            doc.Add(new Field("Name.RU", prod.Name.RU ?? prod.Name.LV, Field.Store.YES, Field.Index.ANALYZED));
            doc.Add(new Field("ID", prod.ID, Field.Store.YES, Field.Index.NO));
            
            writer.AddDocument(doc);
        }

        
        public IEnumerable<Result> GetProductIDs(string term) 
        {
            if(string.IsNullOrWhiteSpace(term)) {
                return Enumerable.Empty<Result>();
            }

            using(var searcher = new IndexSearcher(_dir)) {
                var parser = new QueryParser(Lucene.Net.Util.Version.LUCENE_30, "Name.LV", _analyzer);
                                
                var query = parser.Parse(term);
                
                var foundDocs = searcher.Search(query, 50).ScoreDocs;

                return foundDocs.Select(s => {
                                            var doc = searcher.Doc(s.Doc);

                                            return new Result() {
                                                ID = doc.Get("ID"),
                                                Name = new LocaleString() {
                                                    LV = doc.Get("Name.LV"),
                                                    RU = doc.Get("Name.RU")
                                                }
                                            };
                                        }).ToArray();
            }
        }


        public void AddProduct(Product prod) {
            using(var writer = GetIndexWriter()) {
                AddProduct(writer, prod);

                writer.Optimize();
                writer.Flush(true, true, true);
            }
        }


        public void AddProducts(IEnumerable<Product> prods) {
            using(var writer = GetIndexWriter()) {
                foreach(var prod in prods) {
                    AddProduct(writer, prod);
                }

                writer.Optimize();
                writer.Flush(true, true, true);
            }
        }



        public void UpdateProduct() {
            throw new NotImplementedException();
        }

        public void DeleteProduct(string id) {
            throw new NotImplementedException();
        }







        public class Result
        {
            public string ID { get; set; }
            public LocaleString Name { get; set; }
        }



    }
}
