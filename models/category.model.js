const categoryDatabase = require('../schema/category.schema');

async function fetchCategories() {
  try {
    const categories = await categoryDatabase.find({});
    if (categories) {
      return { status: true, categories };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error finding categories: ${error.message}`);
  }
}

async function addCategory(name) {
  try {
    const isCategoryExist = await categoryDatabase.findOne({ name });
    if (isCategoryExist) {
      return { status: false, message: 'Category name already exist!' };
    }
    const category = new categoryDatabase({
      name: name,
      active: true,
    });
    const result = await category.save();
    if (result) {
      return { status: true, message: 'Category added sucessfully' };
    } else {
      return { status: false, message: 'Category not added!Server error' };
    }
  } catch (error) {
    throw new Error(`Error adding categories: ${error.message}`);
  }
}

async function editCategory(categoryId, newName) {
  try {
    const category = await categoryDatabase.updateOne(
      { _id: categoryId },
      { $set: { name: newName } }
    );
    if (category.modifiedCount > 0) {
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error editing category: ${error.message}`);
  }
}

async function updateCategory(categoryId, updateStatus) {
  try {
    const category = await categoryDatabase.updateOne(
      { _id: categoryId },
      { $set: { active: updateStatus } }
    );
    if (category.modifiedCount > 0) {
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error deleting categories: ${error.message}`);
  }
}

module.exports = {
  fetchCategories,
  addCategory,
  updateCategory,
  editCategory
};
