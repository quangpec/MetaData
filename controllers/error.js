exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn
  });
};
exports.get500 = (req, res, next) => {
  // chỗ nào em gọi cái này, cai này ko dùng nữa 
  res.status(500).render('500', {
    pageTitle: 'errors',
    path: '/500',
    isAuthenticated: req && req.session && req.session.isLoggedIn
  });
};
