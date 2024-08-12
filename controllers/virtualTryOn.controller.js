exports.getvirtualTryOn = (req, res,next) => {
  
  res.render('virtualTryOn.ejs', {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin
  })
};