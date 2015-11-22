using Bodite.Images;
using Bodite.Services;
using Nancy;
using Nancy.Extensions;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Text.RegularExpressions;

namespace Bodite.Front.Modules
{

    public class ImageModule : NancyModule
    {
        public ImageModule(ImageStore imageStore) {


            Get[@"/images/{key}"] = p => 
            {
                var img = imageStore.Retrieve((string)p.key);
                
                return new Response() {
                    ContentType = "image/png",
                    Contents = s => img.Save(s, ImageFormat.Png)
                };
            };



            Post[@"/images"] = p => 
            {             
                var img = Image.FromStream(Request.Body, true);
                
                var storeToken = imageStore.Add(img);
                
                return Response.AsJson(new {
                    status = "success",
                    url = storeToken.Uri?.ToString() ?? $"images/{storeToken.Key}"
                });                
            };



            Post[@"/images/cropandstore"] = p => 
            {
                //var imgString = (string)Request.Form.imgUrl;


                //var matched = Regex.Match(imgString, @"data:.*?;base64,(.*)");

                //if(!matched.Success) { 
                //    throw new InvalidOperationException("Image Base64 string not in acceptable format!");
                //}

                //imgString = matched.Groups[1].Value; 

                //var imgData = Convert.FromBase64String(imgString);

                var h = Request.Headers["Content-Type"];


                using(var imgDataStream = Request.Body) // new MemoryStream(imgData)) 
                {
                    var img = Image.FromStream(imgDataStream, true);
                    
                    var spec = new ImageCropper.Spec() {
                                    Image = img,
                                    ResizeRect = new RectangleF(0, 0, (float)Request.Query["resizeWidth"], (float)Request.Query["resizeHeight"]),
                                    CropRect = new Rectangle(
                                                    (int)(float)Request.Query["cropX"],
                                                    (int)(float)Request.Query["cropY"], 
                                                    (int)(float)Request.Query["cropWidth"],
                                                    (int)(float)Request.Query["cropHeight"])
                                };

                    var cropped = ImageCropper.Crop(spec);
                    
                    var storeToken = imageStore.Add(cropped);
                                        

                    return Response.AsJson(new {
                                            status = "success",
                                            url = storeToken.Uri?.ToString() ?? $"images/{storeToken.Key}"
                                        });
                }
            };

        }
    }
}
