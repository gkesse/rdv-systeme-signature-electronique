export default async function saveSubscription(request, response) {
    const SubscriptionId = request.body?.data?.subscription?.subscription_id;
    const body = request.body;
    const Email = request.body.data?.subscription?.customer?.email;
    const Next_billing_date = request.body?.data?.subscription?.next_billing_at;
    const planCode = request.body?.data?.subscription?.plan?.plan_code;
    const addons = request.body?.data?.subscription?.addons || [];
    const event = request.body?.data?.event_type || '';
    const credits = planCredits?.[planCode] || 0;
    const isTeamPlan = planCode?.includes('team');
    let newAddons = 0;

    if (addons?.length > 0) {

    }
}
