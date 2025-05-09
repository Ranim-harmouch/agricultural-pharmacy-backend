
// import jwt from 'jsonwebtoken';

// // Basic authentication middleware
// // const authenticate = (req, res, next) => {
// //   try {
// //     const token = req.cookies.token;
// //     if (!token) return res.status(401).json({ message: 'No token provided' });

// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded; // Includes userId and role
// //     next();
// //   } catch (error) {
// //     return res.status(401).json({ message: 'Invalid token' });
// //   }
// // };


// const authenticate = (req, res, next) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'No token provided' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };


// // Authorization middleware for role checking
// const authorize = (roles = []) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     next();
//   };
// };

// export { authenticate, authorize };











import jwt from 'jsonwebtoken';

// Authentication Middleware (supports cookie or bearer token)
const authenticate = (req, res, next) => {
  try {
    let token = null;

    // 1. Check for token in cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. Check for Bearer token in Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 3. If no token found
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Authorization Middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export { authenticate, authorize };
