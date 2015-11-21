using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bodite.Model
{
    public class Image
    {
        public int ID { get; private set; }
        public string LargeURL { get; private set; }
        public string MediumURL { get; private set; }
        public string SmallURL { get; private set; }
    }
}
