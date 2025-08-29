import { toast } from 'react-toastify';

const TOAST_OPTIONS = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccessToast = (msg) => {
  toast.success(msg, TOAST_OPTIONS);
};

export const showErrorToast = (msg) => {
  toast.error(msg, TOAST_OPTIONS);
};

export const showInfoToast = (msg) => {
  toast.info(msg, TOAST_OPTIONS);
};

export const showWarningToast = (msg) => {
  toast.warn(msg, TOAST_OPTIONS);
};
