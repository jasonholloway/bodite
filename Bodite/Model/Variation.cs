using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bodite.Model
{
    public class Variation
    {
        public Quality[] Qualities { get; private set; }

        public Variation(IEnumerable<Quality> qualities) {
            Qualities = qualities.ToArray();
        }
    }
}
