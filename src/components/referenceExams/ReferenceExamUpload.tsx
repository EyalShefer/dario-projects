import React, { useState } from 'react';
import { useTranslation } from '../../locales/useTranslation';

interface ReferenceExamUploadProps {
  onUploadComplete?: (data: any) => void;
}

// Sample interface for auth (would be from context in real app)
interface AuthContext {
  currentUser: any;
}

// Mock useAuth hook for demo
const useAuth = (): AuthContext => {
  return { currentUser: null };
};

const MAX_FILE_SIZE_MB = 50;

const EXAM_SUBJECTS = [
  { value: 'math', label: 'exam.subject.math' },
  { value: 'hebrew', label: 'exam.subject.hebrew' },
  { value: 'english', label: 'exam.subject.english' },
  { value: 'science', label: 'exam.subject.science' },
  { value: 'history', label: 'exam.subject.history' },
  { value: 'other', label: 'exam.subject.other' },
];

const EXAM_TYPES = [
  { value: 'unit_exam', label: 'exam.examTypes.unitExam' },
  { value: 'midterm', label: 'exam.examTypes.midterm' },
  { value: 'final', label: 'exam.examTypes.final' },
  { value: 'quiz', label: 'exam.examTypes.quiz' },
];

const GRADES = [
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
];

export default function ReferenceExamUpload({ onUploadComplete }: ReferenceExamUploadProps) {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedExamType, setSelectedExamType] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setError(t('exam.upload.error.selectFile'));
      return;
    }

    const file = files[0];

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError(t('exam.upload.error.selectPdfOnly'));
      return;
    }

    // Validate file size
    const fileSizeMb = file.size / (1024 * 1024);
    if (fileSizeMb > MAX_FILE_SIZE_MB) {
      setError(
        `${t('exam.upload.fileSizeError')} ${fileSizeMb.toFixed(2)}${t('exam.upload.fileSizeMB')}`
      );
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
    setError('');
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrade(e.target.value);
    setError('');
  };

  const handleExamTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExamType(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (!selectedFile) {
      setError(t('exam.upload.error.selectFile'));
      return;
    }

    if (!selectedSubject) {
      setError(t('exam.upload.error.selectTextbook'));
      return;
    }

    if (!selectedGrade) {
      setError(t('exam.upload.selectGrade'));
      return;
    }

    if (!selectedExamType) {
      setError(t('exam.upload.selectExamType'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate upload with progress
      setUploadProgress(0);
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return prev;
          }
          return prev + Math.random() * 40;
        });
      }, 200);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
      clearInterval(uploadInterval);
      setUploadProgress(100);

      // Mock success
      if (onUploadComplete) {
        onUploadComplete({
          file: selectedFile.name,
          subject: selectedSubject,
          grade: selectedGrade,
          examType: selectedExamType,
          source,
          year,
        });
      }

      // Reset form
      setSelectedFile(null);
      setSelectedSubject('');
      setSelectedGrade('');
      setSelectedExamType('');
      setSource('');
      setYear('');
      setUploadProgress(0);
    } catch (err: any) {
      setError(t('exam.upload.error.uploadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{t('exam.upload.title')}</h2>
      <p className="text-gray-600 mb-6 whitespace-pre-line">{t('exam.upload.description')}</p>

      {error && (
        <div
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div>
          <label
            htmlFor="file-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t('exam.upload.selectPdfFile')}
          </label>
          <input
            id="file-input"
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            disabled={isLoading}
            aria-label={t('exam.accessibility.selectFile')}
            aria-describedby="file-help"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p id="file-help" className="text-sm text-gray-500 mt-1">
            {t('exam.accessibility.fileHelp')}
          </p>
          {selectedFile && (
            <p className="text-sm text-green-600 mt-2">
              ✓ {t('exam.upload.selectedFile')}: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Subject Select */}
        <div>
          <label
            htmlFor="subject-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t('exam.subject.label')}
          </label>
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={handleSubjectChange}
            disabled={isLoading}
            aria-label={t('exam.accessibility.selectSubject')}
            aria-describedby="subject-help"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('exam.subject.label')}</option>
            {EXAM_SUBJECTS.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {t(subject.label)}
              </option>
            ))}
          </select>
          <p id="subject-help" className="text-sm text-gray-500 mt-1">
            {t('exam.accessibility.subjectHelp')}
          </p>
        </div>

        {/* Grade Select */}
        <div>
          <label
            htmlFor="grade-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t('exam.upload.selectGrade')}
          </label>
          <select
            id="grade-select"
            value={selectedGrade}
            onChange={handleGradeChange}
            disabled={isLoading}
            aria-label={t('exam.accessibility.selectGrade')}
            aria-describedby="grade-help"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('exam.upload.selectGrade')}</option>
            {GRADES.map((grade) => (
              <option key={grade.value} value={grade.value}>
                {t('exam.upload.gradePrefix')} {grade.label}
              </option>
            ))}
          </select>
          <p id="grade-help" className="text-sm text-gray-500 mt-1">
            {t('exam.accessibility.gradeHelp')}
          </p>
        </div>

        {/* Exam Type Select */}
        <div>
          <label
            htmlFor="exam-type-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t('exam.upload.selectExamType')}
          </label>
          <select
            id="exam-type-select"
            value={selectedExamType}
            onChange={handleExamTypeChange}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('exam.upload.selectExamType')}</option>
            {EXAM_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {t(type.label)}
              </option>
            ))}
          </select>
        </div>

        {/* Source (Optional) */}
        <div>
          <label htmlFor="source-input" className="block text-sm font-medium text-gray-700 mb-2">
            {t('exam.upload.source')}
          </label>
          <input
            id="source-input"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder={t('exam.upload.sourcePlaceholder')}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Year (Optional) */}
        <div>
          <label htmlFor="year-input" className="block text-sm font-medium text-gray-700 mb-2">
            {t('exam.upload.year')}
          </label>
          <input
            id="year-input"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder={t('exam.upload.yearPlaceholder')}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Progress Bar */}
        {isLoading && uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading
            ? `${t('exam.upload.processing')} ${uploadProgress > 0 ? `${Math.round(uploadProgress)}%` : ''}`
            : t('exam.upload.uploadButton')}
        </button>
      </form>
    </div>
  );
}
