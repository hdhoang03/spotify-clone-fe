import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface HelpDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'terms' | 'privacy';
}

const HelpDocumentModal = ({ isOpen, onClose, type }: HelpDocumentModalProps) => {
    const { t } = useTranslation();

    const titleText = type === 'terms'
        ? t('help_documents.terms_title')
        : t('help_documents.privacy_title');

    const sectionsList = (type === 'terms'
        ? t('help_documents.terms_sections', { returnObjects: true })
        : t('help_documents.privacy_sections', { returnObjects: true })) as Array<{ title: string; content: string }> | string;

    if (!isOpen) return null;

    // Handle case where translation is missing or loaded incorrectly (returns a string instead of an array)
    const sections = Array.isArray(sectionsList) ? sectionsList : [];

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                {/* Backdrop overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', duration: 0.4 }}
                    className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 text-zinc-900 dark:text-white"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-3">
                            {type === 'terms' ? (
                                <FileText className="text-green-500" size={22} />
                            ) : (
                                <Shield className="text-green-500" size={22} />
                            )}
                            <h3 className="text-lg font-bold tracking-tight">{titleText}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Content Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {sections.map((sec, index) => (
                            <div key={index} className="space-y-2">
                                <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
                                    {sec.title}
                                </h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                                    {sec.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end bg-zinc-50/50 dark:bg-zinc-900/50">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors text-sm shadow-md shadow-green-500/10"
                        >
                            {t('confirm_modal.confirm', 'Xác nhận')}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default HelpDocumentModal;
