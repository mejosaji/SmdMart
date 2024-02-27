const { sign, verify} =require('jsonwebtoken');

const createTokens = (user)=>{
  console.log(user,'oooooooooooooooooooooooooooooo');
    const accessToken =  sign(
        { username: user.name,id: user._id},"jwtsecret"
        );
        


return accessToken;

};

const validateToken = (req, res, next) => {
const accessToken = req.cookies["access-token"]


if(!accessToken){

  
  res.redirect('/login')
}else{

    try{
      validToken = verify(accessToken,"jwtsecret")
      if(validToken){
        req.authenticated = true
        return next();
      }
    }catch(err){
     console.log(err);

     res.redirect('/login')    }
}
}

module.exports={createTokens, validateToken}