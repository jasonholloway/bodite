using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bodite.Model
{
    public class Category
    {
        public int ID { get; set; }
        public LocaleString Name { get; set; }
        public List<Category> Children { get; set; }
    }
}
