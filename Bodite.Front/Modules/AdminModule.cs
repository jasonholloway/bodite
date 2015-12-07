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
    public class AdminModule : NancyModule
    {
        public AdminModule() : base("/admin") {
            
            Get[@"/"] = p => View["Admin/Admin.cshtml"];

            Post[@"/login"] = p => {
                return Response.AsJson(new {
                    key = "12345678",
                    user = "Jason"
                });
            }; 
                        
        }
    }
}
