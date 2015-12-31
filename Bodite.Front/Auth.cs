using IdentityServer3.Core.Models;
using IdentityServer3.Core.Services.InMemory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Bodite.Front
{
    static class Auth
    {

        public static readonly Scope[] Scopes = new[] {
            new Scope() {
                Name = "CouchWrite"
            },
            new Scope() {
                Name = "S3Write"
            },
        };



        public static readonly Client[] Clients = new[] {
            new Client() {
                ClientName = "BB Editor",

                ClientId = "bbedit",

                AllowedScopes = new List<string>(new[] {
                    "CouchWrite",
                    "S3Write"
                }),

                AccessTokenType = AccessTokenType.Jwt,

                Enabled = true,

                ClientSecrets = new List<Secret>(new[] {
                    new Secret("jerboa bites; crimson puddle".Sha256())
                }),

                Flow = Flows.ClientCredentials

            }
        };



        //public static readonly InMemoryUser[] Users = new[] {
        //    new InMemoryUser() {
        //        Username = "Jason",
        //        Password = "Hamsters",
        //        Claims = new[] {
        //            new ScopeClaim("CouchWrite")
        //        }
        //    }
        //}



    }
}