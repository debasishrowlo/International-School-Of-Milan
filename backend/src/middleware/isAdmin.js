const isAdmin = (req, res, next) => {

  if (req.role !== 'admin' && req.role !== 'moderator' && req.role !== 'creator') {
    console.log("This is req user", req.role)
    return res.status(403).send({
      success: false,
      message: 'You are not allowed to perform this action. Please try to login as an admin'
    });
  }
  next();
}

export default isAdmin; 
