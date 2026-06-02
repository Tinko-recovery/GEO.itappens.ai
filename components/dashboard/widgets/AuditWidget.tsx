export default function AuditWidget() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">AI Visibility Score</h3>
        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">Critical</span>
      </div>
      
      <div className="flex items-center justify-center flex-1 my-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-gray-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-red-500" strokeWidth="3" strokeDasharray="35, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">35</span>
            <span className="text-xs text-gray-500">/ 100</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Technical Signals</span>
          <span className="font-medium text-red-600">Poor (2/10)</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Semantic Anchors</span>
          <span className="font-medium text-yellow-600">Fair (5/10)</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Entity Associations</span>
          <span className="font-medium text-red-600">Missing</span>
        </div>
      </div>
    </div>
  );
}
