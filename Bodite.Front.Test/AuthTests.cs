﻿using NUnit.Framework;
using Nancy.Testing;
using Nancy.Bootstrapper;
using System;
using Nancy;
using Nancy.Authentication.Token;
using NSubstitute;
using Nancy.Authentication.Basic;
using Nancy.Security;
using Bodite.Front.Modules;

namespace Bodite.Front.Test
{
    [TestFixture]
    public class AuthTests
    {
        Browser _browser;



        public AuthTests() {
            var userValidator = Substitute.For<IUserValidator>();
            userValidator.Validate(Arg.Is("Jason"), Arg.Any<string>())
                            .Returns(_ => {
                                var identity = Substitute.For<IUserIdentity>();
                                identity.UserName.Returns("Jason");
                                return identity;
                            });

            var tokenizer = Substitute.For<ITokenizer>();

            tokenizer.Tokenize(Arg.Any<IUserIdentity>(), Arg.Any<NancyContext>())
                            .Returns("12345");
            
            tokenizer.Detokenize(Arg.Is("12345"), Arg.Any<NancyContext>(), Arg.Any<IUserIdentityResolver>())
                        .Returns(_ => {
                            var identity = Substitute.For<IUserIdentity>();
                            identity.UserName.Returns("Jason");
                            return identity;
                        });


            _browser = new Browser(b => {
                b.Module<AuthModule>();
                
                b.ApplicationStartup((c, p) => {
                    c.Register(tokenizer);
                    c.Register(userValidator);
                });
            });
        }




        class AuthResponse
        {
            public string User;
            public string Token;
        }


        [Test]
        public void UsersCanLogIn() {
            var r = _browser.Post(
                            "/auth",
                            c => {
                                c.HttpRequest();
                                c.FormValue("User", "Jason");
                                c.FormValue("Password", "Blah");
                            });

            Assert.That(r.StatusCode, Is.EqualTo(HttpStatusCode.OK));

            var body = r.Body.DeserializeJson<AuthResponse>();

            Assert.That(body.User, Is.EqualTo("Jason"));
            Assert.That(body.Token, Is.EqualTo("12345"));
        }


        [Test]
        public void BadUsersCantLogIn() {
            var r = _browser.Post(
                            "/auth", 
                            c => {
                                c.HttpRequest();
                                c.FormValue("User", "ABadUser");
                                c.FormValue("Password", "Blah");
                            });

            Assert.That(r.StatusCode, Is.EqualTo(HttpStatusCode.Forbidden));
        }



        [Test]
        public void ApiKeysNotServedWithoutToken() {
            var r = _browser.Get(
                                "/auth/apikeys",
                                c => {
                                    c.HttpRequest();
                                });

            Assert.That(r.StatusCode, Is.EqualTo(HttpStatusCode.Unauthorized));
        }


        [Test]
        public void ApiKeysServedWithToken() {
            var r = _browser.Get(
                                "/auth/apikeys",
                                c => {
                                    c.HttpRequest();
                                    c.Header("Authorization", $"Token 12345");
                                });

            Assert.That(r.StatusCode, Is.EqualTo(HttpStatusCode.OK));

            //also test returned key values
            //...

            //NEED TO ENABLE TOKEN AUTH ON TEST BROWSER!!!

        }
        

    }
}