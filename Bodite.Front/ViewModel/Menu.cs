using System;
using System.Collections.Generic;
using System.Linq;

namespace Bodite.Front.ViewModel
{
    public class Menu
    {
        public IEnumerable<MenuItem> Roots { get; set; }
    }


    public class MenuItem
    {
        public string Title { get; set; }
        public string URL { get; set; }
        public IEnumerable<MenuItem> Children { get; set; }

        public bool IsActive { get; set; }
        public bool IsActiveAncestor { get; set; }
    }

}