using System;
using System.Diagnostics;
using System.Linq;
using Bodite.Front;
using Microsoft.Owin.Hosting;

namespace Bodite.Host
{
    class Program
    {
        static void Main(string[] args)
        {
            var port = 12345;
            var url = $"http://localhost:{port}";
                        
            using(var a = WebApp.Start(url, x => new Root().Init(x))) 
            {
                Process.Start($"{url}/admin");

                Console.WriteLine($"HOSTING ON PORT {port}!!!");

                Console.ReadLine();
            }
        }
    }
}
