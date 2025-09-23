export const ERROR_MESSAGES = {
  INVALID_USERNAME: 'Username must not contain special characters',
  INVALID_FULLNAME: 'Fullname must not contain numbers or special characters',
  INVALID_PHONE_NUMBER: 'Invalid phone number',
  PASSWORD_MINLENGTH: 'Password must be at least 6 characters',
  PASSWORD_MISMATCH: 'Password and confirm password do not match',
  EXIST_USERNAME: 'Username already exists',
  LOGIN_FAILED: 'Incorrect username or password',
  NOT_FOUND_ACCOUNT: 'Account not found',
  LOGIN_REQUIRED: 'Please log in to continue',
  NOT_FOUND_CART: 'Cart not found',
  CREATE_CART_FAILED: 'Failed to create cart',
  NOT_FOUND_ORDER: 'Order not found',
  UPDATE_ORDER_FAILED: 'Failed to update order',
  UPDATE_CART_FAILED: 'Failed to update cart',
  NO_PRODUCT_TO_DELETE: 'Product to delete not found',
  NO_PRODUCT_TO_UPDATE: 'Product to update not found',
  NO_CATEGORY_TO_DELETE: 'Category to delete not found',
  NO_CATEGORY_TO_UPDATE: 'Category to update not found',
  UPLOAD_FILE_FAILED: 'File upload failed',
  INVALID_IMAGE: 'Invalid image',
  OVERSIZE_IMAGE: 'Image must not exceed 2MB',
  INVALID_PRODUCT_NAME: 'Invalid product name',
  INVALID_STOCK: 'Invalid product stock',
  INVALID_PRICE: 'Invalid product price',
  INVALID_CATEGORY: 'Category name must not be empty',
  SESSION_EXPIRED: 'Session expired. Please log in again',
  NO_PERMISSION: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error. Please try again later.',
  EXISTED_CATEGORY: 'Category already exists',
  EXISTDE_PRODUCT: 'Product already exists'
};

export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful',
  REGISTER: 'Registration successful',
  DELETE: 'Deleted successfully',
  ADD_TO_CART: 'Added to cart successfully',
  ORDER: 'Order placed successfully',
  UPDATE_ORDER: 'Order updated successfully',
  UPDATE_PRODUCT: 'Product updated successfully',
  CREATE_PRODUCT: 'Product created successfully',
  CREATE_CATEGORY: 'Category created successfully',
  UPDATE_CATEGORY: 'Category updated successfully'
};

export const SWAL_MESSAGES = {
  CONFIRM_DELETE_TITLE: 'Are you sure you want to delete?',
  CONFIRM_ORDER_TITLE: 'Confirm order?',
  CONFIRM_UPDATE_ORDER_TITLE: 'Confirm order update?',
  CONFIRM_DELETE_TEXT: 'This action cannot be undone!',
  BUTTON_CANCEL: 'Cancel',
  BUTTON_CONFIRM_DELETE: 'Delete',
  BUTTON_CONFIRM_ORDER: 'Confirm',
};

export const BUTTON_TITLE = {
  CANCEL: 'Cancel order',
  RETURN: 'Return',
  RECEIVE: 'Mark as received',
};

export const MESSAGES = {
  CONFIRM_EXIT: 'Are you sure you want to leave this page?'
};

export const FORM = {
  REGISTER: 'Register',
  LOGIN: 'Login',
  REGISTER_LINK: '/register',
  LOGIN_LINK: '/login',
  LOGIN_MESSAGE: 'Already have account?',
  REGISTER_MESSAGE: "Don't have account yet?",
}