import { Redirect } from "expo-router";

// The root index simply redirects to either the auth flow or the tabs
// The actual redirection logic is handled in the root _layout.tsx
export default function RootIndex() {
  return <Redirect href="/(tabs)" />;
}
