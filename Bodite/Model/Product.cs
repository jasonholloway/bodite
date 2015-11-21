using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bodite.Model
{
    public class Product
    {
        public string ID { get; set; }

        public LocaleString Name { get; set; }

        public LocaleString Description { get; set; }

        public decimal UnitPrice { get; set; }

        public List<Quality> Variations { get; set; }

        public Image Image { get; set; }

        public List<Category> Categories { get; set; }

    }
}
