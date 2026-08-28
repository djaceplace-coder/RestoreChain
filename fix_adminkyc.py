import os
import re

path = 'src/pages/admin/AdminKYC.tsx'
with open(path, 'r') as f:
    content = f.read()

target = """              <div className="mt-4 border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {d.document_url && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase flex items-center gap-2">
                      <FileText size={14} /> ID Document
                    </p>
                    <div 
                      className="bg-gray-50 border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-brand-purple transition-colors"
                      onClick={() => setSelectedImage(d.document_url)}
                    >
                      <img src={d.document_url} alt="ID Document" className="w-full h-48 object-cover rounded" />
                    </div>
                  </div>
                )}
                {d.selfie_url && (
                  <div>"""

replacement = """              <div className="mt-4 border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {d.document_url && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase flex items-center gap-2">
                      <FileText size={14} /> ID Front
                    </p>
                    <div 
                      className="bg-gray-50 border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-brand-purple transition-colors"
                      onClick={() => setSelectedImage(d.document_url)}
                    >
                      <img src={d.document_url} alt="ID Front" className="w-full h-48 object-cover rounded" />
                    </div>
                  </div>
                )}
                {d.document_back_url && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase flex items-center gap-2">
                      <FileText size={14} /> ID Back
                    </p>
                    <div 
                      className="bg-gray-50 border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-brand-purple transition-colors"
                      onClick={() => setSelectedImage(d.document_back_url)}
                    >
                      <img src={d.document_back_url} alt="ID Back" className="w-full h-48 object-cover rounded" />
                    </div>
                  </div>
                )}
                {d.selfie_url && (
                  <div>"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("TARGET NOT FOUND IN ADMINKYC!")

with open(path, 'w') as f:
    f.write(content)
