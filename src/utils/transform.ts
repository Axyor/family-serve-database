export interface MongoObject {
  _id?: { toString(): string };
  __v?: unknown;
  id?: string;
  members?: MongoObject[];
  numberOfPeople?: number;
  [key: string]: unknown;
}

export function transformWithId(ret: MongoObject): MongoObject {
  if (ret && ret._id) {
    const id = ret._id.toString();
    const rest = { ...ret };
    delete rest._id;
    delete rest.__v;
    ret = { ...rest, id };
  }
  if (ret && ret.members && Array.isArray(ret.members)) {
    ret.members = ret.members.map((member: MongoObject) => {
      if (!member || typeof member !== 'object' || !member._id) return member;
      const id = member._id.toString();
      const rest = { ...member };
      delete rest._id;
      delete rest.__v;
      return { ...rest, id };
    });
  }
  if (ret) {
    ret.numberOfPeople = ret.members ? ret.members.length : 0;
    delete ret.__v;
  }
  return ret;
}

export function memberTransform(ret: MongoObject): MongoObject {
  if (ret && ret._id) {
    const id = ret._id.toString();
    const rest = { ...ret };
    delete rest._id;
    delete rest.__v;
    ret = { ...rest, id };
  }
  if (ret) delete ret.__v;
  return ret;
}