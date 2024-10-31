import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (type, data) => {
  try {
    const url =
      type === 'data'
        ? 'http://localhost:1234/api/v1/users/updateMe'
        : 'http://localhost:1234/api/v1/users/updateMyPassword';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
      //   location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
