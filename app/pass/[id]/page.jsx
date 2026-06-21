import PublicPassView from "../../../src/components/Visitor/PublicPassView";

export default function Page({ params }) {
  // We can pass params to a component if needed, but PublicPassView uses useParams internally.
  // Wait, PublicPassView uses `useParams` from `react-router-dom`. We need to fix that later.
  return <PublicPassView />;
}
