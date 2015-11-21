using Bodite.Model;
using MyCouch;
using MyCouch.Net;
using MyCouch.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Reactive.Subjects;
using System.Threading;
using System.Reactive.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Bodite.Services
{
    public class CouchListener : IDisposable
    {
        CancellationTokenSource _cancelSource = new CancellationTokenSource();



        object _t;


        public CouchListener(Func<IMyCouchClient> fnCouch) {
            var couch = fnCouch();

            var lastSeq = GetLastSeq(couch);

            var changes = couch.Changes.ObserveContinuous(
                                            new GetChangesRequest() {
                                                Heartbeat = 2000,   //should be higher!!!
                                                Feed = ChangesFeed.Continuous,
                                                Since = lastSeq.ToString(),
                                                IncludeDocs = true                                          
                                            },
                                            _cancelSource.Token);
                        

            ProductAdded = changes.Where(s => !string.IsNullOrWhiteSpace(s))
                                    .Select(json => {
                                        var jObj = JObject.Parse(json);
                                        
                                        var product = couch.DocumentSerializer.Deserialize<Product>(jObj["doc"].ToString());
                                        
                                        return product;
                                    });
            
            ProductChanged = changes.Where(s => false).Select(s => (Product)null);
        }






        static int GetLastSeq(IMyCouchClient couch) 
        {
            var result = couch.Connection.SendAsync(
                                        new HttpRequest(HttpMethod.Get, @"_changes?descending=true&limit=1")
                                        ).Result;

            if(result.IsSuccessStatusCode) {
                var json = result.Content.ReadAsStringAsync().Result;

                var resp = JsonConvert.DeserializeAnonymousType(json, new { last_seq = 0 });

                return resp.last_seq;
            }

            throw new InvalidOperationException("ERROR RETRIEVING LAST SEQ!");
        }


        public void Dispose() {
            _cancelSource.Cancel();
        }

        public IObservable<Product> ProductAdded { get; private set; }
        public IObservable<Product> ProductChanged { get; private set; }
        
    }
}
