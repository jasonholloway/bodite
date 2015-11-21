using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace Bodite.Services
{
    public class ImageStore
    {
        
        public abstract class Token {
            public Uri Uri { get; protected set; }
            public string Key { get; protected set; }
        }


        class SimpleToken : Token
        {
            public SimpleToken(string key) {
                Key = key;
                Uri = null;
            }
        }





        static object _keySourceSync = new object();
        static int _nextKey = 1;
        static ConcurrentDictionary<string, Image> _dStore = new ConcurrentDictionary<string, Image>();



        //for now, just store in file...
        //next step would be to store in S3

        public Token Add(Image img) 
        {            
            string key;

            lock(_keySourceSync) {
                key = (_nextKey++).ToString();
            }

            _dStore[key] = img;

            return new SimpleToken(key);
        }



        public Image Retrieve(string key) {
            Image img;

            if(!_dStore.TryGetValue(key, out img)) {
                img = new Bitmap(20, 20);
            }

            return img;
        }
        


        



    }
}
