import Constants from 'expo-constants';

const getDevIP = () => {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) return 'localhost';
  return hostUri.split(':')[0];
};
console.log("🚀 DEV IP:", getDevIP()); // ✅ log the IP here


const API_BASE_URL = __DEV__
  ? `http://${getDevIP()}:5014/api`
  : 'https://prod.api.com';

export default API_BASE_URL;
