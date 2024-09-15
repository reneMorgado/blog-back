import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('User authenticated', decoded);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const checkAuthorized = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(200).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(200).json({ message: 'Invalid token' });
    }
}

const checkPermissions = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(200).json({ message: ['READ'] });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(200).json({ message: ['READ'] });
    }
};

export { checkAuth, checkPermissions, checkAuthorized };