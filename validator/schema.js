/**
 * @desc SCHEMA VALIDATOR
 */
export default {
  signupForm: {
    formType: 'signUp',
    FullName: { field: 'fullName', required: true, isName: true },
    username: { field: 'username', required: true },
    email: { field: 'email', required: true, isEmail: true },
    PhoneNumber: { field: 'phoneNumber', required: true, isPhoneNumber: true },
    password: {
      field: 'password',
      required: true,
      minLength: 8,
      maxLength: 16,
    },
  },
  loginForm: {
    formType: 'login',
    data: { field: 'dataField', required: true },
    password: { field: 'password' },
  },
  createForm: {
    formType: 'createRide',
    departure: { field: 'departure', required: true, isDeparture: true },
    destination: { field: 'destination', required: true, isDestination: true },
    driver: { field: 'driver', required: true, isDriver: true },
    seats: { field: 'seats', required: true, isSeats: true },
    time: { field: 'time', required: true, isTime: true },
    date: { field: 'date', required: true, isDate: Date.now() },
  },
  requestForm: {
    formType: 'requestRide',
    message: { field: 'message', required: true },
  },
  updateRequest: {
    formType: 'updateRide',
    action: { field: 'action', required: true },
  },
  forgetForm: {
    formType: 'forgetPassword',
    email: { field: 'email', required: true },
  },
  resetForm: {
    formType: 'resetPassword',
    password: { field: 'password', required: true },
  },
  verification: {
    formType: 'resend-verify-token',
    email: { field: 'email', required: true },
  },
};
