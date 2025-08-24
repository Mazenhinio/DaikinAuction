export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>✅ Vercel Test Route Works!</h1>
      <p>If you can see this page, Vercel deployment is working.</p>
      <p>Time: {new Date().toISOString()}</p>
      <a href="/">Go to Landing Page</a>
    </div>
  )
}
