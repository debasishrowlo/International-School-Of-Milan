const userDataPermission = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      console.log("provided role is : ", role)
      console.log("userDataPermission fn returns user role : ", req.user.role)
      res.status(403).json({ message: "You are not allowed to acess this route!!!" });
     return; 
    }
    next()
  };
};

export default userDataPermission;
