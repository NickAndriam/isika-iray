export default function SimplePage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🤝</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            Isika iray
          </h1>
          <p className="text-slate-600 mb-8 text-lg">
            Fiaraha-miasa ho an'ny fahafinaretana
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Next.js setup working</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>TailwindCSS working</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>TypeScript working</span>
            </div>
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">
              If you can see this styled page, TailwindCSS is working correctly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}