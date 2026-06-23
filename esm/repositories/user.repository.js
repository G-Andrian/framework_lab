import { Item } from '../db/models/item.model.js';

export const init = async () => {
};

export const findAll = async () => {
  const docs = await Item.find().lean();

  return docs.map(doc => ({
    ...doc,
    id: doc._id.toString()
  }));
};

export const findById = async (id) => {
  const doc = await Item.findById(id).lean();

  if (!doc) {
    return null;
  }

  return {
    ...doc,
    id: doc._id.toString()
  };
};

export const create = async (userData) => {
  const doc = await Item.create(userData);

  return {
    ...doc.toObject(),
    id: doc._id.toString()
  };
};

export const update = async (id, userData) => {
  const doc =
    await Item.findByIdAndUpdate(
      id,
      { $set: userData },
      { new: true }
    ).lean();

  if (!doc) {
    return null;
  }

  return {
    ...doc,
    id: doc._id.toString()
  };
};

export const remove = async (id) => {
  const doc =
    await Item.findByIdAndDelete(id);

  return !!doc;
};

export const setImage = async (
  id,
  imagePath
) => {
  const doc =
    await Item.findByIdAndUpdate(
      id,
      { image: imagePath },
      { new: true }
    ).lean();

  if (!doc) {
    return null;
  }

  return {
    ...doc,
    id: doc._id.toString()
  };
};