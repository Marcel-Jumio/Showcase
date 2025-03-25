import React, { useState } from 'react';
import { Divider, Typography, TextField, Paper } from '@mui/material';
import '@jumio/websdk'; 
import '@jumio/websdk/assets/style.css';


const SdkTokenInput = ({ token, setToken }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <TextField
        label="SDK Token"
        variant="outlined"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        fullWidth
      />
    </div>
  );
};

// Container that will host the Jumio Web SDK via the custom element
const SdkContainer = ({ token }) => {
  return (
    <Paper 
      elevation={3} 
      style={{
        padding: '16px', 
        minHeight: '600px', 
        backgroundColor: '#f5f5f5',
        border: '2px dashed #ccc'
      }}
    >
      <Typography variant="h6" gutterBottom>
        SDK Container
      </Typography>
      {token ? (
        // Render the custom element with the provided token and attributes.
        

        <jumio-sdk 
          dc="eu" 
          token={token} 
          locale="de"
        >
        </jumio-sdk>
      ) : (
        <Typography variant="body1">
          Please enter a token above to initialize the SDK.
        </Typography>
      )}
    </Paper>
  );
};

const Websdk = () => {
  const [token, setToken] = useState('');

  return (
    <div className="websdk-container" style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        WEB SDK
      </Typography>
      <Typography variant="body1" gutterBottom>
        This page demonstrates the basic integration of our Web SDK. Use this space to showcase its capabilities.
      </Typography>
      
      {/* SDK Token input component */}
      <SdkTokenInput token={token} setToken={setToken} />

      {/* Divider */}
      <Divider style={{ margin: '24px 0' }} />

      {/* Container for the SDK */}
      <SdkContainer token={token} />
    </div>
  );
};

export default Websdk;
