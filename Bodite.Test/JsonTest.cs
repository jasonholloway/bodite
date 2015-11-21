using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bodite.Test
{
    [TestFixture]
    class JsonTest
    {
        [Test]
        public void AnonFieldTest() {
            var json = "{ 'id': '123', 'name': 'Brian' }";
            
            var result = JsonConvert.DeserializeAnonymousType(json, new { id = "", name = "" });
            
            Assert.That(result.name, Is.EqualTo("Brian"));
            Assert.That(result.id, Is.EqualTo("123"));
        }

        [Test]
        public void AnonFieldWithUnderscoreTest() {
            var json = "{ '_id': '123', 'name': 'Brian' }";

            var result = JsonConvert.DeserializeAnonymousType(json, new { _id = "", name = "" });

            Assert.That(result.name, Is.EqualTo("Brian"));
            Assert.That(result._id, Is.EqualTo("123"));
        }

    }
}
