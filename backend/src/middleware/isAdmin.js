const isAdmin = (req, res, next) => {
  if (
    req.user.role !== 'admin' && 
    req.user.role !== 'moderator' && 
    req.user.role !== 'creator'
  ) {
    return res.status(403).send({
      success: false,
      message: 'You are not allowed to perform this action. Please try to login as an admin'
    });
  }
  next();
}

export default isAdmin; 
