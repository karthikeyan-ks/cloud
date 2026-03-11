import app from "./index";
import { GCPPubSubSubscription } from "./services/gcp/gcp-pubsub-subscription.service";

const PORT = Number(process.env.PORT || 8080);
const gcpPubSubSubscription = new GCPPubSubSubscription();

gcpPubSubSubscription.startListening();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
