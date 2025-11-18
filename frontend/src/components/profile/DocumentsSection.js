import React, { useState, useEffect } from 'react';
import { formatFileSize } from '../../utils/formatFileSize';

const DocumentsSection = ({ employeeId }) => {
  const [activeCategory, setActiveCategory] = useState('Personal');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['Personal', 'Employment', 'Certificates'];

  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        const response = await fetch(
          `http://localhost:8000/api/employees/${employeeId}/documents/`,
          {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
        } else {
          setError('Failed to load documents');
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Error loading documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [employeeId]);

  const handleDownload = async (documentId, documentName) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `http://localhost:8000/api/employees/${employeeId}/documents/${documentId}/download/`,
        {
          headers: {
            'Authorization': `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = documentName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download document');
      }
    } catch (err) {
      console.error('Error downloading document:', err);
    }
  };

  const handleCategoryKeyDown = (e, category) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveCategory(category);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = categories.indexOf(activeCategory);
      let newIndex;
      
      if (e.key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
      } else {
        newIndex = currentIndex < categories.length - 1 ? currentIndex + 1 : 0;
      }
      
      setActiveCategory(categories[newIndex]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase() || '';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('image') || type.includes('jpg') || type.includes('png')) return 'image';
    if (type.includes('word') || type.includes('doc')) return 'description';
    if (type.includes('excel') || type.includes('xls')) return 'table_chart';
    return 'insert_drive_file';
  };

  const filteredDocuments = documents.filter(doc => doc.category === activeCategory);

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4 flex items-center">
          <span className="material-icons text-primary mr-2">folder</span>
          Documents
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-subtext-light dark:text-subtext-dark">Loading documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
      <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4 flex items-center">
        <span className="material-icons text-primary mr-2">folder</span>
        Documents
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex space-x-1 mb-4 border-b border-border-light dark:border-border-dark" role="tablist">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            onKeyDown={(e) => handleCategoryKeyDown(e, category)}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
              activeCategory === category
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            aria-selected={activeCategory === category}
            role="tab"
            aria-controls={`${category}-panel`}
            id={`${category}-tab`}
            tabIndex={activeCategory === category ? 0 : -1}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Document List */}
      <div
        role="tabpanel"
        id={`${activeCategory}-panel`}
        aria-labelledby={`${activeCategory}-tab`}
      >
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-icons text-6xl text-subtext-light dark:text-subtext-dark mb-3">
              folder_open
            </span>
            <p className="text-subtext-light dark:text-subtext-dark">No documents available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-card-light dark:hover:bg-card-dark transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <span className="material-icons text-primary text-2xl flex-shrink-0">
                    {getFileIcon(doc.fileType)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-light dark:text-text-dark truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-subtext-light dark:text-subtext-dark">
                        {doc.fileType}
                      </span>
                      <span className="text-xs text-subtext-light dark:text-subtext-dark">
                        {formatFileSize(doc.fileSize)}
                      </span>
                      <span className="text-xs text-subtext-light dark:text-subtext-dark">
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                  <button
                    onClick={() => handleDownload(doc.id, doc.name)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    aria-label={`Download ${doc.name}`}
                    title="Download document"
                  >
                    <span className="material-icons">download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsSection;
