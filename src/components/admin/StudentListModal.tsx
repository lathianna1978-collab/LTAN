import React from 'react';
import { X, School } from 'lucide-react';
import { ClassCode } from '../../types';
import { GradebookTable } from './GradebookTable';

interface StudentListModalProps {
  isOpen: boolean;
  classCode: ClassCode;
  onClose: () => void;
  onViewStudentHistory: (studentId: string) => void;
  onRefreshClasses: () => void;
  onUploadRoster?: (classCode: ClassCode) => void;
  onViewSubmissionDetail?: (submissionId: string) => void;
}

export const StudentListModal: React.FC<StudentListModalProps> = ({
  isOpen,
  classCode,
  onClose,
  onViewStudentHistory,
  onRefreshClasses,
  onUploadRoster,
  onViewSubmissionDetail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-6xl w-full p-5 sm:p-7 shadow-2xl border border-purple-100 relative overflow-hidden max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 pr-1">
          <GradebookTable
            selectedClass={classCode}
            onOpenUploadRoster={(c) => {
              if (onUploadRoster) onUploadRoster(c);
            }}
            onViewStudentHistory={onViewStudentHistory}
            onViewSubmissionDetail={onViewSubmissionDetail}
            onRefreshParent={onRefreshClasses}
          />
        </div>
      </div>
    </div>
  );
};
