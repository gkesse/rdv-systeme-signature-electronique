import axios from 'axios';

export const SSOAuth = {
    validateAuthData: async authData => {
        try {
            const response = await axios.get(ssoApiUrl + '/oauth/userinfo', {
                headers: {
                    Authorization: `Bearer ${authData.access_token}`,
                },
            });
            if (response.data && response.data.id && response.data.email === authData.id) {
                return;
            }
            throw new Parse.Error(
                Parse.Error.OBJECT_NOT_FOUND,
                'SSO auth is invalid for this user.'
            );
        } catch (error) {
            console.log('error in sso adapter|error=', error?.response);
            throw new Parse.Error(
                Parse.Error.OBJECT_NOT_FOUND,
                'SSO auth is invalid for this user.'
            );
        }
    },
    validateAppId: () => {
        return Promise.resolve();
    }
};
