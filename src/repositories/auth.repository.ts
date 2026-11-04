import User from "../models/user.model.js";


//Check user exsits
const checkUserExists = async (email: string) => {
    const user = await User.findOne({
        where: {
            email
        }
    });
    return user;
}

//Register a new user
const registerUser = async (userData: any) => {
    const { id, name, email, role  } = await User.create(userData);
    const user = { id, name, email, role  };
    return user;
    
};

export default {
  checkUserExists,
  registerUser,
};