export enum ERROR_MESSAGES {
  INVALID_USERNAME = 'Username must not contain special characters',
  INVALID_FULLNAME = 'Fullname must not contain numbers or special characters',
  INVALID_PHONE_NUMBER = 'Invalid phone number',
  INVALID_PASSWORD = 'Password must not contain space',
  PASSWORD_MINLENGTH = 'Password must be at least 6 characters',
  PASSWORD_MISMATCH = 'Password and confirm password do not match',
  EXIST_USERNAME = 'Username already exists',
  LOGIN_FAILED = 'Incorrect username or password',
  NOT_FOUND_ACCOUNT = 'Account not found',
  LOGIN_REQUIRED = 'Please log in to continue',
  PERMISSION_DENIED = 'You do not have permission to perform this action',
  NOT_FOUND_CART = 'Cart not found',
  CREATE_CART_FAILED = 'Failed to create cart',
  CREATE_USER_FAILED = 'Failed to create account',
  NOT_FOUND_ORDER = 'Order not found',
  UPDATE_ORDER_FAILED = 'Failed to update order',
  UPDATE_CART_FAILED = 'Failed to update cart',
  NOT_FOUND_TO_DELETE = '{itemName} to delete not found',
  NOT_FOUND_TO_SAVE = '{itemName} to save not found',
  UPLOAD_FILE_FAILED = 'File upload failed',
  INVALID_IMAGE = 'Invalid image',
  OVERSIZE_IMAGE = 'Image must not exceed 2MB',
  INVALID_PRODUCT_NAME = 'Invalid product name',
  INVALID_STOCK = 'Invalid product stock',
  INVALID_PRICE = 'Invalid product price',
  INVALID_CATEGORY = 'Category name must not be empty',
  SESSION_EXPIRED = 'Session expired. Please log in again',
  NO_PERMISSION = 'You do not have permission to perform this action',
  NOT_FOUND = 'Resource not found',
  SERVER_ERROR = 'Server error. Please try again later.',
  EXISTED_CATEGORY = 'Category already exists',
  EXISTED_PRODUCT = 'Product already exists'
};

export enum SUCCESS_MESSAGES {
  LOGIN = 'Login successful',
  REGISTER = 'Registration successful',
  DELETE = 'Deleted successfully',
  ADD = 'Added successfully',
  SAVE = 'Saved successfully',
  UPDATE = 'Updated successfully',
  PLACED_ORDER = 'Order placed successfully',
  NOT_FOUND_TO_DELETE = "NOT_FOUND_TO_DELETE",
  NOT_FOUND_TO_SAVE = "NOT_FOUND_TO_SAVE"
};

export enum SWAL_MESSAGES {
  CONFIRM_DELETE_TITLE = 'Do you want to delete the product?',
  CONFIRM_ORDER_TITLE = 'Confirm order?',
  CONFIRM_UPDATE_ORDER_TITLE = 'Confirm order update?',
  CONFIRM_DELETE_TEXT = 'This action cannot be undone!',
  BUTTON_CANCEL = 'Cancel',
  BUTTON_CONFIRM_DELETE = 'Delete',
  BUTTON_CONFIRM_ORDER = 'Confirm',
};

export enum BUTTON_TITLE {
  CANCEL = 'Cancel order',
  RETURN = 'Return',
  RECEIVE = 'Mark as received',
};

export enum MESSAGES {
  CONFIRM_EXIT = 'Are you sure you want to leave this page?'
};

export enum FORM {
  REGISTER = 'Register',
  LOGIN = 'Login',
  LOGIN_MESSAGE = 'Already have account?',
  REGISTER_MESSAGE = "Don't have account yet?",
  SAVE = 'Save',
  TITLE_EDIT_PRODUCT = 'Edit Product'
}

export enum BUTTON_TOOLTIP {
  TOOGLE = 'Toggle Actions',
  CREATE = 'Create new item',
  GIRD_VIEW = 'Grid View',
  CARD_VIEW = 'Card View',
  EDIT = 'Edit item',
  DELETE = 'Delete item',
  COLUMN_MANAGEMENT = 'Choose columns',
  ORDER = 'Orders',
  CART = 'Cart',
  MODE = 'Toggle Dark/Light Mode',
}