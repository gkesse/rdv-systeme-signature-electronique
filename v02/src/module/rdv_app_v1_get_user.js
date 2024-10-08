export default async function getUser(request, response) {
    const reqToken = request.headers['x-api-token'];

    if (!reqToken) {
        return response.status(400).json({ error: 'Veuillez fournir un jeton API.' });
    }

    try {
        const tokenQuery = new Parse.Query('appToken');
        tokenQuery.equalTo('token', reqToken);
        tokenQuery.include('userId');
        const token = await tokenQuery.first({ useMasterKey: true });
        if (token !== undefined) {
            const parseUser = JSON.parse(JSON.stringify(token));
            const userPtr = {
                __type: 'Pointer',
                className: '_User',
                objectId: parseUser.userId.objectId,
            };

            const query = new Parse.Query('contracts_Users');
            query.equalTo('UserId', userPtr);
            query.exclude('IsContactEntry,TourStatus,UserRole,TenantId,UserId,CreatedBy,Plan');
            const user = await query.first({ useMasterKey: true });

            if (user) {
                const parseRes = JSON.parse(JSON.stringify(user));
                if (request.posthog) {
                    request.posthog?.capture({
                        distinctId: parseUser.userId.email,
                        event: 'api_get_your_account_details',
                        properties: { response_code: 200 },
                    });
                }

                return response.json({
                    objectId: parseRes.objectId,
                    name: parseRes.Name,
                    email: parseRes.Email,
                    phone: parseRes?.Phone || '',
                    jobTitle: parseRes.JobTitle,
                    company: parseRes.Company,
                    createdAt: parseRes.createdAt,
                    updatedAt: parseRes.updatedAt,
                });
            } else {
                if (request.posthog) {
                    request.posthog?.capture({
                        distinctId: parseUser.userId.email,
                        event: 'api_get_your_account_details',
                        properties: { response_code: 404 },
                    });
                }
                return response.status(404).json({ error: "Veuillez fournir un nom d'utilisateur valide !" });
            }
        }
        return response.status(405).json({ error: 'Veuillez fournir un Jeton API valide !' });
    } catch (error) {
        console.log('Veuillez fournir une configuration valide.|error=', err);
        return response.status(400).json({ error: "Une erreur s'est produite, veuillez réessayer plus tard !" });
    }

}
