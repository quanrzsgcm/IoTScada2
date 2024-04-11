export const handleError = (value, defaultMessage) => {
  switch (value) {
    case 'PASSWORD_IS_INVALID':
      return 'Your password is incorrect, please check again.';
      break;
    case 'USER_NOT_FOUND':
      return 'This account does not exist yet, please signup.';
      break;
    case 'SOMETHING_WENT_WRONG':
      return 'Something went wrong.';
      break;
    case 'EMAIL_IS_EXIST':
      return 'This email account already exists. Please check again';
      break;
    case 'PHONE_IS_EXIST':
      return 'This phone account already exists. Please check again';
      break;
    case 'INVALID_OTP':
      return 'OTP is invalid';
      break;
    case 'STORE_GIVE_POINT_INVALID':
      return 'You already claim these points. You cannot claim it anymore.';
      break;
    default:
      return defaultMessage || 'Something went wrong.';
      break;
  }
};
