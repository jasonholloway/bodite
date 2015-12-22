using Nancy;
using Nancy.Authentication.Basic;
using Nancy.Authentication.Token;
using Nancy.Security;

namespace Bodite.Front.Modules
{
    public class AuthModule : NancyModule
    {
        public AuthModule(IUserValidator userValidator, ITokenizer tokenizer) : base("/auth") {
            
            Post[@"/"] = p => {
                var name = (string)this.Request.Form.User;
                var pass = (string)this.Request.Form.Password;
                
                var user = userValidator.Validate(name, pass);

                if(user != null) {
                    var token = tokenizer.Tokenize(user, Context);

                    return Response.AsJson(new {
                        token = token,
                        user = user.UserName
                    });
                }
                
                return HttpStatusCode.Forbidden;                
            }; 
                        
        }
    }
}
