import axios from 'axios';
//Axios instance

export default axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const deleteData = async (url) => {
  try {
    const res = await axios.delete(process.env.REACT_APP_BASE_URL+url);
    return res.data
  } catch (error) {
    console.log('delete data error', error);
  }
}

