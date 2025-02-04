import { createRoot } from "react-dom/client";
import React, { PropsWithChildren } from 'react';
import App from './App';
import { Auth0Provider, AppState, Auth0ContextInterface, User } from '@auth0/auth0-react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Auth0ProviderOptions } from '../../../src/index.js';

const Auth0ProviderWithRedirectCallback = ({
  children,
  context,
  ...props
}: PropsWithChildren<Omit<Auth0ProviderOptions, 'context'>> & {
  context?: React.Context<Auth0ContextInterface<User>>
}) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState, user?: User) => {
    navigate((appState?.returnTo) || window.location.pathname);
  };

  return (
    <Auth0Provider
      onRedirectCallback={onRedirectCallback}
      context={context}
      {...props}
    >
      {children}
    </Auth0Provider>
  );
};
const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithRedirectCallback
        domain={process.env.REACT_APP_DOMAIN}
        clientId={process.env.REACT_APP_CLIENT_ID}
        authorizationParams={{
          audience: process.env.REACT_APP_AUDIENCE,
          scope: 'profile email read:users',
          redirect_uri: window.location.origin,
        }}
      >
        <App />
      </Auth0ProviderWithRedirectCallback>
    </BrowserRouter>
  </React.StrictMode>
);
