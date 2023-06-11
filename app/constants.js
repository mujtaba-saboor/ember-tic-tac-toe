import ENV from 'ember-tic-tac-toe/config/environment';

export default { API_URL: extractApiURL() };

function extractApiURL() {
  var apiURL = '';
  if (ENV.environment === 'development') {
    apiURL = 'http://localhost:3000';
  } else {
    // add for other environments
  }
  return apiURL;
}
