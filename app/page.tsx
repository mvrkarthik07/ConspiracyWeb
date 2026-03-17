export default function HomePage() {
  return (
    <div className="container-app py-10">
      <h1 className="typography-h1">API server</h1>
      <p className="mt-2 text-small text-text-muted max-w-prose">
        The UI has moved to the Vite SPA in <code>frontend/</code>. This Next.js app is kept only for <code>/api/articles</code>.
      </p>
      <p className="mt-6 text-small text-text-muted">
        Try <code>/api/articles?query=test</code>.
      </p>
    </div>
  );
}
