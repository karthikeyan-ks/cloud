import app from "./index";
import { GCPPubSubSubscription } from "./services/gcp/gcp-pubsub-subscription.service";

const PORT = Number(process.env.PORT || 8080);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);

  const subscriptionName = process.env.PUB_SUB_SUBSCRIPTION_NAME;
  if (!subscriptionName) {
    console.warn("PUB_SUB_SUBSCRIPTION_NAME is not configured; skipping Pub/Sub listener startup");
    return;
  }

  try {
    const gcpPubSubSubscription = new GCPPubSubSubscription();
    gcpPubSubSubscription.startListening();
  } catch (error) {
    console.error("Pub/Sub listener failed to start", error);
  }
});
