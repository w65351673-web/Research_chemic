import { ServerClient } from 'postmark';

// Check if we have a Postmark server token
const serverToken = process.env.POSTMARK_SERVER_TOKEN;

// Create a mock client if no token is available
const createMockClient = () => {
  console.warn('WARNING: No Postmark server token found. Using mock email client.');
  return {
    sendEmail: async (options) => {
      console.log('MOCK EMAIL SENT:', options);
      return { MessageID: 'mock-message-id', ErrorCode: 0, Message: 'OK' };
    }
  };
};

// Initialize the Postmark client with server token or use mock client
const postmarkClient = serverToken 
  ? new ServerClient(serverToken)
  : createMockClient();

export default postmarkClient;
