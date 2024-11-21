import * as bcrypt from 'bcrypt';

export default class Password {
  static hash(password: string) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }

  static async compare(body_password: string, db_password: string) {
    return await bcrypt.compare(body_password, db_password);
  }
}
