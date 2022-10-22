exports.get404 = (req, res, next) => {
  res.status(404).json(
    {
      pageTitle: 'Page Not Found',
      path: '/404',
      isAuthenticated: req.session.isLoggedIn
    }

  );
};
exports.get500 = (req, res, next) => {
  // chỗ nào em gọi cái này, cai này ko dùng nữa 
  res.status(500).json(
     {
    pageTitle: 'errors',
    path: '/500',
    isAuthenticated: req && req.session && req.session.isLoggedIn
  });
};
