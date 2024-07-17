// Local URL
// export const BASE_URL = 'http://192.168.5.12/new.ezypayroll.in/MobileNew/';
// Live URL
// export const BASE_URL = 'https://testing.ezypayroll.in/MobileNew/';
export const BASE_URL = 'https://ezypayroll.in/MobileNew/';
// export const BASE_URL = 'https://ezypayroll.shoponcell.com/MobileNew/';
// Methods
export const makeRequest = async (url, params = null) => {
  try {
    // request info
    let info = {};
    if (params) {
      // request method type
      info.method = 'POST';
      // Preparing multipart/form-data
      const formData = new FormData();
      for (const key in params) {
        formData.append(key, params[key]);
      }
      // request body
      info.body = formData;
    } else {
      // headers to prevent cache in GET request
      info.headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
      };
    }
    console.log('Request URL:', url);
    console.log('Request Params:', info);
    const response = await fetch(url, info);
    // console.log(response)
    const result = await response.json();
    console.log('Request Response:', result);
    return result;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
