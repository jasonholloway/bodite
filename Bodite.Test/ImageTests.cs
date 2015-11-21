using Bodite.Images;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace Bodite.Test
{
    [TestFixture]
    public class ImageTests
    {
        
        [Test]
        public void CropOnly() 
        {            
            var img = new Bitmap(90, 90);

            using(var g = Graphics.FromImage(img)) {
                var bWhite = new SolidBrush(Color.White);
                var bBlack = new SolidBrush(Color.Black);

                var unit = GraphicsUnit.Pixel;
                g.FillRectangle(bWhite, img.GetBounds(ref unit));
                g.FillRectangle(bBlack, new RectangleF(30, 30, 30, 30));
            }

            var cropSpec = new ImageCropper.Spec() {
                                    Image = img,
                                    ResizeRect = new RectangleF(0, 0, img.Width, img.Height),
                                    CropRect = new Rectangle(30, 30, 30, 30)
                                };


            var cropped = ImageCropper.Crop(cropSpec);


            Assert.That(cropped.Width, Is.EqualTo(cropSpec.CropRect.Width));
            Assert.That(cropped.Height, Is.EqualTo(cropSpec.CropRect.Height));
            

            var bmp = new Bitmap(cropped);

            var pixels = Enumerable.Range(0, bmp.Height)
                                .SelectMany(y => Enumerable.Range(0, bmp.Width)
                                        .Select(x => bmp.GetPixel(x, y)));
            
            Assert.That(pixels.All(p => p.ToArgb() == Color.Black.ToArgb()));
        }







        [Test]
        public void ProjectAndCrop() {
            
            var img = new Bitmap(90, 90);

            using(var g = Graphics.FromImage(img)) {
                var bWhite = new SolidBrush(Color.White);
                var bBlack = new SolidBrush(Color.Black);

                var unit = GraphicsUnit.Pixel;
                g.FillRectangle(bWhite, img.GetBounds(ref unit));
                g.FillRectangle(bBlack, new RectangleF(10, 10, 30, 30));
            }

            var cropSpec = new ImageCropper.Spec() {
                Image = img,
                ResizeRect = new RectangleF(0, 0, 45, 45),
                CropRect = new Rectangle(5, 5, 15, 15)
            };


            var cropped = ImageCropper.Crop(cropSpec);


            Assert.That(cropped.Width, Is.EqualTo(cropSpec.CropRect.Width));
            Assert.That(cropped.Height, Is.EqualTo(cropSpec.CropRect.Height));


            var bmp = new Bitmap(cropped);

            var pixels = Enumerable.Range(0, bmp.Height)
                                .SelectMany(y => Enumerable.Range(0, bmp.Width)
                                        .Select(x => bmp.GetPixel(x, y))).ToArray();

            Assert.That(pixels.All(p => p.ToArgb() == Color.Black.ToArgb()));

        }




    }
}
