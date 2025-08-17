import React, { useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const statusColors = {
  Pending: 'bg-orange-100 text-orange-800',
  'Awaiting Review': 'bg-yellow-100 text-yellow-800',
  Assigned: 'bg-purple-100 text-purple-800'
};

const categoryIcons = {
  Electrical: '⚡',
  Plumbing: '🚿',
  Carpentry: '🛠️',
  IT: '💻',
  Other: '📌'
};

const ComplaintCard = ({ complaint, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDelete = async () => {
    try {
      await axios.delete(`/complaints/${complaint._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      onDelete(complaint._id);
      toast.success('Complaint deleted successfully!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error('Failed to delete complaint', {
        position: "bottom-right",
        autoClose: 3000,
      });
      console.error('Delete error:', err);
    }
    setShowConfirm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        {/* Confirmation Dialog */}
        {showConfirm && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40"></div>
            
            {/* Modal container */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4 border border-gray-200">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Delete Complaint</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this complaint? This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex justify-center gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Complaint Content */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {complaint.title}
            </h3>
            <p className="text-gray-600 mb-3">
              {complaint.description}
            </p>
          </div>
          <span className="text-3xl">
            {categoryIcons[complaint.category] || categoryIcons.Other}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[complaint.status]}`}>
            {complaint.status}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
            {complaint.category}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
            {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Attached Image */}
        {complaint.attachments.url && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Attached Image:</p>
            <img 
              src={complaint.attachments.url} 
              alt="Complaint attachment" 
              className="h-32 w-32 object-cover rounded-lg border cursor-pointer"
              onClick={() => setSelectedImage(complaint.attachments.url)}
            />
          </div>
        )}

        {/* Staff Assignment Info */}
        {complaint.status === 'Assigned' && complaint.assignedTo && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-700">
              <span className="font-medium mr-2">Assigned to:  </span> {complaint.assignedTo.name}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium mr-2">Contact:</span> 
              {complaint.assignedTo.phone}
            </p>
          </div>
        )}

        {/* Delete Button */}
        {complaint.status === 'Pending' && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowConfirm(true)}
              className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition cursor-pointer"
            >
              Delete Complaint
            </button>
          </div>
        )}

        {/* Image Fullscreen Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <img 
                src={selectedImage} 
                alt="Enlarged view" 
                className="max-w-full max-h-screen"
              />
              {/* Cross Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
