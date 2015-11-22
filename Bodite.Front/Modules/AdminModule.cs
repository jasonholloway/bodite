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
        public AdminModule() {
            
            Get[@"/admin"] = p => View["Admin/Admin.cshtml"];
            
        }
    }
}
