exports.getContactus = (req, res,next) => {
  
  res.render('contactus.ejs', {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin
  })
};