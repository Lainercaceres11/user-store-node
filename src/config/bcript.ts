import bcrypt from "bcryptjs";

export const bcryptAadapter = {
  hash(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },

  compare(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  },
};
