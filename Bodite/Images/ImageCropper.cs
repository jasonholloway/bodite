using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;

namespace Bodite.Images
{

    internal static class ImageCropper
    {
       
        public static Image Crop(Spec spec) {
            
            var imgDest = new Bitmap(
                                spec.CropRect.Width, 
                                spec.CropRect.Height, 
                                PixelFormat.Format16bppRgb565);
            
            using(var g = Graphics.FromImage(imgDest)) {
                
                var backRatioX = (float)spec.Image.Width / spec.ResizeRect.Width;
                var backRatioY = (float)spec.Image.Height / spec.ResizeRect.Height;
                
                var srcRect = new RectangleF(
                                    backRatioX * spec.CropRect.Left,
                                    backRatioY * spec.CropRect.Top,
                                    backRatioX * spec.CropRect.Width,
                                    backRatioY * spec.CropRect.Height);
                
                var unit = GraphicsUnit.Pixel;

                g.DrawImage(
                        spec.Image,
                        imgDest.GetBounds(ref unit),
                        srcRect,
                        GraphicsUnit.Pixel);                
            }

            return imgDest;
        }



        internal class Spec
        {
            public Image Image { get; set; }
            
            public RectangleF ResizeRect { get; set; }
            public Rectangle CropRect { get; set; }            
        }







    }
}
