using Nancy.Authentication.Basic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy.Security;
using System.Configuration;

namespace Bodite.Front.Services
{
    public class UserValidator : IUserValidator
    {
        string _adminUsername = ConfigurationManager.AppSettings["adminUsername"];
        string _adminPassword = ConfigurationManager.AppSettings["adminPassword"];
        
        public IUserIdentity Validate(string username, string password) 
        {        
            if(username == _adminUsername && password == _adminPassword) {
                return new UserIdentity(_adminUsername, new[] { "admin" });
            }

            return null;
        }


        class UserIdentity : IUserIdentity
        {
            public UserIdentity(string userName, IEnumerable<string> claims) {
                UserName = userName;
                Claims = claims.ToArray();
            }

            public string UserName { get; private set; }
            public IEnumerable<string> Claims { get; private set; }
        }

    }
}